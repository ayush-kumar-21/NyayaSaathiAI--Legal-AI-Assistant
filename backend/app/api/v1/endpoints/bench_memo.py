"""
Bench Memo API - Skill 08 (Expert Implementation)
"""
from fastapi import APIRouter, Depends, HTTPException
from app.schemas.bench_memo import BenchMemo, GenerateMemoRequest
from app.services.judge.bench_memo import get_bench_memo_service, BenchMemoService
from app.core.security import get_current_admin_user as get_current_judge_user

router = APIRouter(prefix="/bench-memo", tags=["Judge - Bench Memo"])


@router.post("/generate", response_model=BenchMemo)
async def generate_bench_memo(
    request: GenerateMemoRequest,
    service: BenchMemoService = Depends(get_bench_memo_service),
    current_user = Depends(get_current_judge_user)
):
    """Generate a bench memo for a specific case"""
    try:
        user_info = {"full_name": "Justice Chandrachud", "id": "JUDGE-001"}
        return await service.generate_memo(request, user_info)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{memo_id}", response_model=BenchMemo)
async def get_bench_memo(
    memo_id: str,
    service: BenchMemoService = Depends(get_bench_memo_service),
    current_user = Depends(get_current_judge_user)
):
    """Get a specific bench memo"""
    memo = await service.get_memo(memo_id)
    if not memo:
        raise HTTPException(status_code=404, detail="Memo not found")
    return memo


@router.get("/case/{case_id}", response_model=BenchMemo)
async def get_bench_memo_by_case(
    case_id: str,
    service: BenchMemoService = Depends(get_bench_memo_service),
    current_user = Depends(get_current_judge_user)
):
    """Get the bench memo for a specific case"""
    memo = await service.get_memo_by_case(case_id)
    if not memo:
        raise HTTPException(status_code=404, detail="Memo not found for this case")
    return memo


@router.post("/test-generate", response_model=BenchMemo)
async def test_generate_memo(
    service: BenchMemoService = Depends(get_bench_memo_service),
    current_user = Depends(get_current_judge_user)
):
    """Test endpoint with sample data"""
    request = GenerateMemoRequest(case_id="CASE-2025-BAIL-001", focus_area="Bail")
    user_info = {"full_name": "Justice Chandrachud", "id": "JUDGE-001"}
    return await service.generate_memo(request, user_info)
