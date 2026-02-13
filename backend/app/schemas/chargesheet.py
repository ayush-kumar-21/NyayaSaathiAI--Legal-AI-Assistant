"""
Automated Charge Sheet Builder Schemas - Skill 06
Auto-populates Final Report (Section 173 CrPC / BNSS Equivalent)
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, date
from enum import Enum


class ChargeSheetStatus(str, Enum):
    DRAFT = "draft"
    PENDING_REVIEW = "pending_review"
    APPROVED = "approved"
    FILED = "filed"


class AccusedDetails(BaseModel):
    id: str
    name: str
    parentage: str
    address: str
    is_arrested: bool
    arrest_date: Optional[datetime] = None
    remand_status: str


class WitnessSummary(BaseModel):
    id: str
    name: str
    statement_summary: str
    is_key_witness: bool


class EvidenceSummary(BaseModel):
    id: str
    description: str
    seizure_memo_ref: str


class OffenseSection(BaseModel):
    act: str  # e.g., "BNS", "IPC"
    section: str
    description: str
    is_bailable: bool
    max_punishment: str


class ChargeSheet(BaseModel):
    id: str
    fir_id: str
    
    # Header Info
    police_station: str
    district: str
    year: int
    date_filed: Optional[datetime] = None
    
    # Core Content
    complainant_name: str
    accused: List[AccusedDetails]
    offenses: List[OffenseSection]
    brief_facts: str
    investigation_details: str
    
    # Attachments
    witnesses: List[WitnessSummary]
    evidence_list: List[EvidenceSummary]
    
    # Meta
    investigating_officer: str
    status: ChargeSheetStatus
    created_at: datetime
    updated_at: datetime
    
    metadata: Dict[str, Any] = {}


class ChargeSheetCreate(BaseModel):
    fir_id: str
    # Other fields can be auto-populated or manually passed


class ChargeSheetUpdate(BaseModel):
    brief_facts: Optional[str] = None
    investigation_details: Optional[str] = None
    offenses: Optional[List[OffenseSection]] = None
    status: Optional[ChargeSheetStatus] = None
    accused: Optional[List[AccusedDetails]] = None
