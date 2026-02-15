"""
Expert Implementation: Smart-FIR
Optimization: Uses OpenAI GPT-4o for high-accuracy entity extraction and legal analysis.
"""
import json
import uuid
from typing import List, Optional
from datetime import datetime
import openai

from app.core.config import settings
from app.core.architecture import BaseService
from app.schemas.fir import (
    FIRResponse, FIRCreateRequest, FIRAnalysis, ExtractedEntity, 
    BNSSection, FIRStatus, CrimeSeverity
)

class SmartFIRService(BaseService[FIRResponse, str]):
    def __init__(self, db_session=None):
        self.db = db_session
        # Initialize OpenAI client
        # Note: In production, consider async client or handling rate limits
        api_key = settings.OPENAI_API_KEY
        if not api_key:
            print("WARNING: OPENAI_API_KEY not set in backend. Smart FIR will fail.")
        
        self.client = openai.OpenAI(api_key=api_key)

    async def generate_from_text(self, request: FIRCreateRequest) -> FIRResponse:
        text = request.complaint_text
        
        try:
            # Prepare prompt for OpenAI
            system_prompt = """You are an expert Indian Police officer and legal analyst. 
            Analyze the provided complaint text and extract structured information for a First Information Report (FIR).
            
            Output strictly valid JSON with the following structure:
            {
                "entities": [
                    {"entity_type": "person/vehicle/location/date/time", "value": "extracted text", "confidence": 0.95}
                ],
                "bns_sections": [
                    {
                        "section_number": "BNS Section Code",
                        "description": "Short description",
                        "severity": "HEINOUS/SERIOUS/PETTY",
                        "punishment_summary": "Summary of punishment",
                        "cognizable": true/false,
                        "bailable": true/false
                    }
                ],
                "incident_summary": "Brief 1-line summary of the incident",
                "priority_score": 1-10 (float),
                "draft_content": "Full text of the FIR draft, formatted professionally."
            }
            """
            
            user_prompt = f"""Complaint Text: "{text}"
            
            Complainant: {request.complainant_name}
            Contact: {request.complainant_contact}
            Location: {request.incident_location}
            """

            # Call OpenAI
            completion = self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                response_format={"type": "json_object"},
                temperature=0.2
            )

            # Parse response
            raw_content = completion.choices[0].message.content
            data = json.loads(raw_content)
            
            # Map to internal schemas
            entities = [ExtractedEntity(**e, position={"start": 0, "end": 0}) for e in data.get("entities", [])]
            
            sections = []
            for s in data.get("bns_sections", []):
                # Map string severity to Enum if needed, or handle loosely
                sev = s.get("severity", "SERIOUS").upper()
                if sev not in ["HEINOUS", "SERIOUS", "PETTY"]: sev = "SERIOUS"
                
                sections.append(BNSSection(
                    section_number=s.get("section_number"),
                    description=s.get("description"),
                    severity=CrimeSeverity(sev),
                    confidence=0.9,
                    keywords_matched=[],
                    punishment_summary=s.get("punishment_summary"),
                    cognizable=s.get("cognizable", True),
                    bailable=s.get("bailable", True)
                ))

            # Construct Draft
            draft = data.get("draft_content", "")
            if not draft:
                # Fallback draft generation if LLM didn't provide it nicely
                draft = f"FIRST INFORMATION REPORT (DRAFT)\nGenerated via AI\n\nScale of Offense: {data.get('priority_score')}/10\n\nSummary: {data.get('incident_summary')}\n\nDetails:\n{text}"

            # Construct Analysis Object
            analysis = FIRAnalysis(
                entities=entities,
                bns_sections=sections,
                incident_summary=data.get("incident_summary", "Analysis completed."),
                key_facts=[e.value for e in entities],
                priority_score=float(data.get("priority_score", 5.0))
            )
            
            fir_id = str(uuid.uuid4())
            
            # Use DB model here (same as before)
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
                incident_datetime=datetime.now(), 
                analysis_data=analysis.dict(),
                confidence_score=0.95,
                police_station_id=request.police_station_id
            )

            db = SessionLocal()
            try:
                db.add(db_case)
                db.commit()
                db.refresh(db_case)
            except Exception as e:
                db.rollback()
                print(f"DB Error: {e}")
                # For demo purposes, return the object even if DB fails, or re-raise
                # raise e
            finally:
                db.close()

            return FIRResponse(
                fir_id=db_case.id,
                fir_number=db_case.fir_number,
                status=FIRStatus(db_case.status),
                complaint_text=db_case.complaint_text,
                analysis=analysis,
                draft_content=draft,
                generated_at=db_case.created_at,
                confidence_score=db_case.confidence_score
            )

        except Exception as e:
            print(f"OpenAI FIR Generation Failed: {e}")
            # Fallback to empty or basic response? 
            # Or re-raise to let the user know?
            # Re-raising is better for debugging.
            raise e

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
                    draft_content="", 
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
