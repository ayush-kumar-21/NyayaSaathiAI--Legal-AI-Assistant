"""
Document Scanner API - Skill 11 (Expert)
"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from app.schemas.scanner import ScannedDocument, ScanRequest
from app.services.document_scanner import scanner_service
from app.core.security import get_current_admin_user as get_current_user

router = APIRouter(prefix="/scanner", tags=["Citizen - Document Scanner"])


@router.post("/scan", response_model=ScannedDocument)
async def scan_document(
    file: UploadFile = File(...),
    current_user = Depends(get_current_user)
):
    """Scan a document, extract text, and categorize it."""
    try:
        request = ScanRequest(
            filename=file.filename,
            content_type=file.content_type
        )
        user_info = {"id": "CITIZEN-001"}
        return await scanner_service.scan_document(request, user_info)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/test-scan", response_model=ScannedDocument)
async def test_scan_document(
    current_user = Depends(get_current_user)
):
    """Test with sample document data"""
    try:
        request = ScanRequest(
            filename="fir_complaint_2025.pdf",
            content_type="application/pdf"
        )
        user_info = {"id": "CITIZEN-001"}
        return await scanner_service.scan_document(request, user_info)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
