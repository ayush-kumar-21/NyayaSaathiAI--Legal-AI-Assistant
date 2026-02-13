# SWARM AGENT 2 — POLICE TOOLS
## Implementation Package: Skills 03, 04, 05, 06

**Agent ID:** AGENT-2  
**Assignment:** Police Persona — Core Tools  
**Skills:** 4 skills | **Time Estimate:** 8-10 hours  
**Priority:** HIGH  
**Coordinator:** Antigravity  

---

## 🎯 YOUR MISSION

Implement **4 essential police investigation tools** that support case management and evidence handling.

**Skills to Implement:**
1. **Skill 03: Evidence Locker** — Digital evidence storage with chain of custody
2. **Skill 04: Case Linker** — Pattern matching to link related cases
3. **Skill 05: Charge Sheet Builder** — Automated charge sheet generation
4. **Skill 06: Witness Protection** — Witness safety and management system

---

## 📋 DELIVERABLES

### Per Skill (4 files each)
```
backend/app/services/{skill_name}_service.py      (100-200 lines)
backend/app/api/v1/police/{skill_name}.py         (50-100 lines)  
backend/app/schemas/{skill_name}.py               (50-100 lines)

nyayasahayak-main-main/src/core/types/{skillName}.ts     (50-100 lines)
nyayasahayak-main-main/src/core/services/{skillName}Service.ts  (50-100 lines)
nyayasahayak-main-main/src/personas/police/pages/{SkillName}.tsx (200-400 lines)
```

**Total: 24 files | ~3,000 lines of code**

---

## SKILL 03: EVIDENCE LOCKER

### Overview
Secure digital evidence storage with blockchain-based chain of custody tracking.

### Key Features
- Upload and store evidence files
- Automatic hash generation (SHA-256)
- Chain of custody tracking
- Evidence tagging and categorization
- Tamper detection

### Backend Service
```python
class EvidenceLockerService:
    def upload_evidence(self, case_id: str, file: bytes, metadata: dict) -> EvidenceItem:
        # Generate SHA-256 hash
        # Store with metadata
        # Update chain of custody
        pass
    
    def verify_integrity(self, evidence_id: str) -> bool:
        # Verify hash matches
        # Check for tampering
        pass
```

### Frontend Component
Multi-tab interface:
- **Upload Tab:** Drag & drop file upload
- **Gallery Tab:** Evidence browser with thumbnails
- **Chain Tab:** Custody timeline visualization
- **Verify Tab:** Integrity checker

---

## SKILL 04: CASE LINKER

### Overview
AI-powered pattern matching to identify and link related cases across the system.

### Key Features
- Pattern matching on case descriptions
- Similar suspect/victim names
- Location proximity analysis
- Time correlation detection
- Network visualization of linked cases

### Backend Service
```python
class CaseLinkerService:
    def find_related_cases(self, case_id: str) -> List[CaseLink]:
        # NLP analysis of descriptions
        # Entity matching
        # Geographic proximity
        pass
    
    def calculate_similarity(self, case1: Case, case2: Case) -> float:
        # Text similarity (cosine/Jaccard)
        # Entity overlap score
        # Return 0.0-1.0 similarity
        pass
```

### Frontend Component
- Case search input
- Similarity score display
- Network graph visualization
- Link strength indicators
- One-click case comparison

---

## SKILL 05: CHARGE SHEET BUILDER

### Overview
Automated charge sheet generation from FIR and investigation data.

### Key Features
- Auto-populate from FIR data
- BNS section suggestions
- Accused management
- Witness list generation
- Evidence summary
- Document export (PDF)

### Backend Service
```python
class ChargeSheetService:
    def generate_charge_sheet(self, fir_id: str) -> ChargeSheet:
        # Fetch FIR data
        # Get evidence list
        # Apply BNS sections
        # Generate formal document
        pass
    
    def export_pdf(self, charge_sheet_id: str) -> bytes:
        # Generate PDF
        # Add digital signature placeholder
        pass
```

### Frontend Component
- Step wizard (5 steps)
- Accused management table
- Section selector with descriptions
- Preview mode
- PDF export button
- Digital signature integration

---

## SKILL 06: WITNESS PROTECTION

### Overview
Manage witness safety, anonymity, and contact information securely.

