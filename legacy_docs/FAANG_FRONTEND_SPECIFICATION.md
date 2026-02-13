# 🏆 LEGALOS 4.0 - FAANG-LEVEL FRONTEND SPECIFICATION

> **Senior Principal Engineer Standards** | **Production-Grade** | **All 24 Skills**

---

## 📊 PROJECT STRUCTURE ANALYSIS

### Current Architecture Found:
```
D:\Project\nationals\nyayasahayak-main-main\src\
├── core/
│   ├── services/
│   │   ├── api.ts                    ✅ API client
│   │   ├── listingService.ts         ✅ Skill 20 service
│   │   ├── registryService.ts        ✅ Skill 19 service
│   │   ├── policeService.ts          ✅ Skill 1 service
│   │   ├── evidenceService.ts        ✅ Skill 3 service
│   │   └── ...
│   └── types/
│       ├── listing.ts                ✅ Skill 20 types
│       ├── registry.ts               ✅ Skill 19 types
│       ├── fir.ts                    ✅ Skill 1 types
│       ├── evidence.ts               ✅ Skill 3 types
│       └── ...
├── features/
│   ├── police/
│   │   └── pages/
│   │       ├── CrimeScene3D.tsx      ✅ Advanced feature
│   │       └── WarrantManagerPage.tsx ✅ Skill 5
│   ├── judge/
│   │   └── pages/
│   │       ├── UrgencyMatrixPage.tsx ✅ Skill 9/12
│   │       └── VirtualCourtPage.tsx  ✅ Skill 14
│   ├── citizen/
│   │   └── hooks/
│   │       └── useCitizenTranslation.ts ✅ i18n
│   └── admin/
│       └── pages/
│           ├── SystemHealthPage.tsx  ✅ Skill 22
│           └── ResourceAllocatorPage.tsx ✅ Skill 23
├── shared/
│   ├── services/
│   │   ├── observabilityService.ts   ✅ Monitoring
│   │   └── documentAnalysis.ts       ✅ AI analysis
│   └── utils/
│       ├── mockApi.ts               ✅ Testing
│       └── legalCompliance.ts       ✅ Compliance
└── App.tsx                          ✅ Main router
```

---

## 🎯 FAANG ENGINEERING STANDARDS

### 1. **Google Standards**
- ✅ Material Design 3 principles
- ✅ Accessibility (WCAG 2.1 AA)
- ✅ Performance (Core Web Vitals)
- ✅ TypeScript strict mode

### 2. **Amazon Standards**
- ✅ Error handling (95% coverage)
- ✅ Observability (metrics, logs, traces)
- ✅ Multi-tenancy support
- ✅ Security (OWASP Top 10)

### 3. **Meta (Facebook) Standards**
- ✅ React best practices
- ✅ Component composition
- ✅ State management (Redux/Zustand)
- ✅ GraphQL ready

### 4. **Apple Standards**
- ✅ Human Interface Guidelines
- ✅ Privacy-first design
- ✅ Smooth animations (60fps)
- ✅ Dark mode support

### 5. **Netflix Standards**
- ✅ Chaos engineering ready
- ✅ Circuit breakers
- ✅ Fallback strategies
- ✅ A/B testing framework

---

## 👮 POLICE MODULE (Rakshak) - Skills 1-7

### SKILL 01: Smart-FIR Generator

#### **Page Component**: `SmartFIRPage.tsx`

**Route**: `/police/fir/generate`

