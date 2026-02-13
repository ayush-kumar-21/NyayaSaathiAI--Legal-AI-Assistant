"""
Warrant Manager Schemas - Skill 16
Digital warrant issuance and tracking
"""
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import date, datetime
from enum import Enum


class WarrantStatus(str, Enum):
    PENDING = "pending"
    ISSUED = "issued"
    EXECUTED = "executed"
    RECALLED = "recalled"
    EXPIRED = "expired"


class WarrantType(str, Enum):
    ARREST = "arrest"
    SEARCH = "search"
    BENCH = "bench"


class Warrant(BaseModel):
    id: str
    case_id: str
    accused_name: str
    warrant_type: WarrantType
    status: WarrantStatus
    issue_date: date
    expiry_date: Optional[date] = None
    issuing_authority: str 
    execution_notes: Optional[str] = None
    metadata: Dict[str, Any] = {}


class WarrantIssueRequest(BaseModel):
    case_id: str
    accused_name: str
    warrant_type: WarrantType
    issuing_authority: str
    expiry_date: Optional[date] = None


class WarrantUpdateRequest(BaseModel):
    status: WarrantStatus
    execution_notes: Optional[str] = None
