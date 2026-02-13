# Police Portal Implementation Plan
## LegalOS 4.0 - Sidebar & Skill Enhancement Guide

**Version:** 1.0  
**Date:** February 12, 2026  
**Status:** 📋 Ready for Implementation  
**Estimated Duration:** 30-35 hours  
**Skills Coverage:** 01-11 (All 11 Police Skills)

---

## 📑 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current State Analysis](#current-state-analysis)
3. [Skills Overview](#skills-overview)
4. [Sidebar Restructuring](#sidebar-restructuring)
5. [Phase 1: Fix Missing Links](#phase-1-fix-missing-links)
6. [Phase 2: Skill Enhancements](#phase-2-skill-enhancements)
7. [Phase 3: Supporting Features](#phase-3-supporting-features)
8. [Implementation Details](#implementation-details)
9. [Testing Checklist](#testing-checklist)

---

## Executive Summary

Your Police Portal has **11 skills (01-11)** with **15+ pages built**, but **many critical pages are NOT in the sidebar**. Skills like Financial Analyzer, Case Linker, Investigation Planner exist but are inaccessible to users.

### Key Issues Found

| Issue | Current State | Impact |
|-------|--------------|--------|
| Missing Sidebar Links | 8 pages exist but NOT in sidebar | 🔴 Broken navigation |
| Skill 02: Financial Analyzer | Page exists, NOT in sidebar | 🔴 Inaccessible |
| Skill 04: Case Linker | Page exists, NOT in sidebar | 🔴 Inaccessible |
| Skill 05: Charge Sheet Builder | Page exists, NOT in sidebar | 🔴 Inaccessible |
| Skill 06: Witness Protection | Page exists, NOT in sidebar | 🔴 Inaccessible |
| Skill 07: Investigation Planner | Page exists, NOT in sidebar | 🔴 Inaccessible |
| Skill 08: Forensic Interlock | Missing entirely | ❌ Not implemented |
| Skill 09: Evidence Hasher | Missing entirely | ❌ Not implemented |
| Skill 10: Digital Warrant | Page exists, NOT in sidebar | 🔴 Inaccessible |
| Skill 11: Duty Roster | Page exists, NOT in sidebar | 🔴 Inaccessible |
| NyayaBot Link | Links to `/police/bot` (404) | 🔴 Broken link |

### Solution Overview

**Phase 1:** Add all existing pages to sidebar (Skills 02, 04, 05, 06, 07, 10, 11)  
**Phase 2:** Create Skills 08 & 09 (Forensic Interlock, Evidence Hasher)  
**Phase 3:** Enhance all skills with advanced features  
**Phase 4:** Fix NyayaBot link or create placeholder

---

## Current State Analysis

### Existing Sidebar Structure (7 items)

```typescript
// PoliceLayout.tsx - Current navItems
const navItems = [
    { path: '/police/dashboard', label: 'Dashboard', icon: LayoutDashboard },      // ✅ Works
    { path: '/police/warrants', label: 'Warrants & Summons', icon: FileWarning },  // ✅ Works (Skill 10)
    { path: '/police/crime-scene', label: '3D Crime Scene', icon: Box },           // ✅ Works
    { path: '/police/fir', label: 'Smart FIR', icon: Mic },                        // ✅ Works (Skill 01)
    { path: '/police/evidence', label: 'Evidence Locker', icon: Lock },            // ✅ Works (Skill 03)
    { path: '/police/patrol', label: 'Patrol Map', icon: Map },                    // ✅ Works
    { path: '/police/bot', label: 'NyayaBot', icon: MessageSquare },               // ❌ 404 - Page doesn't exist!
];
```

### Existing Pages Inventory (15 pages found!)

| Page File | Route | In Sidebar? | Status | Skill |
|-----------|-------|-------------|--------|-------|
| PoliceDashboard.tsx | `/police/dashboard` | ✅ Yes | Working | - |
| StationDashboard.tsx | `/police/station` | ❌ No | Working | - |
| SmartFIR.tsx | `/police/fir` | ✅ Yes | Working | 01 |
| FinancialAnalyzer.tsx | `/police/financial` | ❌ **NO** | Working | 02 |
| EvidenceLocker.tsx | `/police/evidence` | ✅ Yes | Working | 03 |
| CaseLinker.tsx | `/police/case-linker` | ❌ **NO** | Working | 04 |
| ChargeSheetBuilder.tsx | `/police/charge-sheet` | ❌ **NO** | Working | 05 |
| WitnessTracker.tsx | `/police/witness` | ❌ **NO** | Working | 06 |
| InvestigationPlanner.tsx | `/police/investigation` | ❌ **NO** | Working | 07 |
| DutyRoster.tsx | `/police/roster` | ❌ **NO** | Working | 11 |
| WarrantManagerPage.tsx | `/police/warrants` | ✅ Yes | Working | 10 |
| CrimeScene3D.tsx | `/police/crime-scene` | ✅ Yes | Working | - |
| PatrolMap.tsx | `/police/patrol` | ✅ Yes | Working | - |
| **Forensic Interlock** | ❌ Missing | ❌ No | ❌ Missing | 08 |
| **Evidence Hasher** | ❌ Missing | ❌ No | ❌ Missing | 09 |

### Critical Finding
**8 PAGES EXIST but are NOT in the sidebar!** Users can't access:
- Financial Analyzer (Skill 02) ❌
- Case Linker (Skill 04) ❌
- Charge Sheet Builder (Skill 05) ❌
- Witness Protection (Skill 06) ❌
- Investigation Planner (Skill 07) ❌
- Duty Roster (Skill 11) ❌
- Station Dashboard ❌
- **Plus 2 skills completely missing (08, 09)**

---

## Skills Overview

### Skill 01: Smart-FIR (✅ IMPLEMENTED)
**Status:** Page exists, in sidebar, working
**Current:** `/police/fir` - AI-powered FIR generation
**Features:**
- ✅ AI section detection
- ✅ Auto BNS mapping
- ✅ Voice input support
- 🆕 **Missing:** FIR history, batch processing, templates

### Skill 02: Financial Analyzer (❌ NOT ACCESSIBLE)
**Status:** Page exists, NOT in sidebar
**Current:** `/police/financial` - Works but unreachable
**Features:**
- ✅ Transaction network analysis
- ✅ Anomaly detection
- ✅ Graph visualization
- 🆕 **Missing:** Sidebar link, report export, case linking

### Skill 03: Evidence Locker (✅ IMPLEMENTED)
**Status:** Page exists, in sidebar, working
**Current:** `/police/evidence` - Digital evidence storage
**Features:**
- ✅ Upload and store evidence
- ✅ Basic chain of custody
- 🆕 **Missing:** Blockchain hashing, tamper detection, batch upload

### Skill 04: Case Linker (❌ NOT ACCESSIBLE)
**Status:** Page exists, NOT in sidebar
**Current:** `/police/case-linker` - Works but unreachable
**Features:**
- ✅ Pattern matching
- ✅ Network visualization
- ✅ Similarity scoring
- 🆕 **Missing:** Sidebar link, MO analysis, serial offender detection

### Skill 05: Charge Sheet Builder (❌ NOT ACCESSIBLE)
**Status:** Page exists, NOT in sidebar
**Current:** `/police/charge-sheet` - Works but unreachable
**Features:**
- ✅ Auto-populate from FIR
- ✅ BNS section suggestions
- 🆕 **Missing:** Sidebar link, PDF export, digital signature

### Skill 06: Witness Protection (❌ NOT ACCESSIBLE)
**Status:** Page exists, NOT in sidebar
**Current:** `/police/witness` - Works but unreachable
**Features:**
- ✅ Witness tracking
- ✅ Protection status
- 🆕 **Missing:** Sidebar link, threat assessment, anonymous IDs

### Skill 07: Investigation Planner (❌ NOT ACCESSIBLE)
**Status:** Page exists, NOT in sidebar
**Current:** `/police/investigation` - Works but unreachable
**Features:**
- ✅ Task management
- ✅ Timeline tracking
- 🆕 **Missing:** Sidebar link, Gantt chart, resource allocation

### Skill 08: Forensic Interlock (❌ MISSING ENTIRELY)
**Status:** Not implemented
**Missing:** Everything
**Needs:**
- Digital evidence chain of custody
- Lab integration
- Report management
- Expert witness coordination

### Skill 09: Evidence Hasher (❌ MISSING ENTIRELY)
**Status:** Not implemented
**Missing:** Everything
**Needs:**
- SHA-256 hash generation
- Blockchain attestation
- Tamper detection
- Hash verification

### Skill 10: Digital Warrant Manager (✅ IMPLEMENTED)
**Status:** Page exists, in sidebar, working
**Current:** `/police/warrants` - Warrant management
**Features:**
- ✅ Warrant request
- ✅ Approval workflow
- 🆕 **Missing:** Digital signatures, execution tracking

### Skill 11: Duty Roster (❌ NOT ACCESSIBLE)
**Status:** Page exists, NOT in sidebar
**Current:** `/police/roster` - Works but unreachable
**Features:**
- ✅ Shift scheduling
- ✅ Officer assignments
- 🆕 **Missing:** Sidebar link, leave management, shift swapping

---

## Sidebar Restructuring

### Proposed New Sidebar Structure

```
┌─ 📊 DASHBOARD ───────────────────────┐
│  ◉ Police Dashboard                   │
│  ○ Station Overview                   │
├─ 🚨 CRIME REPORTING ──────────────────┤
│  ○ Smart FIR (Skill 01)              │
│  ○ Financial Analyzer (Skill 02)     │
├─ 📁 CASE MANAGEMENT ──────────────────┤
│  ○ Evidence Locker (Skill 03)        │
│  ○ Forensic Interlock (Skill 08) 🆕  │
│  ○ Evidence Hasher (Skill 09) 🆕     │
│  ○ Case Linker (Skill 04)            │
├─ 📝 INVESTIGATION ────────────────────┤
│  ○ Investigation Planner (Skill 07)  │
│  ○ Charge Sheet Builder (Skill 05)   │
│  ○ Witness Protection (Skill 06)     │
├─ ⚖️ WARRANTS & OPS ───────────────────┤
│  ○ Digital Warrants (Skill 10)       │
│  ○ 3D Crime Scene                    │
│  ○ Patrol Map                        │
├─ 👮 PERSONNEL ────────────────────────┤
│  ○ Duty Roster (Skill 11)            │
│  ○ NyayaBot Assistant                │
└─────────────────────────────────────────┘
```

### Updated navItems Array

```typescript
const navItems = [
    // 📊 DASHBOARD
    { 
        path: '/police/dashboard', 
        label: 'Dashboard', 
        icon: LayoutDashboard,
        category: 'dashboard'
    },
    { 
        path: '/police/station', 
        label: 'Station Overview', 
        icon: Building,
        category: 'dashboard'
    },
    
    // 🚨 CRIME REPORTING
    { 
        path: '/police/fir', 
        label: 'Smart FIR', 
        icon: Mic,
        category: 'reporting',
        skill: 01
    },
    { 
        path: '/police/financial', 
        label: 'Financial Analyzer', 
        icon: TrendingUp,
        category: 'reporting',
        skill: 02
    },
    
    // 📁 CASE MANAGEMENT
    { 
        path: '/police/evidence', 
        label: 'Evidence Locker', 
        icon: Lock,
        category: 'cases',
        skill: 03
    },
    { 
        path: '/police/forensic', 
        label: 'Forensic Interlock', 
        icon: Microscope,
        category: 'cases',
        skill: 08
    },
    { 
        path: '/police/hasher', 
        label: 'Evidence Hasher', 
        icon: Fingerprint,
        category: 'cases',
        skill: 09
    },
    { 
        path: '/police/case-linker', 
        label: 'Case Linker', 
        icon: Share2,
        category: 'cases',
        skill: 04
    },
    
    // 📝 INVESTIGATION
    { 
        path: '/police/investigation', 
        label: 'Investigation Planner', 
        icon: ClipboardList,
        category: 'investigation',
        skill: 07
    },
    { 
        path: '/police/charge-sheet', 
        label: 'Charge Sheet Builder', 
        icon: FileText,
        category: 'investigation',
        skill: 05
    },
    { 
        path: '/police/witness', 
        label: 'Witness Protection', 
        icon: Users,
        category: 'investigation',
        skill: 06
    },
    
    // ⚖️ WARRANTS & OPS
    { 
        path: '/police/warrants', 
        label: 'Digital Warrants', 
        icon: FileWarning,
        category: 'operations',
        skill: 10
    },
    { 
        path: '/police/crime-scene', 
        label: '3D Crime Scene', 
        icon: Box,
        category: 'operations'
    },
    { 
        path: '/police/patrol', 
        label: 'Patrol Map', 
        icon: Map,
        category: 'operations'
    },
    
    // 👮 PERSONNEL
    { 
        path: '/police/roster', 
        label: 'Duty Roster', 
        icon: Calendar,
        category: 'personnel',
        skill: 11
    },
    { 
        path: '/police/bot', 
        label: 'NyayaBot', 
        icon: MessageSquare,
        category: 'personnel'
    }
];
```

---

## Phase 1: Fix Missing Links

### 🎯 Objective
Add all existing pages to sidebar so Skills 02, 04, 05, 06, 07, 11 become accessible.

**Estimated Time:** 1-2 hours

---

### Task 1.1: Update Sidebar Navigation
**File:** `src/shared/layout/PoliceLayout.tsx`  
**Priority:** 🔴 CRITICAL

#### Add Missing Imports
```typescript
// Add missing icon imports
import { 
    LayoutDashboard,
    Lock,
    Map,
    MessageSquare,
    Mic,
    LogOut,
    Menu,
    ChevronLeft,
    ChevronRight,
    FileWarning,
    Clock,
    Box,
    TrendingUp,      // 🆕 Add for Financial Analyzer
    Share2,          // 🆕 Add for Case Linker
    FileText,        // 🆕 Add for Charge Sheet
    Users,           // 🆕 Add for Witness Protection
    ClipboardList,   // 🆕 Add for Investigation Planner
    Calendar,        // 🆕 Add for Duty Roster
    Building,        // 🆕 Add for Station
    Microscope,      // 🆕 Add for Forensic
    Fingerprint      // 🆕 Add for Hasher
} from 'lucide-react';
```

#### Update navItems Array
```typescript
const navItems = [
    // Dashboard
    { path: '/police/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    
    // Crime Reporting
    { path: '/police/fir', label: 'Smart FIR', icon: Mic },
    { path: '/police/financial', label: 'Financial Analyzer', icon: TrendingUp },  // 🆕 ADD
    
    // Case Management
    { path: '/police/evidence', label: 'Evidence Locker', icon: Lock },
    { path: '/police/case-linker', label: 'Case Linker', icon: Share2 },            // 🆕 ADD
    
    // Investigation
    { path: '/police/investigation', label: 'Investigation Planner', icon: ClipboardList },  // 🆕 ADD
    { path: '/police/charge-sheet', label: 'Charge Sheet', icon: FileText },       // 🆕 ADD
    { path: '/police/witness', label: 'Witness Protection', icon: Users },          // 🆕 ADD
    
    // Warrants & Ops
    { path: '/police/warrants', label: 'Warrants', icon: FileWarning },
    { path: '/police/crime-scene', label: '3D Crime Scene', icon: Box },
    { path: '/police/patrol', label: 'Patrol Map', icon: Map },
    
    // Personnel
    { path: '/police/roster', label: 'Duty Roster', icon: Calendar }               // 🆕 ADD
];
```

---

### Task 1.2: Fix NyayaBot Link
**File:** `src/shared/layout/PoliceLayout.tsx`  
**Priority:** 🔴 CRITICAL

#### Current Issue
NyayaBot links to `/police/bot` which returns 404.

#### Solution Options

**Option A: Remove NyayaBot from Police sidebar**
```typescript
// Remove this item:
{ path: '/police/bot', label: 'NyayaBot', icon: MessageSquare }

// NyayaBot is already accessible from:
// - Citizen Portal: /citizen/bot
// - Global navigation if needed
```

**Option B: Create Police-specific NyayaBot page**
```typescript
// Create: src/personas/police/pages/PoliceNyayaBot.tsx
// This would be a police-specific chat interface
```

**Recommended:** Option A (Remove from Police sidebar)

---

### Task 1.3: Group Sidebar by Category
**File:** `src/shared/layout/PoliceLayout.tsx`  
**Priority:** 🟡 MEDIUM

#### Add Collapsible Sections
```typescript
interface NavSection {
    title: string;
    items: NavItem[];
    defaultOpen?: boolean;
}

const navSections: NavSection[] = [
    {
        title: 'Dashboard',
        items: [
            { path: '/police/dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { path: '/police/station', label: 'Station Overview', icon: Building }
        ],
        defaultOpen: true
    },
    {
        title: 'Crime Reporting',
        items: [
            { path: '/police/fir', label: 'Smart FIR', icon: Mic },
            { path: '/police/financial', label: 'Financial Analyzer', icon: TrendingUp }
        ]
    },
    {
        title: 'Case Management',
        items: [
            { path: '/police/evidence', label: 'Evidence Locker', icon: Lock },
            { path: '/police/case-linker', label: 'Case Linker', icon: Share2 }
        ]
    },
    {
        title: 'Investigation',
        items: [
            { path: '/police/investigation', label: 'Investigation Planner', icon: ClipboardList },
            { path: '/police/charge-sheet', label: 'Charge Sheet', icon: FileText },
            { path: '/police/witness', label: 'Witness Protection', icon: Users }
        ]
    },
    {
        title: 'Operations',
        items: [
            { path: '/police/warrants', label: 'Digital Warrants', icon: FileWarning },
            { path: '/police/crime-scene', label: '3D Crime Scene', icon: Box },
            { path: '/police/patrol', label: 'Patrol Map', icon: Map }
        ]
    },
    {
        title: 'Personnel',
        items: [
            { path: '/police/roster', label: 'Duty Roster', icon: Calendar }
        ]
    }
];
```

---

## Phase 2: Create Missing Skills (08 & 09)

### 🎯 Objective
Create Skills 08 (Forensic Interlock) and 09 (Evidence Hasher) from scratch.

**Estimated Time:** 10-12 hours

---

### Skill 08: Forensic Interlock ⭐ NEW

#### Page 2.1: Forensic Interlock Dashboard
**File:** `src/personas/police/pages/ForensicInterlock.tsx`  
**Route:** `/police/forensic`  
**Priority:** 🔴 CRITICAL

#### Purpose
Digital evidence chain of custody with forensic lab integration.

#### UI Layout
```
┌─────────────────────────────────────────────────────────────┐
│  Forensic Interlock                             [+ Request] │
├─────────────────────────────────────────────────────────────┤
│  Manage digital evidence chain of custody                  │
├─────────────────────────────────────────────────────────────┤
│  Filter: [All Statuses ▼] [Case ID...              ] 🔍    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 📁 Evidence Item: Mobile Phone - FIR-2025-001       │   │
│  │                                                     │   │
│  │ Status: 🔬 At Forensic Lab                          │   │
│  │ Chain of Custody:                                   │   │
│  │  1. Seized by SI Sharma (12 Feb, 10:00 AM)         │   │
│  │  2. Received at PS (12 Feb, 11:30 AM)              │   │
│  │  3. Sent to FSL (13 Feb, 09:00 AM)                 │   │
│  │  4. Received at FSL (13 Feb, 02:00 PM)             │   │
│  │  5. Analysis in Progress (Current)                 │   │
│  │                                                     │   │
│  │ [View Details] [Download Report] [Request Analysis]│   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Lab Integration:                                           │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │ 🧪 FSL Delhi │ │ 🧪 CFSL      │ │ 🧪 Private   │       │
│  │ 12 pending   │ │ 8 pending    │ │ 3 pending    │       │
│  │ [Connect]    │ │ [Connect]    │ │ [Connect]    │       │
│  └──────────────┘ └──────────────┘ └──────────────┘       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Key Features
1. **Chain of Custody** - Track evidence from seizure to court
2. **Lab Integration** - Connect with FSL/CFSL systems
3. **Report Management** - Receive and store forensic reports
4. **Expert Coordination** - Manage expert witnesses
5. **Status Tracking** - Real-time evidence status

#### Backend Service
```python
# backend/app/services/forensic_service.py
class ForensicService:
    def create_evidence_request(self, case_id: str, evidence_type: str) -> ForensicRequest:
        """Create forensic analysis request"""
        pass
    
    def update_custody(self, evidence_id: str, officer_id: str, location: str) -> CustodyEntry:
        """Update chain of custody"""
        pass
    
    def receive_report(self, request_id: str, report: bytes) -> ForensicReport:
        """Receive forensic lab report"""
        pass
    
    def get_custody_chain(self, evidence_id: str) -> List[CustodyEntry]:
        """Get complete custody chain"""
        pass
```

---

### Skill 09: Evidence Hasher ⭐ NEW

#### Page 2.2: Evidence Hasher Dashboard
**File:** `src/personas/police/pages/EvidenceHasher.tsx`  
**Route:** `/police/hasher`  
**Priority:** 🔴 CRITICAL

#### Purpose
Blockchain-based evidence integrity with SHA-256 hashing.

#### UI Layout
```
┌─────────────────────────────────────────────────────────────┐
│  Evidence Hasher                                [+ Upload] │
├─────────────────────────────────────────────────────────────┤
│  Blockchain-based evidence integrity verification          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Upload Evidence for Hashing:                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │          📤 Drop files here or click to upload     │   │
│  │                                                     │   │
│  │     Supports: Images, Videos, Documents, Audio     │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Recent Hashes:                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ File              Hash (SHA-256)          Status    │   │
│  │ ────────────────────────────────────────────────────│   │
│  │ crime_scene.jpg   a1b2c3d4...e5f6     ✅ Verified  │   │
│  │ witness_stmt.pdf  b2c3d4e5...f6g7     ✅ Verified  │   │
│  │ cctv_footage.mp4  c3d4e5f6...g7h8     ✅ Verified  │   │
│  │                                                     │   │
│  │ [Verify All] [Export Hashes] [Blockchain View]     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  🔗 Blockchain Attestation:                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Network: Hyperledger Fabric (Justice Network)      │   │
│  │ Last Block: #45,892                                │   │
│  │ Evidence Records: 12,847                           │   │
│  │ Network Status: ✅ Active                          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Key Features
1. **SHA-256 Hashing** - Generate cryptographic hash of evidence
2. **Blockchain Storage** - Store hash on blockchain for immutability
3. **Tamper Detection** - Verify evidence integrity anytime
4. **Hash Verification** - Compare file against stored hash
5. **Batch Processing** - Hash multiple files at once

#### Backend Service
```python
# backend/app/services/hasher_service.py
import hashlib
from typing import List

class EvidenceHasherService:
    def generate_hash(self, file_bytes: bytes) -> str:
        """Generate SHA-256 hash of file"""
        return hashlib.sha256(file_bytes).hexdigest()
    
    def store_on_blockchain(self, evidence_id: str, file_hash: str) -> BlockchainReceipt:
        """Store hash on blockchain"""
        # Connect to Hyperledger Fabric
        # Store hash with timestamp
        # Return receipt
        pass
    
    def verify_integrity(self, evidence_id: str, file_bytes: bytes) -> bool:
        """Verify file matches stored hash"""
        current_hash = self.generate_hash(file_bytes)
        stored_hash = self.get_stored_hash(evidence_id)
        return current_hash == stored_hash
    
    def batch_hash(self, files: List[bytes]) -> List[HashResult]:
        """Hash multiple files"""
        return [self.generate_hash(f) for f in files]
```

---

## Phase 3: Skill Enhancements

### 🎯 Objective
Add advanced features to Skills 01-07, 10-11 for production use.

**Estimated Time:** 12-15 hours

---

### Skill 01: Smart-FIR Enhancements

#### Page 3.1: FIR History & Templates
**File:** `src/personas/police/pages/FIRHistory.tsx`  
**Route:** `/police/fir/history`  
**Priority:** 🟠 HIGH

#### Features
- FIR history tracking
- Template library (common complaint types)
- Batch FIR processing
- Duplicate detection
- Analytics dashboard

---

### Skill 02: Financial Analyzer Enhancements

#### Page 3.2: Financial Report Export
**File:** `src/personas/police/pages/FinancialReport.tsx`  
**Route:** `/police/financial/report`  
**Priority:** 🟠 HIGH

#### Features
- PDF/Excel report export
- Case linking with financial data
- Court-ready presentation
- Evidence packaging

---

### Skill 03: Evidence Locker Enhancements

#### Page 3.3: Batch Upload & Chain View
**File:** `src/personas/police/components/BatchEvidenceUpload.tsx`  
**Priority:** 🟡 MEDIUM

#### Features
- Drag & drop multiple files
- Batch hash generation
- Chain of custody timeline
- Tamper alerts

---

### Skill 04: Case Linker Enhancements

#### Page 3.4: MO Analysis & Serial Offenders
**File:** `src/personas/police/pages/SerialOffenderAnalysis.tsx`  
**Route:** `/police/case-linker/serial`  
**Priority:** 🟠 HIGH

#### Features
- Modus Operandi pattern analysis
- Serial offender identification
- Geographic crime mapping
- Predictive linking

---

### Skill 05: Charge Sheet Builder Enhancements

#### Page 3.5: PDF Export & Digital Signature
**File:** `src/personas/police/components/ChargeSheetExport.tsx`  
**Priority:** 🟠 HIGH

#### Features
- PDF generation
- Digital signature integration
- Court e-filing ready
- Template customization

---

### Skill 06: Witness Protection Enhancements

#### Page 3.6: Threat Assessment & Anonymous IDs
**File:** `src/personas/police/components/WitnessThreatAssessment.tsx`  
**Priority:** 🟡 MEDIUM

#### Features
- Threat level calculator
- Anonymous ID generation (W-XXXXX)
- Protection measures tracking
- Contact schedule

---

### Skill 07: Investigation Planner Enhancements

#### Page 3.7: Gantt Chart & Resource Allocation
**File:** `src/personas/police/components/InvestigationGantt.tsx`  
**Priority:** 🟡 MEDIUM

#### Features
- Gantt chart visualization
- Resource allocation
- Critical path analysis
- Deadline alerts

---

### Skill 10: Digital Warrant Enhancements

#### Page 3.8: Warrant Execution Tracking
**File:** `src/personas/police/components/WarrantExecution.tsx`  
**Priority:** 🟡 MEDIUM

#### Features
- Execution status tracking
- GPS location logging
- Result documentation
- Post-execution report

---

### Skill 11: Duty Roster Enhancements

#### Page 3.9: Shift Swapping & Leave Management
**File:** `src/personas/police/components/ShiftSwap.tsx`  
**Priority:** 🟡 MEDIUM

#### Features
- Shift swap requests
- Leave management
- Availability tracking
- Overtime calculation

---

## Phase 4: Supporting Features

### 🎯 Objective
Create supporting pages and components.

**Estimated Time:** 4-5 hours

---

### Page 4.1: Station Dashboard
**File:** `src/personas/police/pages/StationDashboard.tsx` (Update)  
**Route:** `/police/station`  
**Priority:** 🟡 MEDIUM

#### Purpose
Station-level overview for SHO/Inspector.

#### Features
- Station-wise FIR statistics
- Officer performance metrics
- Resource allocation
- Compliance dashboard

---

## Implementation Details

### Complete File Structure

```
src/
├── shared/layout/
│   └── PoliceLayout.tsx                    # UPDATE - New sidebar
│
├── personas/police/pages/
│   ├── PoliceDashboard.tsx                 # ✅ Existing
│   ├── StationDashboard.tsx                # ✅ Existing
│   ├── SmartFIR.tsx                        # ✅ Existing (Skill 01)
│   ├── FinancialAnalyzer.tsx               # ✅ Existing (Skill 02)
│   ├── EvidenceLocker.tsx                  # ✅ Existing (Skill 03)
│   ├── CaseLinker.tsx                      # ✅ Existing (Skill 04)
│   ├── ChargeSheetBuilder.tsx              # ✅ Existing (Skill 05)
│   ├── WitnessTracker.tsx                  # ✅ Existing (Skill 06)
│   ├── InvestigationPlanner.tsx            # ✅ Existing (Skill 07)
│   ├── DutyRoster.tsx                      # ✅ Existing (Skill 11)
│   ├── WarrantManagerPage.tsx              # ✅ Existing (Skill 10)
│   ├── CrimeScene3D.tsx                    # ✅ Existing
│   ├── PatrolMap.tsx                       # ✅ Existing
│   │
│   ├── NEW PAGES - Skills 08 & 09
│   ├── ForensicInterlock.tsx               # 🆕 Skill 08
│   ├── EvidenceHasher.tsx                  # 🆕 Skill 09
│   │
│   ├── NEW PAGES - Enhancements
│   ├── FIRHistory.tsx                      # 🆕 Skill 01 enhancement
│   ├── FinancialReport.tsx                 # 🆕 Skill 02 enhancement
│   ├── SerialOffenderAnalysis.tsx          # 🆕 Skill 04 enhancement
│   │
│   └── UPDATES
│       └── [Various component updates]
│
├── personas/police/components/             # 🆕 NEW COMPONENTS
│   ├── fir/
│   │   ├── FIRTemplateCard.tsx
│   │   ├── FIRHistoryTable.tsx
│   │   └── DuplicateDetector.tsx
│   │
│   ├── financial/
│   │   ├── TransactionGraph.tsx
│   │   ├── AnomalyList.tsx
│   │   └── ReportExporter.tsx
│   │
│   ├── evidence/
│   │   ├── BatchUploadZone.tsx
│   │   ├── CustodyTimeline.tsx
│   │   └── TamperAlert.tsx
│   │
│   ├── forensic/                           # 🆕 NEW
│   │   ├── ChainOfCustody.tsx
│   │   ├── LabConnector.tsx
│   │   ├── ReportViewer.tsx
│   │   └── ExpertWitnessManager.tsx
│   │
│   ├── hasher/                             # 🆕 NEW
│   │   ├── HashGenerator.tsx
│   │   ├── BlockchainViewer.tsx
│   │   ├── VerifyIntegrity.tsx
│   │   └── HashHistoryTable.tsx
│   │
│   ├── caselinker/
│   │   ├── NetworkGraph.tsx
│   │   ├── PatternAnalyzer.tsx
│   │   └── SimilarityScore.tsx
│   │
│   ├── chargesheet/
│   │   ├── SectionSelector.tsx
│   │   ├── AccusedManager.tsx
│   │   ├── PDFPreview.tsx
│   │   └── DigitalSignature.tsx
│   │
│   ├── witness/
│   │   ├── ThreatCalculator.tsx
│   │   ├── AnonymousIDGenerator.tsx
│   │   ├── ProtectionMeasures.tsx
│   │   └── ContactSchedule.tsx
│   │
│   ├── investigation/
│   │   ├── TaskBoard.tsx
│   │   ├── GanttChart.tsx
│   │   ├── ResourceAllocator.tsx
│   │   └── DeadlineTracker.tsx
│   │
│   ├── warrant/
│   │   ├── WarrantRequestForm.tsx
│   │   ├── ApprovalQueue.tsx
│   │   ├── ExecutionTracker.tsx
│   │   └── VerificationPortal.tsx
│   │
│   └── roster/
│       ├── ShiftCalendar.tsx
│       ├── SwapRequestForm.tsx
│       ├── LeaveManager.tsx
│       └── OvertimeCalculator.tsx
│
├── core/services/
│   ├── policeService.ts                    # ✅ Existing
│   ├── firService.ts                       # ✅ Existing
│   ├── financialService.ts                 # ✅ Existing
│   ├── evidenceService.ts                  # ✅ Existing
│   ├── caseLinkerService.ts                # ✅ Existing
│   ├── chargeSheetService.ts               # ✅ Existing
│   ├── witnessService.ts                   # ✅ Existing
│   ├── investigationService.ts             # ✅ Existing
│   ├── warrantService.ts                   # ✅ Existing
│   ├── dutyService.ts                      # ✅ Existing
│   ├── forensicService.ts                  # 🆕 NEW
│   └── hasherService.ts                    # 🆕 NEW
│
└── core/hooks/
    ├── useFIR.ts                           # 🆕 FIR-specific hooks
    ├── useEvidence.ts                      # 🆕 Evidence hooks
    ├── useForensic.ts                      # 🆕 Forensic hooks
    └── useHasher.ts                        # 🆕 Hasher hooks
```

---

### Route Configuration Updates

```typescript
// App.tsx - Update police routes

<Route element={<ProtectedRoute allowedRoles={['POLICE']} />}>
  <Route path="/police" element={<PoliceLayout />}>
    
    {/* Dashboard */}
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard" element={<PoliceDashboard />} />
    <Route path="station" element={<StationDashboard />} />
    
    {/* Skill 01: Smart-FIR */}
    <Route path="fir" element={<SmartFIR />} />
    <Route path="fir/history" element={<FIRHistory />} />
    
    {/* Skill 02: Financial Analyzer */}
    <Route path="financial" element={<FinancialAnalyzer />} />
    <Route path="financial/report" element={<FinancialReport />} />
    
    {/* Skill 03: Evidence Locker */}
    <Route path="evidence" element={<EvidenceLocker />} />
    
    {/* Skill 04: Case Linker */}
    <Route path="case-linker" element={<CaseLinker />} />
    <Route path="case-linker/serial" element={<SerialOffenderAnalysis />} />
    
    {/* Skill 05: Charge Sheet Builder */}
    <Route path="charge-sheet" element={<ChargeSheetBuilder />} />
    
    {/* Skill 06: Witness Protection */}
    <Route path="witness" element={<WitnessTracker />} />
    
    {/* Skill 07: Investigation Planner */}
    <Route path="investigation" element={<InvestigationPlanner />} />
    
    {/* Skill 08: Forensic Interlock - NEW */}
    <Route path="forensic" element={<ForensicInterlock />} />
    
    {/* Skill 09: Evidence Hasher - NEW */}
    <Route path="hasher" element={<EvidenceHasher />} />
    
    {/* Skill 10: Digital Warrant */}
    <Route path="warrants" element={<WarrantManagerPage />} />
    
    {/* Skill 11: Duty Roster */}
    <Route path="roster" element={<DutyRoster />} />
    
    {/* Supporting Pages */}
    <Route path="crime-scene" element={<CrimeScene3DPage />} />
    <Route path="patrol" element={<PatrolMapPage />} />
    
  </Route>
</Route>
```

---

## Testing Checklist

### Navigation Tests
- [ ] All sidebar links navigate correctly
- [ ] Active state shows for current route
- [ ] Sidebar collapse/expand works
- [ ] Tooltips show on collapsed state
- [ ] BNSS timer widget displays

### Skill 01: Smart-FIR
- [ ] AI section detection works
- [ ] Voice input functions
- [ ] FIR number generated
- [ ] History page loads

### Skill 02: Financial Analyzer
- [ ] Graph visualization renders
- [ ] Anomaly detection works
- [ ] Report export functions

### Skill 03: Evidence Locker
- [ ] File upload works
- [ ] Chain of custody displays
- [ ] Evidence categorized

### Skills 04-07: Core Tools
- [ ] Case linking works
- [ ] Charge sheet generates
- [ ] Witness protection functions
- [ ] Investigation plans create

### Skill 08: Forensic Interlock (NEW)
- [ ] Chain of custody tracks
- [ ] Lab integration connects
- [ ] Reports received

### Skill 09: Evidence Hasher (NEW)
- [ ] SHA-256 hashes generate
- [ ] Blockchain stores hash
- [ ] Tamper detection works

### Skill 10: Digital Warrant
- [ ] Warrant requests create
- [ ] Approval workflow functions
- [ ] Execution tracked

### Skill 11: Duty Roster
- [ ] Shifts scheduled
- [ ] Officers assigned
- [ ] Roster displays

---

## Implementation Timeline

### Week 1: Navigation Fix (Days 1-2)
**Day 1:**
- Update PoliceLayout.tsx with new navItems
- Add missing icon imports
- Test all navigation links
- Remove/fix NyayaBot link

**Day 2:**
- Add collapsible sidebar sections
- Test sidebar collapse/expand
- Verify all skills accessible

### Week 2: Create Skills 08 & 09 (Days 3-6)
**Day 3-4:**
- Create ForensicInterlock.tsx
- Create forensic service
- Create chain of custody components

**Day 5-6:**
- Create EvidenceHasher.tsx
- Create hasher service
- Implement SHA-256 hashing
- Add blockchain integration

### Week 3: Skill Enhancements (Days 7-10)
**Day 7:**
- Create FIRHistory.tsx
- Create FinancialReport.tsx

**Day 8:**
- Create SerialOffenderAnalysis.tsx
- Update ChargeSheetBuilder with export

**Day 9:**
- Create WitnessThreatAssessment.tsx
- Create InvestigationGantt.tsx

**Day 10:**
- Create WarrantExecution.tsx
- Create ShiftSwap.tsx

### Week 4: Polish (Days 11-14)
**Day 11-12:**
- Update StationDashboard.tsx
- Create placeholder pages

**Day 13-14:**
- Testing and bug fixes
- Responsive design checks
- Performance optimization

---

## Summary

### What You're Getting

**Phase 1: Fixed Navigation (1-2h)**
- ✅ All existing pages accessible
- ✅ Organized 6-section sidebar
- ✅ Removed broken NyayaBot link

**Phase 2: New Skills (10-12h)**
- 🆕 Skill 08: Forensic Interlock
- 🆕 Skill 09: Evidence Hasher
- 🆕 Blockchain integration
- 🆕 Chain of custody tracking

**Phase 3: Skill Enhancements (12-15h)**
- 🆕 8+ enhancement pages
- 🆕 PDF export features
- 🆕 Analytics dashboards
- 🆕 Advanced tooling

**Phase 4: Supporting (4-5h)**
- 🆕 Station Dashboard updates
- 🆕 Placeholder pages
- ✅ Complete testing

### Total Deliverables
- **17+ pages** (existing + new)
- **6-section organized sidebar**
- **All 11 skills (01-11)** covered
- **2 completely new skills**
- **Production-ready features**

### Time Estimate
- **Phase 1:** 1-2 hours
- **Phase 2:** 10-12 hours
- **Phase 3:** 12-15 hours
- **Phase 4:** 4-5 hours
- **Total:** 27-34 hours

---

**Critical Issue to Fix First:** Add 8 missing pages to sidebar (Financial, Case Linker, Charge Sheet, Witness, Investigation, Duty Roster, Station Dashboard)! ⚡

**Ready to implement!** 🚀
