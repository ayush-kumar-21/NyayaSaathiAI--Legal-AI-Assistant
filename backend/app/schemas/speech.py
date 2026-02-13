"""
Voice Grievance Schemas - Skill 12
Multilingual speech-to-text for citizen complaints
"""
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


class Language(str, Enum):
    HINDI = "hi"
    ENGLISH = "en"
    TAMIL = "ta"
    TELUGU = "te"
    BENGALI = "bn"
    GUJARATI = "gu"
    MARATHI = "mr"


class GrievanceStatus(str, Enum):
    RECORDED = "recorded"
    PROCESSING = "processing"
    SUBMITTED = "submitted"


class VoiceGrievance(BaseModel):
    id: str
    user_id: str
    audio_url: str
    
    # AI Processing Results
    transcript: str
    detected_language: Language
    summary: str # Structured complaint summary
    category: str # e.g. "Theft", "Harassment"
    
    status: GrievanceStatus
    created_at: datetime
    metadata: Dict[str, Any] = {}


class VoiceSubmissionRequest(BaseModel):
    audio_content_type: str
    # In a real app, file content would be uploaded via Multipart/Form-Data
    # Here we simulate with base64 or just metadata for the mock
    language_hint: Optional[Language] = None
