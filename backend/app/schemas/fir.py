"""
Smart-FIR Schemas - Skill 01
AI-powered FIR generation with BNS section mapping
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime
from enum import Enum


class FIRStatus(str, Enum):
    DRAFT = "draft"
    PENDING_REVIEW = "pending_review"
    APPROVED = "approved"
    FILED = "filed"
    REJECTED = "rejected"


class CrimeSeverity(str, Enum):
    MINOR = "minor"
    MODERATE = "moderate"
    SERIOUS = "serious"
    HEINOUS = "heinous"


class ExtractedEntity(BaseModel):
    entity_type: str  # person, location, time, object, vehicle
    value: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    position: Optional[Dict[str, int]] = None  # start/end indices


class BNSSection(BaseModel):
    section_number: str  # e.g., "BNS 303"
    description: str
    severity: CrimeSeverity
    confidence: float = Field(..., ge=0.0, le=1.0)
    keywords_matched: List[str]
    punishment_summary: Optional[str] = None
    cognizable: bool = True
    bailable: bool = True


class FIRAnalysis(BaseModel):
    entities: List[ExtractedEntity]
    bns_sections: List[BNSSection]
    incident_summary: str
    key_facts: List[str]
    recommended_io: Optional[str] = None  # Investigating Officer
    priority_score: float = Field(..., ge=0.0, le=10.0)


class FIRCreateRequest(BaseModel):
    complaint_text: str = Field(..., min_length=20, max_length=5000)
    complainant_name: str
    complainant_contact: str
    police_station_id: str
    incident_location: Optional[str] = None
    incident_datetime: Optional[datetime] = None
    supporting_docs: Optional[List[str]] = []  # URLs


class FIRResponse(BaseModel):
    fir_id: str
    fir_number: str  # e.g., FIR/2025/042
    status: FIRStatus
    complaint_text: str
    analysis: FIRAnalysis
    draft_content: str
    generated_at: datetime
    reviewed_by: Optional[str] = None
    reviewed_at: Optional[datetime] = None
    confidence_score: float = Field(..., ge=0.0, le=1.0)


class FIRUpdateRequest(BaseModel):
    status: Optional[FIRStatus] = None
    draft_content: Optional[str] = None
    reviewed_by: Optional[str] = None
    notes: Optional[str] = None


class FIRSearchRequest(BaseModel):
    query: Optional[str] = None
    status: Optional[FIRStatus] = None
    police_station_id: Optional[str] = None
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None
    bns_section: Optional[str] = None
    page: int = 1
    page_size: int = 20


class FIRSearchResponse(BaseModel):
    total: int
    results: List[FIRResponse]
    page: int
    page_size: int
    facets: Optional[Dict] = None


# BNS Section Database Reference
BNS_SECTIONS_DB = {
    "BNS 100": {
        "description": "Murder",
        "severity": CrimeSeverity.HEINOUS,
        "keywords": ["kill", "murder", "death", "dead", "body"],
        "punishment": "Death or imprisonment for life",
        "cognizable": True,
        "bailable": False
    },
    "BNS 103": {
        "description": "Culpable Homicide",
        "severity": CrimeSeverity.SERIOUS,
        "keywords": ["death", "killed", "homicide", "manslaughter"],
        "punishment": "Imprisonment for life or 10 years",
        "cognizable": True,
        "bailable": False
    },
    "BNS 115": {
        "description": "Hurt",
        "severity": CrimeSeverity.MODERATE,
        "keywords": ["hurt", "injury", "injured", "beat", "assault"],
        "punishment": "Imprisonment up to 1 year or fine",
        "cognizable": True,
        "bailable": True
    },
    "BNS 299": {
        "description": "Theft",
        "severity": CrimeSeverity.MODERATE,
        "keywords": ["stolen", "theft", "steal", "took", "missing"],
        "punishment": "Imprisonment up to 3 years or fine",
        "cognizable": True,
        "bailable": True
    },
    "BNS 300": {
        "description": "Extortion",
        "severity": CrimeSeverity.SERIOUS,
        "keywords": ["extort", "threaten", "force", "money", "demand"],
        "punishment": "Imprisonment up to 7 years",
        "cognizable": True,
        "bailable": False
    },
    "BNS 351": {
        "description": "Criminal Intimidation",
        "severity": CrimeSeverity.MODERATE,
        "keywords": ["threat", "intimidate", "fear", "harm"],
        "punishment": "Imprisonment up to 2 years",
        "cognizable": True,
        "bailable": True
    },
    "BNS 64": {
        "description": "Robbery",
        "severity": CrimeSeverity.SERIOUS,
        "keywords": ["robbery", "robbed", "force", "weapon", "gun", "knife"],
        "punishment": "Imprisonment up to 10 years",
        "cognizable": True,
        "bailable": False
    },
    "BNS 309": {
        "description": "Dacoity",
        "severity": CrimeSeverity.HEINOUS,
        "keywords": ["dacoity", "gang", "armed", "robbery", "five"],
        "punishment": "Imprisonment for life or 10 years",
        "cognizable": True,
        "bailable": False
    },
    "BNS 304": {
        "description": "Snatching",
        "severity": CrimeSeverity.MODERATE,
        "keywords": ["snatch", "grab", "chain", "bag", "mobile"],
        "punishment": "Imprisonment up to 3 years",
        "cognizable": True,
        "bailable": True
    },
    "BNS 356": {
        "description": "Assault",
        "severity": CrimeSeverity.MINOR,
        "keywords": ["assault", "beat", "hit", "slap", "attack"],
        "punishment": "Imprisonment up to 3 months or fine",
        "cognizable": True,
        "bailable": True
    }
}
