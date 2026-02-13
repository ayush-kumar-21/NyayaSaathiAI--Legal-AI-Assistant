"""
Case Escalation Pipeline Schemas
Handles the full lifecycle: Citizen Complaint → Police → Court Hierarchy
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


class EscalationLevel(str, Enum):
    """The current level a case is at in the pipeline"""
    POLICE_LOCAL = "police_local"           # Nearest police station
    POLICE_NEARBY = "police_nearby"         # Nearby police stations
    MAGISTRATE_COURT = "magistrate_court"   # Lowest court
    SESSIONS_COURT = "sessions_court"       # District/Sessions court
    HIGH_COURT = "high_court"              # State High Court
    SUPREME_COURT = "supreme_court"        # Supreme Court of India


class EscalationStatus(str, Enum):
    """Status of the case at its current level"""
    PENDING = "pending"             # Waiting to be picked up
    INVESTIGATING = "investigating" # Being worked on
    RESOLVED = "resolved"          # Solved at this level
    ESCALATED = "escalated"        # Moved to next level
    CLOSED = "closed"              # Case closed (final)


# ── Requests ──────────────────────────────────────────────

class ComplaintRequest(BaseModel):
    """Citizen files a new complaint"""
    complainant_name: str = Field(..., min_length=2)
    complainant_contact: str
    complaint_text: str = Field(..., min_length=10)
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    address: Optional[str] = None
    evidence_urls: List[str] = []
    incident_datetime: Optional[str] = None


class ResolveRequest(BaseModel):
    """Resolve a case at current level"""
    conclusion: str = Field(..., min_length=5)
    resolved_by: str
    notes: Optional[str] = None


class EscalateRequest(BaseModel):
    """Escalate a case to the next level"""
    reason: str = Field(..., min_length=5)
    escalated_by: str
    notes: Optional[str] = None


# ── Data Objects ──────────────────────────────────────────

class PoliceStationInfo(BaseModel):
    """Police station summary"""
    id: str
    name: str
    district: str
    address: str
    latitude: float
    longitude: float
    distance_km: Optional[float] = None


class CourtInfo(BaseModel):
    """Court summary"""
    id: str
    name: str
    level: EscalationLevel
    district: str
    bench: Optional[str] = None


class EscalationEntry(BaseModel):
    """One step in the escalation timeline"""
    level: EscalationLevel
    status: EscalationStatus
    assigned_to: str               # Station name or Court name
    assigned_to_id: str
    started_at: str
    ended_at: Optional[str] = None
    action_by: Optional[str] = None
    conclusion: Optional[str] = None
    reason: Optional[str] = None
    notes: Optional[str] = None


# ── Responses ─────────────────────────────────────────────

class CaseEscalationResponse(BaseModel):
    """Full case view with escalation timeline"""
    id: str
    fir_number: str
    complainant_name: str
    complainant_contact: str
    complaint_text: str
    address: Optional[str] = None
    latitude: float
    longitude: float
    evidence_urls: List[str] = []
    incident_datetime: Optional[str] = None

    # Current state
    current_level: EscalationLevel
    current_status: EscalationStatus
    current_assigned_to: str
    current_assigned_to_id: str

    # Timeline
    timeline: List[EscalationEntry] = []

    # Meta
    created_at: str
    updated_at: str
    resolved_at: Optional[str] = None
    conclusion: Optional[str] = None


class CaseListItem(BaseModel):
    """Summary item for case lists"""
    id: str
    fir_number: str
    complainant_name: str
    complaint_summary: str
    current_level: EscalationLevel
    current_status: EscalationStatus
    current_assigned_to: str
    created_at: str
    updated_at: str


class CaseListResponse(BaseModel):
    """Paginated list of cases"""
    total: int
    cases: List[CaseListItem]
