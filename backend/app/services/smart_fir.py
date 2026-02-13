"""
Smart-FIR Service - Skill 01
AI-powered FIR generation with entity extraction and BNS mapping
"""
import uuid
import re
from datetime import datetime
from typing import List, Dict, Optional, Tuple
import random

from app.schemas.fir import (
    FIRCreateRequest, FIRResponse, FIRUpdateRequest,
    FIRAnalysis, ExtractedEntity, BNSSection, CrimeSeverity,
    FIRStatus, BNS_SECTIONS_DB
)


class SmartFIRService:
    """
    AI-powered FIR generation service
    Uses NLP for entity extraction and semantic matching for BNS sections
    """
    
    def __init__(self):
        self._firs: Dict[str, FIRResponse] = {}
        self._fir_counter = 0
        
        # Entity extraction patterns
        self.entity_patterns = {
            "time": [
                r"(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm))",
                r"(\d{1,2}\s*(?:AM|PM|am|pm))",
                r"(yesterday|today|last\s+night|this\s+morning|evening)",
                r"(\d{1,2})\s*(?:th|st|nd|rd)?\s*(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*"
            ],
            "vehicle": [
                r"(Honda\s+City|Toyota\s+Innova|Swift|Alto|BMW|Mercedes|Audi)",
                r"(\w+\s+(?:car|bike|scooter|motorcycle|bus|truck))",
                r"([A-Z]{2}\s*\d{2}\s*[A-Z]{1,2}\s*\d{4})"  # License plate
            ],
            "location": [
                r"(MG\s+Road|Connaught\s+Place|Cyber\s+Hub|Sector\s+\d+)",
                r"(?:at|near|from)\s+([A-Z][a-zA-Z\s]+(?:Road|Street|Market|Colony))",
                r"([A-Z][a-z]+\s*(?:Metro|Station|Hospital|Mall))"
            ],
            "person": [
                r"(\b[A-Z][a-z]+\s+[A-Z][a-z]+\b)"  # Full names
            ],
            "phone": [
                r"(\+91[-\s]?\d{5}[-\s]?\d{5})",
                r"(\d{10})"
            ]
        }
    
    def generate_fir(self, request: FIRCreateRequest) -> FIRResponse:
        """
        Generate FIR from complaint text
        
        Process:
        1. Extract entities using regex patterns
        2. Map to BNS sections using keyword matching
        3. Generate structured FIR draft
        4. Calculate confidence scores
        """
        # Step 1: Extract entities
        entities = self._extract_entities(request.complaint_text)
        
        # Step 2: Map to BNS sections
        bns_sections = self._map_to_bns_sections(request.complaint_text)
        
        # Step 3: Generate analysis
        analysis = FIRAnalysis(
            entities=entities,
            bns_sections=bns_sections,
            incident_summary=self._generate_summary(request.complaint_text),
            key_facts=self._extract_key_facts(request.complaint_text),
            priority_score=self._calculate_priority(bns_sections)
        )
        
        # Step 4: Generate draft FIR
        draft_content = self._generate_draft_fir(request, analysis)
        
        # Step 5: Calculate overall confidence
        confidence = self._calculate_confidence(entities, bns_sections)
        
        # Step 6: Create FIR record
        self._fir_counter += 1
        fir_id = str(uuid.uuid4())
        fir_number = f"FIR/{datetime.now().year}/{self._fir_counter:05d}"
        
        fir = FIRResponse(
            fir_id=fir_id,
            fir_number=fir_number,
            status=FIRStatus.DRAFT,
            complaint_text=request.complaint_text,
            analysis=analysis,
            draft_content=draft_content,
            generated_at=datetime.now(),
            confidence_score=confidence
        )
        
        self._firs[fir_id] = fir
        return fir
    
    def _extract_entities(self, text: str) -> List[ExtractedEntity]:
        """Extract entities from complaint text using regex patterns"""
        entities = []
        
        for entity_type, patterns in self.entity_patterns.items():
            for pattern in patterns:
                matches = re.finditer(pattern, text, re.IGNORECASE)
                for match in matches:
                    # Calculate confidence based on pattern specificity
                    confidence = random.uniform(0.75, 0.95)
                    
                    entity = ExtractedEntity(
                        entity_type=entity_type,
                        value=match.group(1) if match.groups() else match.group(0),
                        confidence=confidence,
                        position={"start": match.start(), "end": match.end()}
                    )
                    entities.append(entity)
        
        # Remove duplicates and sort by confidence
        seen = set()
        unique_entities = []
        for e in sorted(entities, key=lambda x: -x.confidence):
            key = (e.entity_type, e.value.lower())
            if key not in seen:
                seen.add(key)
                unique_entities.append(e)
        
        return unique_entities[:10]  # Limit to top 10
    
    def _map_to_bns_sections(self, text: str) -> List[BNSSection]:
        """Map complaint text to BNS sections using keyword matching"""
        text_lower = text.lower()
        matched_sections = []
        
        for section_code, data in BNS_SECTIONS_DB.items():
            matched_keywords = []
            
            for keyword in data["keywords"]:
                if keyword.lower() in text_lower:
                    matched_keywords.append(keyword)
            
            if matched_keywords:
                # Calculate confidence based on keyword matches
                confidence = min(0.95, 0.6 + (len(matched_keywords) * 0.1))
                
                section = BNSSection(
                    section_number=section_code,
                    description=data["description"],
                    severity=data["severity"],
                    confidence=confidence,
                    keywords_matched=matched_keywords,
                    punishment_summary=data.get("punishment"),
                    cognizable=data.get("cognizable", True),
                    bailable=data.get("bailable", True)
                )
                matched_sections.append(section)
        
        # Sort by confidence and severity
        severity_order = {
            CrimeSeverity.HEINOUS: 4,
            CrimeSeverity.SERIOUS: 3,
            CrimeSeverity.MODERATE: 2,
            CrimeSeverity.MINOR: 1
        }
        
        matched_sections.sort(
            key=lambda x: (-x.confidence, -severity_order.get(x.severity, 0))
        )
        
        return matched_sections[:5]  # Return top 5 matches
    
    def _generate_summary(self, text: str) -> str:
        """Generate incident summary from complaint"""
        # Extract first 2-3 sentences
        sentences = re.split(r'[.!?]+', text)
        summary_sentences = [s.strip() for s in sentences[:3] if len(s.strip()) > 10]
        return " ".join(summary_sentences)
    
    def _extract_key_facts(self, text: str) -> List[str]:
        """Extract key facts from complaint"""
        facts = []
        
        # Look for patterns
        patterns = [
            (r"(?:stolen|took|missing)\s+([^.]+)", "Property involved: {}"),
            (r"(?:at|near|from)\s+([A-Z][^.]+)", "Location: {}"),
            (r"(?:yesterday|today|last\s+night|[0-9]+\s*(?:AM|PM))", "Time: {}"),
            (r"(?:Honda|Toyota|BMW|Maruti|Audi)\s+([^.]+)", "Vehicle: {}"),
        ]
        
        for pattern, template in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                facts.append(template.format(match.group(0)))
        
        return facts[:5]
    
    def _calculate_priority(self, sections: List[BNSSection]) -> float:
        """Calculate case priority score (0-10)"""
        if not sections:
            return 3.0
        
        severity_scores = {
            CrimeSeverity.HEINOUS: 10,
            CrimeSeverity.SERIOUS: 7,
            CrimeSeverity.MODERATE: 5,
            CrimeSeverity.MINOR: 2
        }
        
        max_score = max(
            severity_scores.get(s.severity, 3) for s in sections
        )
        
        # Boost if multiple serious sections
        if len([s for s in sections if s.severity in [CrimeSeverity.HEINOUS, CrimeSeverity.SERIOUS]]) > 1:
            max_score = min(10, max_score + 1)
        
        return max_score
    
    def _generate_draft_fir(self, request: FIRCreateRequest, analysis: FIRAnalysis) -> str:
        """Generate structured FIR draft"""
        sections_text = ", ".join([s.section_number for s in analysis.bns_sections])
        
        draft = f"""
FIRST INFORMATION REPORT

FIR No.: [AUTO-GENERATED]
Date: {datetime.now().strftime("%d/%m/%Y")}
Police Station: {request.police_station_id}

COMPLAINANT:
Name: {request.complainant_name}
Contact: {request.complainant_contact}

INCIDENT DETAILS:
Date/Time: {request.incident_datetime or 'As stated below'}
Location: {request.incident_location or 'As stated below'}

STATEMENT:
{request.complaint_text}

LEGAL ANALYSIS:
Applicable BNS Sections: {sections_text or 'To be determined'}

INCIDENT SUMMARY:
{analysis.incident_summary}

KEY FACTS:
{chr(10).join(['- ' + f for f in analysis.key_facts])}

RECOMMENDED ACTION:
Priority Level: {analysis.priority_score}/10
Investigating Officer: {analysis.recommended_io or 'To be assigned'}

---
Generated by Smart-FIR AI System
Confidence Score: {self._calculate_confidence(analysis.entities, analysis.bns_sections):.0%}
"""
        return draft.strip()
    
    def _calculate_confidence(self, entities: List, sections: List) -> float:
        """Calculate overall confidence score"""
        if not entities and not sections:
            return 0.5
        
        entity_conf = sum(e.confidence for e in entities) / len(entities) if entities else 0.5
        section_conf = sum(s.confidence for s in sections) / len(sections) if sections else 0.5
        
        return round((entity_conf * 0.4 + section_conf * 0.6), 2)
    
    def get_fir(self, fir_id: str) -> Optional[FIRResponse]:
        """Get FIR by ID"""
        return self._firs.get(fir_id)
    
    def update_fir(self, fir_id: str, update: FIRUpdateRequest) -> Optional[FIRResponse]:
        """Update FIR status or content"""
        fir = self._firs.get(fir_id)
        if not fir:
            return None
        
        if update.status:
            fir.status = update.status
        if update.draft_content:
            fir.draft_content = update.draft_content
        if update.reviewed_by:
            fir.reviewed_by = update.reviewed_by
            fir.reviewed_at = datetime.now()
        
        return fir
    
    def list_firs(self, police_station_id: Optional[str] = None, 
                  status: Optional[FIRStatus] = None,
                  limit: int = 50) -> List[FIRResponse]:
        """List FIRs with optional filters"""
        firs = list(self._firs.values())
        
        if police_station_id:
            # Would filter by police station in real implementation
            pass
        
        if status:
            firs = [f for f in firs if f.status == status]
        
        return sorted(firs, key=lambda x: x.generated_at, reverse=True)[:limit]
    
    def get_bns_reference(self, section_code: str) -> Optional[Dict]:
        """Get BNS section reference data"""
        return BNS_SECTIONS_DB.get(section_code)


# Singleton instance
smart_fir_service = SmartFIRService()
