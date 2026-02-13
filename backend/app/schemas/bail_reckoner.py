"""
Bail Reckoner Schemas - Skill 09
AI-driven bail eligibility analysis
"""
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


class RiskLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class BailRecommendation(str, Enum):
    GRANT = "grant"
    GRANT_WITH_CONDITIONS = "grant_with_conditions"
    REJECT = "reject"


class RiskFactor(BaseModel):
    category: str  # Flight Risk, Tampering, Reoffending
    description: str
    risk_level: RiskLevel
    weight: float


class BailReport(BaseModel):
    id: str
    case_id: str
    accused_id: str
    accused_name: str
    
    offenses: List[str]  # e.g., ["BNS 303(2)", "BNS 318(4)"]
    is_bailable_offense: bool
    max_punishment_years: int
    
    # Analysis
    criminal_history_score: float
    flight_risk_score: float
    tampering_risk_score: float
    overall_risk_score: float  # 0-100
    
    risk_factors: List[RiskFactor]
    recommendation: BailRecommendation
    suggested_conditions: List[str]
    
    created_at: datetime
    metadata: Dict[str, Any] = {}


class BailAnalysisRequest(BaseModel):
    case_id: str
    accused_id: str
    offenses: List[str]
    prior_convictions: int = 0
    is_flight_risk: bool = False
    is_witness_tampering_risk: bool = False
