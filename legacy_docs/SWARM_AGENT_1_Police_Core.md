# SWARM AGENT 1 — POLICE CORE SKILLS
## Implementation Package: Skills 01, 02, 08, 09

**Agent ID:** AGENT-1  
**Assignment:** Police Persona — Core Skills  
**Skills:** 4 skills | **Time Estimate:** 8-10 hours  
**Priority:** CRITICAL — Start First  
**Coordinator:** Antigravity  

---

## 🎯 YOUR MISSION

Implement the **4 foundational Police skills** that form the core of the police persona. These are the most critical skills and establish patterns for all other police tools.

**Skills to Implement:**
1. **Skill 01: Smart-FIR** — AI-powered First Information Report generation
2. **Skill 02: Financial Analyzer** — Transaction pattern analysis for financial crimes
3. **Skill 08: Forensic Interlock** — Digital evidence chain of custody
4. **Skill 09: Evidence Hasher** — Blockchain-based evidence integrity

---

## 📋 SKILL 01: SMART-FIR

### Overview
AI-powered FIR generation using speech-to-text, automatic BNS section mapping, and digital signatures.

### Backend Implementation

**File 1:** `backend/app/services/smart_fir_service.py`
```python
"""
Smart FIR Service - Skill 01
AI-powered First Information Report generation with automatic legal section mapping.
"""
import uuid
import re
from datetime import datetime
from typing import List, Dict, Optional, Tuple
from enum import Enum
from pydantic import BaseModel, Field
from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)

class FIRStatus(str, Enum):
    DRAFT = "draft"
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    REGISTERED = "registered"
    REJECTED = "rejected"

class Complainant(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    age: int = Field(..., ge=1, le=120)
    gender: str = Field(..., regex="^(male|female|other)$")
    address: str = Field(..., min_length=10, max_length=500)
    phone: str = Field(..., regex="^[0-9]{10}$")
    email: Optional[str] = Field(None, regex="^[^@]+@[^@]+\.[^@]+$")
    id_type: str = Field(..., regex="^(aadhaar|pan|passport|voter_id)$")
    id_number: str = Field(..., min_length=6, max_length=20)
    occupation: Optional[str] = None

class IncidentDetails(BaseModel):
    date_of_incident: datetime
    time_of_incident: Optional[str] = None
    place_of_incident: str = Field(..., min_length=5, max_length=200)
    district: str
    police_station: str
    description: str = Field(..., min_length=50, max_length=5000)
    injury_details: Optional[str] = None
    property_damage: Optional[str] = None
    witnesses: List[str] = Field(default_factory=list)
    evidence_photos: List[str] = Field(default_factory=list)

class BNSection(BaseModel):
    section: str
    title: str
    description: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    ipc_equivalent: Optional[str] = None

class FIRData(BaseModel):
    fir_number: str
    police_station: str
    district: str
    date_filed: datetime
    complainant: Complainant
    incident: IncidentDetails
    sections_applied: List[BNSection]
    status: FIRStatus
    investigating_officer: Optional[str] = None
    priority: str = "normal"  # urgent, high, normal, low
    ai_summary: Optional[str] = None
    follow_up_actions: List[str] = Field(default_factory=list)

class FIRCreateRequest(BaseModel):
    complainant: Complainant
    incident: IncidentDetails
    priority: str = "normal"

class FIRUpdateRequest(BaseModel):
    investigating_officer: Optional[str] = None
    status: Optional[FIRStatus] = None
    follow_up_actions: Optional[List[str]] = None
    notes: Optional[str] = None


class SmartFIRService:
    """
    Service for AI-powered FIR generation and management.
    
    Features:
    - Automatic BNS section mapping from incident description
    - Speech-to-text conversion
    - FIR number generation
    - Priority classification
    """
    
    # BNS Section mapping patterns
    BNS_PATTERNS: Dict[str, List[Dict]] = {
        r"(murder|killed|death|homicide)": [
            {"section": "BNS 103", "title": "Murder", "ipc_equivalent": "IPC 302"}
        ],
        r"(theft|stole|stolen|robbery|burglary)": [
            {"section": "BNS 303", "title": "Theft", "ipc_equivalent": "IPC 379"},
            {"section": "BNS 310", "title": "Robbery", "ipc_equivalent": "IPC 392"}
        ],
        r"(assault|beat|hit|attack|hurt)": [
            {"section": "BNS 115", "title": "Voluntarily causing hurt", "ipc_equivalent": "IPC 323"},
            {"section": "BNS 118", "title": "Voluntarily causing grievous hurt", "ipc_equivalent": "IPC 325"}
        ],
        r"(rape|sexual assault|molest|harass)": [
            {"section": "BNS 63", "title": "Rape", "ipc_equivalent": "IPC 376"}
        ],
        r"(fraud|cheat|cheating|forgery|fake)": [
            {"section": "BNS 318", "title": "Cheating", "ipc_equivalent": "IPC 420"},
            {"section": "BNS 336", "title": "Forgery", "ipc_equivalent": "IPC 463"}
        ],
        r"(domestic violence|dowry|harassment|cruelty)": [
            {"section": "BNS 85", "title": "Cruelty by husband", "ipc_equivalent": "IPC 498A"}
        ],
        r"(kidnap|abduct|missing)": [
            {"section": "BNS 136", "title": "Kidnapping", "ipc_equivalent": "IPC 363"}
        ],
        r"(extortion|blackmail|threat)": [
            {"section": "BNS 308", "title": "Extortion", "ipc_equivalent": "IPC 384"}
        ],
        r"(arson|fire|burn)": [
            {"section": "BNS 325", "title": "Mischief by fire", "ipc_equivalent": "IPC 435"}
        ],
        r"(cyber|online|internet|hacking|phishing)": [
            {"section": "IT Act 66", "title": "Computer related offences"}
        ]
    }
    
    def __init__(self):
        self._firs: Dict[str, FIRData] = {}
        self._counter = 0
    
    def generate_fir_number(self, police_station: str, district: str) -> str:
        """Generate unique FIR number: FIR/DISTRICT/PS/YEAR/SEQUENCE"""
        self._counter += 1
        year = datetime.now().year
        ps_code = police_station.replace(" ", "_").upper()[:10]
        dist_code = district.replace(" ", "_").upper()[:5]
        return f"FIR/{dist_code}/{ps_code}/{year}/{self._counter:05d}"
    
    def detect_bns_sections(self, description: str) -> List[BNSection]:
        """
        AI-powered BNS section detection from incident description.
        Uses keyword matching with confidence scoring.
        """
        description_lower = description.lower()
        detected_sections = []
        
        for pattern, sections in self.BNS_PATTERNS.items():
            if re.search(pattern, description_lower, re.IGNORECASE):
                for section in sections:
                    # Calculate confidence based on keyword density
                    matches = len(re.findall(pattern, description_lower, re.IGNORECASE))
                    confidence = min(0.5 + (matches * 0.1), 0.95)
                    
                    detected_sections.append(BNSection(
                        section=section["section"],
                        title=section["title"],
                        description=f"Detected from incident description",
                        confidence=round(confidence, 2),
                        ipc_equivalent=section.get("ipc_equivalent")
                    ))
        
        # Sort by confidence
        detected_sections.sort(key=lambda x: x.confidence, reverse=True)
        
        # If no sections detected, add general section
        if not detected_sections:
            detected_sections.append(BNSection(
                section="BNS 2",
                title="General Offense",
                description="General offense under Bharatiya Nyaya Sanhita",
                confidence=0.3,
                ipc_equivalent=None
            ))
        
        return detected_sections[:5]  # Return top 5 sections
    
    def classify_priority(self, sections: List[BNSection], description: str) -> str:
        """Classify FIR priority based on sections and keywords"""
        urgent_keywords = ["murder", "rape", "kidnapping", "attempt to murder", "riot"]
        high_keywords = ["robbery", "theft", "assault", "domestic violence"]
        
        description_lower = description.lower()
        
        # Check for urgent keywords
        if any(keyword in description_lower for keyword in urgent_keywords):
            return "urgent"
        
        # Check for high priority keywords
        if any(keyword in description_lower for keyword in high_keywords):
            return "high"
        
        # Check section severity
        severe_sections = ["BNS 103", "BNS 63", "BNS 136", "BNS 118"]
        if any(s.section in severe_sections for s in sections):
            return "urgent"
        
        return "normal"
    
    def generate_ai_summary(self, fir: FIRData) -> str:
        """Generate AI summary of the FIR"""
        sections_str = ", ".join([s.section for s in fir.sections_applied[:3]])
        return (
            f"FIR filed by {fir.complainant.name} regarding "
            f"{fir.incident.description[:100]}... "
            f"Applicable sections: {sections_str}. "
            f"Priority: {fir.priority}."
        )
    
    def create_fir(self, request: FIRCreateRequest) -> FIRData:
        """Create a new FIR with AI-powered section detection"""
        # Generate FIR number
        fir_number = self.generate_fir_number(
            request.incident.police_station,
            request.incident.district
        )
        
        # Detect BNS sections
        sections = self.detect_bns_sections(request.incident.description)
        
        # Classify priority
        priority = self.classify_priority(sections, request.incident.description)
        
        # Create FIR data
        fir = FIRData(
            fir_number=fir_number,
            police_station=request.incident.police_station,
            district=request.incident.district,
            date_filed=datetime.now(),
            complainant=request.complainant,
            incident=request.incident,
            sections_applied=sections,
            status=FIRStatus.DRAFT,
            priority=priority,
            ai_summary="",
            follow_up_actions=[]
        )
        
        # Generate summary
        fir.ai_summary = self.generate_ai_summary(fir)
        
        # Store FIR
        self._firs[fir_number] = fir
        
        logger.info(f"FIR created: {fir_number} with {len(sections)} sections detected")
        
        return fir
    
    def get_fir(self, fir_number: str) -> Optional[FIRData]:
        """Retrieve FIR by number"""
        return self._firs.get(fir_number)
    
    def update_fir(self, fir_number: str, updates: FIRUpdateRequest) -> Optional[FIRData]:
        """Update FIR details"""
        fir = self._firs.get(fir_number)
        if not fir:
            return None
        
        if updates.investigating_officer:
            fir.investigating_officer = updates.investigating_officer
        
        if updates.status:
            fir.status = updates.status
        
        if updates.follow_up_actions:
            fir.follow_up_actions.extend(updates.follow_up_actions)
        
        fir.follow_up_actions.append(f"Updated at {datetime.now().isoformat()}")
        
        return fir
    
    def list_firs(
        self,
        police_station: Optional[str] = None,
        status: Optional[FIRStatus] = None,
        priority: Optional[str] = None,
        limit: int = 100
    ) -> List[FIRData]:
        """List FIRs with optional filtering"""
        firs = list(self._firs.values())
        
        if police_station:
            firs = [f for f in firs if f.police_station == police_station]
        
        if status:
            firs = [f for f in firs if f.status == status]
        
        if priority:
            firs = [f for f in firs if f.priority == priority]
        
        # Sort by date (newest first)
        firs.sort(key=lambda x: x.date_filed, reverse=True)
        
        return firs[:limit]
    
    def speech_to_text(self, audio_data: bytes) -> str:
        """
        Convert speech to text for FIR narration.
        Mock implementation - replace with actual ASR service.
        """
        # TODO: Integrate with Google Speech-to-Text or similar
        logger.info("Speech-to-text conversion requested")
        return "Speech transcription would appear here after ASR processing."
    
    def get_section_details(self, section_code: str) -> Optional[Dict]:
        """Get details about a specific BNS section"""
        # Mock implementation
        sections_db = {
            "BNS 103": {
                "title": "Murder",
                "description": "Whoever commits murder shall be punished with death, or imprisonment for life...",
                "punishment": "Death or imprisonment for life, and fine",
                "bailable": False,
                "cognizable": True
            },
            "BNS 303": {
                "title": "Theft",
                "description": "Whoever, intending to take dishonestly any movable property...",
                "punishment": "Imprisonment up to 3 years, or fine, or both",
                "bailable": True,
                "cognizable": True
            }
        }
        return sections_db.get(section_code)


# Singleton instance
smart_fir_service = SmartFIRService()
```

