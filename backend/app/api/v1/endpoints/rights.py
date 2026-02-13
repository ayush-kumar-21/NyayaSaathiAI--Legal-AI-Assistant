"""
Know Your Rights API - Skill 22 (Expert)
"""
from fastapi import APIRouter, Depends, HTTPException
from app.schemas.rights import RightsQueryRequest, RightsQueryResponse, RightsCategory
from app.services.rights_service import get_rights_service
from app.core.security import get_current_admin_user as get_current_user

router = APIRouter(prefix="/rights", tags=["Citizen - Know Your Rights"])


@router.post("/query", response_model=RightsQueryResponse)
async def query_rights(
    request: RightsQueryRequest,
    current_user = Depends(get_current_user)
):
    """Get legal rights information based on query"""
    try:
        service = get_rights_service()
        return await service.query_rights(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/test-query", response_model=RightsQueryResponse)
async def test_query_rights(
    current_user = Depends(get_current_user)
):
    """Test with sample rights query"""
    try:
        service = get_rights_service()
        request = RightsQueryRequest(
            query="What are my rights if I am arrested by police?",
            category=RightsCategory.ARREST,
            language="en"
        )
        return await service.query_rights(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