**Layout Structure**:
```
┌─────────────────────────────────────────────────────────────┐
│ Header: Smart-FIR Generator (Skill 01)              [Help] │
├─────────────────────────────────────────────────────────────┤
│ Progress Bar: [Step 1] ---- [Step 2] ---- [Step 3]         │
├──────────────────────┬──────────────────────────────────────┤
│                      │                                      │
│ COMPLAINT INPUT      │ AI ANALYSIS PANEL                   │
│ ┌─────────────────┐  │ ┌────────────────────────────────┐  │
│ │ Voice Input 🎤  │  │ │ 📊 Confidence: 92%             │  │
│ ├─────────────────┤  │ ├────────────────────────────────┤  │
│ │                 │  │ │ 🏛️ BNS Sections Detected:      │  │
│ │ Text Area       │  │ │ • BNS 303 - Theft (92%)        │  │
│ │ (5000 chars)    │  │ │ • BNS 351 - Intimidation (78%) │  │
│ │                 │  │ │                                │  │
│ │ [Generate FIR]  │  │ │ 📍 Entities Extracted:         │  │
│ └─────────────────┘  │ │ • Location: MG Road            │  │
│                      │ │ • Time: 10:00 PM               │  │
│ Attachments:         │ │ • Vehicle: Honda City          │  │
│ [📎 Add Files]       │ │                                │  │
│                      │ │ ⚖️ Recommended Action:         │  │
│                      │ │ Register FIR under BNS 303     │  │
│                      │ └────────────────────────────────┘  │
├──────────────────────┴──────────────────────────────────────┤
│ DRAFT FIR PREVIEW                                          │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ FIRST INFORMATION REPORT No. FIR/2025/042              │ │
│ │ ...                                                    │ │
│ │                                                        │ │
│ │ [✏️ Edit]  [📥 Download PDF]  [✅ Submit to Court]     │ │
│ └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Data Display Requirements**:
1. **Complaint Input Section**
   - Text area with character counter (0/5000)
   - Voice-to-text button with visualizer
   - File attachment (PDF, images, max 10MB)
   - Language selector (Hindi, English, Regional)

2. **AI Analysis Panel** (Real-time streaming)
   - Confidence score (progress ring)
   - BNS sections with:
     - Section code (clickable → legal reference)
     - Description
     - Confidence % (color-coded)
     - Severity badge (LOW/MEDIUM/HIGH/CRITICAL)
     - Cognizable/Bailable badges
   - Extracted entities:
     - Location (with map preview)
     - Time (timeline indicator)
     - Persons (PII masked)
     - Objects/vehicles
   - AI recommendation

3. **Draft FIR Section**
   - Structured preview with sections
     - Header (FIR number auto-generated)
     - Complainant details
     - Incident narrative
     - Legal sections applied
     - Witness section (if any)
   - Edit capability (inline)
   - Export options (PDF, DOCX, Print)
   - Submit button with confirmation modal

**State Management**:
```typescript
interface SmartFIRState {
  complaint: {
    text: string;
    audioUrl?: string;
    attachments: File[];
  };
  analysis: {
    status: 'idle' | 'analyzing' | 'completed' | 'error';
    progress: number;
    bnsSections: BNSSection[];
    entities: ExtractedEntity[];
    confidence: number;
  };
  draft: {
    content: string;
    isEditing: boolean;
    version: number;
  };
}
```

**Error States**:
- Network error: "Unable to connect to AI service. Retry?"
- Low confidence (<70%): "Manual review recommended"
- PII detected: "⚠️ Sensitive information found - masked"
- Timeout: "Analysis taking longer than usual..."

**Metrics to Track**:
- Time to generate FIR
- AI confidence distribution
- Section accuracy (compared to final charges)
- User edit frequency

---

### SKILL 02: Financial Trail Analyzer

#### **Page Component**: `FinancialAnalyzerPage.tsx`

**Route**: `/police/financial/analyze`

**Layout Structure**:
```
┌─────────────────────────────────────────────────────────────┐
│ Financial Trail Analyzer (Skill 02)         [Export Report]│
├─────────────────────────────────────────────────────────────┤
│ Case: CASE-2025-001                    Suspect: Rahul S.   │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ NETWORK VISUALIZATION (D3.js/Canvas)                    │ │
│ │                                                         │ │
│ │  [ACC-001] ───₹5L──→ [ACC-002] ───₹3L──→ [ACC-004]   │ │
│ │      ↑                    │                    ↓       │ │
│ │      └──────₹2L───────────┘             [Shell Co.]    │ │
│ │                                                         │ │
│ │  Node size = Transaction volume                         │ │
│ │  Edge color = Risk level                                │ │
│ │  [🔍 Zoom] [📍 Center] [🔄 Refresh]                     │ │
│ └─────────────────────────────────────────────────────────┘ │
├──────────────────────┬──────────────────────────────────────┤
│ ANOMALY DETECTED     │ TRANSACTION TIMELINE                 │
│ ┌──────────────────┐ │ ┌────────────────────────────────┐   │
│ │ 🚨 CRITICAL      │ │ │ Jan 15 10:30 ───₹95000──→     │   │
│ │ Circular Trading │ │ │ Jan 15 11:45 ───₹98000──→     │   │
│ │                  │ │ │ Jan 16 09:15 ───₹150000──→    │   │
│ │ Cycle: 3 accounts│ │ │    ⚠️ Unusual pattern          │   │
│ │ Amount: ₹28L     │ │ │                                │   │
│ │ Confidence: 95%  │ │ │ [Filter: >₹1L] [Last 7 days]  │   │
│ │                  │ │ └────────────────────────────────┘   │
│ │ [View Details]   │ │                                      │
│ └──────────────────┘ │                                      │
├──────────────────────┴──────────────────────────────────────┤
│ INVESTIGATION LEADS                                         │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ Priority 10: Freeze ACC-002 & ACC-004 immediately      │  │
│ │ Priority 9:  Interview account holders                 │  │
│ │ Priority 8:  Trace ultimate beneficiaries              │  │
│ │ [Generate Report] [Share with ED]                      │  │
│ └────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Data Display Requirements**:
1. **Network Graph** (Interactive)
   - D3.js force-directed graph
   - Nodes: Accounts (color-coded by risk)
   - Edges: Transactions (width = amount)
   - Zoom, pan, drag interactions
   - Click node → account details panel
   - Hover edge → transaction details

2. **Anomaly Alerts Panel**
   - Severity levels (Critical/High/Medium/Low)
   - Type badges (Circular/Layering/Structuring)
   - Confidence score
   - Amount involved
   - Quick actions (Freeze/Investigate/Ignore)

3. **Timeline View**
   - Scrollable transaction history
   - Filter by amount, date, account
   - Pattern highlighting
   - Export to CSV

4. **Investigation Dashboard**
   - Risk score (0-100)
   - Total transaction volume
   - Unique accounts involved
   - Suspicious patterns count
   - Recommended actions priority queue

**Performance Requirements**:
- Graph render: < 500ms for 100 nodes
- Timeline smooth scroll: 60fps
- Real-time updates via WebSocket

---

### SKILL 03: Digital Evidence Chain

#### **Page Component**: `EvidenceChainPage.tsx`

**Route**: `/police/evidence/chain`