**File 2:** `backend/app/api/v1/police/fir.py`
```python
"""
Smart FIR API Endpoints - Skill 01
"""
from fastapi import APIRouter, HTTPException, Query, status
from typing import List, Optional
from app.services.smart_fir_service import (
    smart_fir_service, FIRCreateRequest, FIRUpdateRequest,
    FIRData, FIRStatus
)

router = APIRouter(prefix="/fir", tags=["Smart FIR"])


@router.post("/", response_model=FIRData, status_code=status.HTTP_201_CREATED)
async def create_fir(request: FIRCreateRequest):
    """
    Create a new FIR with AI-powered section detection.
    
    Automatically detects applicable BNS sections from incident description.
    """
    try:
        fir = smart_fir_service.create_fir(request)
        return fir
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create FIR: {str(e)}"
        )


@router.get("/{fir_number}", response_model=FIRData)
async def get_fir(fir_number: str):
    """Get FIR details by FIR number"""
    fir = smart_fir_service.get_fir(fir_number)
    if not fir:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"FIR {fir_number} not found"
        )
    return fir


@router.put("/{fir_number}", response_model=FIRData)
async def update_fir(fir_number: str, updates: FIRUpdateRequest):
    """Update FIR details"""
    fir = smart_fir_service.update_fir(fir_number, updates)
    if not fir:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"FIR {fir_number} not found"
        )
    return fir


@router.get("/", response_model=List[FIRData])
async def list_firs(
    police_station: Optional[str] = Query(None, description="Filter by police station"),
    status: Optional[FIRStatus] = Query(None, description="Filter by status"),
    priority: Optional[str] = Query(None, description="Filter by priority"),
    limit: int = Query(100, ge=1, le=1000)
):
    """List FIRs with optional filtering"""
    return smart_fir_service.list_firs(
        police_station=police_station,
        status=status,
        priority=priority,
        limit=limit
    )


@router.post("/{fir_number}/submit")
async def submit_fir(fir_number: str):
    """Submit FIR for registration"""
    fir = smart_fir_service.update_fir(
        fir_number,
        FIRUpdateRequest(status=FIRStatus.SUBMITTED)
    )
    if not fir:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"FIR {fir_number} not found"
        )
    return {"message": "FIR submitted successfully", "fir_number": fir_number}


@router.get("/sections/{section_code}")
async def get_section_details(section_code: str):
    """Get details about a specific BNS section"""
    details = smart_fir_service.get_section_details(section_code)
    if not details:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Section {section_code} not found"
        )
    return details


@router.post("/speech-to-text")
async def speech_to_text():
    """Convert speech to text for FIR narration"""
    # TODO: Implement audio file upload and processing
    return {"message": "Speech-to-text endpoint - implement audio upload"}
```

