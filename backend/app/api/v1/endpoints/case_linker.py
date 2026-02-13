"""
Case Linker API - Skill 05 (Expert)
"""
from fastapi import APIRouter, Depends, HTTPException
from app.schemas.case_linker import (
    CaseLinkRequest, CaseLinkResponse
)
from app.services.case_linker_service import case_linker_service
from app.core.security import get_current_admin_user as get_current_police_user

router = APIRouter(prefix="/linker", tags=["Police - Case Linker"])


@router.post("/analyze", response_model=CaseLinkResponse)
async def analyze_case_links(
    request: CaseLinkRequest,
    current_user = Depends(get_current_police_user)
):
    """Analyze a case for links to other crimes, suspects, and MOs"""
    try:
        return await case_linker_service.analyze_case(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/test-analyze", response_model=CaseLinkResponse)
async def test_case_link_analysis(
    current_user = Depends(get_current_police_user)
):
    """Test with pre-loaded graph data"""
    try:
        request = CaseLinkRequest(case_id="FIR-2025-001")
        return await case_linker_service.analyze_case(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
