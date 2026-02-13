"""
Duty Roster API - Skill 15 (Expert)
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List
from datetime import date, timedelta
from app.schemas.duty import DutyShift, RosterGenerateRequest
from app.services.duty_roster import duty_service
from app.core.security import get_current_admin_user as get_current_user

router = APIRouter(prefix="/duty", tags=["Police - Duty Roster"])


@router.get("/list", response_model=List[DutyShift])
async def get_roster(
    start_date: date = Query(default=date.today()),
    end_date: date = Query(default=date.today() + timedelta(days=7)),
    current_user = Depends(get_current_user)
):
    """Get the duty roster for a date range"""
    try:
        return await duty_service.get_roster(start_date, end_date)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate", response_model=List[DutyShift])
async def generate_roster(
    request: RosterGenerateRequest,
    current_user = Depends(get_current_user)
):
    """Generate a new duty roster"""
    try:
        return await duty_service.generate_roster(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/test-generate", response_model=List[DutyShift])
async def test_generate_roster(
    current_user = Depends(get_current_user)
):
    """Test with sample roster generation"""
    try:
        request = RosterGenerateRequest(
            station_id="PS-SECTOR4",
            start_date=date.today(),
            end_date=date.today() + timedelta(days=7),
            officer_count=8
        )
        return await duty_service.generate_roster(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