### Frontend Implementation

**File 3:** `nyayasahayak-main-main/src/core/types/fir.types.ts`
```typescript
// FIR Types - Skill 01

export type FIRStatus = 'draft' | 'submitted' | 'under_review' | 'registered' | 'rejected';
export type Gender = 'male' | 'female' | 'other';
export type IDType = 'aadhaar' | 'pan' | 'passport' | 'voter_id';
export type Priority = 'urgent' | 'high' | 'normal' | 'low';

export interface Complainant {
  name: string;
  age: number;
  gender: Gender;
  address: string;
  phone: string;
  email?: string;
  idType: IDType;
  idNumber: string;
  occupation?: string;
}

export interface IncidentDetails {
  dateOfIncident: string;
  timeOfIncident?: string;
  placeOfIncident: string;
  district: string;
  policeStation: string;
  description: string;
  injuryDetails?: string;
  propertyDamage?: string;
  witnesses: string[];
  evidencePhotos: string[];
}

export interface BNSection {
  section: string;
  title: string;
  description: string;
  confidence: number;
  ipcEquivalent?: string;
}

export interface FIRData {
  firNumber: string;
  policeStation: string;
  district: string;
  dateFiled: string;
  complainant: Complainant;
  incident: IncidentDetails;
  sectionsApplied: BNSection[];
  status: FIRStatus;
  investigatingOfficer?: string;
  priority: Priority;
  aiSummary?: string;
  followUpActions: string[];
}

export interface FIRCreateRequest {
  complainant: Complainant;
  incident: IncidentDetails;
  priority?: Priority;
}

export interface FIRUpdateRequest {
  investigatingOfficer?: string;
  status?: FIRStatus;
  followUpActions?: string[];
  notes?: string;
}
```

