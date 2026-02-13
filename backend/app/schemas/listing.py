"""
Listing Optimizer Schemas - Case Listing Management
"""
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum

class CaseType(str, Enum):
    CIVIL = "civil"
    CRIMINAL = "criminal"
    WRIT = "writ"
    APPEAL = "appeal"
    REVISION = "revision"
    BAIL_APPLICATION = "bail_application"
    INTERLOCUTORY = "interlocutory"

class CaseStage(str, Enum):
    ADMISSION = "admission"
    NOTICE = "notice"
    FILING_OF_DOCUMENTS = "filing_of_documents"
    INTERLOCUTORY_ARGUMENTS = "interlocutory_arguments"
    FINAL_ARGUMENTS = "final_arguments"
    JUDGMENT_RESERVED = "judgment_reserved"
    MENTION = "mention"
    ORDERS = "orders"
    EVIDENCE = "evidence"

class CasePriority(str, Enum):
    URGENT = "urgent"
    HIGH = "high"
    NORMAL = "normal"
    LOW = "low"

class TimeSlot(BaseModel):
    slot_id: Optional[int] = None
    start_time: str  # HH:MM format
    end_time: str
    duration_minutes: int

class CaseListing(BaseModel):
    id: str
    cino: str = ""  # Case number
    case_number: str
    title: str
    case_type: CaseType | str
    stage: CaseStage | str
    priority: CasePriority = CasePriority.NORMAL
    urgency: str = "Normal"
    estimated_duration: Optional[int] = None
    preferred_time: Optional[str] = None
    judge_id: Optional[str] = None
    court_id: str
    last_listed_date: Optional[str] = None
    adjournment_count: int = 0
    notes: Optional[str] = None

class ScheduledSlot(BaseModel):
    slot_id: int
    start_time: str
    end_time: str
    duration_minutes: int
    case: CaseListing

class OptimizedSchedule(BaseModel):
    date: str
    court_id: str
    judge_id: str
    judge_name: str
    total_cases: int
    total_minutes_scheduled: int
    utilization_percentage: float
    schedule: List[ScheduledSlot]
    unlisted_cases: List[CaseListing]
    breaks: List[TimeSlot]

class OptimizationRequest(BaseModel):
    court_id: str
    judge_id: str
    date: str
    cases: List[CaseListing]
    max_daily_minutes: int = 330  # 5.5 hours

class ListingCreate(BaseModel):
    case_number: str
    title: str = Field(..., min_length=5, max_length=500)
    case_type: CaseType
    stage: CaseStage
    priority: CasePriority = CasePriority.NORMAL
    court_id: str
    judge_id: Optional[str] = None
    notes: Optional[str] = None

class ListingUpdate(BaseModel):
    title: Optional[str] = None
    stage: Optional[CaseStage] = None
    priority: Optional[CasePriority] = None
    notes: Optional[str] = None
