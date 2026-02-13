"""
Judgment Validator API - Skill 21 (Expert)
"""
from fastapi import APIRouter, Depends, HTTPException
from app.schemas.judgment import JudgmentValidateRequest, JudgmentValidateResponse
from app.services.judgment_validator import get_judgment_validator_service
from app.core.security import get_current_admin_user as get_current_judge_user

router = APIRouter(prefix="/judgment", tags=["Judge - Judgment Validator"])


@router.post("/validate", response_model=JudgmentValidateResponse)
async def validate_judgment(
    request: JudgmentValidateRequest,
    current_user = Depends(get_current_judge_user)
):
    """Validate a draft judgment for legal completeness"""
    try:
        service = get_judgment_validator_service()
        return await service.validate(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/test-validate", response_model=JudgmentValidateResponse)
async def test_validate_judgment(
    current_user = Depends(get_current_judge_user)
):
    """Test with sample judgment text"""
    try:
        service = get_judgment_validator_service()
        request = JudgmentValidateRequest(
            case_id="CASE-2025-CR-042",
            judgment_text="""
            IN THE COURT OF SESSIONS JUDGE, CYBER CITY
            
            State (Prosecution) vs. Suresh Kumar (Accused)
            
            FIR No. 42/2025 under BNS Section 303(2)
            
            BRIEF FACTS OF THE CASE:
            The prosecution case is that on 15.01.2025, the accused Suresh Kumar 
            committed theft at Shop No. 12, Sector 4 Market.
            
            ISSUES FOR DETERMINATION:
            1. Whether the prosecution has proved the guilt of the accused beyond 
            reasonable doubt?
            
            ARGUMENTS AND SUBMISSIONS:
            The prosecution argued that CCTV footage (Exhibit P-1) and witness 
            testimony clearly establish the presence of accused. The defence 
            submitted that the identification is unreliable.
            
            ANALYSIS AND DISCUSSION:
            Having considered the evidence on record, this Court notes that the 
            CCTV footage corroborates the eyewitness account of PW-1.
            As held in Tomaso Bruno v State of UP (2015) 7 SCC 178, circumstantial 
            evidence must form a complete chain.
            
            ORDER:
            The accused is convicted under BNS Section 303(2).
            """,
            offense_sections=["BNS 303(2)"]
        )
        return await service.validate(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