**File 4:** `nyayasahayak-main-main/src/core/services/firService.ts`
```typescript
import api from './api';
import { FIRData, FIRCreateRequest, FIRUpdateRequest, FIRStatus } from '../types/fir.types';

export const firService = {
  createFIR: async (data: FIRCreateRequest): Promise<FIRData> => {
    const response = await api.post('/police/fir/', data);
    return response.data;
  },

  getFIR: async (firNumber: string): Promise<FIRData> => {
    const response = await api.get(`/police/fir/${firNumber}`);
    return response.data;
  },

  updateFIR: async (firNumber: string, data: FIRUpdateRequest): Promise<FIRData> => {
    const response = await api.put(`/police/fir/${firNumber}`, data);
    return response.data;
  },

  listFIRs: async (params?: {
    policeStation?: string;
    status?: FIRStatus;
    priority?: string;
    limit?: number;
  }): Promise<FIRData[]> => {
    const response = await api.get('/police/fir/', { params });
    return response.data;
  },

  submitFIR: async (firNumber: string): Promise<void> => {
    await api.post(`/police/fir/${firNumber}/submit`);
  },

  getSectionDetails: async (sectionCode: string) => {
    const response = await api.get(`/police/fir/sections/${sectionCode}`);
    return response.data;
  }
};
```

