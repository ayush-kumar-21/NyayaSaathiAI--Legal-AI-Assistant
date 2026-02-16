from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.api.v1.deps import get_db, require_judge
from app.models import User, Case, CaseStatus
from app.schemas.case import CaseResponse, CaseStatusUpdate
from app.services.case_service import CaseService

router = APIRouter(prefix="/judge/cases", tags=["Judge Cases"])

@router.get("", response_model=List[CaseResponse])
async def list_court_cases(
    db: Session = Depends(get_db),
    user: User = Depends(require_judge),
):
    """List cases assigned to the judge/court."""
    service = CaseService(db)
    cases, _ = service.list_cases(limit=100)

    # Filter for judge relevant statuses
    judge_statuses = [
        CaseStatus.CHARGESHEET_SUBMITTED,
        CaseStatus.CHARGESHEET_ACCEPTED,
        CaseStatus.CASE_ASSIGNED,
        CaseStatus.HEARING_SCHEDULED,
        CaseStatus.HEARING_IN_PROGRESS,
        CaseStatus.ARGUMENTS_HEARD,
        CaseStatus.JUDGMENT_RESERVED
    ]

    return [c for c in cases if c.status in judge_statuses]

@router.put("/{case_id}/verdict", response_model=CaseResponse)
async def issue_verdict(
    case_id: str,
    update: CaseStatusUpdate, # Expects JUDGMENT_DELIVERED or similar
    db: Session = Depends(get_db),
    user: User = Depends(require_judge),
):
    """Issue a verdict for a case."""
    service = CaseService(db)
    return service.update_status(case_id, update.new_status, actor_id=str(user.id), notes=update.notes)

@router.get("/{case_id}/evidence", response_model=List[dict]) # Use proper Evidence schema
async def get_case_evidence(
    case_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(require_judge),
):
    """Get all evidence for a case."""
    from app.services.evidence_service import EvidenceService
    service = EvidenceService(db)
    # Using internal method directly or we should add list_evidence to service
    # Assuming list_evidence_by_case exists or we query DB directly here
    from app.models import Evidence
    evidence = db.query(Evidence).filter(Evidence.case_id == case_id).all()
    return evidence
