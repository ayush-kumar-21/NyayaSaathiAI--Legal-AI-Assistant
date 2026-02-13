"""
Digital Evidence Locker (Sakshya) Schemas - Skill 03
Blockchain-inspired chain of custody for digital evidence
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


class EvidenceType(str, Enum):
    DOCUMENT = "document"
    IMAGE = "image"
    VIDEO = "video"
    AUDIO = "audio"
    FORENSIC_REPORT = "forensic_report"
    PHYSICAL_ITEM_RECORD = "physical_item_record"
    OTHER = "other"


class EvidenceStatus(str, Enum):
    COLLECTED = "collected"
    SEALED = "sealed"
    ANALYZED = "analyzed"
    SUBMITTED_TO_COURT = "submitted_to_court"
    ARCHIVED = "archived"
    DISPOSED = "disposed"


class CustodyAction(str, Enum):
    COLLECTED = "collected"
    UPLOADED = "uploaded"
    ACCESSED = "accessed"
    TRANSFERRED = "transferred"
    SEALED = "sealed"
    UNSEALED = "unsealed"
    ANALYZED = "analyzed"
    CHECKED_OUT = "checked_out"
    CHECKED_IN = "checked_in"


class ChainOfCustodyEvent(BaseModel):
    id: str
    evidence_id: str
    timestamp: datetime
    actor_id: str
    actor_name: str
    actor_role: str
    action: CustodyAction
    location: str
    comments: Optional[str] = None
    previous_hash: str  # Link to previous event for tamper-evidence
    event_hash: str     # Hash of this event's data


class Evidence(BaseModel):
    id: str
    case_id: str
    title: str
    description: str
    evidence_type: EvidenceType
    file_url: Optional[str] = None  # Mock URL
    file_hash: str  # SHA-256 of the file content
    file_size_bytes: int
    collection_date: datetime
    collection_location: str
    collected_by: str
    current_status: EvidenceStatus
    custodian_id: str
    tags: List[str] = []
    metadata: Dict[str, Any] = {}
    
    # Verification
    is_tampered: bool = False
    blockchain_tx_id: Optional[str] = None  # Mock blockchain reference


class EvidenceCreate(BaseModel):
    case_id: str
    title: str
    description: str
    evidence_type: EvidenceType
    collection_location: str
    collection_date: Optional[datetime] = None
    tags: List[str] = []
    metadata: Dict[str, Any] = {}


class CustodyTransferRequest(BaseModel):
    evidence_id: str
    to_user_id: str
    to_user_name: str
    location: str
    comments: str
    action: CustodyAction = CustodyAction.TRANSFERRED


class EvidenceResponse(BaseModel):
    evidence: Evidence
    chain_of_custody: List[ChainOfCustodyEvent]
    integrity_status: str  # "VERIFIED", "TAMPERED", "UNKNOWN"
