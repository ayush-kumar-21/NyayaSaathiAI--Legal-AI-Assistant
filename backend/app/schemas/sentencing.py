"""
Sentencing Assistant Schemas - Skill 10
AI-driven sentencing recommendations
"""
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


class SentenceType(str, Enum):
    IMPRISONMENT = "imprisonment"
    FINE = "fine"
    COMMUNITY_SERVICE = "community_service"
    PROBATION = "probation"
    DEATH_PENALTY = "death_penalty"


class FactorType(str, Enum):
    AGGRAVATING = "aggravating"
    MITIGATING = "mitigating"


class SentencingFactor(BaseModel):
    description: str
    type: FactorType
    weight: float  # Importance 1-10


class SentenceRange(BaseModel):
    min_years: float
    max_years: float
    fine_amount: float
    type: SentenceType


class SentencingReport(BaseModel):
    id: str
    case_id: str
    convict_id: str
    convict_name: str
    
    offenses: List[str]  # Convicted sections
    
    # Guidelines
    statutory_min: SentenceRange
    statutory_max: SentenceRange
    
    # Analysis
    aggravating_factors: List[SentencingFactor]
    mitigating_factors: List[SentencingFactor]
    
    recommended_sentence: SentenceRange
    reasoning: str
    precedents_cited: List[str]
    
    created_at: datetime
    metadata: Dict[str, Any] = {}


class SentencingRequest(BaseModel):
    case_id: str
    convict_id: str
    offenses: List[str]
    age: int
    prior_convictions: int
    background_info: str
