"""
Know Your Rights Schema - Skill 22
Citizen-facing legal rights information engine
"""
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum


class RightsCategory(str, Enum):
    ARREST = "arrest"
    BAIL = "bail"
    FIR = "fir"
    SEARCH_SEIZURE = "search_seizure"
    PROPERTY = "property"
    CONSUMER = "consumer"
    LABOUR = "labour"
    WOMEN = "women"
    CHILDREN = "children"
    CYBER = "cyber"
    RTI = "rti"
    GENERAL = "general"


class RightInfo(BaseModel):
    title: str
    description: str
    legal_basis: str  # Section/Article reference
    key_points: List[str]
    dos: List[str]
    donts: List[str]


class RightsQueryRequest(BaseModel):
    query: str
    category: Optional[RightsCategory] = None
    language: str = "en"


class RightsQueryResponse(BaseModel):
    id: str
    query: str
    category: RightsCategory
    rights: List[RightInfo]
    emergency_contacts: List[dict]
    related_sections: List[str]
    disclaimer: str = "This information is for educational purposes. Consult a legal professional for specific advice."
    generated_at: datetime = Field(default_factory=datetime.now)
