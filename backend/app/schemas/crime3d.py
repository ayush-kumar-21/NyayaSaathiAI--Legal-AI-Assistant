"""
Crime Scene 3D Schemas - Skill 17
3D Reconstruction and Evidence Mapping
"""
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import date, datetime
from enum import Enum


class EvidenceMarkerType(str, Enum):
    WEAPON = "weapon"
    BLOOD = "blood"
    FINGERPRINT = "fingerprint"
    FOOTPRINT = "footprint"
    OTHER = "other"


class EvidenceMarker(BaseModel):
    id: str
    type: EvidenceMarkerType
    description: str
    position_x: float
    position_y: float
    position_z: float
    image_url: Optional[str] = None
    collected_by: Optional[str] = None
    timestamp: datetime


class CrimeScene(BaseModel):
    id: str
    case_id: str
    location: str
    date: date
    description: str
    markers: List[EvidenceMarker] = []
    model_url: Optional[str] = None # URL to 3D model file (GLB/GLTF)
    metadata: Dict[str, Any] = {}


class CreateSceneRequest(BaseModel):
    case_id: str
    location: str
    date: date
    description: str


class AddMarkerRequest(BaseModel):
    type: EvidenceMarkerType
    description: str
    position_x: float
    position_y: float
    position_z: float
