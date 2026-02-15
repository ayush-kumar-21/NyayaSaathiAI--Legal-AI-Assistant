from pydantic import BaseModel
from typing import Optional
from datetime import datetime


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
    sha256_hash: str
    verification_status: str
    blockchain_block_number: Optional[int]
    collected_at: Optional[datetime]

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