**File 5:** `nyayasahayak-main-main/src/personas/police/pages/SmartFIR.tsx`
```tsx
/**
 * Smart FIR Component - Skill 01
 * AI-powered FIR generation with automatic BNS section mapping
 */
import React, { useState, useCallback } from 'react';
import { 
  FileText, 
  Mic, 
  Shield, 
  AlertCircle, 
  CheckCircle,
  User,
  MapPin,
  Calendar,
  Clock
} from 'lucide-react';
import { firService } from '../../../core/services/firService';
import { FIRData, FIRCreateRequest, Complainant, IncidentDetails } from '../../../core/types/fir.types';

const SmartFIR: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [createdFIR, setCreatedFIR] = useState<FIRData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [complainant, setComplainant] = useState<Complainant>({
    name: '',
    age: 0,
    gender: 'male',
    address: '',
    phone: '',
    idType: 'aadhaar',
    idNumber: ''
  });

  const [incident, setIncident] = useState<IncidentDetails>({
    dateOfIncident: new Date().toISOString().split('T')[0],
    placeOfIncident: '',
    district: '',
    policeStation: '',
    description: '',
    witnesses: [],
    evidencePhotos: []
  });

  const handleCreateFIR = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const request: FIRCreateRequest = {
        complainant,
        incident,
        priority: 'normal'
      };
      
      const fir = await firService.createFIR(request);
      setCreatedFIR(fir);
      setStep(4);
    } catch (err: any) {
      setError(err.message || 'Failed to create FIR');
    } finally {
      setLoading(false);
    }
  }, [complainant, incident]);

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold flex items-center gap-2">
        <User className="w-5 h-5 text-blue-400" />
        Complainant Details
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1">Full Name *</label>
          <input
            type="text"
            value={complainant.name}
            onChange={(e) => setComplainant({...complainant, name: e.target.value})}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white"
            placeholder="Enter full name"
          />
        </div>
        
        <div>
          <label className="block text-sm text-slate-400 mb-1">Age *</label>
          <input
            type="number"
            value={complainant.age || ''}
            onChange={(e) => setComplainant({...complainant, age: parseInt(e.target.value) || 0})}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-1">Gender *</label>
        <select
          value={complainant.gender}
          onChange={(e) => setComplainant({...complainant, gender: e.target.value as any})}
          className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white"
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-1">Address *</label>
        <textarea
          value={complainant.address}
          onChange={(e) => setComplainant({...complainant, address: e.target.value})}
          className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white h-20"
          placeholder="Full address with PIN code"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1">Phone Number *</label>
          <input
            type="tel"
            value={complainant.phone}
            onChange={(e) => setComplainant({...complainant, phone: e.target.value})}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white"
            placeholder="10 digit mobile number"
            maxLength={10}
          />
        </div>
        
        <div>
          <label className="block text-sm text-slate-400 mb-1">Email</label>
          <input
            type="email"
            value={complainant.email || ''}
            onChange={(e) => setComplainant({...complainant, email: e.target.value})}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white"
            placeholder="Optional"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1">ID Type *</label>
          <select
            value={complainant.idType}
            onChange={(e) => setComplainant({...complainant, idType: e.target.value as any})}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white"
          >
            <option value="aadhaar">Aadhaar</option>
            <option value="pan">PAN Card</option>
            <option value="passport">Passport</option>
            <option value="voter_id">Voter ID</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm text-slate-400 mb-1">ID Number *</label>
          <input
            type="text"
            value={complainant.idNumber}
            onChange={(e) => setComplainant({...complainant, idNumber: e.target.value})}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white"
          />
        </div>
      </div>

      <button
        onClick={() => setStep(2)}
        disabled={!complainant.name || !complainant.phone || !complainant.address}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-bold transition-all"
      >
        Next: Incident Details →
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold flex items-center gap-2">
        <MapPin className="w-5 h-5 text-red-400" />
        Incident Details
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1">Date of Incident *</label>
          <input
            type="date"
            value={incident.dateOfIncident}
            onChange={(e) => setIncident({...incident, dateOfIncident: e.target.value})}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm text-slate-400 mb-1">Time of Incident</label>
          <input
            type="time"
            value={incident.timeOfIncident || ''}
            onChange={(e) => setIncident({...incident, timeOfIncident: e.target.value})}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1">District *</label>
          <input
            type="text"
            value={incident.district}
            onChange={(e) => setIncident({...incident, district: e.target.value})}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm text-slate-400 mb-1">Police Station *</label>
          <input
            type="text"
            value={incident.policeStation}
            onChange={(e) => setIncident({...incident, policeStation: e.target.value})}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-1">Place of Incident *</label>
        <input
          type="text"
          value={incident.placeOfIncident}
          onChange={(e) => setIncident({...incident, placeOfIncident: e.target.value})}
          className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white"
          placeholder="Exact location where incident occurred"
        />
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-1">Incident Description *</label>
        <div className="relative">
          <textarea
            value={incident.description}
            onChange={(e) => setIncident({...incident, description: e.target.value})}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white h-40"
            placeholder="Describe the incident in detail. Include what happened, who was involved, and any sequence of events. AI will automatically detect applicable BNS sections."
          />
          <button className="absolute bottom-2 right-2 bg-slate-700 p-2 rounded-lg hover:bg-slate-600" title="Voice Input">
            <Mic className="w-4 h-4 text-slate-400" />
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Minimum 50 characters. AI will analyze and suggest applicable BNS sections.
        </p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setStep(1)}
          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg font-bold transition-all"
        >
          ← Back
        </button>
        
        <button
          onClick={() => setStep(3)}
          disabled={!incident.description || incident.description.length < 50 || !incident.placeOfIncident}
          className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-bold transition-all"
        >
          Next: Review →
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold flex items-center gap-2">
        <Shield className="w-5 h-5 text-emerald-400" />
        Review & Submit
      </h3>

      <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
        <h4 className="font-semibold mb-3">Complainant Information</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-slate-500">Name:</span> {complainant.name}</div>
          <div><span className="text-slate-500">Age:</span> {complainant.age}</div>
          <div><span className="text-slate-500">Phone:</span> {complainant.phone}</div>
          <div><span className="text-slate-500">ID:</span> {complainant.idType.toUpperCase()} - {complainant.idNumber}</div>
        </div>
      </div>

      <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
        <h4 className="font-semibold mb-3">Incident Details</h4>
        <div className="space-y-2 text-sm">
          <div><span className="text-slate-500">Date:</span> {incident.dateOfIncident}</div>
          <div><span className="text-slate-500">Location:</span> {incident.placeOfIncident}, {incident.district}</div>
          <div><span className="text-slate-500">Police Station:</span> {incident.policeStation}</div>
          <div className="mt-3">
            <span className="text-slate-500">Description:</span>
            <p className="mt-1 text-slate-300">{incident.description.substring(0, 200)}...</p>
          </div>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="w-5 h-5 text-blue-400" />
          <span className="font-semibold text-blue-400">AI Processing</span>
        </div>
        <p className="text-sm text-slate-400">
          Upon submission, AI will automatically detect applicable BNS sections from the incident description 
          and classify the priority based on severity.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={() => setStep(2)}
          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg font-bold transition-all"
        >
          ← Back
        </button>
        
        <button
          onClick={handleCreateFIR}
          disabled={loading}
          className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <FileText className="w-5 h-5" />
              Generate FIR
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => {
    if (!createdFIR) return null;

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-2xl font-bold text-emerald-400">FIR Generated Successfully!</h3>
          <p className="text-slate-400 mt-2">FIR Number: <span className="font-mono text-white">{createdFIR.firNumber}</span></p>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <h4 className="font-semibold mb-3">AI-Detected BNS Sections</h4>
          <div className="space-y-2">
            {createdFIR.sectionsApplied.map((section, index) => (
              <div key={index} className="flex items-center justify-between bg-slate-900/50 p-3 rounded-lg">
                <div>
                  <span className="font-bold text-blue-400">{section.section}</span>
                  <span className="text-slate-300 ml-2">{section.title}</span>
                  {section.ipcEquivalent && (
                    <span className="text-slate-500 ml-2">(formerly {section.ipcEquivalent})</span>
                  )}
                </div>
                <span className={`text-sm px-2 py-1 rounded ${
                  section.confidence > 0.8 ? 'bg-emerald-500/20 text-emerald-400' :
                  section.confidence > 0.5 ? 'bg-amber-500/20 text-amber-400' :
                  'bg-slate-500/20 text-slate-400'
                }`}>
                  {(section.confidence * 100).toFixed(0)}% match
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-center">
            <div className={`text-2xl font-bold capitalize ${
              createdFIR.priority === 'urgent' ? 'text-red-400' :
              createdFIR.priority === 'high' ? 'text-amber-400' :
              'text-blue-400'
            }`}>
              {createdFIR.priority}
            </div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Priority</div>
          </div>
          
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-center">
            <div className="text-2xl font-bold text-white capitalize">
              {createdFIR.status.replace('_', ' ')}
            </div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Status</div>
          </div>
          
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-center">
            <div className="text-2xl font-bold text-white">
              {new Date(createdFIR.dateFiled).toLocaleDateString()}
            </div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Date Filed</div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <h4 className="font-semibold mb-2">AI Summary</h4>
          <p className="text-slate-300 text-sm">{createdFIR.aiSummary}</p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => {
              setStep(1);
              setCreatedFIR(null);
              setError(null);
            }}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg font-bold transition-all"
          >
            File Another FIR
          </button>
          
          <button
            onClick={() => {/* Download PDF */}}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-lg font-bold transition-all"
          >
            Download FIR PDF
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 min-h-screen bg-slate-900 text-white">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-blue-400" />
            Smart FIR Generator
          </h1>
          <p className="text-slate-400">
            AI-powered First Information Report with automatic BNS section mapping
          </p>
        </header>

        {/* Progress Steps */}
        <div className="flex items-center mb-8">
          {[
            { num: 1, label: 'Complainant' },
            { num: 2, label: 'Incident' },
            { num: 3, label: 'Review' },
            { num: 4, label: 'Complete' }
          ].map((s, index) => (
            <React.Fragment key={s.num}>
              <div className={`flex items-center gap-2 ${step >= s.num ? 'text-blue-400' : 'text-slate-600'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  step >= s.num ? 'bg-blue-500/20 border border-blue-500/50' : 'bg-slate-800 border border-slate-700'
                }`}>
                  {step > s.num ? <CheckCircle className="w-5 h-5" /> : s.num}
                </div>
                <span className="text-sm hidden sm:block">{s.label}</span>
              </div>
              {index < 3 && (
                <div className={`flex-1 h-0.5 mx-2 ${step > s.num ? 'bg-blue-500/50' : 'bg-slate-800'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 p-6">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </div>
      </div>
    </div>
  );
};

