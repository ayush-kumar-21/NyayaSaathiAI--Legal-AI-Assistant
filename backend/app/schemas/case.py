from pydantic import BaseModel, Field
from typing import Optional, List, Union
from datetime import datetime
from uuid import UUID
from app.models.enums import CaseStatus, CasePriority


class CaseCreate(BaseModel):
    complaint_narrative: str = Field(..., min_length=10, max_length=10000)
    incident_location: Optional[str] = None
    incident_datetime: Optional[datetime] = None
    accused_description: Optional[str] = None
    priority: CasePriority = CasePriority.MEDIUM


class CaseResponse(BaseModel):
    id: Union[str, UUID]
    cnr: str
    status: CaseStatus
    priority: CasePriority
    fir_filed_date: Optional[datetime]
    bnss_days_remaining: Optional[int] = None
    citizen_id: Union[str, UUID]
    assigned_io_id: Optional[Union[str, UUID]] = None
    assigned_judge_id: Optional[Union[str, UUID]] = None
    created_at: datetime

    class Config:
        from_attributes = True


class CaseStatusUpdate(BaseModel):
    new_status: CaseStatus
    notes: Optional[str] = None


class CaseListResponse(BaseModel):
    total: int
    cases: List[CaseResponse]
