"""
Secure Chat API - Skill 14 (Expert)
"""
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.schemas.chat import ChatMessage, SendMessageRequest
from app.services.secure_chat import chat_service
from app.core.security import get_current_admin_user as get_current_user

router = APIRouter(prefix="/chat", tags=["Citizen - Secure Chat"])


@router.post("/send", response_model=ChatMessage)
async def send_message(
    request: SendMessageRequest,
    current_user = Depends(get_current_user)
):
    """Send an encrypted message"""
    try:
        user_info = {"id": "CITIZEN-001"}
        return await chat_service.send_message(request, user_info)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history/{other_user_id}", response_model=List[ChatMessage])
async def get_chat_history(
    other_user_id: str,
    current_user = Depends(get_current_user)
):
    """Get chat history"""
    try:
        user_id = "CITIZEN-001"
        return await chat_service.get_history(user_id, other_user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/test-send", response_model=ChatMessage)
async def test_send_message(
    current_user = Depends(get_current_user)
):
    """Test with sample chat message"""
    try:
        request = SendMessageRequest(
            to_user_id="LAWYER-001",
            content="I need legal advice regarding a property dispute in Sector 7. The neighbor has encroached on 50 sq ft of my land.",
            is_encrypted=True
        )
        user_info = {"id": "CITIZEN-001"}
        return await chat_service.send_message(request, user_info)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
