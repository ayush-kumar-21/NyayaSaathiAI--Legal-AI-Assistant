from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime
from enum import Enum

class EvidenceStatus(str, Enum):
    COLLECTED = "COLLECTED"
    SEALED = "SEALED"
    SUBMITTED = "SUBMITTED"
    VERIFIED = "VERIFIED"
    TAMPERED = "TAMPERED"

class CustodyAction(str, Enum):
    COLLECTED = "COLLECTED"
    TRANSFERRED = "TRANSFERRED"
    RECEIVED = "RECEIVED"
    SEALED = "SEALED"
    UNSEALED = "UNSEALED"
    SUBMITTED_TO_COURT = "SUBMITTED_TO_COURT"

class ChainOfCustodyEvent(BaseModel):
    id: str
    evidence_id: str
    timestamp: datetime
    actor_id: str
    actor_name: str
    actor_role: str
    action: CustodyAction
    location: Optional[str] = None
    comments: Optional[str] = None
    previous_hash: str
    event_hash: str

    class Config:
        from_attributes = True

class EvidenceCreate(BaseModel):
    title: str
    description: Optional[str] = None
    case_id: str
    evidence_type: str
    collection_date: Optional[datetime] = None
    collection_location: Optional[str] = None
    tags: Optional[List[str]] = []
    metadata: Optional[Dict] = {}

class Evidence(EvidenceCreate):
    id: str
    file_url: str
    file_hash: str
    file_size_bytes: int
    current_status: EvidenceStatus
    custodian_id: str
    blockchain_tx_id: Optional[str] = None
    chain_of_custody: List[ChainOfCustodyEvent] = []

    class Config:
        from_attributes = True

class EvidenceUpload(BaseModel):
    case_id: str
    evidence_type: str
    description: Optional[str] = None
    file_name: str

class EvidenceResponse(BaseModel):
    id: str
    case_id: str
    evidence_type: str
    file_name: Optional[str]
    sha256_hash: Optional[str] = None
    file_hash: Optional[str] = None # For compatibility
    verification_status: Optional[str] = None
    current_status: Optional[EvidenceStatus] = None # For compatibility
    blockchain_block_number: Optional[int] = None
    collected_at: Optional[datetime] = None
    evidence: Optional[Evidence] = None # Nested full object if needed
    chain_of_custody: Optional[List[ChainOfCustodyEvent]] = None
    integrity_status: Optional[str] = None

    class Config:
        from_attributes = True

class VerificationResult(BaseModel):
    evidence_id: str
    original_hash: str
    current_hash: str
    is_verified: bool
    block_number: Optional[int]
    verified_at: str
    bsa_certificate: Optional[str] = None

class CustodyTransferRequest(BaseModel):
    evidence_id: str
    to_user_id: str
    action: CustodyAction
    location: str
    comments: Optional[str] = None
