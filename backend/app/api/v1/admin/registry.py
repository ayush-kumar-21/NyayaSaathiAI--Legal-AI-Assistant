"""
Registry Automator API Endpoints
"""
from fastapi import APIRouter, HTTPException, Query, status
from app.schemas.registry import (
    ScrutinyRequest, ScrutinyResponse,
    FeeCalculationRequest, FeeCalculationResponse,
    FilingType
)
from app.services.registry_service import registry_service

router = APIRouter(prefix="/registry", tags=["Registry Automator"])


# ============ Scrutiny Endpoints ============

@router.post("/scrutiny", response_model=ScrutinyResponse)
async def scrutinize_document(request: ScrutinyRequest):
    """
    AI-powered document scrutiny.
    Checks filing for compliance with court requirements.
    """
    try:
        result = registry_service.scrutinize_document(
            document_url=request.document_url,
            filing_type=request.filing_type
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Scrutiny failed: {str(e)}"
        )


@router.post("/test-scrutiny", response_model=ScrutinyResponse)
async def test_scrutiny(
    document_url: str = Query(default="http://example.com/test-petition.pdf")
):
    """Test scrutiny with a sample document URL."""
    return registry_service.scrutinize_document(document_url)


# ============ Fee Calculation Endpoints ============

@router.post("/calculate-fees", response_model=FeeCalculationResponse)
async def calculate_fees(request: FeeCalculationRequest):
    """
    Calculate court fees based on filing type and value in dispute.
    """
    return registry_service.calculate_fees(
        filing_type=request.filing_type,
        value_in_dispute=request.value_in_dispute
    )


@router.post("/test-fees", response_model=FeeCalculationResponse)
async def test_fees(
    filing_type: FilingType = Query(default=FilingType.CIVIL_SUIT),
    value: float = Query(default=500000)
):
    """Test fee calculation with sample values."""
    return registry_service.calculate_fees(filing_type, value)
