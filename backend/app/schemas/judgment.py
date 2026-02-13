"""
Judgment Validator Schema - Skill 21
AI tool to check draft judgments for legal completeness
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime
from enum import Enum


class ValidityStatus(str, Enum):
    VALID = "valid"
    NEEDS_REVIEW = "needs_review"
    CRITICAL_ISSUES = "critical_issues"


class IssueCategory(str, Enum):
    CITATION = "citation"
    PROCEDURAL = "procedural"
    CONSTITUTIONAL = "constitutional"
    FACTUAL = "factual"
    SENTENCING = "sentencing"
    FORMATTING = "formatting"


class IssueSeverity(str, Enum):
    CRITICAL = "critical"
    WARNING = "warning"
    INFO = "info"


class ValidationIssue(BaseModel):
    id: str
    category: IssueCategory
    severity: IssueSeverity
    title: str
    description: str
    location: str  # Section/paragraph reference
    suggestion: str
    legal_reference: Optional[str] = None


class JudgmentValidateRequest(BaseModel):
    case_id: str
    judgment_text: str
    judgment_type: str = "order"  # order, judgment, decree
    offense_sections: List[str] = []


class JudgmentValidateResponse(BaseModel):
    id: str
    case_id: str
    status: ValidityStatus
    overall_score: float = Field(ge=0, le=100)
    issues: List[ValidationIssue]
    issue_summary: Dict[str, int]  # category -> count
    strengths: List[str]
    recommendation: str
    validated_at: datetime = Field(default_factory=datetime.now)
