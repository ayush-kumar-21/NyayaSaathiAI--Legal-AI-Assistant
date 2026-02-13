"""
Voice Grievance Service - Skill 12
"""
import uuid
from datetime import datetime
from typing import List, Optional, Dict
from app.schemas.speech import (
    VoiceGrievance, VoiceSubmissionRequest, 
    Language, GrievanceStatus
)


class VoiceGrievanceService:
    """
    Service for processing voice complaints
    """
    
    def __init__(self):
        self.grievances: Dict[str, VoiceGrievance] = {}
        
    async def process_voice(self, request: VoiceSubmissionRequest, user: dict) -> VoiceGrievance:
        """Mock ASR and Summarization"""
        grievance_id = str(uuid.uuid4())
        
        # Mock Logic
        transcript = "Main kal raat ghar ja raha tha aur kisi ne mera phone cheen liya. Station ke paas hua ye."
        summary = "Theft of mobile phone reported near the station last night."
        category = "Theft"
        lang = request.language_hint if request.language_hint else Language.HINDI
        
        grievance = VoiceGrievance(
            id=grievance_id,
            user_id=user.get("id", "CITIZEN-001"),
            audio_url=f"/voice-uploads/{grievance_id}.wav",
            transcript=transcript,
            detected_language=lang,
            summary=summary,
            category=category,
            status=GrievanceStatus.SUBMITTED,
            created_at=datetime.now()
        )
        
        self.grievances[grievance_id] = grievance
        return grievance

    async def get_grievance(self, grievance_id: str) -> Optional[VoiceGrievance]:
        return self.grievances.get(grievance_id)


# Singleton
speech_service = VoiceGrievanceService()
