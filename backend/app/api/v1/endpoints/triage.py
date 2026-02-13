"""
Case Intake Triage API - Skill 18 (Expert)
"""
from fastapi import APIRouter, Depends, HTTPException
from app.schemas.triage import TriageRequest, TriageResult
from app.services.case_triage import get_triage_service
from app.core.security import get_current_admin_user as get_current_judge_user

router = APIRouter(prefix="/triage", tags=["Judge - Case Intake Triage"])


@router.post("/analyze", response_model=TriageResult)
async def triage_case(
    request: TriageRequest,
    current_user = Depends(get_current_judge_user)
):
    """Analyze case urgency and recommend priority"""
    try:
        service = get_triage_service()
        return await service.triage_case(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/test-analyze", response_model=TriageResult)
async def test_triage(
    current_user = Depends(get_current_judge_user)
):
    """Test with sample case data"""
    try:
        service = get_triage_service()
        request = TriageRequest(
            case_id="CASE-2025-CR-042",
            case_title="State vs. Suresh Kumar - BNS 303(2)",
            offense_sections=["BNS 303(2)"],
            case_type="bail",
            accused_in_custody=True,
            custody_days=58,
            is_minor_involved=False,
            brief_facts="Accused is in custody for 58 days. Chargesheet not yet filed."
        )
        return await service.triage_case(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
