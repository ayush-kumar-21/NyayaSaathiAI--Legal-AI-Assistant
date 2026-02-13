"""
Charge Sheet API - Skill 06 (Expert)
"""
from fastapi import APIRouter, Depends, HTTPException
from app.schemas.chargesheet import (
    ChargeSheet, ChargeSheetCreate, ChargeSheetUpdate
)
from app.services.chargesheet_service import chargesheet_service
from app.core.security import get_current_admin_user as get_current_police_user

router = APIRouter(prefix="/chargesheet", tags=["Police - Charge Sheet"])


@router.post("/generate", response_model=ChargeSheet)
async def generate_chargesheet(
    request: ChargeSheetCreate,
    current_user = Depends(get_current_police_user)
):
    """Generate a draft charge sheet from FIR ID"""
    try:
        user_info = {"full_name": "IO Inspector Gadget", "id": "IO-001"}
        return await chargesheet_service.generate_draft(request.fir_id, user_info)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{cs_id}", response_model=ChargeSheet)
async def get_chargesheet(
    cs_id: str,
    current_user = Depends(get_current_police_user)
):
    """Get charge sheet details"""
    cs = await chargesheet_service.get_chargesheet(cs_id)
    if not cs:
        raise HTTPException(status_code=404, detail="Charge Sheet not found")
    return cs


@router.put("/{cs_id}", response_model=ChargeSheet)
async def update_chargesheet(
    cs_id: str,
    update_data: ChargeSheetUpdate,
    current_user = Depends(get_current_police_user)
):
    """Update draft charge sheet"""
    cs = await chargesheet_service.update_chargesheet(cs_id, update_data)
    if not cs:
        raise HTTPException(status_code=404, detail="Charge Sheet not found")
    return cs


@router.post("/test-generate", response_model=ChargeSheet)
async def test_generate_chargesheet(
    current_user = Depends(get_current_police_user)
):
    """Test with sample FIR data"""
    try:
        user_info = {"full_name": "Inspector Rahul Verma", "id": "IO-002"}
        return await chargesheet_service.generate_draft("FIR-2025-001", user_info)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
