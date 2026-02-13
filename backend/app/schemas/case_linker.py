"""
Case Linker & Pattern Detection Schemas - Skill 05
Graph-based crime analysis and serial offender detection
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


class PatternType(str, Enum):
    MODUS_OPERANDI = "modus_operandi"
    GEOSPATIAL = "geospatial"
    RECURRING_SUSPECT = "recurring_suspect"
    TEMPORAL = "temporal"
    FORENSIC_MATCH = "forensic_match"
    CYBER_SIGNATURE = "cyber_signature"


class LinkStrength(str, Enum):
    CONFIRMED = "confirmed"  # DNA, Fingerprint, Confession
    HIGH = "high"            # Distinctive MO, Witness ID
    MEDIUM = "medium"        # Similar description, nearby
    LOW = "low"              # Vague similarities


class CrimeNode(BaseModel):
    id: str
    type: str  # Case, Suspect, Weapon, Vehicle, Location
    label: str
    metadata: Dict[str, Any]


class CrimeLink(BaseModel):
    source: str
    target: str
    strength: LinkStrength
    type: PatternType
    description: str
    confidence_score: float = Field(..., ge=0.0, le=1.0)


class CrimeGraph(BaseModel):
    nodes: List[CrimeNode]
    links: List[CrimeLink]


class PatternAlert(BaseModel):
    id: str
    pattern_type: PatternType
    title: str
    description: str
    linked_cases: List[str]
    suspects_involved: List[str]
    confidence_score: float
    detected_at: datetime
    recommended_action: str


class CaseLinkRequest(BaseModel):
    case_id: str
    include_closed_cases: bool = True
    min_confidence: float = 0.6


class CaseLinkResponse(BaseModel):
    case_id: str
    graph: CrimeGraph
    patterns: List[PatternAlert]
    similar_cases: List[Dict[str, Any]]
