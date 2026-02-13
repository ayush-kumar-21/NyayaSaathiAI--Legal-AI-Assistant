"""
Document Scanner Service - Skill 11
"""
import uuid
from datetime import datetime
from typing import List, Optional, Dict
from app.schemas.scanner import (
    ScannedDocument, ScanRequest, DocumentType
)


class DocumentScannerService:
    """
    Service for scanning and processing documents
    """
    
    def __init__(self):
        self.documents: Dict[str, ScannedDocument] = {}
        
    async def scan_document(self, request: ScanRequest, user: dict) -> ScannedDocument:
        """Mock OCR and Categorization"""
        doc_id = str(uuid.uuid4())
        
        # Mock Logic based on filename
        doc_type = DocumentType.OTHER
        extracted_text = "Sample extracted text..."
        
        if "fir" in request.filename.lower():
            doc_type = DocumentType.FIR
            extracted_text = "FIRST INFORMATION REPORT... Section 154 CrPC..."
        elif "affidavit" in request.filename.lower():
            doc_type = DocumentType.AFFIDAVIT
            extracted_text = "I, [Name], do hereby solemnly affirm and declare..."
            
        doc = ScannedDocument(
            id=doc_id,
            user_id=user.get("id", "CITIZEN-001"),
            filename=request.filename,
            file_url=f"/uploads/{doc_id}_{request.filename}",
            extracted_text=extracted_text,
            detected_language="en",
            confidence_score=0.95,
            document_type=doc_type,
            document_date=datetime.now(),
            created_at=datetime.now()
        )
        
        self.documents[doc_id] = doc
        return doc

    async def get_document(self, doc_id: str) -> Optional[ScannedDocument]:
        return self.documents.get(doc_id)


# Singleton
scanner_service = DocumentScannerService()
