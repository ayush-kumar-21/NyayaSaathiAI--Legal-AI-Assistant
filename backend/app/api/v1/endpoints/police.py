"""
Police API Endpoints - Smart-FIR (Skill 01)
Expert Implementation using O(n) Regex Engine
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.schemas.fir import (
    FIRCreateRequest, FIRResponse, FIRUpdateRequest,
    FIRStatus, FIRSearchRequest, FIRSearchResponse
)
# Import the EXPERT service factory
from app.services.police.smart_fir import get_smart_fir_service, SmartFIRService
from app.core.security import get_current_admin_user

router = APIRouter() # Prefix is handled in api/v1/router.py

@router.post("/fir/generate", response_model=FIRResponse, status_code=status.HTTP_201_CREATED)
async def generate_fir(
    request: FIRCreateRequest,
    service: SmartFIRService = Depends(get_smart_fir_service),
    current_user = Depends(get_current_admin_user)
):
    """
    Generate FIR from complaint text using generic AI & Regex Engine.
    
    - Extracts entities (O(n) complexity)
    - Maps to BNS sections (Dict lookup)
    - Returns structured draft with confidence scores
    """
    try:
        # The service now accepts the full request object
        return await service.generate_from_text(request)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"FIR generation failed: {str(e)}"
        )

@router.get("/fir/{fir_id}", response_model=FIRResponse)
async def get_fir(
    fir_id: str,
    service: SmartFIRService = Depends(get_smart_fir_service),
    current_user = Depends(get_current_admin_user)
):
    """Get FIR by ID"""
    fir = await service.get_fir(fir_id)
    if not fir:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="FIR not found"
        )
    return fir

@router.put("/fir/{fir_id}", response_model=FIRResponse)
async def update_fir(
    fir_id: str,
    update: FIRUpdateRequest,
    service: SmartFIRService = Depends(get_smart_fir_service),
    current_user = Depends(get_current_admin_user)
):
    """Update FIR status or content"""
    fir = await service.update_fir(fir_id, update)
    if not fir:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="FIR not found"
        )
    return fir

@router.get("/fir", response_model=List[FIRResponse])
async def list_firs(
    status: Optional[FIRStatus] = Query(None),
    police_station_id: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    service: SmartFIRService = Depends(get_smart_fir_service),
    current_user = Depends(get_current_admin_user)
):
    """List FIRs with filters"""
    return await service.list_firs(police_station_id, status, limit)

@router.get("/bns-sections")
async def get_bns_sections(
    current_user = Depends(get_current_admin_user)
):
    """Get all available BNS sections for reference"""
    from app.schemas.fir import BNS_SECTIONS_DB
    
    sections = []
    for code, data in BNS_SECTIONS_DB.items():
        sections.append({
            "section_number": code,
            "description": data["description"],
            "severity": data["severity"],
            "punishment": data.get("punishment"),
            "cognizable": data.get("cognizable"),
            "bailable": data.get("bailable"),
            "keywords": data["keywords"]
        })
    
    return sections

@router.post("/fir/test-generate")
async def test_generate_fir(
    service: SmartFIRService = Depends(get_smart_fir_service),
    current_user = Depends(get_current_admin_user)
):
    """Test FIR generation with sample data"""
    test_request = FIRCreateRequest(
        complaint_text="My Honda City car was stolen from MG Road yesterday at 10 PM. The car was parked near the metro station. The thief also threatened me when I tried to stop him.",
        complainant_name="Rahul Sharma",
        complainant_contact="+91-98765-43210",
        police_station_id="PS-MGROAD-01",
        incident_location="MG Road, near Metro Station",
        incident_datetime=None
    )
    
    return await service.generate_from_text(test_request)
