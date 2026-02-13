"""
Digital Evidence Locker API - Skill 03 (Expert)
"""
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime
from app.schemas.evidence import (
    EvidenceCreate, EvidenceResponse, CustodyTransferRequest, Evidence,
    CustodyAction
)
from app.services.evidence_locker import evidence_service
from app.core.security import get_current_admin_user as get_current_police_user

router = APIRouter(prefix="/evidence", tags=["Police - Evidence Locker"])


@router.post("/upload", response_model=Evidence)
async def upload_evidence(
    request: EvidenceCreate,
    current_user = Depends(get_current_police_user)
):
    """Log and upload new digital evidence"""
    try:
        user_info = {"id": "OFFICER-001", "full_name": "Inspector Rahul", "role": "POLICE"}
        return await evidence_service.create_evidence(request, user_info)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/case/{case_id}", response_model=List[Evidence])
async def list_case_evidence(
    case_id: str,
    current_user = Depends(get_current_police_user)
):
    """Get all evidence associated with a case"""
    return await evidence_service.list_evidence_by_case(case_id)


@router.get("/{evidence_id}", response_model=EvidenceResponse)
async def get_evidence_details(
    evidence_id: str,
    current_user = Depends(get_current_police_user)
):
    """Get evidence details and full chain of custody"""
    evidence = await evidence_service.get_evidence(evidence_id)
    if not evidence:
        raise HTTPException(status_code=404, detail="Evidence not found")
    return evidence


@router.post("/transfer", response_model=EvidenceResponse)
async def transfer_custody(
    request: CustodyTransferRequest,
    current_user = Depends(get_current_police_user)
):
    """Transfer custody or update status of evidence"""
    try:
        user_info = {"id": "OFFICER-001", "full_name": "Inspector Rahul", "role": "POLICE"}
        return await evidence_service.transfer_custody(request, user_info)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/test-upload", response_model=Evidence)
async def test_upload_evidence(
    current_user = Depends(get_current_police_user)
):
    """Test with sample evidence data"""
    sample = EvidenceCreate(
        case_id="CASE-2025-CR-042",
        title="CCTV Footage - Sector 4 Market",
        description="Surveillance footage from camera ID CAM-047 showing suspect at 23:45 IST",
        evidence_type="video",
        collection_date=datetime.now(),
        collection_location="Sector 4, Cyber City",
        tags=["cctv", "suspect", "nighttime"],
        metadata={"camera_id": "CAM-047", "resolution": "1080p", "duration_seconds": 120}
    )
    user_info = {"id": "OFFICER-001", "full_name": "Inspector Rahul", "role": "POLICE"}
    return await evidence_service.create_evidence(sample, user_info)
