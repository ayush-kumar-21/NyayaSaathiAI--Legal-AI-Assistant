# SWARM AGENT 6 — CITIZEN TOOLS
## Implementation Package: Skills 21, 22, 23, 24

**Agent ID:** AGENT-6  
**Assignment:** Citizen Persona — Public Services  
**Skills:** 4 skills | **Time Estimate:** 8-10 hours  
**Priority:** MEDIUM  
**Coordinator:** Antigravity  

---

## 🎯 YOUR MISSION

Implement **4 citizen-facing services** for public access to legal system.

**Skills to Implement:**
1. **Skill 21: NyayaBot (Legal AI)** — Chatbot for legal queries
2. **Skill 22: e-Filing Pro** — Online case filing system
3. **Skill 23: Case Status Predictor** — AI prediction of case outcomes
4. **Skill 24: Legal Aid Connector** — Connect to free legal services

---

## 📋 SKILL 21: NYAYABOT (LEGAL AI)

### Overview
AI-powered chatbot for legal queries, document help, and procedural guidance.

### Key Features
- Natural language legal queries
- Document template suggestions
- Court procedure guidance
- BNS/IPC section lookup
- Multilingual support
- Voice input/output

### Backend Service Structure
```python
class NyayaBotService:
    def process_query(self, query: str, language: str = "en") -> BotResponse:
        """Process legal query and generate response"""
        # Intent classification
        # Entity extraction
        # Knowledge base lookup
        # Generate response
        pass
    
    def find_template(self, query: str) -> Optional[DocumentTemplate]:
        """Suggest document template based on query"""
        pass
    
    def lookup_section(self, section_code: str) -> Optional[SectionInfo]:
        """Look up BNS/IPC section details"""
        pass
    
    def get_procedure(self, procedure_type: str) -> ProcedureGuide:
        """Get step-by-step court procedure"""
        pass
    
    def text_to_speech(self, text: str, language: str) -> bytes:
        """Convert response to speech"""
        pass
```

### Frontend Component
- **Chat Interface:** WhatsApp-style chat
- **Quick Replies:** Common questions
- **Document Suggestions:** Template recommendations
- **Voice Input:** Mic button
- **History:** Previous conversations

---

## 📋 SKILL 22: E-FILING PRO

### Overview
Complete online case filing system for citizens.

### Key Features
- Online petition filing
- Document upload
- Fee payment integration
- Case tracking
- Digital signatures
- Status notifications

### Backend Service Structure
```python
class EFilingService:
    def create_filing(self, petition_data: dict) -> Filing:
        """Create new case filing"""
        pass
    
    def upload_document(self, filing_id: str, document: bytes, metadata: dict) -> Document:
        """Upload supporting document"""
        pass
    
    def calculate_fees(self, filing_type: str, value: float) -> FeeBreakdown:
        """Calculate court fees"""
        pass
    
    def process_payment(self, filing_id: str, payment_data: dict) -> Payment:
        """Process fee payment"""
        pass
    
    def track_status(self, filing_id: str) -> FilingStatus:
        """Track filing status"""
        pass
```

### Frontend Component
- **Filing Wizard:** Step-by-step process
- **Document Upload:** Drag & drop
- **Fee Calculator:** Real-time calculation
- **Payment Gateway:** Secure payment
- **Status Tracker:** Timeline view
- **Dashboard:** All filings overview

---

## 📋 SKILL 23: CASE STATUS PREDICTOR

### Overview
AI prediction of case outcomes, timelines, and success probabilities.

### Key Features
- Win/loss prediction
- Timeline estimation
- Settlement likelihood
- Appeal success rate
- Cost estimation
- Lawyer performance metrics

### ML Model (Mock)
```python
prediction_factors = {
    'case_type': 0.25,
    'judge_history': 0.20,
    'evidence_strength': 0.20,
    'lawyer_experience': 0.15,
    'similar_cases': 0.20
}
```

### Backend Service Structure
```python
class CasePredictorService:
    def predict_outcome(self, case_details: dict) -> OutcomePrediction:
        """Predict case outcome probability"""
        pass
    
    def estimate_timeline(self, case_type: str, court_id: str) -> TimelineEstimate:
        """Estimate case resolution timeline"""
        pass
    
    def calculate_settlement_chance(self, case_id: str) -> float:
        """Calculate settlement likelihood (0-1)"""
        pass
    
    def estimate_costs(self, case_details: dict) -> CostEstimate:
        """Estimate total legal costs"""
        pass
    
    def analyze_similar_cases(self, case_details: dict) -> List[CaseAnalysis]:
        """Find and analyze similar cases"""
        pass
```

