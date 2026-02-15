from fastapi import APIRouter, Depends
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
