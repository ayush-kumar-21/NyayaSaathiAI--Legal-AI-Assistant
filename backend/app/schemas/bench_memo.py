"""
Bench Memo Generator Schemas - Skill 08
Auto-generates bench memos for judges
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


class MemoStatus(str, Enum):
    DRAFT = "draft"
    GENERATED = "generated"
    REVIEWED = "reviewed"


class CasePrecedent(BaseModel):
    title: str
    citation: str
    summary: str
    relevance: str


class LegalIssue(BaseModel):
    issue: str
    rule_of_law: str
    analysis: str
    conclusion: str


class BenchMemo(BaseModel):
    id: str
    case_id: str
    judge_id: str
    
    # Memo Content
    case_summary: str
    procedural_history: str
    legal_issues: List[LegalIssue]
    precedents: List[CasePrecedent]
    recommended_ruling: str
    
    status: MemoStatus
    created_at: datetime
    updated_at: datetime
    
    metadata: Dict[str, Any] = {}


class GenerateMemoRequest(BaseModel):
    case_id: str
    focus_area: Optional[str] = "General"  # e.g., "Bail", "Sentencing", "Admissibility"
