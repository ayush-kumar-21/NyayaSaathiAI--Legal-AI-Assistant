"""
Witness Protection Tracker (Rakshya) Schemas - Skill 04
Secure management of witness identities and protection detail
"""
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime, date
from enum import Enum


class ThreatLevel(str, Enum):
    CRITICAL = "critical"   # Immediate life threat
    HIGH = "high"           # Potential for violence
    MODERATE = "moderate"   # Intimidation likely
    LOW = "low"             # Minimal risk


class ProtectionStatus(str, Enum):
    ACTIVE = "active"
    RELOCATED = "relocated"
    COMPLETED = "completed"
    WITHDRAWN = "withdrawn"
    TERMINATED = "terminated"


class IdentityStatus(str, Enum):
    REVEALED = "revealed"
    CONCEALED = "concealed"
    ALIAS_ACTIVE = "alias_active"


class Witness(BaseModel):
    id: str
    case_id: str
    
    # Hidden Identity (Only visible to authorized)
    real_name: str
    date_of_birth: date
    contact_number: str
    address: str
    
    # Public/Alias Identity
    alias_name: Optional[str] = None
    identity_status: IdentityStatus = IdentityStatus.CONCEALED
    
    # Protection Details
    threat_level: ThreatLevel
    protection_status: ProtectionStatus
    assigned_officer_id: str
    
    # Metadata
    risk_factors: List[str] = []
    protection_measures: List[str] = []
    next_check_in: Optional[datetime] = None
    last_check_in: Optional[datetime] = None
    
    metadata: Dict[str, Any] = {}


class WitnessCreate(BaseModel):
    case_id: str
    real_name: str
    date_of_birth: date
    contact_number: str
    address: str
    threat_level: ThreatLevel = ThreatLevel.MODERATE
    risk_factors: List[str] = []
    protection_measures: List[str] = []


class RiskAssessment(BaseModel):
    id: str
    witness_id: str
    assessed_by: str
    assessment_date: datetime
    threat_level: ThreatLevel
    threat_source: str
    evidence_of_threat: Optional[str] = None
    recommended_measures: List[str] = []


class ProtectionUpdate(BaseModel):
    status: ProtectionStatus
    comments: str


class WitnessResponse(BaseModel):
    id: str
    case_id: str
    alias_name: Optional[str] = None
    threat_level: ThreatLevel
    protection_status: ProtectionStatus
    
    # Conditional fields based on access
    real_name: Optional[str] = None
    contact_number: Optional[str] = None
    address: Optional[str] = None
