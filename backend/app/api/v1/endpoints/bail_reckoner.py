"""
Bail Reckoner API - Skill 09 (Expert Implementation)
"""
from fastapi import APIRouter, Depends, HTTPException
from app.schemas.bail_reckoner import BailReport, BailAnalysisRequest
from app.services.judge.bail_reckoner import get_bail_reckoner_service, BailReckonerService
from app.core.security import get_current_admin_user as get_current_judge_user

router = APIRouter(prefix="/bail-reckoner", tags=["Judge - Bail Reckoner"])


@router.post("/analyze", response_model=BailReport)
async def analyze_bail(
    request: BailAnalysisRequest,
    service: BailReckonerService = Depends(get_bail_reckoner_service),
    current_user = Depends(get_current_judge_user)
):
    """Analyze bail eligibility for an accused"""
    try:
        return await service.analyze_bail(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{report_id}", response_model=BailReport)
async def get_bail_report(
    report_id: str,
    service: BailReckonerService = Depends(get_bail_reckoner_service),
    current_user = Depends(get_current_judge_user)
):
    """Get a specific bail report"""
    report = await service.get_report(report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report


@router.post("/test-analyze", response_model=BailReport)
async def test_bail_analysis(
    service: BailReckonerService = Depends(get_bail_reckoner_service),
    current_user = Depends(get_current_judge_user)
):
    """Test with sample bail application"""
    request = BailAnalysisRequest(
        case_id="CASE-2025-CR-042",
        accused_id="ACC-001",
        offenses=["BNS 303(2)", "BNS 318(4)"],
        prior_convictions=1,
        is_flight_risk=True,
        is_witness_tampering_risk=False
    )
    return await service.analyze_bail(request)
