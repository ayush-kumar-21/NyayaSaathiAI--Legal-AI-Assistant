"""
Registry Automator Schemas - Document Scrutiny & Fee Calculation
"""
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from enum import Enum


class DefectSeverity(str, Enum):
    CRITICAL = "critical"
    MAJOR = "major"
    MINOR = "minor"


class FilingType(str, Enum):
    WRIT_PETITION = "writ_petition"
    CIVIL_SUIT = "civil_suit"
    CRIMINAL_CASE = "criminal_case"
    APPEAL = "appeal"


class Defect(BaseModel):
    id: str
    description: str
    severity: DefectSeverity
    section_reference: Optional[str] = None
    suggestion: Optional[str] = None
    location: Optional[str] = None


class FeeBreakdown(BaseModel):
    base_fee: float
    value_based_fee: float
    additional_charges: float = 0
    total_fee: float
    max_fee_applied: bool = False


class ScrutinyRequest(BaseModel):
    document_url: str
    filing_type: Optional[FilingType] = None


class ScrutinyResponse(BaseModel):
    filing_id: str
    status: str  # COMPLIANT or DEFECTIVE
    defect_count: int
    defects_found: List[Defect]
    ai_summary: Optional[str] = None


class FeeCalculationRequest(BaseModel):
    filing_type: FilingType
    value_in_dispute: float = 0


class FeeCalculationResponse(BaseModel):
    filing_type: FilingType
    value_in_dispute: float
    fee_breakdown: FeeBreakdown
    applicable_rules: List[str]
