"""
Crime Scene 3D Service - Skill 17
"""
import uuid
from datetime import date, datetime
from typing import List, Optional, Dict
from app.schemas.crime3d import CrimeScene, EvidenceMarker, CreateSceneRequest, AddMarkerRequest, EvidenceMarkerType


class CrimeSceneService:
    """
    Service for managing 3D crime scenes and evidence markers
    """
    
    def __init__(self):
        self.scenes: Dict[str, CrimeScene] = {}
        self._seed_data()
        
    def _seed_data(self):
        s_id = str(uuid.uuid4())
        scene = CrimeScene(
            id=s_id,
            case_id="CASE-2023-001",
            location="Apartment 4B, Vasant Vihar",
            date=date.today(),
            description="Alleged burglary and assault scene",
            markers=[
                EvidenceMarker(
                    id=str(uuid.uuid4()),
                    type=EvidenceMarkerType.WEAPON,
                    description="Crowbar found near window",
                    position_x=1.2,
                    position_y=0.0,
                    position_z=-2.5,
                    timestamp=datetime.now()
                ),
                EvidenceMarker(
                    id=str(uuid.uuid4()),
                    type=EvidenceMarkerType.FOOTPRINT,
                    description="Muddy footprint size 9",
                    position_x=0.5,
                    position_y=0.0,
                    position_z=1.0,
                    timestamp=datetime.now()
                )
            ]
        )
        self.scenes[s_id] = scene

    async def create_scene(self, request: CreateSceneRequest) -> CrimeScene:
        """Create a new crime scene record"""
        s_id = str(uuid.uuid4())
        scene = CrimeScene(
            id=s_id,
            case_id=request.case_id,
            location=request.location,
            date=request.date,
            description=request.description,
            markers=[]
        )
        self.scenes[s_id] = scene
        return scene

    async def get_scene(self, scene_id: str) -> Optional[CrimeScene]:
        return self.scenes.get(scene_id)
        
    async def get_scene_by_case(self, case_id: str) -> Optional[CrimeScene]:
        for scene in self.scenes.values():
            if scene.case_id == case_id:
                return scene
        return None

    async def add_marker(self, scene_id: str, request: AddMarkerRequest) -> EvidenceMarker:
        if scene_id not in self.scenes:
            raise ValueError("Scene not found")
            
        marker = EvidenceMarker(
            id=str(uuid.uuid4()),
            type=request.type,
            description=request.description,
            position_x=request.position_x,
            position_y=request.position_y,
            position_z=request.position_z,
            timestamp=datetime.now()
        )
        self.scenes[scene_id].markers.append(marker)
        return marker


# Singleton
crime_service = CrimeSceneService()
