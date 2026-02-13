"""
Feedback Schemas
"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class FeedbackCreate(BaseModel):
    nps_score: int
    comment: Optional[str] = None
    user_id: Optional[str] = "anonymous"

class FeedbackStats(BaseModel):
    total_responses: int
    average_nps: float
    promoters: int
    passives: int
    detractors: int

class FeedbackResponse(BaseModel):
    id: str
    nps_score: int
    comment: Optional[str]
    timestamp: datetime
    status: str
