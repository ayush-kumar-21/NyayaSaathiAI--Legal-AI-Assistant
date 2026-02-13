"""
Legal Aid Finder API - Skill 24 (Expert)
"""
from fastapi import APIRouter, Depends, HTTPException
from app.schemas.legal_aid import LegalAidRequest, LegalAidResponse
from app.services.legal_aid_service import get_legal_aid_service
from app.core.security import get_current_admin_user as get_current_user

router = APIRouter(prefix="/legal-aid", tags=["Citizen - Legal Aid Finder"])


@router.post("/find", response_model=LegalAidResponse)
async def find_legal_aid(
    request: LegalAidRequest,
    current_user = Depends(get_current_user)
):
    """Find legal aid services based on eligibility"""
    try:
        service = get_legal_aid_service()
        return await service.find_aid(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/test-find", response_model=LegalAidResponse)
async def test_find_legal_aid(
    current_user = Depends(get_current_user)
):
    """Test with sample legal aid request"""
    try:
        service = get_legal_aid_service()
        request = LegalAidRequest(
            category="criminal",
            district="South Delhi",
            state="Delhi",
            annual_income=180000,
            is_sc_st=False,
            is_woman=True,
            case_description="Need legal help for domestic violence case under BNS Section 85-86"
        )
        return await service.find_aid(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