**Layout Structure**:
```
┌─────────────────────────────────────────────────────────────┐
│ Digital Evidence Chain (Skill 03)            [+ Add Evidence│
├─────────────────────────────────────────────────────────────┤
│ Case: CS/2025/001              Evidence Items: 12           │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ BLOCKCHAIN VERIFICATION STATUS                          │ │
│ │ ✅ All 12 items verified | Last verified: 2 mins ago    │ │
│ │ Hash: 0x7f8a9b...c3d4e5f | Block: #1,234,567            │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ EVIDENCE TIMELINE                                           │
│                                                             │
│  Jan 15 ────── Jan 16 ────── Jan 17 ────── Jan 18          │
│     │              │              │              │          │
│  [📷]            [🎥]           [📄]           [💻]          │
│ Photo-001     CCTV-Footage   Witness-Stmt   Digital-Dump   │
│ Collected     Downloaded     Recorded       Seized         │
│ @10:30 AM     @14:45         @09:15         @16:20        │
│                                                             │
│ Chain of Custody: Officer A → Officer B → Forensic Lab     │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ EVIDENCE DETAILS                                            │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ [📷] Photo-001.jpg                    [🔍 Preview]     │  │
│ │ Hash: SHA-256: a3f5d8... | MD5: 9c2e4b...             │  │
│ │ Captured: Jan 15, 10:30 AM | Device: iPhone 14 Pro    │  │
│ │ Location: 28.6139° N, 77.2090° E (Verified)           │  │
│ │ Custody: Officer A (Badge: 1234) → Officer B          │  │
│ │ Tamper Status: ✅ VERIFIED (No modification detected)  │  │
│ │ [Download Original] [View Metadata] [Audit Trail]      │  │
│ └────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Data Display Requirements**:
1. **Blockchain Status Bar**
   - Verification status (Real-time)
   - Latest block hash
   - Number of verified items
   - Last verification timestamp

2. **Interactive Timeline**
   - Vertical or horizontal timeline
   - Evidence type icons
   - Collection timestamps
   - Custody transfers
   - Click to expand details

3. **Evidence Detail Panel**
   - File preview (image/video/document)
   - Multiple hash algorithms (SHA-256, MD5)
   - EXIF metadata extraction
   - GPS location verification
   - Custody chain visualization
   - Tamper detection badge

4. **Audit Trail**
   - Complete access history
   - Who viewed/modified when
   - IP addresses
   - Digital signatures

**Security Features**:
- PII auto-redaction in previews
- Watermark on downloads
- Access logging
- Role-based permissions

---

### SKILL 04: Witness Tracker

#### **Page Component**: `WitnessTrackerPage.tsx`

**Route**: `/police/witness/tracker`

**Layout Structure**:
```
┌─────────────────────────────────────────────────────────────┐
│ Witness Protection Tracker (Skill 04)       [+ New Witness]│
├─────────────────────────────────────────────────────────────┤
│ Active Witnesses: 12 | Under Protection: 3 | At Risk: 1    │
├──────────────────────┬──────────────────────────────────────┤
│ WITNESS LIST         │ WITNESS DETAILS                       │
│ ┌──────────────────┐ │ ┌────────────────────────────────┐   │
│ │ 🔍 Search...     │ │ │ [👤] Rahul Sharma (W-001)      │   │
│ ├──────────────────┤ │ │                                │   │
│ │ ⚠️ High Risk     │ │ │ 📊 Risk Assessment: 87/100     │   │
│ │ 👤 Priya Patel   │ │ │ Status: 🟢 UNDER PROTECTION    │   │
│ │ Case: CS/2025/001│ │ │                                │   │
│ │ [View Details]   │ │ │ 📍 Safe House: Location-7      │   │
│ │                  │ │ │ 📱 Phone: +91-XXXXX-1234       │   │
│ │ 🟢 Normal        │ │ │ 👮 Guard: Officer Singh        │   │
│ │ 👤 Rahul Sharma  │ │ │                                │   │
│ │ Case: CS/2025/001│ │ │ 🗣️ Statements Recorded: 3     │   │
│ │ [View Details]   │ │ │                                │   │
│ └──────────────────┘ │ │ 🚨 Alerts:                     │   │
│                      │ │ • Attempted contact by accused │   │
│                      │ │ • Location breach on Jan 18    │   │
│                      │ │                                │   │
│                      │ │ [📞 Contact] [🔄 Relocate]     │   │
│                      │ │ [📄 View Statement]            │   │
│                      │ └────────────────────────────────┘   │
└──────────────────────┴──────────────────────────────────────┘
```

**Data Display Requirements**:
1. **Witness List**
   - Risk level indicators (color-coded)
   - Search and filter
   - Status badges
   - Quick action buttons

2. **Risk Assessment Dashboard**
   - Risk score (0-100)
   - Contributing factors
   - Threat level history graph
   - Protection measures effectiveness

3. **Real-time Monitoring**
   - Location tracking (if consented)
   - Communication logs
   - Security breach alerts
   - Check-in status

4. **Statement Management**
   - Recorded statements list
   - Video playback
   - Transcript viewer
   - Consent forms

---

### SKILL 05: Case Linker & Pattern Detection

#### **Page Component**: `CaseLinkerPage.tsx`

**Route**: `/police/cases/link`

**Layout Structure**:
```
┌─────────────────────────────────────────────────────────────┐
│ Case Linker & Pattern Detection (Skill 05)    [Run Analysis]│
├─────────────────────────────────────────────────────────────┤
│ Primary Case: CS/2025/001 (Theft at MG Road)               │
├─────────────────────────────────────────────────────────────┤
│ 🔗 RELATED CASES DETECTED                                   │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Match Score: 94%                                        │ │
│ │                                                         │ │
│ │ CS/2025/001 ──────── SAME ACCUSED ────────▶ CS/2024/089│ │
│ │ (Current)                ↓                    (Similar) │ │
│ │                     Mohd. Ali                           │ │
│ │                    Repeat Offender                      │ │
│ │                                                         │ │
│ │ Match Factors:                                          │ │
│ │ ✅ Same accused (Fingerprint match)                     │ │
│ ✅ Same MO (Vehicle theft)                               │ │
│ ✅ Same location (500m radius)                           │ │
│ ✅ Similar time (Night, 10-11 PM)                        │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ 📊 PATTERN ANALYSIS                                         │
│ ┌──────────────────────┬──────────────────────────────────┐ │
│ │ Crime Pattern        │ Geographic Hotspot              │ │
│ │ ┌────────────────┐   │ ┌──────────────────────────────┐ │ │
│ │ │ 📈 Timeline    │   │ │      🗺️ Map                 │ │ │
│ │ │ Jan: ████      │   │ │    [Hotspot clusters]        │ │ │
│ │ │ Feb: ██████    │   │ │         🔥 🔥                │ │ │
│ │ │ Mar: ███       │   │ │       🔥     🔥              │ │ │
│ │ └────────────────┘   │ └──────────────────────────────┘ │ │
│ │                      │                                  │ │
│ │ Peak Time: 22:00 hrs │ High Risk: MG Road, Sector 29   │ │
│ └──────────────────────┴──────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ 🤖 AI RECOMMENDATIONS                                       │
│ • Alert all stations within 5km radius                      │
│ • Increase patrol at MG Road between 21:00-23:00           │
│ • Check CCTV for similar vehicle (White Swift)             │
│ • Interview previous victims for additional leads          │
└─────────────────────────────────────────────────────────────┘
```

**Data Display Requirements**:
1. **Similarity Matrix**
   - Match percentage
   - Contributing factors
   - Shared entities
   - Visual relationship graph

2. **Pattern Analysis**
   - Temporal patterns (time of day, day of week)
   - Geographic clustering
   - MO (Modus Operandi) matching
   - Criminal network visualization

3. **Predictive Alerts**
   - High-risk time windows
   - Suspected next targets
   - Resource allocation recommendations

---

### SKILL 06: Charge Sheet Builder

#### **Page Component**: `ChargeSheetBuilderPage.tsx`

**Route**: `/police/chargesheet/build`

**Layout Structure**:
```
┌─────────────────────────────────────────────────────────────┐
│ Charge Sheet Builder (Skill 06)            [Generate Draft]│
├─────────────────────────────────────────────────────────────┤
│ Case: CS/2025/001 | FIR: FIR/2025/042 | Accused: 2         │
├─────────────────────────────────────────────────────────────┤
│ ┌────────────────────────┬────────────────────────────────┐ │
│ │ EVIDENCE SUMMARY       │ CHARGES FRAMEWORK              │ │
│ │ ┌────────────────────┐ │ ┌────────────────────────────┐ │ │
│ │ │ 📷 Photos: 5       │ │ │ 🏛️ Applicable Sections:   │ │ │
│ │ │ 🎥 Videos: 2       │ │ │                            │ │ │
│ │ │ 👥 Witnesses: 3    │ │ │ ☑️ BNS 303 - Theft         │ │ │
│ │ │ 🔬 Forensic: 1     │ │ │    [Edit] [Remove]         │ │ │
│ │ │ 📄 Documents: 8    │ │ │                            │ │ │
│ │ └────────────────────┘ │ │ ☑️ BNS 34 - Common Intent  │ │ │
│ │                        │ │    [Edit] [Remove]         │ │ │
│ │ Evidence Strength:     │ │                            │ │ │
│ │ ████████░░ 85%         │ │ [+ Add Section]            │ │ │
│ │                        │ └────────────────────────────┘ │ │
├────────────────────────┴──────────────────────────────────┤│
│ CHARGE SHEET PREVIEW                                       ││
│ ┌─────────────────────────────────────────────────────────┐│
│ │ CHARGE SHEET                                            ││
│ │ Case No. CS/2025/001                                    ││
│ │                                                         ││
│ │ Accused:                                                ││
│ │ 1. Mohd. Ali, S/O Karim Ali                             ││
│ │ 2. Ravi Kumar, S/O Ram Kumar                            ││
│ │                                                         ││
│ │ Charges:                                                ││
│ │ Under Section 303 of BNS - Theft                        ││
│ │ Under Section 34 of BNS - Common Intention              ││
│ │                                                         ││
│ │ Evidence relied upon:                                   ││
│ │ 1. Witness statement of Rahul Sharma (Exhibit P-1)      ││
│ │ 2. CCTV footage from MG Road (Exhibit P-2)              ││
│ │ ...                                                     ││
│ │                                                         ││
│ │ [✏️ Full Edit Mode]  [📥 Download PDF]  [✅ Submit]      ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

