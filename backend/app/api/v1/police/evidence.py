from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.v1.deps import get_db, require_police
from app.models import User, EvidenceType
from app.services.evidence_service import EvidenceService

router = APIRouter(prefix="/police/evidence", tags=["Police Evidence"])


@router.post("/upload")
async def upload_evidence(
    case_id: str,
    evidence_type: str,
    file_name: str,
    description: str = None,
    db: Session = Depends(get_db),
    user: User = Depends(require_police),
):
    """Upload evidence with hash computation and blockchain anchor."""
    service = EvidenceService(db)
    # In production, this would handle actual file upload
    # For demo, we simulate with a mock content
    mock_content = f"evidence_content_{file_name}_{case_id}".encode()

    evidence = service.upload_evidence(
        case_id=case_id,
        evidence_type=EvidenceType(evidence_type),
        file_content=mock_content,
        file_name=file_name,
        collected_by=str(user.id),
        description=description,
    )
    return {
        "id": str(evidence.id),
        "sha256_hash": evidence.sha256_hash,
        "blockchain_block": evidence.blockchain_block_number,
        "status": evidence.verification_status.value,
    }


@router.get("/{evidence_id}/verify")
async def verify_evidence(
    evidence_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(require_police),
):
    """Verify evidence integrity against blockchain."""
    service = EvidenceService(db)
    return service.verify_evidence(evidence_id)