### Key Features
- Anonymous witness IDs
- Threat level assessment
- Protection measures tracking
- Contact schedule management
- Identity redaction

### Backend Service
```python
class WitnessProtectionService:
    def register_witness(self, case_id: str, witness_data: dict) -> ProtectedWitness:
        # Generate anonymous ID (W-XXXXX)
        # Encrypt personal details
        # Assess threat level
        pass
    
    def update_protection_level(self, witness_id: str, level: str) -> None:
        # Update security measures
        # Log changes
        pass
```

### Frontend Component
- Witness registration form
- Anonymous ID display
- Threat level selector
- Protection measures checklist
- Contact schedule calendar
- Redaction preview

---

## ⏱️ TIME BREAKDOWN

| Skill | Backend | Frontend | Testing | Total |
|-------|---------|----------|---------|-------|
| 03: Evidence Locker | 2h | 2h | 30m | 4.5h |
| 04: Case Linker | 1.5h | 1.5h | 15m | 3h |
| 05: Charge Sheet | 2h | 2h | 30m | 4.5h |
| 06: Witness Protection | 1.5h | 1.5h | 15m | 3h |
| **TOTAL** | **7h** | **7h** | **1.5h** | **15h** |

**Realistic:** 8-10 hours

---

## 📁 FILE RESERVATIONS

**Reserve these files before starting:**

### Backend
```
backend/app/services/evidence_service.py
backend/app/services/case_linker_service.py
backend/app/services/chargesheet_service.py
backend/app/services/witness_service.py

backend/app/api/v1/police/evidence.py
backend/app/api/v1/police/case_linker.py
backend/app/api/v1/police/chargesheet.py
backend/app/api/v1/police/witness.py

backend/app/schemas/evidence.py
backend/app/schemas/case_linker.py
backend/app/schemas/chargesheet.py
backend/app/schemas/witness.py
```

### Frontend
```
nyayasahayak-main-main/src/core/types/evidence.types.ts
nyayasahayak-main-main/src/core/types/caseLinker.types.ts
nyayasahayak-main-main/src/core/types/chargesheet.types.ts
nyayasahayak-main-main/src/core/types/witness.types.ts

nyayasahayak-main-main/src/core/services/evidenceService.ts
nyayasahayak-main-main/src/core/services/caseLinkerService.ts
nyayasahayak-main-main/src/core/services/chargesheetService.ts
nyayasahayayak-main-main/src/core/services/witnessService.ts

nyayasahayak-main-main/src/personas/police/pages/EvidenceLocker.tsx
nyayasahayak-main-main/src/personas/police/pages/CaseLinker.tsx
nyayasahayak-main-main/src/personas/police/pages/ChargeSheetBuilder.tsx
nyayasahayak-main-main/src/personas/police/pages/WitnessProtection.tsx
```

---

## ✅ COMPLETION CHECKLIST

### Backend
- [ ] EvidenceLockerService with hash generation
- [ ] CaseLinkerService with similarity algorithm
- [ ] ChargeSheetService with PDF export
- [ ] WitnessProtectionService with encryption
- [ ] All API endpoints with error handling
- [ ] All Pydantic schemas with validation
- [ ] Unit tests (3+ per skill)

### Frontend
- [ ] EvidenceLocker: Upload, gallery, chain, verify tabs
- [ ] CaseLinker: Search, similarity scores, network graph
- [ ] ChargeSheetBuilder: 5-step wizard, PDF export
- [ ] WitnessProtection: Registration, threat levels, schedule
- [ ] All with loading states & error handling
- [ ] Responsive design (Tailwind)

### Integration
- [ ] Router registration in main.py
- [ ] Service exports in __init__.py
- [ ] Frontend routes added
- [ ] Navigation menu updated

---

## 🚀 START ORDER

1. **Skill 03: Evidence Locker** (2.5h) — Most complex
2. **Skill 05: Charge Sheet** (2.5h) — High priority
3. **Skill 04: Case Linker** (1.5h) — Medium complexity
4. **Skill 06: Witness Protection** (1.5h) — Straightforward

---

**AGENT 2: YOU ARE CLEARED TO BEGIN!** 🚀

**Start with Skill 03: Evidence Locker**

Build with precision! The police need these tools! 👮‍♂️⚖️