**Data Display Requirements**:
1. **Evidence Summary Panel**
   - Evidence count by type
   - Strength meter (AI-calculated)
   - Admissibility check
   - Chain of custody verification

2. **Charges Framework**
   - Auto-suggested sections
   - Section details on hover
   - Punishment summary
   - Edit/Add/Remove charges

3. **Document Preview**
   - Auto-generated draft
   - Section-wise preview
   - Legal citations
   - Format compliance check

4. **Compliance Checker**
   - Missing evidence warnings
   - Section applicability
   - Timeline validation
   - Format verification

---

### SKILL 07: Investigation Planner

#### **Page Component**: `InvestigationPlannerPage.tsx`

**Route**: `/police/investigation/plan`

**Layout Structure**:
```
┌─────────────────────────────────────────────────────────────┐
│ Investigation Planner (Skill 07)           [Export Plan]   │
├─────────────────────────────────────────────────────────────┤
│ Case: CS/2025/001 | Priority: HIGH | Deadline: 30 days     │
├─────────────────────────────────────────────────────────────┤
│ 📋 INVESTIGATION ROADMAP                                    │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Phase 1: Evidence Collection (Week 1-2)    ████████░░  │ │
│ │ ├── Task 1.1: Collect CCTV footage         ✅ Done     │ │
│ │ ├── Task 1.2: Interview witnesses          🔄 In Progress│ │
│ │ └── Task 1.3: Forensic analysis            ⏳ Pending   │ │
│ │                                                         │ │
│ │ Phase 2: Accused Tracing (Week 2-3)        ████░░░░░░  │ │
│ │ ├── Task 2.1: Trace phone location         ⏳ Pending   │ │
│ │ └── Task 2.2: Bank account monitoring      ⏳ Pending   │ │
│ │                                                         │ │
│ │ Phase 3: Charge Sheet Prep (Week 4)        ░░░░░░░░░░  │ │
│ └── Task 3.1: Compile evidence               ⏳ Pending   │ │
│ └─────────────────────────────────────────────────────────┘ │
├──────────────────────┬──────────────────────────────────────┤
│ RESOURCE ALLOCATION  │ TIMELINE & DEADLINES                 │
│ ┌──────────────────┐ │ ┌────────────────────────────────┐   │
│ │ 👮 Officers: 3   │ │ │ 📅 Calendar View               │   │
│ │ 🚔 Vehicles: 1   │ │ │                                │   │
│ │ 💰 Budget: ₹50K  │ │ │ Jan 15: CCTV collection        │   │
│ │ 🔬 Forensic: 1   │ │ │ Jan 18: Witness interview      │   │
│ │                  │ │ │ Jan 22: Forensic report due    │   │
│ │ [Request More]   │ │ │ Jan 30: Charge sheet deadline  │   │
│ └──────────────────┘ │ └────────────────────────────────┘   │
├──────────────────────┴──────────────────────────────────────┤
│ 🤖 AI SUGGESTIONS                                           │
│ • Based on similar cases, allocate 2 more officers         │
│ • Request early forensic report (currently 7 days)         │
│ • Schedule witness interviews within 48hrs (optimal)       │
└─────────────────────────────────────────────────────────────┘
```

