from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.v1.deps import get_db, require_judge
from app.models import User
from app.services.evidence_service import EvidenceService

router = APIRouter(prefix="/judge/evidence", tags=["Judge Evidence"])


@router.get("/{evidence_id}/verify")
async def verify_evidence_judge(
    evidence_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(require_judge),
):
    """Judge verifies evidence integrity."""
    service = EvidenceService(db)
    result = service.verify_evidence(evidence_id)

    # Add BSA certificate info for judge
    result["bsa_certificate"] = (
        f"BSA Section 63 Compliance Certificate\n"
        f"Evidence ID: {evidence_id}\n"
        f"Hash: {result['original_hash']}\n"
        f"Verified: {result['is_verified']}\n"
        f"Block: {result['block_number']}\n"
        f"Verified At: {result['verified_at']}"
    )
    return result
