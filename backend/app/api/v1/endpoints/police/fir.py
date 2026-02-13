from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.services.police.smart_fir import get_smart_fir_service, SmartFIRService, FIR
from pydantic import BaseModel

router = APIRouter(prefix="/police/fir", tags=["Smart FIR"])

class TextRequest(BaseModel):
    text: str

@router.post("/generate", response_model=FIR)
async def generate_fir(
    request: TextRequest,
    service: SmartFIRService = Depends(get_smart_fir_service)
):
    """
    Generate a draft FIR from raw complaint text using AI & Regex.
    """
    try:
        return await service.generate_from_text(request.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{fir_id}", response_model=FIR)
async def get_fir(
    fir_id: str,
    service: SmartFIRService = Depends(get_smart_fir_service)
):
    fir = await service.get(fir_id)
    if not fir:
        raise HTTPException(status_code=404, detail="FIR not found")
    return fir
