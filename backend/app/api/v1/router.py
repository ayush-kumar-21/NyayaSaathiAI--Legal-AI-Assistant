from fastapi import APIRouter
from app.api.v1.citizen.cases import router as citizen_cases_router
from app.api.v1.police.evidence import router as police_evidence_router
from app.api.v1.judge.evidence import router as judge_evidence_router
from app.api.v1.admin.analytics import router as admin_analytics_router

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(citizen_cases_router)
api_router.include_router(police_evidence_router)
api_router.include_router(judge_evidence_router)
api_router.include_router(admin_analytics_router)
