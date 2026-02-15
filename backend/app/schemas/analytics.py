from pydantic import BaseModel
from typing import List, Optional


class HeatmapData(BaseModel):
    state: str
    total_cases: int
    pending_cases: int
    disposed_cases: int
    sla_breaches: int
    sla_breach_rate: float
    intensity: float  # 0.0 to 1.0


class NationalStats(BaseModel):
    total_cases: int
    pending_cases: int
    disposed_cases: int
    avg_disposal_days: float
    sla_compliance_rate: float
    critical_districts: int
    conviction_rate: float
    states: List[HeatmapData]


class BNSSDeadlineCase(BaseModel):
    cnr: str
    case_id: str
    days_remaining: int
    deadline_days: int
    status: str
    priority: str
    fir_registered_date: Optional[str]
    state: Optional[str]
    district: Optional[str]
