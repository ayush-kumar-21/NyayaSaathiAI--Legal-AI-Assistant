"""
Case Intake Triage Schema - Skill 18
AI-powered case priority classification for judges
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime
from enum import Enum


class UrgencyLevel(str, Enum):
    CRITICAL = "critical"       # Life/liberty at stake
    HIGH = "high"               # Statutory deadline approaching
    MEDIUM = "medium"           # Standard priority
    LOW = "low"                 # Routine matter
    DEFERRED = "deferred"       # Can be scheduled later


class CaseCategory(str, Enum):
    BAIL = "bail"
    REMAND = "remand"
    ANTICIPATORY_BAIL = "anticipatory_bail"
    QUASHING = "quashing"
    APPEALS = "appeals"
    CIVIL = "civil"
    FAMILY = "family"
    WRIT = "writ"
    PIL = "pil"
    OTHER = "other"


class TriageFactor(BaseModel):
    factor: str
    impact: str  # "increases_urgency" or "decreases_urgency"
    weight: float = Field(ge=0, le=10)
    description: str


class TriageRequest(BaseModel):
    case_id: str
    case_title: str
    filing_date: Optional[str] = None
    offense_sections: List[str] = []
    case_type: Optional[str] = None
    accused_in_custody: bool = False
    custody_days: int = 0
    statutory_deadline_days: Optional[int] = None
    is_senior_citizen: bool = False
    is_minor_involved: bool = False
    is_woman_complainant: bool = False
    brief_facts: str = ""


class TriageResult(BaseModel):
    id: str
    case_id: str
    case_title: str
    urgency_level: UrgencyLevel
    urgency_score: float = Field(ge=0, le=100)
    category: CaseCategory
    factors: List[TriageFactor]
    recommended_bench: str
    recommended_hearing_date: str
    estimated_hearing_time: str
    special_instructions: List[str]
    statutory_alerts: List[str]
    created_at: datetime = Field(default_factory=datetime.now)
