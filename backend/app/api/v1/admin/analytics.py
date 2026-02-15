from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.v1.deps import get_db, require_admin
from app.models import User
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/admin/analytics", tags=["Admin Analytics"])


@router.get("/national")
async def get_national_stats(
    db: Session = Depends(get_db),
    user: User = Depends(require_admin),
):
    """National justice statistics for MHA Dashboard."""
    service = AnalyticsService(db)
    return service.get_national_stats()


@router.get("/heatmap")
async def get_heatmap(
    db: Session = Depends(get_db),
    user: User = Depends(require_admin),
):
    """State-wise case heatmap data."""
    service = AnalyticsService(db)
    return service.get_heatmap_data()


@router.get("/bnss-deadlines")
async def get_bnss_deadlines(
    db: Session = Depends(get_db),
    user: User = Depends(require_admin),
):
    """Cases approaching BNSS 193 charge sheet deadlines."""
    service = AnalyticsService(db)
    return service.get_bnss_deadlines()
