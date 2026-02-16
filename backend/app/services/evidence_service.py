import uuid
import hashlib
from datetime import datetime
from sqlalchemy.orm import Session

from app.models import Evidence, ChainOfCustody, BlockchainRecord, EvidenceType, EvidenceStatus
from app.core.exceptions import EvidenceTampered, CaseNotFound
from app.core.logging_config import logger
from app.services.blockchain_service import BlockchainService


class EvidenceService:
    def __init__(self, db: Session):
        self.db = db
        self.blockchain = BlockchainService(db)

    def compute_hash(self, content: bytes, timestamp: str, io_signature: str = "") -> str:
        """Compute SHA-256 hash: Hash = SHA256(Content + Timestamp + IO_Signature)"""
        data = content + timestamp.encode() + io_signature.encode()
        return hashlib.sha256(data).hexdigest()

    def upload_evidence(self, case_id: str, evidence_type: EvidenceType,
                        file_content: bytes, file_name: str,
                        collected_by: str, description: str = None) -> Evidence:
        """Upload evidence with hash computation and blockchain anchoring."""
        timestamp = datetime.utcnow().isoformat()
        sha256_hash = self.compute_hash(file_content, timestamp, collected_by)

        evidence = Evidence(
            id=str(uuid.uuid4()),
            case_id=case_id,
            evidence_type=evidence_type,
            description=description,
            file_name=file_name,
            file_path=f"uploads/{case_id}/{file_name}",
            sha256_hash=sha256_hash,
            verification_status=EvidenceStatus.UPLOADED,
            collected_by=collected_by,
            collected_at=datetime.utcnow(),
        )
        self.db.add(evidence)

        # Chain of custody - initial entry
        custody = ChainOfCustody(
            id=str(uuid.uuid4()),
            evidence_id=evidence.id,
            transferred_to=collected_by,
            transfer_datetime=datetime.utcnow(),
            purpose="Initial collection",
        )
        self.db.add(custody)

        # Blockchain anchor
        block = self.blockchain.anchor_record(
            data_hash=sha256_hash,
            reference_id=evidence.id,
            reference_table="evidence"
        )
        evidence.blockchain_block_number = block.block_number

        self.db.commit()
        self.db.refresh(evidence)
        logger.info(f"Evidence uploaded: {file_name} (hash: {sha256_hash[:16]}...)")
        return evidence

    def verify_evidence(self, evidence_id: str) -> dict:
        """Verify evidence integrity by recomputing hash."""
        evidence = self.db.query(Evidence).filter(Evidence.id == evidence_id).first()
        if not evidence:
            raise CaseNotFound(f"Evidence {evidence_id}")

        # Check blockchain record
        block = self.db.query(BlockchainRecord).filter(
            BlockchainRecord.reference_id == evidence_id,
            BlockchainRecord.reference_table == "evidence"
        ).first()

        original_hash = evidence.sha256_hash
        blockchain_hash = block.data_hash if block else None

        is_verified = original_hash == blockchain_hash if blockchain_hash else False

        if is_verified:
            evidence.verification_status = EvidenceStatus.VERIFIED
        else:
            evidence.verification_status = EvidenceStatus.TAMPERED

        evidence.last_verified_at = datetime.utcnow()
        self.db.commit()

        return {
            "evidence_id": evidence_id,
            "original_hash": original_hash,
            "blockchain_hash": blockchain_hash or "NOT_ANCHORED",
            "is_verified": is_verified,
            "block_number": block.block_number if block else None,
            "verified_at": datetime.utcnow().isoformat(),
        }