### Frontend Component
- **Case Input:** Enter case details
- **Prediction Display:** Probability meters
- **Timeline View:** Expected dates
- **Cost Breakdown:** Estimated expenses
- **Similar Cases:** Precedent analysis
- **Recommendation:** Suggested actions

---

## 📋 SKILL 24: LEGAL AID CONNECTOR

### Overview
Connect underprivileged citizens with free legal aid services.

### Key Features
- Eligibility checker
- Legal aid provider directory
- Appointment booking
- Document assistance
- Pro bono lawyer matching
- Support services referral

### Backend Service Structure
```python
class LegalAidService:
    def check_eligibility(self, user_details: dict) -> EligibilityResult:
        """Check if user qualifies for legal aid"""
        pass
    
    def find_providers(self, location: str, case_type: str) -> List[LegalAidProvider]:
        """Find legal aid providers"""
        pass
    
    def book_appointment(self, provider_id: str, user_id: str, slot: datetime) -> Appointment:
        """Book appointment with legal aid"""
        pass
    
    def match_pro_bono(self, case_details: dict) -> Optional[Lawyer]:
        """Match with pro bono lawyer"""
        pass
    
    def get_support_services(self, location: str) -> List[SupportService]:
        """Get additional support services"""
        pass
```

### Frontend Component
- **Eligibility Quiz:** Simple questionnaire
- **Provider Map:** Geographic search
- **Booking Calendar:** Appointment scheduling
- **Application Form:** Legal aid request
- **Status Tracker:** Application status
- **Resources:** Self-help materials

---

## ⏱️ TIME BREAKDOWN

| Skill | Backend | Frontend | Testing | Total |
|-------|---------|----------|---------|-------|
| 21: NyayaBot | 2h | 2h | 30m | 4.5h |
| 22: e-Filing | 2h | 2h | 30m | 4.5h |
| 23: Case Predictor | 1.5h | 1.5h | 15m | 3h |
| 24: Legal Aid | 1.5h | 1.5h | 15m | 3h |
| **TOTAL** | **7h** | **7h** | **1.5h** | **15.5h** |

**Realistic:** 8-10 hours

---

## 📁 FILE RESERVATIONS

**Reserve these files:**

### Backend
```
backend/app/services/nyayabot_service.py
backend/app/services/efiling_service.py
backend/app/services/predictor_service.py
backend/app/services/legalaid_service.py

backend/app/api/v1/citizen/nyayabot.py
backend/app/api/v1/citizen/efiling.py
backend/app/api/v1/citizen/predictor.py
backend/app/api/v1/citizen/legalaid.py

backend/app/schemas/nyayabot.py
backend/app/schemas/efiling.py
backend/app/schemas/predictor.py
backend/app/schemas/legalaid.py
```

### Frontend
```
nyayasahayak-main-main/src/core/types/nyayabot.types.ts
nyayasahayak-main-main/src/core/types/efiling.types.ts
nyayasahayak-main-main/src/core/types/predictor.types.ts
nyayasahayak-main-main/src/core/types/legalaid.types.ts

nyayasahayak-main-main/src/core/services/nyayabotService.ts
nyayasahayak-main-main/src/core/services/efilingService.ts
nyayasahayak-main-main/src/core/services/predictorService.ts
nyayasahayak-main-main/src/core/services/legalaidService.ts

nyayasahayak-main-main/src/personas/citizen/pages/NyayaBot.tsx
nyayasahayak-main-main/src/personas/citizen/pages/EFiling.tsx
nyayasahayak-main-main/src/personas/citizen/pages/CasePredictor.tsx
nyayasahayak-main-main/src/personas/citizen/pages/LegalAid.tsx
```

---

## 🚀 START ORDER

1. **Skill 21: NyayaBot** (2.5h) — AI chat interface
2. **Skill 22: e-Filing** (2.5h) — Complex workflow
3. **Skill 23: Case Predictor** (1.5h) — Prediction UI
4. **Skill 24: Legal Aid** (1.5h) — Directory service

---

**AGENT 6: YOU ARE CLEARED TO BEGIN!** 🚀

**Start with Skill 21: NyayaBot**

Empower citizens with these tools! 👥⚖️
