"""
Sentencing Assistant API - Skill 10 (Expert)
"""
from fastapi import APIRouter, Depends, HTTPException
from app.schemas.sentencing import SentencingReport, SentencingRequest
from app.services.sentencing_assistant import sentencing_service
from app.core.security import get_current_admin_user as get_current_judge_user

router = APIRouter(prefix="/sentencing", tags=["Judge - Sentencing Assistant"])


@router.post("/analyze", response_model=SentencingReport)
async def analyze_sentencing(
    request: SentencingRequest,
    current_user = Depends(get_current_judge_user)
):
    """Analyze sentencing options and provide recommendations"""
    try:
        return await sentencing_service.analyze_sentencing(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{report_id}", response_model=SentencingReport)
async def get_sentencing_report(
    report_id: str,
    current_user = Depends(get_current_judge_user)
):
    """Get a specific sentencing report"""
    report = await sentencing_service.get_report(report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report


@router.post("/test-analyze", response_model=SentencingReport)
async def test_sentencing_analysis(
    current_user = Depends(get_current_judge_user)
):
    """Test with sample sentencing data"""
    try:
        request = SentencingRequest(
            case_id="CASE-2025-CR-042",
            convict_id="ACC-001",
            offenses=["BNS 303(2)", "BNS 309"],
            prior_convictions=1,
            age=28,
            background_info="First-time theft offender who showed remorse during trial. Employed as daily wage worker."
        )
        return await sentencing_service.analyze_sentencing(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