export default SmartFIR;
```

---

## ⏱️ TIME ESTIMATES

| Skill | Backend | Frontend | Testing | Total |
|-------|---------|----------|---------|-------|
| **01: Smart-FIR** | 2h | 2h | 30m | **4.5h** |
| **02: Financial Analyzer** | 2h | 2h | 30m | **4.5h** |
| **08: Forensic Interlock** | 1.5h | 1.5h | 15m | **3h** |
| **09: Evidence Hasher** | 1.5h | 1.5h | 15m | **3h** |
| **TOTAL** | **7h** | **7h** | **1.5h** | **15h** |

**Realistic Estimate:** 8-10 hours (with breaks, reviews)

---

## ✅ COMPLETION CHECKLIST

### Backend
- [ ] `smart_fir_service.py` — Service with AI section detection
- [ ] `financial_service.py` — Transaction analysis
- [ ] `forensic_service.py` — Chain of custody
- [ ] `evidence_hash_service.py` — Blockchain hashing
- [ ] API routers for all 4 skills
- [ ] Pydantic schemas with validation
- [ ] Error handling implemented
- [ ] Unit tests (3+ per skill)

### Frontend
- [ ] TypeScript types for all 4 skills
- [ ] Service files with API calls
- [ ] `SmartFIR.tsx` — Multi-step form with AI
- [ ] `FinancialAnalyzer.tsx` — Transaction visualization
- [ ] `ForensicInterlock.tsx` — Chain timeline
- [ ] `EvidenceHasher.tsx` — Hash verification UI
- [ ] Loading states & error handling
- [ ] Responsive design (Tailwind)

### Documentation
- [ ] Each skill documented with examples
- [ ] API endpoints listed
- [ ] Usage instructions

---

## 🚀 DELIVERY

**When Complete:**
1. All files committed to git
2. Code reviewed by senior dev
3. Tests passing
4. Integration verified
5. Documentation complete

**Report to Coordinator:**
- ✅ Skills 01, 02, 08, 09 complete
- ✅ 16 files created (4 skills × 4 files each)
- ✅ All tests passing
- ✅ Ready for integration

---

**AGENT 1: YOU ARE CLEARED TO BEGIN!** 🚀

**Start with Skill 01: Smart-FIR (most critical)**

Good luck! Build with extreme precision! ⚖️
