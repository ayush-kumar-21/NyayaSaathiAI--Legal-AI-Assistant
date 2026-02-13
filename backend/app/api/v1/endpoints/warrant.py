"""
Warrant Manager API - Skill 16 (Expert)
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from app.schemas.warrant import Warrant, WarrantIssueRequest, WarrantUpdateRequest, WarrantStatus
from app.services.warrant_manager import warrant_service
from app.core.security import get_current_admin_user as get_current_user

router = APIRouter(prefix="/warrant", tags=["Police - Warrant Manager"])


@router.get("/list", response_model=List[Warrant])
async def list_warrants(
    status: Optional[WarrantStatus] = Query(None),
    current_user = Depends(get_current_user)
):
    """List warrants"""
    try:
        return await warrant_service.list_warrants(status)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/issue", response_model=Warrant)
async def issue_warrant(
    request: WarrantIssueRequest,
    current_user = Depends(get_current_user)
):
    """Issue a new warrant"""
    try:
        return await warrant_service.issue_warrant(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/{warrant_id}", response_model=Warrant)
async def update_warrant(
    warrant_id: str,
    update: WarrantUpdateRequest,
    current_user = Depends(get_current_user)
):
    """Update warrant status"""
    try:
        return await warrant_service.update_warrant(warrant_id, update)
    except ValueError:
        raise HTTPException(status_code=404, detail="Warrant not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/test-issue", response_model=Warrant)
async def test_issue_warrant(
    current_user = Depends(get_current_user)
):
    """Test with sample warrant data"""
    try:
        request = WarrantIssueRequest(
            case_id="CASE-2025-CR-042",
            accused_name="Suresh Kumar",
            warrant_type="arrest",
            issuing_authority="District Court, Cyber City"
        )
        return await warrant_service.issue_warrant(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
