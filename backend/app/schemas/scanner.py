"""
Document Scanner Schemas - Skill 11
OCR and categorization for legal documents
"""
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


class DocumentType(str, Enum):
    FIR = "fir"
    AFFIDAVIT = "affidavit"
    SUMMONS = "summons"
    PETITION = "petition"
    ORDER = "order"
    OTHER = "other"


class ScannedDocument(BaseModel):
    id: str
    user_id: str
    filename: str
    file_url: str
    
    # OCR Results
    extracted_text: str
    detected_language: str
    confidence_score: float
    
    # Classification
    document_type: DocumentType
    document_date: Optional[datetime]
    
    created_at: datetime
    metadata: Dict[str, Any] = {}


class ScanRequest(BaseModel):
    filename: str
    content_type: str
    # In a real app, file content would be uploaded via Multipart/Form-Data
    # Here we simulate with base64 or just metadata for the mock
    image_data: Optional[str] = None 
