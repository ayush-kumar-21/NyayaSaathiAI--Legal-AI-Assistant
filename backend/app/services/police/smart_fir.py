"""
Expert Implementation: Smart-FIR
Optimization: Pre-compiled regex patterns for O(n) entity extraction.
Integreated with official schemas.
"""
import re
import uuid
from typing import List, Dict, Optional
from datetime import datetime

from app.core.architecture import BaseService, InMemoryRepository, IRepository
from app.schemas.fir import (
    FIRResponse, FIRCreateRequest, FIRAnalysis, ExtractedEntity, 
    BNSSection, FIRStatus, CrimeSeverity, BNS_SECTIONS_DB
)

class SmartFIRService(BaseService[FIRResponse, str]):
    # Pre-compile patterns once at module level (O(1) initialization)
    PATTERNS = {
        "time": re.compile(r"\b(\d{1,2}:\d{2}\s*(?:AM|PM))\b", re.I),
        "date": re.compile(r"\b(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})\b"),
        "vehicle": re.compile(r"\b([A-Z]{2}[-\s]?\d{1,2}[-\s]?[A-Z]{1,2}[-\s]?\d{4})\b"), # India License Plate
        "phone": re.compile(r"\b(\+91[\-\s]?)?[6-9]\d{9}\b"),
        "aadhaar": re.compile(r"\b\d{4}\s\d{4}\s\d{4}\b"),
        "email": re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b"),
        "person": re.compile(r"\b(Mr\.|Mrs\.|Ms\.|Dr\.)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b")
    }

    def __init__(self, db_session=None):
        self.db = db_session

    async def generate_from_text(self, request: FIRCreateRequest) -> FIRResponse:
        text = request.complaint_text
        
        # 1. Entity Extraction (O(n))
        entities = []
        for type_, pattern in self.PATTERNS.items():
            for match in pattern.finditer(text):
                entities.append(ExtractedEntity(
                    entity_type=type_,
                    value=match.group(0),
                    confidence=0.95,
                    position={"start": match.start(), "end": match.end()}
                ))
        
        # 2. BNS Mapping (O(n))
        sections = []
        text_lower = text.lower()
        
        for code, data in BNS_SECTIONS_DB.items():
            matched_keywords = [k for k in data["keywords"] if k in text_lower]
            if matched_keywords:
                sections.append(BNSSection(
                    section_number=code, 
                    description=data["description"],
                    severity=data["severity"],
                    confidence=0.85 + (0.05 * len(matched_keywords)), 
                    keywords_matched=matched_keywords,
                    punishment_summary=data.get("punishment"),
                    cognizable=data.get("cognizable", True),
                    bailable=data.get("bailable", True)
                ))
        
        # 3. Draft Generation
        draft = f"FIRST INFORMATION REPORT (DRAFT)\n"
        draft += f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}\n"
        draft += f"-" * 40 + "\n\n"
        draft += f"1. COMPLAINANT: {request.complainant_name} ({request.complainant_contact})\n"
        draft += f"2. INCIDENT: {request.incident_location or 'Unknown Location'}\n"
        draft += f"3. OFFENSE DETAILS:\n"
        for s in sections:
            draft += f"   - {s.section_number}: {s.description} ({s.severity.value.upper()})\n"
        draft += f"\n4. STATEMENT SUMMARY:\n{text[:200]}...\n"
        
        # 4. Construct Response
        analysis = FIRAnalysis(
            entities=entities,
            bns_sections=sections,
            incident_summary=f"Incident involving {len(entities)} identified entities and potential violations of {', '.join([s.section_number for s in sections])}.",
            key_facts=[e.value for e in entities],
            priority_score=9.0 if any(s.severity == CrimeSeverity.HEINOUS for s in sections) else 5.0
        )
        
        fir_id = str(uuid.uuid4())
        # Use DB model here
        from app.models.case import Case
        from app.db.database import SessionLocal

        db_case = Case(
            id=fir_id,
            fir_number=f"FIR/{datetime.now().year}/{fir_id[:4].upper()}",
            status=FIRStatus.DRAFT,
            complaint_text=text,
            complainant_name=request.complainant_name,
            complainant_contact=request.complainant_contact,
            incident_location=request.incident_location,
            incident_datetime=datetime.now(), # Or parse from text if possible
            analysis_data=analysis.dict(),
            confidence_score=0.92,
            police_station_id=request.police_station_id
        )

        # Handle DB Session - prototype specific workaround
        # In a real app better to inject session via FastAPI Depends
        db = SessionLocal()
        try:
            db.add(db_case)
            db.commit()
            db.refresh(db_case)
        except Exception as e:
            db.rollback()
            print(f"DB Error: {e}")
            raise e
        finally:
            db.close()

        
        response = FIRResponse(
            fir_id=db_case.id,
            fir_number=db_case.fir_number,
            status=FIRStatus(db_case.status),
            complaint_text=db_case.complaint_text,
            analysis=analysis,
            draft_content=draft,
            generated_at=db_case.created_at,
            confidence_score=db_case.confidence_score
        )
        
        return response

    async def list_firs(self, police_station_id: Optional[str] = None, status: Optional[str] = None, limit: int = 50) -> List[FIRResponse]:
        from app.models.case import Case
        from app.db.database import SessionLocal
        
        db = SessionLocal()
        try:
            query = db.query(Case)
            if police_station_id:
                query = query.filter(Case.police_station_id == police_station_id)
            if status:
                query = query.filter(Case.status == status)
                
            cases = query.limit(limit).all()
            
            return [
                FIRResponse(
                    fir_id=c.id,
                    fir_number=c.fir_number,
                    status=FIRStatus(c.status),
                    complaint_text=c.complaint_text,
                    analysis=FIRAnalysis(**c.analysis_data) if c.analysis_data else None,
                    draft_content="", # Reconstruct or store? For listing, maybe exclude large text
                    generated_at=c.created_at,
                    confidence_score=c.confidence_score
                ) for c in cases
            ]
        finally:
            db.close()

    async def get_fir(self, fir_id: str) -> Optional[FIRResponse]:
        from app.models.case import Case
        from app.db.database import SessionLocal
        
        db = SessionLocal()
        try:
            c = db.query(Case).filter(Case.id == fir_id).first()
            if not c: return None
            
            return FIRResponse(
                fir_id=c.id,
                fir_number=c.fir_number,
                status=FIRStatus(c.status),
                complaint_text=c.complaint_text,
                analysis=FIRAnalysis(**c.analysis_data) if c.analysis_data else None,
                draft_content="", 
                generated_at=c.created_at,
                confidence_score=c.confidence_score
            )
        finally:
            db.close()

    async def update_fir(self, fir_id: str, update_data: any) -> Optional[FIRResponse]:
        from app.models.case import Case
        from app.db.database import SessionLocal
        
        db = SessionLocal()
        try:
            c = db.query(Case).filter(Case.id == fir_id).first()
            if not c: return None
            
            # Simple status update logic for now
            if hasattr(update_data, 'status') and update_data.status:
               c.status = update_data.status
            
            db.commit()
            db.refresh(c)
            
            return await self.get_fir(fir_id)
        finally:
            db.close()

# Factory
_service_instance = None

def get_smart_fir_service() -> SmartFIRService:
    global _service_instance
    if _service_instance is None:
        _service_instance = SmartFIRService()
    return _service_instance
