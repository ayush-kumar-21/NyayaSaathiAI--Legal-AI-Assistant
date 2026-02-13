"""
Legal Aid Finder Schema - Skill 24
Connects citizens with free legal aid services
"""
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum


class AidType(str, Enum):
    FREE_LAWYER = "free_lawyer"
    LEGAL_CLINIC = "legal_clinic"
    NALSA_SCHEME = "nalsa_scheme"
    DISTRICT_AUTHORITY = "district_authority"
    NGO = "ngo"
    PRO_BONO = "pro_bono"


class EligibilityStatus(str, Enum):
    ELIGIBLE = "eligible"
    LIKELY_ELIGIBLE = "likely_eligible"
    NEEDS_VERIFICATION = "needs_verification"
    NOT_ELIGIBLE = "not_eligible"


class LegalAidProvider(BaseModel):
    id: str
    name: str
    type: AidType
    address: str
    district: str
    state: str
    contact_phone: str
    contact_email: Optional[str] = None
    specialization: List[str]
    languages: List[str]
    availability: str
    rating: float = Field(ge=0, le=5)


class LegalAidRequest(BaseModel):
    category: str  # criminal, civil, family, labour
    district: str
    state: str = "Delhi"
    annual_income: Optional[float] = None
    is_sc_st: bool = False
    is_woman: bool = False
    is_minor: bool = False
    is_disabled: bool = False
    case_description: str = ""


class LegalAidResponse(BaseModel):
    id: str
    eligibility: EligibilityStatus
    eligibility_reason: str
    providers: List[LegalAidProvider]
    nalsa_schemes: List[dict]
    helpline_numbers: List[dict]
    application_steps: List[str]
    documents_required: List[str]
    generated_at: datetime = Field(default_factory=datetime.now)
