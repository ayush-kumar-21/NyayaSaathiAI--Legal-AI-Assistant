"""
Witness Protection API - Skill 04 (Expert)
"""
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schemas.witness import (
    WitnessCreate, WitnessResponse, Witness, RiskAssessment, ProtectionStatus,
    ThreatLevel
)
from app.services.witness_protection import witness_service
from app.core.security import get_current_admin_user as get_current_police_user

router = APIRouter(prefix="/witness", tags=["Police - Witness Protection"])


@router.post("/register", response_model=Witness)
async def register_witness(
    request: WitnessCreate,
    current_user = Depends(get_current_police_user)
):
    """Register a new witness into the protection program"""
    try:
        user_info = {"id": "OFFICER-001", "full_name": "Inspector Rahul", "role": "POLICE"}
        return await witness_service.register_witness(request, user_info)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{witness_id}", response_model=WitnessResponse)
async def get_witness_details(
    witness_id: str,
    current_user = Depends(get_current_police_user)
):
    """Get secure witness details"""
    user_info = {"id": "OFFICER-001", "role": "POLICE"}
    result = await witness_service.get_witness(witness_id, user_info)
    if not result:
        raise HTTPException(status_code=404, detail="Witness not found")
    return result


@router.get("/case/{case_id}", response_model=List[WitnessResponse])
async def list_case_witnesses(
    case_id: str,
    current_user = Depends(get_current_police_user)
):
    """List protection status of witnesses in a case"""
    user_info = {"id": "OFFICER-001", "role": "POLICE"}
    return await witness_service.list_witnesses_by_case(case_id, user_info)


@router.post("/test-register", response_model=Witness)
async def test_register_witness(
    current_user = Depends(get_current_police_user)
):
    """Test with sample witness data"""
    sample = WitnessCreate(
        case_id="CASE-2025-CR-042",
        real_name="Rajesh Kumar",
        date_of_birth="1990-05-15",
        contact_number="+91-9876543210",
        address="123, Sector 7, Cyber City",
        threat_level=ThreatLevel.HIGH,
        risk_factors=["Accused has criminal network", "Threatened family"],
        protection_measures=["Armed escort", "Safe house relocation", "Identity concealment"]
    )
    user_info = {"id": "OFFICER-001", "full_name": "Inspector Rahul", "role": "POLICE"}
    return await witness_service.register_witness(sample, user_info)