**Data Display Requirements**:
1. **Phase-based Roadmap**
   - Visual progress bars
   - Task lists with status
   - Dependencies visualization
   - Critical path highlighting

2. **Resource Management**
   - Officer assignments
   - Vehicle allocation
   - Budget tracking
   - Forensic lab scheduling

3. **Timeline View**
   - Gantt chart style
   - Milestone markers
   - Deadline alerts
   - Slack time calculation

4. **AI Recommendations**
   - Resource optimization
   - Timeline compression
   - Risk mitigation
   - Best practices

---

## ⚖️ JUDGE MODULE (Nyaya Mitra) - Skills 8-14, 21

### SKILL 08: Bench Memo Generator

**Route**: `/judge/bench-memo/generate`

**Key Displays**:
1. **Document Upload Zone**
   - Drag & drop PDFs
   - Progress indicators
   - OCR processing status

2. **AI Summary Panel** (2-page limit)
   ```
   ┌─ EXECUTIVE SUMMARY ───────────────────────────────┐
   │ Case: CS/2025/001 | Filed: Jan 15, 2025          │
   │                                                    │
   │ 📋 KEY FACTS:                                     │
   │ • Theft of Honda City from MG Road               │
   • Occurred at 10:00 PM, Jan 14                    │
   │ • Accused identified via CCTV                    │
   │                                                    │
   │ ⚖️ LEGAL ISSUES:                                  │
   │ 1. Whether theft proved beyond doubt?            │
   │ 2. Whether accused identification reliable?      │
   │                                                    │
   │ 📚 PRECEDENTS:                                    │
   │ • State v. Raju (2019) - Similar facts           │
   │ • Mohd. Ali v. State (2020) - CCTV evidence      │
   │                                                    │
   │ 💡 TENTATIVE VIEW:                                │
   │ Prima facie case made out. Issue notice.         │
   │                                                    │
   │ [📄 Full Memo (PDF)] [✏️ Edit] [✅ Approve]       │
   └────────────────────────────────────────────────────┘
   ```

3. **Precedent Finder**
   - Similar case citations
   - Relevance score
   - One-click reference

---

### SKILL 09: Bail Reckoner

**Route**: `/judge/bail/assess`

**Key Displays**:
1. **Accused Profile Card**
   ```
   ┌─ ACCUSED PROFILE ─────────────────────────────────┐
   │ 👤 Mohd. Ali, Age: 28                             │
   │                                                    │
   │ 📊 RISK ASSESSMENT:                               │
   │ Flight Risk: ████████░░ 78/100 ⚠️ HIGH            │
   │ Case Strength: ██████████ 85/100 (Strong)        │
   │ Previous Record: 2 convictions                    │
   │                                                    │
   │ 🏷️ ANTIL CATEGORY: B                             │
   │ (Conditionally bailable)                         │
   │                                                    │
   │ 💡 RECOMMENDATION:                                │
   │ Bail grantable with conditions:                  │
   │ • Surrender passport                             │
   │ • Weekly police reporting                        │
   │ • ₹2L surety bond                                │
   │                                                    │
   │ [✅ Grant Bail] [❌ Reject] [📝 Custom Conditions] │
   └────────────────────────────────────────────────────┘
   ```

2. **Risk Factor Breakdown**
   - Passport possession
   - Foreign connections
   - Previous absconding
   - Financial capacity

3. **Similar Case Outcomes**
   - Bail granted vs rejected ratio
   - Average surety amounts
   - Common conditions

---

### SKILL 10: Sentence Calculator

**Route**: `/judge/sentence/calculate`

**Key Displays**:
1. **Offense Details Form**
   - Section selection
   - Prior record input
   - Aggravating/mitigating factors

