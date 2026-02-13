# SWARM AGENT 4 — JUDGE CORE
## Implementation Package: Skills 12, 13, 14, 15

**Agent ID:** AGENT-4  
**Assignment:** Judge Persona — Core Tools  
**Skills:** 4 skills | **Time Estimate:** 8-10 hours  
**Priority:** CRITICAL — Parallel with Agent 1  
**Coordinator:** Antigravity  

---

## 🎯 YOUR MISSION

Implement the **4 foundational Judge skills** that are essential for judicial proceedings.

**Skills to Implement:**
1. **Skill 12: Bail Reckoner** — AI-powered bail calculation and recommendation
2. **Skill 13: Sentencing Assistant** — Sentencing guideline suggestions
3. **Skill 14: Bench Memo Generator** — Automated bench memo creation
4. **Skill 15: Virtual Moot Court** — Virtual courtroom simulation

---

## 📋 SKILL 12: BAIL RECKONER

### Overview
AI-powered bail risk assessment and amount recommendation based on case factors.

### Key Features
- Risk score calculation (0-100)
- Bail amount recommendation
- Flight risk assessment
- Case severity analysis
- Previous record check
- Surety requirements
- Conditional bail suggestions

### Risk Factors (Algorithm)
```python
risk_factors = {
    'offense_severity': 0-40 points,
    'flight_risk': 0-25 points,
    'criminal_history': 0-20 points,
    'community_ties': 0-15 points,
    'cooperation_level': 0-10 points
}
```

### Backend Service Structure
```python
class BailReckonerService:
    def calculate_risk_score(self, case_id: str, accused_id: str) -> RiskAssessment:
        """Calculate bail risk score (0-100)"""
        # Analyze case severity
        # Check criminal history
        # Assess flight risk
        # Evaluate community ties
        pass
    
    def recommend_bail_amount(self, risk_score: int, offense_type: str) -> float:
        """Suggest bail amount based on risk and offense"""
        pass
    
    def suggest_conditions(self, risk_score: int) -> List[str]:
        """Recommend bail conditions"""
        pass
```

### Frontend Component
- **Risk Calculator:** Input case details
- **Assessment Display:** Risk score visualization
- **Recommendation Panel:** Bail amount & conditions
- **History View:** Past bail decisions
- **Comparison Tool:** Compare with similar cases

---

## 📋 SKILL 13: SENTENCING ASSISTANT

### Overview
AI-powered sentencing recommendations based on legal guidelines and case precedents.

### Key Features
- Guideline range calculation
- Aggravating/mitigating factors
- Precedent case lookup
- Sentence prediction
- Rehabilitation recommendations
- Victim impact consideration

### Backend Service Structure
```python
class SentencingAssistantService:
    def get_guideline_range(self, offense: str, severity: str) -> Tuple[int, int]:
        """Get sentencing range in months"""
        pass
    
    def analyze_factors(self, case_id: str) -> SentencingFactors:
        """Identify aggravating/mitigating factors"""
        pass
    
    def recommend_sentence(self, case_id: str) -> SentenceRecommendation:
        """AI recommendation with reasoning"""
        pass
    
    def find_precedents(self, offense: str, similarity_threshold: float) -> List[Case]:
        """Find similar sentencing cases"""
        pass
```

### Frontend Component
- **Offense Selector:** Choose crime type
- **Factor Analysis:** Checklist of factors
- **Guideline Display:** Range visualization
- **Precedent Browser:** Similar cases
- **Recommendation Panel:** AI suggestion with reasoning

---

## 📋 SKILL 14: BENCH MEMO GENERATOR

### Overview
Automated generation of bench memos summarizing case facts, issues, and arguments.

### Key Features
- Case fact extraction
- Issue identification
- Argument summarization
- Evidence overview
- Legal points compilation
- Export to PDF/DOCX

### Backend Service Structure
```python
class BenchMemoService:
    def generate_memo(self, case_id: str) -> BenchMemo:
        """Auto-generate bench memo from case data"""
        # Extract facts from documents
        # Identify legal issues
        # Summarize arguments
        # Compile evidence list
        pass
    
    def extract_facts(self, documents: List[Document]) -> List[Fact]:
        """Extract material facts from case documents"""
        pass
    
    def identify_issues(self, arguments: List[Argument]) -> List[LegalIssue]:
        """Identify legal questions to be decided"""
        pass
    
    def export_memo(self, memo_id: str, format: str) -> bytes:
        """Export memo to PDF or DOCX"""
        pass
```

