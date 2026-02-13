from fastapi import APIRouter, HTTPException, Depends
from typing import List, Any
from datetime import datetime
import uuid

from app.schemas.feedback import FeedbackCreate, FeedbackResponse, FeedbackStats

router = APIRouter()

# In-memory storage for feedback (Simulating DB)
feedback_db = [
    {
        "id": "mock-1",
        "nps_score": 9,
        "comment": "Great service, very helpful AI.",
        "user_id": "user-123",
        "timestamp": datetime.now(),
        "status": "submitted"
    },
    {
        "id": "mock-2",
        "nps_score": 8,
        "comment": "Easy to use interface.",
        "user_id": "user-456",
        "timestamp": datetime.now(),
        "status": "submitted"
    }
]

@router.post("/", response_model=FeedbackResponse)
def submit_feedback(feedback_in: FeedbackCreate) -> Any:
    """
    Submit citizen feedback (NPS Score).
    """
    feedback_entry = {
        "id": str(uuid.uuid4()),
        "nps_score": feedback_in.nps_score,
        "comment": feedback_in.comment,
        "user_id": feedback_in.user_id,
        "timestamp": datetime.now(),
        "status": "submitted"
    }
    feedback_db.append(feedback_entry)
    return feedback_entry

@router.get("/stats", response_model=FeedbackStats)
def get_feedback_stats() -> Any:
    """
    Get aggregated feedback statistics.
    """
    total = len(feedback_db)
    if total == 0:
        return {
            "total_responses": 0,
            "average_nps": 0.0,
            "promoters": 0,
            "passives": 0,
            "detractors": 0
        }

    total_score = sum(f["nps_score"] for f in feedback_db)
    promoters = sum(1 for f in feedback_db if f["nps_score"] >= 9)
    passives = sum(1 for f in feedback_db if 7 <= f["nps_score"] <= 8)
    detractors = sum(1 for f in feedback_db if f["nps_score"] <= 6)

    # Calculate NPS
    # NPS = % Promoters - % Detractors
    # Here we just return raw counts for frontend calculation if needed, or pre-calc
    
    return {
        "total_responses": total,
        "average_nps": round(total_score / total, 1),
        "promoters": promoters,
        "passives": passives,
        "detractors": detractors
    }

@router.get("/", response_model=List[FeedbackResponse])
def get_all_feedback() -> Any:
    """
    Get all feedback entries (For Admin).
    """
    return feedback_db
