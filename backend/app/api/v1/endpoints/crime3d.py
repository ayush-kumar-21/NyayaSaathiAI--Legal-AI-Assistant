"""
Crime Scene 3D API - Skill 17 (Expert)
"""
from fastapi import APIRouter, Depends, HTTPException
from app.schemas.crime3d import CrimeScene, EvidenceMarker, CreateSceneRequest, AddMarkerRequest
from app.services.crime_scene import crime_service
from app.core.security import get_current_admin_user as get_current_user

router = APIRouter(prefix="/crime-scene", tags=["Police - Crime Scene 3D"])


@router.get("/{scene_id}", response_model=CrimeScene)
async def get_scene(
    scene_id: str,
    current_user = Depends(get_current_user)
):
    """Get crime scene details"""
    scene = await crime_service.get_scene(scene_id)
    if not scene:
        raise HTTPException(status_code=404, detail="Scene not found")
    return scene


@router.get("/case/{case_id}", response_model=CrimeScene)
async def get_scene_by_case(
    case_id: str,
    current_user = Depends(get_current_user)
):
    """Get crime scene for a case"""
    scene = await crime_service.get_scene_by_case(case_id)
    if not scene:
        raise HTTPException(status_code=404, detail="Scene not found for this case")
    return scene


@router.post("/", response_model=CrimeScene)
async def create_scene(
    request: CreateSceneRequest,
    current_user = Depends(get_current_user)
):
    """Create a new crime scene"""
    try:
        return await crime_service.create_scene(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{scene_id}/marker", response_model=EvidenceMarker)
async def add_marker(
    scene_id: str,
    request: AddMarkerRequest,
    current_user = Depends(get_current_user)
):
    """Add evidence marker to scene"""
    try:
        return await crime_service.add_marker(scene_id, request)
    except ValueError:
        raise HTTPException(status_code=404, detail="Scene not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/test-create", response_model=CrimeScene)
async def test_create_scene(
    current_user = Depends(get_current_user)
):
    """Test with sample crime scene data"""
    try:
        request = CreateSceneRequest(
            case_id="CASE-2025-CR-042",
            location="Sector 4 Market, Shop No. 12",
            scene_type="indoor",
            dimensions={"length": 10.0, "width": 8.0, "height": 3.0},
            description="Theft crime scene - jewellery shop with broken glass display and scattered items"
        )
        return await crime_service.create_scene(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
