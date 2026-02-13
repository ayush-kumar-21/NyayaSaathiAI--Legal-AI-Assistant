"""
Case Status Tracker Schema - Skill 23
Real-time case status tracking for citizens
"""
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum


class CaseStage(str, Enum):
    FIR_FILED = "fir_filed"
    INVESTIGATION = "investigation"
    CHARGESHEET_FILED = "chargesheet_filed"
    TRIAL_COMMENCED = "trial_commenced"
    EVIDENCE_STAGE = "evidence_stage"
    ARGUMENTS = "arguments"
    JUDGMENT_RESERVED = "judgment_reserved"
    JUDGMENT_DELIVERED = "judgment_delivered"
    APPEAL = "appeal"
    DISPOSED = "disposed"


class HearingInfo(BaseModel):
    date: str
    court: str
    judge: str
    purpose: str
    result: str
    next_date: Optional[str] = None


class CaseStatusRequest(BaseModel):
    cnr_number: Optional[str] = None
    fir_number: Optional[str] = None
    case_type: Optional[str] = None
    year: Optional[int] = None


class CaseStatusResponse(BaseModel):
    id: str
    cnr_number: str
    case_title: str
    case_type: str
    court: str
    judge: str
    current_stage: CaseStage
    stage_percentage: float = Field(ge=0, le=100)
    filing_date: str
    next_hearing: Optional[str] = None
    hearings: List[HearingInfo]
    parties: dict  # petitioner, respondent
    status_summary: str
    estimated_timeline: str
    retrieved_at: datetime = Field(default_factory=datetime.now)
