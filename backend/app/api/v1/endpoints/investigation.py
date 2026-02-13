"""
Investigation Planner API - Skill 07 (Expert)
"""
from fastapi import APIRouter, Depends, HTTPException
from app.schemas.investigation import (
    InvestigationPlan, CreatePlanRequest, CreateTaskRequest, 
    UpdateTaskRequest, InvestigationTask
)
from app.services.investigation_planner import investigation_service
from app.core.security import get_current_admin_user as get_current_police_user

router = APIRouter(prefix="/investigation", tags=["Police - Investigation Planner"])


@router.post("/plan", response_model=InvestigationPlan)
async def create_plan(
    request: CreatePlanRequest,
    current_user = Depends(get_current_police_user)
):
    """Create a new investigation plan for a case"""
    try:
        user_info = {"full_name": "Senior Inspector", "id": "SI-001"}
        return await investigation_service.create_plan(request, user_info)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/case/{case_id}", response_model=InvestigationPlan)
async def get_case_plan(
    case_id: str,
    current_user = Depends(get_current_police_user)
):
    """Get the investigation plan for a specific case"""
    plan = await investigation_service.get_plan_by_case(case_id)
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found for this case")
    return plan


@router.post("/task", response_model=InvestigationTask)
async def add_task(
    request: CreateTaskRequest,
    current_user = Depends(get_current_police_user)
):
    """Add a new task to an existing plan"""
    try:
        return await investigation_service.add_task(request)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.put("/task/{task_id}", response_model=InvestigationTask)
async def update_task(
    task_id: str,
    request: UpdateTaskRequest,
    current_user = Depends(get_current_police_user)
):
    """Update task status or details"""
    try:
        return await investigation_service.update_task(task_id, request)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/test-plan", response_model=InvestigationPlan)
async def test_create_plan(
    current_user = Depends(get_current_police_user)
):
    """Test with sample investigation plan data"""
    try:
        request = CreatePlanRequest(
            case_id="CASE-2025-CR-042",
            title="Theft Investigation - Sector 4 Market",
            description="Organized theft ring operating in commercial areas. Multiple CCTV leads available."
        )
        user_info = {"full_name": "Inspector Rahul Verma", "id": "SI-002"}
        return await investigation_service.create_plan(request, user_info)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
