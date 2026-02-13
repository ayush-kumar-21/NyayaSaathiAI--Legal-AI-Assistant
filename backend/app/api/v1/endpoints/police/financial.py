from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.financial import FinancialAnalysisRequest, FinancialAnalysisResponse
from app.services.police.financial import get_financial_service, FinancialService
from app.core.security import get_current_admin_user

router = APIRouter()

@router.post("/analyze", response_model=FinancialAnalysisResponse)
async def analyze_financial_trail(
    request: FinancialAnalysisRequest,
    service: FinancialService = Depends(get_financial_service),
    current_user = Depends(get_current_admin_user)
):
    """
    Analyze financial transaction trail for suspicious patterns (Skill 02)
    
    Detects:
    - Circular trading (Graph Cycles)
    - Money layering
    - Structuring/smurfing
    - Shell companies
    """
    try:
        return await service.analyze(request)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis failed: {str(e)}"
        )
