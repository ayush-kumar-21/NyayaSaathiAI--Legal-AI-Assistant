"""
Case Escalation Service — Core State Machine
Handles the full lifecycle of a case through the escalation pipeline.
"""
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any

from app.schemas.escalation import (
    EscalationLevel, EscalationStatus,
    ComplaintRequest, ResolveRequest, EscalateRequest,
    EscalationEntry, CaseEscalationResponse, CaseListItem,
    PoliceStationInfo, CourtInfo,
)
from app.services.police_stations import (
    find_nearest_station, find_nearby_stations, get_station_by_id,
)
from app.services.court_hierarchy import (
    get_next_court, get_court_by_id,
)


# ── In-memory store (replace with DB in production) ──────

_cases: Dict[str, Dict[str, Any]] = {}
_fir_counter = 100


def _now() -> str:
    return datetime.utcnow().isoformat()


def _next_fir() -> str:
    global _fir_counter
    _fir_counter += 1
    return f"FIR/2025/{_fir_counter:04d}"


# ── Public API ────────────────────────────────────────────

def file_complaint(req: ComplaintRequest) -> CaseEscalationResponse:
    """
    Citizen files a new complaint.
    - Geolocates the nearest police station
    - Creates the case at POLICE_LOCAL level
    """
    station = find_nearest_station(req.latitude, req.longitude)

    case_id = str(uuid.uuid4())
    fir = _next_fir()

    entry = EscalationEntry(
        level=EscalationLevel.POLICE_LOCAL,
        status=EscalationStatus.PENDING,
        assigned_to=station["name"],
        assigned_to_id=station["id"],
        started_at=_now(),
    )

    case = {
        "id": case_id,
        "fir_number": fir,
        "complainant_name": req.complainant_name,
        "complainant_contact": req.complainant_contact,
        "complaint_text": req.complaint_text,
        "address": req.address,
        "latitude": req.latitude,
        "longitude": req.longitude,
        "evidence_urls": req.evidence_urls,
        "incident_datetime": req.incident_datetime,
        "current_level": EscalationLevel.POLICE_LOCAL,
        "current_status": EscalationStatus.PENDING,
        "current_assigned_to": station["name"],
        "current_assigned_to_id": station["id"],
        "district": station["district"],
        "timeline": [entry.model_dump()],
        "created_at": _now(),
        "updated_at": _now(),
        "resolved_at": None,
        "conclusion": None,
        "nearest_station": station,
    }

    _cases[case_id] = case
    return _to_response(case)


def get_case(case_id: str) -> Optional[CaseEscalationResponse]:
    """Get full case details by ID."""
    case = _cases.get(case_id)
    if not case:
        return None
    return _to_response(case)


def list_cases(
    assigned_to_id: Optional[str] = None,
    level: Optional[EscalationLevel] = None,
    status: Optional[EscalationStatus] = None,
) -> List[CaseListItem]:
    """List cases, optionally filtered."""
    results = []
    for c in _cases.values():
        if assigned_to_id and c["current_assigned_to_id"] != assigned_to_id:
            continue
        if level and c["current_level"] != level:
            continue
        if status and c["current_status"] != status:
            continue

        results.append(CaseListItem(
            id=c["id"],
            fir_number=c["fir_number"],
            complainant_name=c["complainant_name"],
            complaint_summary=c["complaint_text"][:120] + ("..." if len(c["complaint_text"]) > 120 else ""),
            current_level=c["current_level"],
            current_status=c["current_status"],
            current_assigned_to=c["current_assigned_to"],
            created_at=c["created_at"],
            updated_at=c["updated_at"],
        ))
    return results


def resolve_case(case_id: str, req: ResolveRequest) -> Optional[CaseEscalationResponse]:
    """Mark the case as resolved at the current level."""
    case = _cases.get(case_id)
    if not case:
        return None

    # Close the current timeline entry
    timeline = case["timeline"]
    if timeline:
        timeline[-1]["status"] = EscalationStatus.RESOLVED
        timeline[-1]["ended_at"] = _now()
        timeline[-1]["conclusion"] = req.conclusion
        timeline[-1]["action_by"] = req.resolved_by
        timeline[-1]["notes"] = req.notes

    case["current_status"] = EscalationStatus.CLOSED
    case["resolved_at"] = _now()
    case["conclusion"] = req.conclusion
    case["updated_at"] = _now()

    return _to_response(case)