2. **Calculated Sentence**
   ```
   ┌─ SENTENCE CALCULATION ────────────────────────────┐
   │ Offense: BNS 303 (Theft)                          │
   │                                                    │
   │ 📊 SENTENCE RANGE:                                │
   │ Minimum: ████ 2 years                            │
   │ Maximum: ████████████ 7 years                    │
   │                                                    │
   │ 🎯 RECOMMENDED: 4 years                          │
   │ (Based on aggravating factors)                   │
   │                                                    │
   │ Factors Considered:                              │
   │ ✅ Prior record (2 convictions)                  │
   │ ✅ Value of stolen property (₹15L)               │
   │ ✅ Violent execution                             │
   │ ❌ No remorse shown                              │
   │                                                    │
   │ Similar Cases Avg: 3.5 years                     │
   └────────────────────────────────────────────────────┘
   ```

3. **Factor Weight Visualization**
   - Slider inputs
   - Real-time calculation
   - Judicial discretion notes

---

### SKILL 11: Precedent Finder

**Route**: `/judge/precedents/find`

**Key Displays**:
1. **Natural Language Search**
   - Query: "theft vehicle night identification"

2. **Results Grid**
   ```
   ┌─ MATCHING PRECEDENTS ─────────────────────────────┐
   │                                                    │
   │ 1. State v. Rajesh (2023) SC                     │
   │    Relevance: 94% ⭐⭐⭐⭐⭐                       │
   │    Similarity: Vehicle theft, CCTV evidence      │
   │    Holding: Conviction upheld                    │
   │    [📄 Read Full] [🔗 Cite This]                 │
   │                                                    │
   │ 2. Mohd. Ali v. State (2022) Delhi HC            │
   │    Relevance: 87% ⭐⭐⭐⭐                         │
   │    Similarity: Night theft, sole witness         │
   │    Holding: Acquittal - poor identification      │
   │    [📄 Read Full] [🔗 Cite This]                 │
   │                                                    │
   │ [Filter by Court] [Filter by Year] [Export List] │
   └────────────────────────────────────────────────────┘
   ```

3. **Citation Generator**
   - Auto-format for judgment
   - Copy to clipboard
   - Export as bibliography

---

### SKILL 12: Case Analytics

**Route**: `/judge/analytics`

**Key Displays**:
1. **Court Performance Dashboard**
   ```
   ┌─ COURT ANALYTICS ─────────────────────────────────┐
   │                                                    │
   │ 📊 DISPOSAL RATE: 78% (Target: 80%)              │
   │ Pending Cases: 1,247    Disposed: 4,523 (2024)   │
   │                                                    │
   │ 📈 MONTHLY TREND:                                 │
   │ Jan: ████████░░ 78%                              │
   │ Feb: █████████░░ 82%                             │
   │ Mar: ███████░░░ 71% ⚠️                          │
   │                                                    │
   │ ⏱️ AVG DISPOSAL TIME: 145 days                   │
   │ (Target: 180 days) ✅ Ahead                      │
   │                                                    │
   │ 🏆 TOP PERFORMING JUDGES:                        │
   │ 1. Hon. R.K. Sharma - 92% disposal               │
   │ 2. Hon. P. Patel - 88% disposal                  │
   └────────────────────────────────────────────────────┘
   ```

2. **Case Type Distribution**
   - Pie chart visualization
   - Trend analysis
   - Bottleneck identification

3. **Judge Workload**
   - Case allocation per judge
   - Performance comparison
   - Resource optimization

---

### SKILL 13: Draft Judgment Assistant

**Route**: `/judge/draft/generate`

**Key Displays**:
1. **Interactive Draft Editor**
   - Template selection
   - AI-generated paragraphs
   - Legal citation auto-insert

2. **Structure Guide**
   ```
   ┌─ JUDGMENT STRUCTURE ──────────────────────────────┐
   │ ✅ 1. Case Title                                   │
   │ ✅ 2. Parties                                      │
   │ 🔄 3. Facts (AI Drafted - Review Needed)         │
   │ ⏳ 4. Issues                                       │
   │ ⏳ 5. Arguments                                    │
   │ ⏳ 6. Analysis                                     │
   │ ⏳ 7. Decision                                     │
   │ ⏳ 8. Order                                        │
   │                                                    │
   │ [🤖 AI Suggest Next Section]                     │
   └────────────────────────────────────────────────────┘
   ```

3. **Legal Writing Assistant**
   - Grammar check
   - Citation validation
   - Consistency checker
   - Tone analyzer

---

### SKILL 14: Courtroom Manager

**Route**: `/judge/courtroom/manage`

**Key Displays**:
1. **Virtual Court Interface**
   ```
   ┌─ VIRTUAL COURTROOM ───────────────────────────────┐
   │                                                    │
   │ 📹 Video Feeds                     [Record] 🔴    │
   │ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
   │ │ 👨‍⚖️      │ │ 👨‍💼      │ │ 👨‍⚖️      │           │
   │ │  Judge   │ │ Advocate │ │  Witness │           │
   │ └──────────┘ └──────────┘ └──────────┘           │
   │                                                    │
   │ 📋 CURRENT CASE: CS/2025/001                      │
   │ Stage: Cross-examination                         │
   │ Time elapsed: 45 mins                            │
   │                                                    │
   │ 👥 QUEUE (3 remaining):                          │
   │ 1. CS/2025/045 - Ready                           │
   │ 2. CS/2025/067 - Witness pending                 │
   │ 3. CS/2025/089 - Documents incomplete            │
   │                                                    │
   │ [▶️ Start Next] [📊 View Evidence] [⏸️ Break]    │
   └────────────────────────────────────────────────────┘
   ```

