"""
Case Status Tracker API - Skill 23 (Expert)
"""
from fastapi import APIRouter, Depends, HTTPException
from app.schemas.case_status import CaseStatusRequest, CaseStatusResponse
from app.services.case_status_service import get_case_status_service
from app.core.security import get_current_admin_user as get_current_user

router = APIRouter(prefix="/case-status", tags=["Citizen - Case Status Tracker"])


@router.post("/track", response_model=CaseStatusResponse)
async def track_case(
    request: CaseStatusRequest,
    current_user = Depends(get_current_user)
):
    """Track case status by CNR or FIR number"""
    try:
        service = get_case_status_service()
        result = await service.get_status(request)
        if not result:
            raise HTTPException(status_code=404, detail="Case not found")
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/test-track", response_model=CaseStatusResponse)
async def test_track_case(
    current_user = Depends(get_current_user)
):
    """Test with sample CNR number"""
    try:
        service = get_case_status_service()
        request = CaseStatusRequest(cnr_number="DLHC01-000001-2025")
        return await service.get_status(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