def escalate_case(case_id: str, req: EscalateRequest) -> Optional[CaseEscalationResponse]:
    """
    Escalate the case to the next level in the pipeline.
    POLICE_LOCAL → POLICE_NEARBY → MAGISTRATE → SESSIONS → HIGH_COURT → SUPREME_COURT
    """
    case = _cases.get(case_id)
    if not case:
        return None

    current_level = case["current_level"]
    district = case.get("district", "Central Delhi")

    # Close current timeline entry
    timeline = case["timeline"]
    if timeline:
        timeline[-1]["status"] = EscalationStatus.ESCALATED
        timeline[-1]["ended_at"] = _now()
        timeline[-1]["reason"] = req.reason
        timeline[-1]["action_by"] = req.escalated_by
        timeline[-1]["notes"] = req.notes

    # Determine next level and assignment
    if current_level == EscalationLevel.POLICE_LOCAL:
        # Escalate to nearby police stations
        nearby = find_nearby_stations(
            case["latitude"], case["longitude"],
            exclude_id=case["current_assigned_to_id"],
            limit=1,
        )
        if nearby:
            next_station = nearby[0]
            new_entry = EscalationEntry(
                level=EscalationLevel.POLICE_NEARBY,
                status=EscalationStatus.PENDING,
                assigned_to=next_station["name"],
                assigned_to_id=next_station["id"],
                started_at=_now(),
            )
            case["current_level"] = EscalationLevel.POLICE_NEARBY
            case["current_assigned_to"] = next_station["name"]
            case["current_assigned_to_id"] = next_station["id"]
        else:
            # No nearby stations, jump to court
            return _escalate_to_court(case, district)

    elif current_level == EscalationLevel.POLICE_NEARBY:
        # Escalate to Magistrate Court
        return _escalate_to_court(case, district)

    elif current_level in (
        EscalationLevel.MAGISTRATE_COURT,
        EscalationLevel.SESSIONS_COURT,
        EscalationLevel.HIGH_COURT,
    ):
        # Escalate to next court
        next_court = get_next_court(current_level, district)
        if not next_court:
            # Already at Supreme Court — cannot escalate further
            return _to_response(case)

        new_entry = EscalationEntry(
            level=next_court["level"],
            status=EscalationStatus.PENDING,
            assigned_to=next_court["name"],
            assigned_to_id=next_court["id"],
            started_at=_now(),
        )
        case["current_level"] = next_court["level"]
        case["current_assigned_to"] = next_court["name"]
        case["current_assigned_to_id"] = next_court["id"]

    else:
        # Supreme Court — cannot escalate further
        return _to_response(case)

    case["current_status"] = EscalationStatus.PENDING
    case["timeline"].append(new_entry.model_dump())
    case["updated_at"] = _now()

    return _to_response(case)


def get_all_cases() -> List[CaseListItem]:
    """Get all cases (for admin/demo)."""
    return list_cases()


# ── Seed demo data ────────────────────────────────────────

def seed_demo_cases():
    """Create a few demo cases for testing."""
    if _cases:
        return  # Already seeded

    demos = [
        ComplaintRequest(
            complainant_name="Aarav Sharma",
            complainant_contact="+91 98765 43210",
            complaint_text="My neighbour broke into my house last night at 2am and stole jewellery worth ₹2,00,000. I have CCTV footage of the incident. When I confronted him, he threatened me with a knife.",
            latitude=28.5300,
            longitude=77.2100,
            address="B-42, Saket, New Delhi",
            evidence_urls=["cctv_footage_01.mp4", "photo_damage.jpg"],
            incident_datetime="2025-02-12T02:00:00",
        ),
        ComplaintRequest(
            complainant_name="Priya Gupta",
            complainant_contact="+91 87654 32109",
            complaint_text="I was assaulted by two men while returning from work near Hauz Khas metro. They snatched my bag containing laptop, phone and ₹15,000 cash. One of them had a scar on his left cheek.",
            latitude=28.5500,
            longitude=77.2050,
            address="Near Hauz Khas Metro Station, New Delhi",
            evidence_urls=["medical_report.pdf"],
            incident_datetime="2025-02-11T21:30:00",
        ),
        ComplaintRequest(
            complainant_name="Rajesh Kumar",
            complainant_contact="+91 76543 21098",
            complaint_text="My employer has not paid my salary for the last 4 months despite repeated requests. Total pending amount is ₹1,60,000. He is also threatening to terminate me if I complain.",
            latitude=28.6300,
            longitude=77.2200,
            address="Connaught Place, New Delhi",
            evidence_urls=["salary_slips.pdf", "chat_screenshots.jpg"],
            incident_datetime="2025-02-10T10:00:00",
        ),
    ]

    for demo in demos:
        file_complaint(demo)

    # Escalate the second case to show the pipeline
    cases = list(_cases.values())
    if len(cases) >= 2:
        # Escalate Priya's case through police levels
        cid = cases[1]["id"]
        escalate_case(cid, EscalateRequest(
            reason="Suspects fled jurisdiction, need wider search",
            escalated_by="SI Vikram Singh",
        ))


# ── Helpers ───────────────────────────────────────────────

def _escalate_to_court(case: dict, district: str) -> CaseEscalationResponse:
    """Helper to move a case from police to the first court."""
    court = get_next_court(EscalationLevel.POLICE_NEARBY, district)
    if not court:
        court = get_court_by_id("MC-DEL-002")  # Fallback

    new_entry = EscalationEntry(
        level=court["level"],
        status=EscalationStatus.PENDING,
        assigned_to=court["name"],
        assigned_to_id=court["id"],
        started_at=_now(),
    )

    case["current_level"] = court["level"]
    case["current_status"] = EscalationStatus.PENDING
    case["current_assigned_to"] = court["name"]
    case["current_assigned_to_id"] = court["id"]
    case["timeline"].append(new_entry.model_dump())
    case["updated_at"] = _now()

    return _to_response(case)


def _to_response(case: dict) -> CaseEscalationResponse:
    """Convert the internal dict to the response schema."""
    return CaseEscalationResponse(
        id=case["id"],
        fir_number=case["fir_number"],
        complainant_name=case["complainant_name"],
        complainant_contact=case["complainant_contact"],
        complaint_text=case["complaint_text"],
        address=case.get("address"),
        latitude=case["latitude"],
        longitude=case["longitude"],
        evidence_urls=case.get("evidence_urls", []),
        incident_datetime=case.get("incident_datetime"),
        current_level=case["current_level"],
        current_status=case["current_status"],
        current_assigned_to=case["current_assigned_to"],
        current_assigned_to_id=case["current_assigned_to_id"],
        timeline=[EscalationEntry(**e) for e in case["timeline"]],
        created_at=case["created_at"],
        updated_at=case["updated_at"],
        resolved_at=case.get("resolved_at"),
        conclusion=case.get("conclusion"),
    )
