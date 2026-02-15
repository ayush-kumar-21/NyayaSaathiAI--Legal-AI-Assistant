from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from app.models.enums import CaseStatus, CasePriority


class CaseCreate(BaseModel):
    complaint_narrative: str = Field(..., min_length=10, max_length=10000)
    incident_location: Optional[str] = None
    incident_datetime: Optional[datetime] = None
    accused_description: Optional[str] = None
    priority: CasePriority = CasePriority.MEDIUM


class CaseResponse(BaseModel):
    id: str
    cnr: str
    status: CaseStatus
    priority: CasePriority
    fir_filed_date: Optional[datetime]
    bnss_days_remaining: Optional[int] = None
    citizen_id: str
    assigned_io_id: Optional[str] = None
    assigned_judge_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class CaseStatusUpdate(BaseModel):
    new_status: CaseStatus
    notes: Optional[str] = None


class CaseListResponse(BaseModel):
    total: int
    cases: List[CaseResponse]
