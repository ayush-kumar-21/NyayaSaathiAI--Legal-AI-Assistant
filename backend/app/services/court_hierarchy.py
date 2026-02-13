"""
Court Hierarchy — Indian Judicial System
Magistrate Court → Sessions Court → High Court → Supreme Court
"""
from typing import Optional, List
from app.schemas.escalation import EscalationLevel


# ── Court Data ────────────────────────────────────────────

COURTS = [
    # Magistrate Courts (lowest — one per district cluster)
    {
        "id": "MC-DEL-001",
        "name": "Metropolitan Magistrate Court, Saket",
        "level": EscalationLevel.MAGISTRATE_COURT,
        "district": "South Delhi",
        "address": "Saket Court Complex, New Delhi",
        "bench": "MM-1",
    },
    {
        "id": "MC-DEL-002",
        "name": "Metropolitan Magistrate Court, Tis Hazari",
        "level": EscalationLevel.MAGISTRATE_COURT,
        "district": "Central Delhi",
        "address": "Tis Hazari Courts Complex, Delhi",
        "bench": "MM-3",
    },
    {
        "id": "MC-DEL-003",
        "name": "Metropolitan Magistrate Court, Dwarka",
        "level": EscalationLevel.MAGISTRATE_COURT,
        "district": "South West Delhi",
        "address": "Dwarka Court Complex, Sector 10, Dwarka",
        "bench": "MM-5",
    },
    {
        "id": "MC-DEL-004",
        "name": "Metropolitan Magistrate Court, Karkardooma",
        "level": EscalationLevel.MAGISTRATE_COURT,
        "district": "East Delhi",
        "address": "Karkardooma Courts Complex, Delhi",
        "bench": "MM-7",
    },

    # Sessions Courts (mid — one per zone)
    {
        "id": "SC-DEL-001",
        "name": "Sessions Court, Saket (South)",
        "level": EscalationLevel.SESSIONS_COURT,
        "district": "South Delhi",
        "address": "Saket Court Complex, New Delhi",
        "bench": "ASJ-1",
    },
    {
        "id": "SC-DEL-002",
        "name": "Sessions Court, Tis Hazari (North/Central)",
        "level": EscalationLevel.SESSIONS_COURT,
        "district": "Central Delhi",
        "address": "Tis Hazari Courts Complex, Delhi",
        "bench": "ASJ-4",
    },

    # High Court
    {
        "id": "HC-DEL-001",
        "name": "Delhi High Court",
        "level": EscalationLevel.HIGH_COURT,
        "district": "Central Delhi",
        "address": "Sher Shah Rd, Near India Gate, New Delhi",
        "bench": "Division Bench",
    },

    # Supreme Court
    {
        "id": "SCI-001",
        "name": "Supreme Court of India",
        "level": EscalationLevel.SUPREME_COURT,
        "district": "Central Delhi",
        "address": "Tilak Marg, New Delhi",
        "bench": "Constitution Bench",
    },
]


# ── District → Court Mapping ─────────────────────────────

# Maps police station district to the Magistrate Court that covers it
DISTRICT_TO_MAGISTRATE = {
    "South Delhi": "MC-DEL-001",
    "South East Delhi": "MC-DEL-001",
    "Central Delhi": "MC-DEL-002",
    "North Delhi": "MC-DEL-002",
    "North West Delhi": "MC-DEL-002",
    "South West Delhi": "MC-DEL-003",
    "West Delhi": "MC-DEL-003",
    "East Delhi": "MC-DEL-004",
}

DISTRICT_TO_SESSIONS = {
    "South Delhi": "SC-DEL-001",
    "South East Delhi": "SC-DEL-001",
    "South West Delhi": "SC-DEL-001",
    "West Delhi": "SC-DEL-001",
    "Central Delhi": "SC-DEL-002",
    "North Delhi": "SC-DEL-002",
    "North West Delhi": "SC-DEL-002",
    "East Delhi": "SC-DEL-002",
}


# ── Lookup Functions ──────────────────────────────────────

def get_court_by_id(court_id: str) -> Optional[dict]:
    """Get a court by its ID."""
    for c in COURTS:
        if c["id"] == court_id:
            return c
    return None


def get_next_court(current_level: EscalationLevel, district: str) -> Optional[dict]:
    """
    Given the current escalation level and district, return the next court
    in the hierarchy. Returns None if already at Supreme Court.
    """
    if current_level == EscalationLevel.POLICE_LOCAL or current_level == EscalationLevel.POLICE_NEARBY:
        # First court: Magistrate
        court_id = DISTRICT_TO_MAGISTRATE.get(district, "MC-DEL-002")
        return get_court_by_id(court_id)

    elif current_level == EscalationLevel.MAGISTRATE_COURT:
        # Next: Sessions Court
        court_id = DISTRICT_TO_SESSIONS.get(district, "SC-DEL-002")
        return get_court_by_id(court_id)

    elif current_level == EscalationLevel.SESSIONS_COURT:
        # Next: High Court
        return get_court_by_id("HC-DEL-001")

    elif current_level == EscalationLevel.HIGH_COURT:
        # Next: Supreme Court
        return get_court_by_id("SCI-001")

    # Already at highest level
    return None


def get_first_court_for_district(district: str) -> dict:
    """Get the Magistrate Court for a given district."""
    court_id = DISTRICT_TO_MAGISTRATE.get(district, "MC-DEL-002")
    return get_court_by_id(court_id)
