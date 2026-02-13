"""
Voice Grievance API - Skill 12 (Expert)
"""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from app.schemas.speech import VoiceGrievance, VoiceSubmissionRequest, Language
from app.services.speech_service import speech_service
from app.core.security import get_current_admin_user as get_current_user

router = APIRouter(prefix="/voice-grievance", tags=["Citizen - Voice Grievance"])


@router.post("/submit", response_model=VoiceGrievance)
async def submit_voice_grievance(
    file: UploadFile = File(...),
    language_hint: Optional[Language] = Form(None),
    current_user = Depends(get_current_user)
):
    """Submit voice audio for grievance filing"""
    try:
        request = VoiceSubmissionRequest(
            audio_content_type=file.content_type,
            language_hint=language_hint
        )
        user_info = {"id": "CITIZEN-001"}
        return await speech_service.process_voice(request, user_info)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/test-submit", response_model=VoiceGrievance)
async def test_voice_grievance(
    current_user = Depends(get_current_user)
):
    """Test with sample voice grievance data"""
    try:
        request = VoiceSubmissionRequest(
            audio_content_type="audio/wav",
            language_hint=Language.HINDI if hasattr(Language, 'HINDI') else None
        )
        user_info = {"id": "CITIZEN-001"}
        return await speech_service.process_voice(request, user_info)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
