"""
Case Escalation Pipeline — API Endpoints
"""
from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List

from app.schemas.escalation import (
    ComplaintRequest, ResolveRequest, EscalateRequest,
    CaseEscalationResponse, CaseListItem, CaseListResponse,
    EscalationLevel, EscalationStatus,
    PoliceStationInfo,
)
from app.services.escalation_service import (
    file_complaint, get_case, list_cases, resolve_case,
    escalate_case, get_all_cases, seed_demo_cases,
)
from app.services.police_stations import (
    find_nearest_station, find_nearby_stations, POLICE_STATIONS,
)
from app.services.court_hierarchy import COURTS

router = APIRouter()


# ── Seed demo data on first import ───────────────────────
seed_demo_cases()


# ── Citizen Endpoints ─────────────────────────────────────

@router.post("/complaint", response_model=CaseEscalationResponse)
async def submit_complaint(req: ComplaintRequest):
    """Citizen files a new complaint. Auto-routes to nearest station."""
    try:
        return file_complaint(req)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/nearest-station", response_model=PoliceStationInfo)
async def get_nearest_station(
    lat: float = Query(..., ge=-90, le=90),
    lng: float = Query(..., ge=-180, le=180),
):
    """Find the nearest police station to given coordinates."""
    station = find_nearest_station(lat, lng)
    return PoliceStationInfo(**station)


# ── Case Operations ──────────────────────────────────────

@router.get("/cases", response_model=CaseListResponse)
async def list_all_cases(
    assigned_to_id: Optional[str] = Query(None),
    level: Optional[EscalationLevel] = Query(None),
    status: Optional[EscalationStatus] = Query(None),
):
    """List cases with optional filters."""
    cases = list_cases(assigned_to_id=assigned_to_id, level=level, status=status)
    return CaseListResponse(total=len(cases), cases=cases)


@router.get("/case/{case_id}", response_model=CaseEscalationResponse)
async def get_case_detail(case_id: str):
    """Get full case details with escalation timeline."""
    case = get_case(case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return case


@router.post("/case/{case_id}/resolve", response_model=CaseEscalationResponse)
async def resolve(case_id: str, req: ResolveRequest):
    """Resolve a case at its current level."""
    result = resolve_case(case_id, req)
    if not result:
        raise HTTPException(status_code=404, detail="Case not found")
    return result


@router.post("/case/{case_id}/escalate", response_model=CaseEscalationResponse)
async def escalate(case_id: str, req: EscalateRequest):
    """Escalate a case to the next level in the pipeline."""
    result = escalate_case(case_id, req)
    if not result:
        raise HTTPException(status_code=404, detail="Case not found")
    return result


# ── Reference Data ────────────────────────────────────────

@router.get("/stations")
async def list_stations():
    """List all police stations."""
    return POLICE_STATIONS


@router.get("/courts")
async def list_courts():
    """List all courts in the hierarchy."""
    return COURTS
