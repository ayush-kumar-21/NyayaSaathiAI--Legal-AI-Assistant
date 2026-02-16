from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.api.v1.deps import get_db, require_police
from app.models import User, Case, CaseStatus
from app.schemas.case import CaseResponse, CaseStatusUpdate
from app.services.case_service import CaseService

router = APIRouter(prefix="/police/cases", tags=["Police Cases"])

@router.get("", response_model=List[CaseResponse])
async def list_assigned_cases(
    db: Session = Depends(get_db),
    user: User = Depends(require_police),
):
    """List cases assigned to the police officer."""
    # In a real app, filtering by assigned_io_id or police_station_id would be here.
    # For demo, returning all cases with relevant statuses
    service = CaseService(db)
    # Using existing list_cases which takes a single status, or we might need to update it
    # to accept a list. For now, let's fetch all and filter in memory or update service later.
    cases, _ = service.list_cases(limit=100)

    # Filter for police relevant statuses
    police_statuses = [
        CaseStatus.FIR_REGISTERED,
        CaseStatus.UNDER_INVESTIGATION,
        CaseStatus.ACCUSED_ARRESTED,
        CaseStatus.EVIDENCE_COLLECTED,
        CaseStatus.INVESTIGATION_COMPLETE
    ]

    return [c for c in cases if c.status in police_statuses]

@router.put("/{case_id}", response_model=CaseResponse)
async def update_case_status(
    case_id: str,
    update: CaseStatusUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(require_police),
):
    """Update status of a case (e.g. to UNDER_INVESTIGATION)."""
    service = CaseService(db)
    return service.update_status(case_id, update.new_status, actor_id=str(user.id), notes=update.notes)

@router.put("/{case_id}/register-fir", response_model=CaseResponse)
async def register_fir(
    case_id: str,
    update: CaseStatusUpdate, # We expect status=FIR_REGISTERED
    db: Session = Depends(get_db),
    user: User = Depends(require_police),
):
    """Register FIR for a case."""
    service = CaseService(db)
    return service.update_status(case_id, CaseStatus.FIR_REGISTERED, actor_id=str(user.id), notes=update.notes)