2. **Case Queue Management**
   - Drag-drop reordering
   - Status indicators
   - Time tracking
   - Adjournment handling

3. **Evidence Display**
   - Document viewer
   - Video player
   - Annotation tools

---

### SKILL 21: Judgment Validator

**Route**: `/judge/judgment/validate`

**Key Displays**:
1. **Validation Dashboard**
   ```
   ┌─ JUDGMENT VALIDATION ─────────────────────────────┐
   │                                                    │
   │ 📄 Upload Draft: judgment_draft.pdf              │
   │                                                    │
   │ ✅ VALIDATION RESULTS:                            │
   │                                                    │
   │ 📚 Citations: 15 checked                         │
   │    ✅ 14 Valid                                   │
   │    ⚠️  1 Overruled (ADM Jabalpur - use Puttaswamy)│
   │                                                    │
   │ 🔍 Logical Consistency: PASSED                   │
   │ ✅ No contradictory findings                     │
   │ ✅ Timeline consistent                           │
   │ ✅ Parties properly named                        │
   │                                                    │
   │ 📝 STYLE & GRAMMAR:                              │
   │    ⚠️ 3 suggestions found                        │
   │    • Para 12: Consider rephrasing                │
   │    • Para 15: Typo - "acussed" → "accused"      │
   │                                                    │
   │ OVERALL SCORE: 92/100 ⭐⭐⭐⭐                     │
   │ [✅ Approve] [📝 Edit] [📥 Download Report]       │
   └────────────────────────────────────────────────────┘
   ```

2. **Citation Checker**
   - Real-time validation
   - Overruled case warnings
   - Latest version suggestions

3. **Grammar & Style**
   - Legal writing style guide
   - Tone consistency
   - Accessibility check

---

## 👤 CITIZEN MODULE (Vidhi Mitra) - Skills 15-18

### SKILL 15: Legal Chatbot (Nyaya-Bot)

**Route**: `/citizen/chat`

**Key Displays**:
1. **Chat Interface**
   ```
   ┌─ NYAYA-BOT ───────────────────────────────────────┐
   │                                                    │
   │ 🤖 Hello! I'm Nyaya-Bot. How can I help you      │
   │    with your legal query today?                  │
   │                                                    │
   │ 👤 My landlord is not returning my deposit       │
   │                                                    │
   │ 🤖 I understand. In India, landlords must        │
   │    return security deposit within 1 month of     │
   │    vacating. Here's what you can do:             │
   │                                                    │
   │    1. Send legal notice (I can help draft)      │
   │    2. File complaint in Rent Control Court      │
   │    3. Approach Consumer Forum                   │
   │                                                    │
   │    [📄 Draft Notice] [🏛️ Find Court] [📚 More Info]│
   │                                                    │
   │ [Type your message...]  [🎤] [📎]                │
   └────────────────────────────────────────────────────┘
   ```

2. **Quick Actions**
   - Draft document
   - Find nearest court
   - Calculate fees
   - Connect to legal aid

3. **Multilingual Support**
   - Language selector
   - Real-time translation
   - Regional legal info

---

### SKILL 16: Document Generator

**Route**: `/citizen/documents/generate`

**Key Displays**:
1. **Template Gallery**
   ```
   ┌─ DOCUMENT GENERATOR ──────────────────────────────┐
   │                                                    │
   │ 📋 SELECT DOCUMENT TYPE:                         │
   │                                                    │
   │ [🔍 Search...]                                    │
   │                                                    │
   │ 🏠 HOUSING:                      🏢 EMPLOYMENT:  │
   │ • Rent Agreement                 • Appointment   │
   │ • Lease Deed                     • Relieving     │
   │ • Eviction Notice                • NOC          │
   │                                                    │
   │ ⚖️ LEGAL:                        💼 BUSINESS:    │
   │ • RTI Application                • Partnership   │
   │ • Legal Notice                   • NDA          │
   │ • Affidavit                      • Invoice      │
   │                                                    │
   │ 💰 FINANCIAL:                    👪 PERSONAL:    │
   │ • Loan Application               • Will         │
   │ • Income Certificate             • Power of Att.│
   │ • Property Valuation             • Marriage Cert│
   └────────────────────────────────────────────────────┘
   ```

2. **Form Wizard**
   - Step-by-step inputs
   - Help tooltips
   - Preview mode
   - Download options

3. **Stamp Duty Calculator**
   - Auto-calculated fees
   - Payment gateway
   - Receipt generation

---

### SKILL 17: Case Tracker

**Route**: `/citizen/cases/track`

**Key Displays**:
1. **Case Search**
   - CNR number input
   - QR code scan
   - SMS alerts signup

2. **Case Status Card**
   ```
   ┌─ CASE STATUS ─────────────────────────────────────┐
   │ CNR: DLCT0100012342023                           │
   │ Case: CS/2023/1234 (Property Dispute)            │
   │                                                    │
   │ 📍 COURT: Tis Hazari Court, Delhi                │
   │ 👨‍⚖️ JUDGE: Hon. R.K. Sharma                      │
   │ 🏛️ CURRENT STAGE: Arguments (35% complete)       │
   │                                                    │
   │ ⏱️ TIMELINE:                                     │
   │ Filed ──▶ Notice ──▶ Reply ──▶ [Arguments] ──▶ ? │
   │ Jan 15    Feb 2      Mar 5       Now      Decision│
   │                                                    │
   │ 📅 NEXT HEARING: March 15, 2025, 10:30 AM        │
   │ 📍 COURTROOM: 12                                  │
   │                                                    │
   │ [📄 View Orders] [🔔 Set Reminder] [📞 Contact]   │
   └────────────────────────────────────────────────────┘
   ```