### Frontend Component
- **Case Selector:** Choose case to memo
- **Content Editor:** Review/edit sections
- **Preview Mode:** Memo preview
- **Export Options:** PDF/DOCX download
- **Template Manager:** Custom templates

---

## 📋 SKILL 15: VIRTUAL MOOT COURT

### Overview
Virtual courtroom simulation for training and practice proceedings.

### Key Features
- Virtual courtroom environment
- Role assignment (judge, advocate, witness)
- Case scenario library
- Recording and playback
- Performance evaluation
- Multi-participant support

### Backend Service Structure
```python
class VirtualMootCourtService:
    def create_session(self, case_scenario: str) -> MootSession:
        """Create virtual courtroom session"""
        pass
    
    def assign_role(self, session_id: str, user_id: str, role: str) -> None:
        """Assign participant role"""
        pass
    
    def start_proceeding(self, session_id: str) -> None:
        """Begin moot court proceeding"""
        pass
    
    def record_session(self, session_id: str) -> Recording:
        """Record the proceeding"""
        pass
    
    def evaluate_performance(self, session_id: str) -> EvaluationReport:
        """AI evaluation of participants"""
        pass
```

### Frontend Component
- **Courtroom View:** Virtual bench, bar, witness stand
- **Role Selection:** Choose/join as role
- **Scenario Library:** Select case scenarios
- **Live Session:** Real-time proceeding
- **Recording Player:** Playback with annotations
- **Evaluation Report:** Performance feedback

---

## ⏱️ TIME BREAKDOWN

| Skill | Backend | Frontend | Testing | Total |
|-------|---------|----------|---------|-------|
| 12: Bail Reckoner | 2h | 2h | 30m | 4.5h |
| 13: Sentencing Assistant | 2h | 2h | 30m | 4.5h |
| 14: Bench Memo | 1.5h | 1.5h | 15m | 3h |
| 15: Virtual Moot | 2h | 2h | 30m | 4.5h |
| **TOTAL** | **7.5h** | **7.5h** | **1.5h** | **16.5h** |

**Realistic:** 8-10 hours

---

## 📁 FILE RESERVATIONS

**Reserve these files:**

### Backend
```
backend/app/services/bail_reckoner.py
backend/app/services/sentencing_service.py
backend/app/services/bench_memo_service.py
backend/app/services/moot_court_service.py

backend/app/api/v1/judge/bail.py
backend/app/api/v1/judge/sentencing.py
backend/app/api/v1/judge/bench_memo.py
backend/app/api/v1/judge/moot_court.py

backend/app/schemas/bail.py
backend/app/schemas/sentencing.py
backend/app/schemas/bench_memo.py
backend/app/schemas/moot_court.py
```

### Frontend
```
nyayasahayak-main-main/src/core/types/bail.types.ts
nyayasahayak-main-main/src/core/types/sentencing.types.ts
nyayasahayak-main-main/src/core/types/benchMemo.types.ts
nyayasahayak-main-main/src/core/types/mootCourt.types.ts

nyayasahayak-main-main/src/core/services/bailReckonerService.ts
nyayasahayak-main-main/src/core/services/sentencingService.ts
nyayasahayak-main-main/src/core/services/benchMemoService.ts
nyayasahayak-main-main/src/core/services/mootCourtService.ts

nyayasahayak-main-main/src/personas/judge/pages/BailReckoner.tsx
nyayasahayak-main-main/src/personas/judge/pages/SentencingAssistant.tsx
nyayasahayak-main-main/src/personas/judge/pages/BenchMemoGenerator.tsx
nyayasahayak-main-main/src/personas/judge/pages/VirtualMootCourt.tsx
```

---

## 🚀 START ORDER

1. **Skill 12: Bail Reckoner** (2.5h) — Critical judicial tool
2. **Skill 13: Sentencing Assistant** (2.5h) — AI-powered recommendations
3. **Skill 15: Virtual Moot Court** (2.5h) — Complex UI
4. **Skill 14: Bench Memo** (1.5h) — Document generation

---

**AGENT 4: YOU ARE CLEARED TO BEGIN!** 🚀

**Start with Skill 12: Bail Reckoner**

Build these essential judicial tools! ⚖️👨‍⚖️
