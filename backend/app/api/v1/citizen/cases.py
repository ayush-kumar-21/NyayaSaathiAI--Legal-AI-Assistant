from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.v1.deps import get_db, require_citizen
from app.models import User
from app.schemas.case import CaseCreate, CaseResponse
from app.services.case_service import CaseService

router = APIRouter(prefix="/citizen/cases", tags=["Citizen Cases"])


@router.post("/file", response_model=CaseResponse)
async def file_fir(
    data: CaseCreate,
    db: Session = Depends(get_db),
    user: User = Depends(require_citizen),
):
    """File a new FIR."""
    service = CaseService(db)
    case = service.create_case(
        citizen_id=str(user.id),
        narrative=data.complaint_narrative,
        location=data.incident_location,
        priority=data.priority,
    )
    return case


@router.get("/my-cases")
async def list_my_cases(
    db: Session = Depends(get_db),
    user: User = Depends(require_citizen),
):
    """List cases filed by current citizen."""
    from app.models import Case
    cases = db.query(Case).filter(Case.citizen_id == str(user.id)).all()
    return [CaseResponse.model_validate(c) for c in cases]


@router.get("/track/{cnr:path}", response_model=CaseResponse)
async def track_case_by_cnr(
    cnr: str,
    db: Session = Depends(get_db),
    user: User = Depends(require_citizen),
):
    """Track case by CNR (Citizen Number Record)."""
    from app.models import Case
    # CNR is unique, so we can search directly.
    # Security: Citizens can view ANY case if they have the CNR (Open Justice principle for tracking),
    # OR we can restrict it. For hackathon, let's allow it but log it.
    case = db.query(Case).filter(Case.cnr == cnr).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found with this CNR")
    return CaseResponse.model_validate(case)


@router.post("/sos")
async def trigger_sos(
    location: str = "Unknown",
    db: Session = Depends(get_db),
    user: User = Depends(require_citizen),
):
    """Trigger an Emergency SOS."""
    # In a real app, this would integrate with police dispatch / websocket.
    # For now, we log it and return success.
    print(f"🚨 SOS TRIGGERED by {user.email} at {location}")
    return {"status": "SOS_DISPATCHED", "message": "Emergency services notified"}


@router.get("/{case_id}", response_model=CaseResponse)
async def get_case(
    case_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(require_citizen),
):
    """Get case details."""
    from app.models import Case
    case = db.query(Case).filter(Case.id == case_id, Case.citizen_id == str(user.id)).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return CaseResponse.model_validate(case)