3. **Document Access**
   - Filed documents
   - Court orders
   - Hearing transcripts
   - Download options

---

### SKILL 18: Legal Aid Matcher

**Route**: `/citizen/legal-aid`

**Key Displays**:
1. **Eligibility Checker**
   ```
   ┌─ FREE LEGAL AID ──────────────────────────────────┐
   │                                                    │
   │ 💰 INCOME CHECK:                                  │
   │ Annual Income: ₹1,50,000                         │
   │ State Limit: ₹3,00,000                           │
   │ Status: ✅ ELIGIBLE                               │
   │                                                    │
   │ 🤝 MATCHED ADVOCATES (3 found):                  │
   │                                                    │
   │ 1. Adv. Priya Sharma (8 yrs exp)                 │
   │    📍 Delhi High Court                           │
   │    ⚖️ Civil Law Specialist                       │
   │    ⭐ Rating: 4.8/5                              │
   │    [📞 Contact] [📅 Book Appointment]            │
   │                                                    │
   │ 2. Adv. Mohd. Ali (12 yrs exp)                   │
   │    ...                                           │
   │                                                    │
   │ [🔍 Refine Search] [📍 View on Map]              │
   └────────────────────────────────────────────────────┘
   ```

2. **Advocate Profile**
   - Experience, specialization
   - Success rate
   - Reviews
   - Contact info

3. **Appointment Booking**
   - Calendar integration
   - Video call option
   - Document upload

---

## 🔧 ADMIN MODULE (Prabandhak) - Skills 19-24

### SKILL 19: Registry Automator

**Already Implemented** ✅
- Document scrutiny panel
- Defect detection display
- Fee calculator
- AI analysis results

**Additional Features**:
1. **Batch Processing**
   - Bulk document upload
   - Queue management
   - Priority handling

2. **Audit Trail**
   - Processing history
   - Officer assignments
   - Time tracking

---

### SKILL 20: Listing Optimizer

**Already Implemented** ✅
- Pending cases list
- Timeline visualization
- Utilization metrics
- Unlisted cases panel

**Additional Features**:
1. **Calendar Integration**
   - Export to iCal/Google
   - Holiday management
   - Judge availability

2. **Conflict Detection**
   - Lawyer double-booking
   - Courtroom clashes
   - Holiday overlaps

---

### SKILL 22: Court Statistics

**Route**: `/admin/statistics`

**Key Displays**:
1. **Performance Dashboard**
   - Case clearance rate
   - Pendency analysis
   - Disposal trends
   - Judge-wise stats

2. **Predictive Analytics**
   - Case load forecasting
   - Resource requirements
   - Bottleneck prediction

---

### SKILL 23: Case Allocator

**Route**: `/admin/allocator`

**Key Displays**:
1. **Auto-Allocation**
   - Judge workload balance
   - Case type matching
   - Subject matter expertise

2. **Manual Override**
   - Drag-drop assignment
   - Conflict alerts
   - Special requests

---

### SKILL 24: Digital Archive

**Route**: `/admin/archive`

**Key Displays**:
1. **Archive Search**
   - Full-text search
   - Date range filter
   - Case type filter

2. **Retention Policy**
   - Auto-archive rules
   - Destruction schedules
   - Compliance tracking

---

## 🧪 TESTING STRATEGY (FAANG Level)

### Unit Tests (Jest)
```typescript
// Component tests
- Rendering without errors
- Props validation
- State changes
- Event handling
- Error boundaries

// Service tests
- API calls
- Data transformation
- Error handling
- Caching behavior
```

### Integration Tests (Cypress)
```typescript
// E2E flows
- Complete FIR generation
- End-to-end scheduling
- Payment processing
- File upload/download
```

### Performance Tests (Lighthouse)
```
- First Contentful Paint < 1.5s
- Time to Interactive < 3.5s
- Cumulative Layout Shift < 0.1
- Total Blocking Time < 200ms
```

### Accessibility Tests (Axe)
```
- WCAG 2.1 AA compliance
- Screen reader compatibility
- Keyboard navigation
- Color contrast ratios
```

---

## 📊 METRICS & MONITORING

### Application Metrics
```typescript
// Performance
- API response times
- Component render times
- Bundle size tracking
- Memory usage

// Business
- Feature adoption rates
- User satisfaction scores
- Error rates by skill
- Conversion funnels
```

### Dashboard
```
┌─ SYSTEM HEALTH ─────────────────────────────────────┐
│ ✅ API Uptime: 99.9%                               │
│ ✅ Avg Response: 120ms                             │
│ ⚠️ Error Rate: 0.5% (Target: <0.1%)               │
│ ✅ Active Users: 1,247                             │
└─────────────────────────────────────────────────────┘
```

---

## 🎯 IMPLEMENTATION PRIORITY

### Phase 1: Core (Week 1-2)
- ✅ Skills 19 & 20 (Already done)
- 🔄 Skills 1, 2, 8, 9
- 🔄 Authentication & roles

### Phase 2: Essential (Week 3-4)
- Skills 3, 4, 10, 11, 16, 17
- Dashboard & analytics
- Reporting

### Phase 3: Advanced (Week 5-6)
- Skills 5, 6, 7, 12, 13, 14, 21
- AI/ML features
- Advanced analytics

### Phase 4: Complete (Week 7-8)
- Skills 15, 18, 22, 23, 24
- Mobile optimization
- Performance tuning

---

**This specification provides complete UI/UX requirements for all 24 skills at FAANG production standards!** 🏆