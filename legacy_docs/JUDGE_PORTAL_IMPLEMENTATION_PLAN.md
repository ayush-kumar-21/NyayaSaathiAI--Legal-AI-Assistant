# Judge Portal Implementation Plan
## LegalOS 4.0 - Sidebar & Skill Enhancement Guide

**Version:** 1.0  
**Date:** February 12, 2026  
**Status:** 📋 Ready for Implementation  
**Estimated Duration:** 25-30 hours  
**Skills Coverage:** 12-18 (All 7 Judge Skills)

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

Your Judge Portal has **7 sidebar items** but **many critical pages exist but aren't linked**. Skills 12-18 have basic implementations but need advanced features and proper navigation integration.

### Key Issues Found

| Issue | Current State | Impact |
|-------|--------------|--------|
| Missing Sidebar Links | 7 pages exist but aren't in sidebar | 🔴 Broken navigation |
| Skill 13 (Sentencing) | Page exists, NOT in sidebar | 🔴 Inaccessible |
| Skill 14 (Bench Memo) | Page exists, NOT in sidebar | 🔴 Inaccessible |
| Skill 15 (Moot Court) | Page exists, NOT in sidebar | 🔴 Inaccessible |
| Skill 17 (Case Queue) | Page exists, NOT in sidebar | 🔴 Inaccessible |
| Skill 18 (Wellness) | Page exists, NOT in sidebar | 🔴 Inaccessible |
| Skill 16 (Smart Orders) | Missing entirely | ⚠️ Not implemented |

### Solution Overview

**Phase 1:** Add all existing pages to sidebar  
**Phase 2:** Enhance Skills 12-18 with advanced features  
**Phase 3:** Create Smart Orders (Skill 16)  
**Phase 4:** Add supporting workflow features

---

## Current State Analysis

### Existing Sidebar Structure (7 items)

```typescript
// JudgeLayout.tsx - Current navItems
const navItems = [
    { path: '/judge/board', label: 'Case Board', icon: LayoutDashboard },         // ✅ Works
    { path: '/judge/urgency', label: 'Urgency Matrix', icon: AlertTriangle },     // ❓ Unknown
    { path: '/judge/virtual-court', label: 'Virtual Courtroom', icon: Video },    // ❓ Unknown
    { path: '/judge/draft', label: 'Draft & Audit', icon: PenTool },              // ❓ Unknown
    { path: '/judge/evidence', label: 'Evidence Vault', icon: Briefcase },        // ❓ Unknown
    { path: '/judge/bail', label: 'Smart Bail', icon: Scale },                    // ✅ Works (Skill 12)
    { path: '/judge/orders', label: 'Orders History', icon: FileText },           // ✅ Works
];
```

### Existing Pages Inventory (15 pages found!)

| Page File | Route | In Sidebar? | Status | Skill |
|-----------|-------|-------------|--------|-------|
| JudgeBoard.tsx | `/judge/board` | ✅ Yes | Working | - |
| BailReckoner.tsx | `/judge/bail` | ✅ Yes | Working | 12 |
| SmartBailPage.tsx | `/judge/smart-bail` | ❌ No | Working | 12 |
| SentencingAssistant.tsx | `/judge/sentencing` | ❌ **NO** | Working | 13 |
| BenchMemoGenerator.tsx | `/judge/bench-memo` | ❌ **NO** | Working | 14 |
| VirtualMootCourt.tsx | `/judge/moot-court` | ❌ **NO** | Working | 15 |
| CaseQueuePage.tsx | `/judge/queue` | ❌ **NO** | Working | 17 |
| JudgeWellness.tsx | `/judge/wellness` | ❌ **NO** | Working | 18 |
| JudgmentValidatorPage.tsx | `/judge/validate` | ❌ No | Working | - |
| CaseIntakeTriagePage.tsx | `/judge/triage` | ❌ No | Working | - |
| OrdersHistory.tsx | `/judge/orders` | ✅ Yes | Working | - |
| HashVerifier.tsx | `/judge/verify` | ❌ No | Working | - |
| JudgeDashboard.tsx | `/judge/dashboard` | ❌ No | Working | - |
| UrgencyMatrixPage | `/judge/urgency` | ✅ Yes | Unknown | - |
| VirtualCourtPage | `/judge/virtual-court` | ✅ Yes | Unknown | - |

### Critical Finding
**6 PAGES EXIST but are NOT in the sidebar!** Users can't access:
- Sentencing Assistant (Skill 13) ❌
- Bench Memo Generator (Skill 14) ❌
- Virtual Moot Court (Skill 15) ❌
- Case Queue Optimizer (Skill 17) ❌
- Judge Wellness (Skill 18) ❌
- Smart Bail Page ❌

---

## Skills Overview

### Skill 12: Bail Reckoner (⚠️ PARTIAL)
**Status:** Basic UI exists, needs enhancements
**Current:** `/judge/bail` - Basic risk assessment form
**Missing:** 
- Bail history tracking
- Similar case comparison
- Advanced conditions builder
- Surety calculator

### Skill 13: Sentencing Assistant (❌ NOT ACCESSIBLE)
**Status:** Page exists, NOT in sidebar
**Current:** `/judge/sentencing` - Works but unreachable
**Missing:**
- Sidebar link
- Precedent browser
- Guideline visualization
- Rehabilitation tracker

### Skill 14: Bench Memo Generator (❌ NOT ACCESSIBLE)
**Status:** Page exists, NOT in sidebar
**Current:** `/judge/bench-memo` - Works but unreachable
**Missing:**
- Sidebar link
- Template library
- Export to PDF/DOCX
- Memo history

### Skill 15: Virtual Moot Court (❌ NOT ACCESSIBLE)
**Status:** Page exists, NOT in sidebar
**Current:** `/judge/moot-court` - Works but unreachable
**Missing:**
- Sidebar link
- Case scenario library
- Recording playback
- Performance evaluation

### Skill 16: Smart Orders (❌ MISSING ENTIRELY)
**Status:** Not implemented
**Missing:** Everything
**Needs:**
- Order template library
- Auto-fill from case data
- Legal language AI
- Digital signature
- Order tracking

### Skill 17: Case Queue Optimizer (❌ NOT ACCESSIBLE)
**Status:** Page exists, NOT in sidebar
**Current:** `/judge/queue` - Works but unreachable
**Missing:**
- Sidebar link
- Priority matrix visualization
- Judge assignment logic
- Queue analytics

### Skill 18: Judge Wellness (❌ NOT ACCESSIBLE)
**Status:** Page exists, NOT in sidebar
**Current:** `/judge/wellness` - Works but unreachable
**Missing:**
- Sidebar link
- Workload analytics
- Stress trend tracking
- Peer support network

---

## Sidebar Restructuring

### Proposed New Sidebar Structure

```
┌─ ⚖️ JUDICIAL BOARD ──────────────────┐
│  ◉ Case Board                        │
│  ○ Today's Cause List                │
├─ 🔍 PRE-HEARING ─────────────────────┤
│  ○ Bail Reckoner                     │
│  ○ Case Queue Optimizer              │
│  ○ Urgency Matrix                    │
├─ 📝 DURING HEARING ──────────────────┤
│  ○ Bench Memo Generator              │
│  ○ Virtual Moot Court                │
│  ○ Evidence Vault                    │
├─ ⚖️ POST-HEARING ────────────────────┤
│  ○ Sentencing Assistant              │
│  ○ Smart Orders                      │
│  ○ Judgment Validator                │
│  ○ Orders History                    │
├─ 👤 JUDGE SUPPORT ───────────────────┤
│  ○ Judge Wellness                    │
│  ○ Virtual Courtroom                 │
└───────────────────────────────────────┘
```

### Updated navItems Array

```typescript
const navItems = [
    // ⚖️ JUDICIAL BOARD
    { 
        path: '/judge/board', 
        label: 'Case Board', 
        labelHi: 'केस बोर्ड',
        icon: LayoutDashboard,
        category: 'board',
        description: 'Daily cause list and case management'
    },
    { 
        path: '/judge/queue', 
        label: 'Case Queue', 
        labelHi: 'केस कतार',
        icon: List,
        category: 'board',
        skill: 17,
        description: 'AI-optimized case prioritization'
    },
    
    // 🔍 PRE-HEARING
    { 
        path: '/judge/bail', 
        label: 'Bail Reckoner', 
        labelHi: 'जमानत गणक',
        icon: Scale,
        category: 'pre-hearing',
        skill: 12,
        description: 'AI bail risk assessment'
    },
    { 
        path: '/judge/urgency', 
        label: 'Urgency Matrix', 
        labelHi: 'प्राथमिकता मैट्रिक्स',
        icon: AlertTriangle,
        category: 'pre-hearing',
        description: 'Case urgency visualization'
    },
    
    // 📝 DURING HEARING
    { 
        path: '/judge/bench-memo', 
        label: 'Bench Memo', 
        labelHi: 'बेंच मेमो',
        icon: FileText,
        category: 'during-hearing',
        skill: 14,
        description: 'Auto-generate judicial summaries'
    },
    { 
        path: '/judge/moot-court', 
        label: 'Virtual Moot', 
        labelHi: 'वर्चुअल मूट',
        icon: Video,
        category: 'during-hearing',
        skill: 15,
        description: 'Practice courtroom simulation'
    },
    { 
        path: '/judge/evidence', 
        label: 'Evidence Vault', 
        labelHi: 'साक्ष्य भंडार',
        icon: Briefcase,
        category: 'during-hearing',
        description: 'Digital evidence management'
    },
    
    // ⚖️ POST-HEARING
    { 
        path: '/judge/sentencing', 
        label: 'Sentencing', 
        labelHi: 'सजा निर्धारण',
        icon: Gavel,
        category: 'post-hearing',
        skill: 13,
        description: 'AI sentencing recommendations'
    },
    { 
        path: '/judge/smart-orders', 
        label: 'Smart Orders', 
        labelHi: 'स्मार्ट आदेश',
        icon: PenTool,
        category: 'post-hearing',
        skill: 16,
        description: 'Automated order generation'
    },
    { 
        path: '/judge/validate', 
        label: 'Judgment Validator', 
        labelHi: 'निर्णय सत्यापक',
        icon: CheckCircle,
        category: 'post-hearing',
        description: 'Verify judgment compliance'
    },
    { 
        path: '/judge/orders', 
        label: 'Orders History', 
        labelHi: 'आदेश इतिहास',
        icon: History,
        category: 'post-hearing',
        description: 'Past orders archive'
    },
    
    // 👤 JUDGE SUPPORT
    { 
        path: '/judge/wellness', 
        label: 'Judge Wellness', 
        labelHi: 'न्यायाधीश कल्याण',
        icon: Heart,
        category: 'support',
        skill: 18,
        description: 'Workload & stress management'
    },
    { 
        path: '/judge/virtual-court', 
        label: 'Virtual Courtroom', 
        labelHi: 'ई-कोर्ट',
        icon: Monitor,
        category: 'support',
        description: 'Video conferencing'
    }
];
```

---

## Phase 1: Fix Missing Links

### 🎯 Objective
Add all existing pages to sidebar so Skills 13, 14, 15, 17, 18 become accessible.

**Estimated Time:** 1-2 hours

---

### Task 1.1: Update Sidebar Navigation
**File:** `src/shared/layout/JudgeLayout.tsx`  
**Priority:** 🔴 CRITICAL

#### Add Missing Imports
```typescript
// Add missing icon imports
import { 
    LayoutDashboard, 
    Scale, 
    PenTool, 
    Briefcase, 
    LogOut, 
    FileText, 
    Video, 
    AlertTriangle,
    Gavel,           // 🆕 Add for Sentencing
    Heart,           // 🆕 Add for Wellness
    List,            // 🆕 Add for Case Queue
    Monitor,         // 🆕 Add for Virtual Court
    CheckCircle      // 🆕 Add for Validator
} from 'lucide-react';
```

#### Update navItems Array
```typescript
const navItems = [
    // Judicial Board
    { path: '/judge/board', label: 'Case Board', labelHi: 'केस बोर्ड', icon: LayoutDashboard },
    
    // Pre-Hearing
    { path: '/judge/bail', label: 'Bail Reckoner', labelHi: 'जमानत गणक', icon: Scale },
    { path: '/judge/queue', label: 'Case Queue', labelHi: 'केस कतार', icon: List },           // 🆕 ADD
    { path: '/judge/urgency', label: 'Urgency Matrix', labelHi: 'प्राथमिकता', icon: AlertTriangle },
    
    // During Hearing
    { path: '/judge/bench-memo', label: 'Bench Memo', labelHi: 'बेंच मेमो', icon: FileText }, // 🆕 ADD
    { path: '/judge/moot-court', label: 'Virtual Moot', labelHi: 'वर्चुअल मूट', icon: Video }, // 🆕 ADD
    { path: '/judge/evidence', label: 'Evidence Vault', labelHi: 'साक्ष्य', icon: Briefcase },
    
    // Post-Hearing
    { path: '/judge/sentencing', label: 'Sentencing', labelHi: 'सजा निर्धारण', icon: Gavel }, // 🆕 ADD
    { path: '/judge/orders', label: 'Orders History', labelHi: 'आदेश', icon: History },
    
    // Judge Support
    { path: '/judge/wellness', label: 'Wellness', labelHi: 'कल्याण', icon: Heart },            // 🆕 ADD
    { path: '/judge/virtual-court', label: 'Virtual Court', labelHi: 'ई-कोर्ट', icon: Monitor }
];
```

---

### Task 1.2: Group Sidebar by Workflow Phase
**File:** `src/shared/layout/JudgeLayout.tsx`  
**Priority:** 🟡 MEDIUM

#### Add Collapsible Sections
```typescript
// Add section grouping
interface NavSection {
    title: string;
    titleHi: string;
    items: NavItem[];
    defaultOpen?: boolean;
}

const navSections: NavSection[] = [
    {
        title: 'Judicial Board',
        titleHi: 'न्यायिक बोर्ड',
        items: [
            { path: '/judge/board', label: 'Case Board', labelHi: 'केस बोर्ड', icon: LayoutDashboard },
            { path: '/judge/queue', label: 'Case Queue', labelHi: 'केस कतार', icon: List }
        ],
        defaultOpen: true
    },
    {
        title: 'Pre-Hearing',
        titleHi: 'सुनवाई से पहले',
        items: [
            { path: '/judge/bail', label: 'Bail Reckoner', labelHi: 'जमानत गणक', icon: Scale },
            { path: '/judge/urgency', label: 'Urgency Matrix', labelHi: 'प्राथमिकता', icon: AlertTriangle }
        ]
    },
    {
        title: 'During Hearing',
        titleHi: 'सुनवाई के दौरान',
        items: [
            { path: '/judge/bench-memo', label: 'Bench Memo', labelHi: 'बेंच मेमो', icon: FileText },
            { path: '/judge/moot-court', label: 'Virtual Moot', labelHi: 'वर्चुअल मूट', icon: Video },
            { path: '/judge/evidence', label: 'Evidence Vault', labelHi: 'साक्ष्य', icon: Briefcase }
        ]
    },
    {
        title: 'Post-Hearing',
        titleHi: 'सुनवाई के बाद',
        items: [
            { path: '/judge/sentencing', label: 'Sentencing', labelHi: 'सजा निर्धारण', icon: Gavel },
            { path: '/judge/orders', label: 'Orders History', labelHi: 'आदेश', icon: History }
        ]
    },
    {
        title: 'Judge Support',
        titleHi: 'न्यायाधीश सहायता',
        items: [
            { path: '/judge/wellness', label: 'Wellness', labelHi: 'कल्याण', icon: Heart },
            { path: '/judge/virtual-court', label: 'Virtual Court', labelHi: 'ई-कोर्ट', icon: Monitor }
        ]
    }
];
```

---

## Phase 2: Skill Enhancements

### 🎯 Objective
Add advanced features to Skills 12-18 for production use.

**Estimated Time:** 15-18 hours

---

### Skill 12: Bail Reckoner Enhancements

#### Page 2.1: Bail History & Analytics
**File:** `src/personas/judge/pages/BailHistory.tsx`  
**Route:** `/judge/bail/history`  
**Priority:** 🟠 HIGH

#### Purpose
Track bail decisions over time with analytics and trends.

#### UI Layout
```
┌─────────────────────────────────────────────────────────────┐
│  Bail Decision History                           [Export ↓] │
├─────────────────────────────────────────────────────────────┤
│  Period: [Last 90 Days ▼]  Case Type: [All ▼]   [Filter]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📊 Summary Cards:                                          │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐│
│  │ 127        │ │ 68%        │ │ ₹45,000    │ │ 4.2 days   ││
│  │ Decisions  │ │ Grant Rate │ │ Avg Amount │ │ Avg Time   ││
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘│
│                                                             │
│  📈 Trends:                                                 │
│  ┌─────────────────────┐ ┌─────────────────────┐           │
│  │ Grant Rate Trend    │ │ Bail Amount Dist.   │           │
│  │ [Line Chart]        │ │ [Histogram]         │           │
│  └─────────────────────┘ └─────────────────────┘           │
│                                                             │
│  📋 Recent Decisions:                                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Case          Date     Decision    Amount   Risk    │   │
│  │ ────────────────────────────────────────────────────│   │
│  │ CRL-2025-001  12 Feb   Granted    ₹50,000   Low    │   │
│  │ CRL-2025-002  11 Feb   Rejected   -         High   │   │
│  │ CRL-2025-003  10 Feb   Conditional ₹25,000  Medium │   │
│  │ ...                                                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Key Features
1. **Decision Statistics** - Grant rate, average amount, processing time
2. **Trend Analysis** - Charts showing patterns over time
3. **Case Comparison** - Compare with similar cases
4. **Export Reports** - PDF/Excel for court records

---

#### Page 2.2: Advanced Bail Conditions Builder
**File:** `src/personas/judge/components/BailConditionsBuilder.tsx`  
**Route:** Part of BailReckoner  
**Priority:** 🟡 MEDIUM

#### Purpose
Visual builder for complex bail conditions.

#### UI Layout
```
┌─────────────────────────────────────────────────────────────┐
│  Bail Conditions Builder                                   │
├─────────────────────────────────────────────────────────────┤
│  Select conditions to apply:                                │
│                                                             │
│  ☐ Surrender Passport                                    │
│  ☐ Weekly Police Reporting (Select day: [Monday ▼])      │
│  ☐ Fixed Residence (Address: [________________])         │
│  ☐ No Contact with Witnesses                             │
│  ☐ Surety Bond (Amount: ₹[________])                     │
│  ☐ Electronic Monitoring                                 │
│  ☐ Curfew (________ to ________)                         │
│  ☐ Travel Restrictions (Within: [District ▼])            │
│  ☐ Community Service (Hours: [____])                     │
│  ☐ Regular Court Appearances                             │
│                                                             │
│  📋 Generated Conditions Text:                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ The accused shall:                                  │   │
│  │ 1. Surrender passport within 7 days                 │   │
│  │ 2. Report to police station every Monday           │   │
│  │ 3. Not leave Delhi NCT without permission          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  [Preview Order]  [Save Template]  [Apply to Case]         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### Skill 13: Sentencing Assistant Enhancements

#### Page 2.3: Precedent Browser
**File:** `src/personas/judge/pages/SentencingPrecedents.tsx`  
**Route:** `/judge/sentencing/precedents`  
**Priority:** 🟠 HIGH

#### Purpose
Browse and compare similar sentencing cases.

#### UI Layout
```
┌─────────────────────────────────────────────────────────────┐
│  Sentencing Precedents                          [Compare ↓] │
├─────────────────────────────────────────────────────────────┤
│  Search: [BNS 303...                    ]  [🔍 Search]     │
│  Filters: [Offense ▼] [Year ▼] [Court ▼] [Severity ▼]      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Similar Cases Found: 47                                    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ⚖️ Case: State vs. Rajesh Kumar (2024)              │   │
│  │ Offense: BNS 303(2) - Murder                        │   │
│  │ Sentence: Life Imprisonment + ₹10,000 fine         │   │
│  │ Aggravating: Brutality, Premeditated               │   │
│  │ Mitigating: First offense, Family dependents       │   │
│  │ [View Details] [Add to Comparison]                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  📊 Comparison Matrix:                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Factor        | Case 1 | Case 2 | Case 3 | Average  │   │
│  │ ────────────────────────────────────────────────────│   │
│  │ Offense       | 303(2) | 303(2) | 303(1) | -       │   │
│  │ Sentence      | Life   | 20 yrs  | 10 yrs  | -      │   │
│  │ Fine          | ₹10K   | ₹25K   | ₹5K    | ₹13.3K  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### Skill 14: Bench Memo Generator Enhancements

#### Page 2.4: Memo Template Library
**File:** `src/personas/judge/pages/BenchMemoTemplates.tsx`  
**Route:** `/judge/bench-memo/templates`  
**Priority:** 🟡 MEDIUM

#### Purpose
Manage reusable bench memo templates.

#### UI Layout
```
┌─────────────────────────────────────────────────────────────┐
│  Bench Memo Templates                           [+ Create]  │
├─────────────────────────────────────────────────────────────┤
│  Category: [All ▼] [Search templates...              ] 🔍  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │ 📝           │ │ 📝           │ │ 📝           │       │
│  │ Bail         │ │ Criminal     │ │ Civil        │       │
│  │ Application  │ │ Appeal       │ │ Suit         │       │
│  │ Review       │ │ Memo         │ │ Memo         │       │
│  │              │ │              │ │              │       │
│  │ [Use] [Edit] │ │ [Use] [Edit] │ │ [Use] [Edit] │       │
│  └──────────────┘ └──────────────┘ └──────────────┘       │
│                                                             │
│  Template Editor:                                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Title: [Bail Application Review       ]            │   │
│  │                                                     │   │
│  │ Sections: ☑ Facts  ☑ Issues  ☑ Arguments          │   │
│  │           ☑ Evidence  ☑ Precedents  ☑ Conclusion  │   │
│  │                                                     │   │
│  │ Auto-Extract: ☑ Dates  ☑ Names  ☑ Sections        │   │
│  │                                                     │   │
│  │ [Save Template] [Preview] [Export]                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### Skill 15: Virtual Moot Court Enhancements

#### Page 2.5: Case Scenario Library
**File:** `src/personas/judge/pages/MootScenarioLibrary.tsx`  
**Route:** `/judge/moot-court/scenarios`  
**Priority:** 🟡 MEDIUM

#### Purpose
Library of case scenarios for moot court practice.

#### UI Layout
```
┌─────────────────────────────────────────────────────────────┐
│  Moot Court Scenarios                           [+ Create]  │
├─────────────────────────────────────────────────────────────┤
│  Category: [Criminal ▼] [Search...                    ] 🔍  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ⚖️ Scenario: Murder Trial Simulation                │   │
│  │ Type: Criminal | Difficulty: Hard | Duration: 2hrs │   │
│  │                                                     │   │
│  │ Facts: Accused charged under BNS 303. Multiple    │   │
│  │ witnesses, forensic evidence, motive established.  │   │
│  │                                                     │   │
│  │ Roles: Judge (1) | Prosecution (1) | Defense (1)  │   │
│  │                                                     │   │
│  │ [Start Session] [Preview] [Edit] [Duplicate]       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Recent Sessions:                                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Date       Scenario              Role      Score    │   │
│  │ ────────────────────────────────────────────────────│   │
│  │ 12 Feb     Murder Trial          Judge     85/100  │   │
│  │ 10 Feb     Property Dispute      Advocate  78/100  │   │
│  │ ...                                                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### Skill 16: Smart Orders (NEW SKILL)

#### Page 2.6: Smart Orders Generator ⭐ NEW
**File:** `src/personas/judge/pages/SmartOrders.tsx`  
**Route:** `/judge/smart-orders`  
**Priority:** 🔴 CRITICAL

#### Purpose
Automated generation of court orders with templates and legal language AI.

#### UI Layout
```
┌─────────────────────────────────────────────────────────────┐
│  Smart Orders Generator                         [+ Create] │
├─────────────────────────────────────────────────────────────┤
│  Select order type or start from template:                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Order Categories:                                          │
│  [Bail Orders] [Remand] [Release] [Transfer] [Misc ▼]      │
│                                                             │
│  Recent Templates:                                          │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │ 📄           │ │ 📄           │ │ 📄           │       │
│  │ Bail Grant   │ │ Bail Reject  │ │ Custody      │       │
│  │ Standard     │ │ Default      │ │ Remand       │       │
│  │              │ │              │ │              │       │
│  │ [Use]        │ │ [Use]        │ │ [Use]        │       │
│  └──────────────┘ └──────────────┘ └──────────────┘       │
│                                                             │
│  Order Editor:                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Order Type: [Bail Order ▼]                         │   │
│  │ Case No: [CRL-APP-2025-001          ]              │   │
│  │                                                     │   │
│  │ ☑ Auto-fill from case data                         │   │
│  │ ☑ Apply legal language AI                          │   │
│  │ ☑ Include standard conditions                      │   │
│  │                                                     │   │
│  │ Content:                                            │
│  │ ┌───────────────────────────────────────────────┐  │   │
│  │ │ Upon hearing the learned counsel for the      │  │   │
│  │ │ parties and perusing the case records...      │  │   │
│  │ │                                                 │  │   │
│  │ │ [AI-generated order text appears here]        │  │   │
│  │ └───────────────────────────────────────────────┘  │   │
│  │                                                     │   │
│  │ [🤖 Regenerate with AI] [✏️ Manual Edit]          │   │
│  │                                                     │   │
│  │ [Preview PDF] [Save Draft] [Sign & Issue]         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Key Features
1. **Template Library** - Pre-built order templates
2. **Auto-Fill** - Pull case data automatically
3. **Legal Language AI** - Suggest professional language
4. **Standard Clauses** - Insert common legal clauses
5. **Digital Signature** - Ready for e-signature
6. **Export** - PDF/DOCX formats

#### Backend Service
```python
# backend/app/services/orders_service.py
class SmartOrdersService:
    def generate_order(self, case_id: str, order_type: str) -> Order:
        """Generate court order from template"""
        template = self.get_template(order_type)
        case_data = self.fetch_case_data(case_id)
        
        order = template.fill(case_data)
        order.apply_legal_language()
        
        return order
    
    def get_templates(self) -> List[OrderTemplate]:
        """Get available order templates"""
        return [
            OrderTemplate("bail_grant", "Bail Grant Order"),
            OrderTemplate("bail_reject", "Bail Rejection Order"),
            OrderTemplate("custody_remand", "Custody Remand Order"),
            OrderTemplate("discharge", "Discharge Order"),
            OrderTemplate("transfer", "Transfer Order")
        ]
```

---

### Skill 17: Case Queue Optimizer Enhancements

#### Page 2.7: Priority Matrix Dashboard
**File:** `src/personas/judge/components/PriorityMatrix.tsx`  
**Route:** Part of CaseQueuePage  
**Priority:** 🟠 HIGH

#### Purpose
Visual matrix showing case urgency vs complexity.

#### UI Layout
```
┌─────────────────────────────────────────────────────────────┐
│  Case Priority Matrix                            [Analyze]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│           Complexity →                                      │
│         Low    Medium    High    Critical                   │
│  U  High  [12]   [8]      [5]      [2]     ⚠️ Urgent       │
│  r  Med   [18]   [15]     [7]      [1]                      │
│  g  Low   [22]   [20]     [10]     [0]                      │
│  e                                                        │
│  n  Total: 120 cases pending review                        │
│  c                                                        │
│  y                                                        │
│                                                             │
│  Legend: [🟢 Low] [🟡 Medium] [🟠 High] [🔴 Critical]      │
│                                                             │
│  Selected Cell: High Urgency + High Complexity (7 cases)   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Case ID    Title                    Days   Action   │   │
│  │ ────────────────────────────────────────────────────│   │
│  │ C-2025-089 State vs. Sharma         45     [View]  │   │
│  │ C-2025-076 State vs. Patel          38     [View]  │   │
│  │ ...                                                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### Skill 18: Judge Wellness Enhancements

#### Page 2.8: Workload Analytics Dashboard
**File:** `src/personas/judge/pages/WellnessAnalytics.tsx`  
**Route:** `/judge/wellness/analytics`  
**Priority:** 🟡 MEDIUM

#### Purpose
Detailed workload and stress analytics for judges.

#### UI Layout
```
┌─────────────────────────────────────────────────────────────┐
│  Workload & Wellness Analytics                   [Period ▼] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📊 This Week:                                              │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐│
│  │ 24         │ │ 8.5 hrs    │ │ 3.2/5      │ │ 2          ││
│  │ Cases      │ │ Avg Day    │ │ Stress     │ │ Breaks     ││
│  │            │ │            │ │ Level      │ │ Taken      ││
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘│
│                                                             │
│  📈 Trends:                                                 │
│  ┌─────────────────────┐ ┌─────────────────────┐           │
│  │ Case Load Trend     │ │ Stress Level        │           │
│  │ [Line Chart]        │ │ [Area Chart]        │           │
│  └─────────────────────┘ └─────────────────────┘           │
│                                                             │
│  ⚠️ Insights:                                               │
│  • Case load 15% above average this week                   │
│  • Taking fewer breaks than recommended                    │
│  • Consider delegating administrative tasks                │
│  • Next vacation scheduled: 15 days away                   │
│                                                             │
│  🎯 Wellness Goals:                                         │
│  ☐ Take 3 mindful breaks today (1/3 completed)            │
│  ☐ Finish work by 5 PM                                     │
│  ☐ Review only 5 cases max tomorrow                        │
│  ☐ Schedule 30min walk                                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase 3: Supporting Features

### 🎯 Objective
Create placeholder/supporting pages for complete workflow coverage.

**Estimated Time:** 4-5 hours

---

### Page 3.1: Judgment Validator
**File:** `src/personas/judge/pages/JudgmentValidator.tsx` (Update)  
**Route:** `/judge/validate`  
**Priority:** 🟡 MEDIUM

#### Purpose
Validate judgments for compliance and completeness before pronouncement.

#### UI Layout
```
┌─────────────────────────────────────────────────────────────┐
│  Judgment Validator                              [⚙️ Config]│
├─────────────────────────────────────────────────────────────┤
│  Upload or paste judgment text for AI validation           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Case Number: [CRL-APP-2025-001        ]  [📎 Upload PDF]  │
│                                                             │
│  Or paste text:                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │ [Paste judgment text here...]                      │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Validation Checks:                                         │
│  ☑ Legal citations valid                                  │
│  ☑ BNS sections correctly referenced                       │
│  ☑ All issues addressed                                    │
│  ☑ Reasoning complete                                      │
│  ☑ Proportionality check                                   │
│  ☑ Appeal period mentioned                                 │
│  ☑ Signature block complete                                │
│                                                             │
│  [🤖 Run AI Validation]                                    │
│                                                             │
│  Validation Results:                                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ✅ Passed: 6/7 checks                                │   │
│  │                                                     │   │
│  │ ⚠️ Warning: Appeal period not specified             │   │
│  │    Suggested: "Appeal may be filed within 30 days"  │   │
│  │                                                     │   │
│  │ [View Details] [Export Report] [Fix Issues]        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementation Details

### Complete File Structure

```
src/
├── shared/layout/
│   └── JudgeLayout.tsx                    # UPDATE - New sidebar
│
├── personas/judge/pages/
│   ├── JudgeBoard.tsx                     # ✅ Existing
│   ├── JudgeDashboard.tsx                 # ✅ Existing
│   ├── BailReckoner.tsx                   # ✅ Existing (Skill 12)
│   ├── SmartBailPage.tsx                  # ✅ Existing
│   ├── SentencingAssistant.tsx            # ✅ Existing (Skill 13)
│   ├── BenchMemoGenerator.tsx             # ✅ Existing (Skill 14)
│   ├── VirtualMootCourt.tsx               # ✅ Existing (Skill 15)
│   ├── CaseQueuePage.tsx                  # ✅ Existing (Skill 17)
│   ├── JudgeWellness.tsx                  # ✅ Existing (Skill 18)
│   ├── OrdersHistory.tsx                  # ✅ Existing
│   ├── JudgmentValidatorPage.tsx          # ✅ Existing
│   ├── CaseIntakeTriagePage.tsx           # ✅ Existing
│   ├── HashVerifier.tsx                   # ✅ Existing
│   │
│   ├── NEW PAGES - Skill Enhancements
│   ├── BailHistory.tsx                    # 🆕 Skill 12
│   ├── SentencingPrecedents.tsx           # 🆕 Skill 13
│   ├── BenchMemoTemplates.tsx             # 🆕 Skill 14
│   ├── MootScenarioLibrary.tsx            # 🆕 Skill 15
│   ├── SmartOrders.tsx                    # 🆕 Skill 16 (NEW!)
│   ├── WellnessAnalytics.tsx              # 🆕 Skill 18
│   │
│   └── UPDATES
│       └── JudgmentValidator.tsx          # 🔧 Update
│
├── personas/judge/components/             # 🆕 NEW COMPONENTS
│   ├── bail/
│   │   ├── BailConditionsBuilder.tsx      # 🆕 Advanced conditions
│   │   ├── BailHistoryChart.tsx           # 🆕 History visualization
│   │   └── SuretyCalculator.tsx           # 🆕 Surety calculation
│   │
│   ├── sentencing/
│   │   ├── PrecedentBrowser.tsx           # 🆕 Precedent search
│   │   ├── SentencingGuidelines.tsx       # 🆕 Guidelines display
│   │   └── FactorAnalysis.tsx             # 🆕 Factor checklist
│   │
│   ├── benchmemo/
│   │   ├── MemoTemplateCard.tsx           # 🆕 Template card
│   │   ├── MemoSectionEditor.tsx          # 🆕 Section editor
│   │   └── MemoPreview.tsx                # 🆕 Preview component
│   │
│   ├── mootcourt/
│   │   ├── ScenarioCard.tsx               # 🆕 Scenario card
│   │   ├── RoleSelector.tsx               # 🆕 Role selection
│   │   └── SessionRecorder.tsx            # 🆕 Recording
│   │
│   ├── orders/
│   │   ├── OrderTemplateGallery.tsx       # 🆕 Template gallery
│   │   ├── OrderEditor.tsx                # 🆕 WYSIWYG editor
│   │   ├── LegalLanguageAI.tsx            # 🆕 AI assistant
│   │   └── OrderPreview.tsx               # 🆕 PDF preview
│   │
│   ├── queue/
│   │   ├── PriorityMatrix.tsx             # 🆕 Matrix view
│   │   ├── CaseCard.tsx                   # 🆕 Case card
│   │   └── QueueAnalytics.tsx             # 🆕 Analytics
│   │
│   └── wellness/
│       ├── BreakTimer.tsx                 # ✅ Existing
│       ├── StressMeter.tsx                # 🆕 Stress gauge
│       ├── WorkloadChart.tsx              # 🆕 Workload viz
│       └── WellnessTips.tsx               # 🆕 Tips component
│
├── core/services/
│   ├── bailReckonerService.ts             # ✅ Existing - Add methods
│   ├── sentencingService.ts               # ✅ Existing - Add methods
│   ├── benchMemoService.ts                # ✅ Existing - Add methods
│   ├── mootCourtService.ts                # ✅ Existing - Add methods
│   ├── ordersService.ts                   # 🆕 NEW for Skill 16
│   ├── queueOptimizerService.ts           # 🆕 NEW/Extend
│   └── wellnessService.ts                 # ✅ Existing - Add methods
│
└── core/hooks/
    ├── useBail.ts                         # 🆕 Bail-specific hooks
    ├── useSentencing.ts                   # 🆕 Sentencing hooks
    ├── useBenchMemo.ts                    # 🆕 Bench memo hooks
    ├── useOrders.ts                       # 🆕 Orders hooks
    └── useWellness.ts                     # 🆕 Wellness hooks
```

---

### Route Configuration

```typescript
// App.tsx - Update judge routes

<Route element={<ProtectedRoute allowedRoles={['JUDGE']} />}>
  <Route path="/judge" element={<JudgeLayout />}>
    
    {/* Main Board */}
    <Route index element={<Navigate to="board" replace />} />
    <Route path="board" element={<JudgeBoard />} />
    <Route path="dashboard" element={<JudgeDashboard />} />
    <Route path="queue" element={<CaseQueuePage />} />
    
    {/* Skill 12: Bail Reckoner */}
    <Route path="bail" element={<BailReckoner />} />
    <Route path="bail/history" element={<BailHistory />} />
    <Route path="smart-bail" element={<SmartBailPage />} />
    
    {/* Skill 13: Sentencing Assistant */}
    <Route path="sentencing" element={<SentencingAssistant />} />
    <Route path="sentencing/precedents" element={<SentencingPrecedents />} />
    
    {/* Skill 14: Bench Memo Generator */}
    <Route path="bench-memo" element={<BenchMemoGenerator />} />
    <Route path="bench-memo/templates" element={<BenchMemoTemplates />} />
    
    {/* Skill 15: Virtual Moot Court */}
    <Route path="moot-court" element={<VirtualMootCourt />} />
    <Route path="moot-court/scenarios" element={<MootScenarioLibrary />} />
    
    {/* Skill 16: Smart Orders (NEW) */}
    <Route path="smart-orders" element={<SmartOrders />} />
    
    {/* Skill 17: Case Queue */}
    <Route path="queue" element={<CaseQueuePage />} />
    
    {/* Skill 18: Judge Wellness */}
    <Route path="wellness" element={<JudgeWellness />} />
    <Route path="wellness/analytics" element={<WellnessAnalytics />} />
    
    {/* Supporting Pages */}
    <Route path="urgency" element={<UrgencyMatrixPage />} />
    <Route path="virtual-court" element={<VirtualCourtPage />} />
    <Route path="evidence" element={<EvidenceVaultPage />} />
    <Route path="draft" element={<DraftAuditPage />} />
    <Route path="orders" element={<OrdersHistory />} />
    <Route path="validate" element={<JudgmentValidatorPage />} />
    <Route path="triage" element={<CaseIntakeTriagePage />} />
    <Route path="verify" element={<HashVerifierPage />} />
    
  </Route>
</Route>
```

---

## Testing Checklist

### Navigation Tests
- [ ] All sidebar links navigate correctly
- [ ] Active state shows for current route
- [ ] Hindi labels display correctly
- [ ] Sidebar collapse/expand works
- [ ] Tooltips show on collapsed state

### Skill 12: Bail Reckoner
- [ ] Risk calculation works
- [ ] Bail amount recommendation is reasonable
- [ ] Conditions builder functions
- [ ] History page loads
- [ ] Analytics charts display

### Skill 13: Sentencing Assistant
- [ ] Sentencing analysis works
- [ ] Precedent browser finds similar cases
- [ ] Guidelines display correctly
- [ ] Factor analysis completes

### Skill 14: Bench Memo Generator
- [ ] Memo generation works
- [ ] Templates load correctly
- [ ] Export to PDF works
- [ ] Preview displays properly

### Skill 15: Virtual Moot Court
- [ ] Scenarios load from library
- [ ] Role selection works
- [ ] Session starts correctly
- [ ] Recording playback works

### Skill 16: Smart Orders (NEW)
- [ ] Templates load
- [ ] Auto-fill populates data
- [ ] AI language generation works
- [ ] PDF export functions
- [ ] Digital signature ready

### Skill 17: Case Queue
- [ ] Priority matrix displays
- [ ] Cases sorted correctly
- [ ] Analytics load
- [ ] Optimization runs

### Skill 18: Judge Wellness
- [ ] Break timer functions
- [ ] Stress meter displays
- [ ] Workload charts load
- [ ] Insights generate

### General
- [ ] All pages responsive
- [ ] No console errors
- [ ] Loading states work
- [ ] Error boundaries catch errors
- [ ] Mobile navigation functional

---

## Implementation Timeline

### Week 1: Navigation Fix (Days 1-2)
**Day 1:**
- Update JudgeLayout.tsx with new navItems
- Add missing icon imports
- Test all navigation links

**Day 2:**
- Add collapsible sidebar sections
- Test sidebar collapse/expand
- Verify Hindi labels

### Week 2: Skill Enhancements (Days 3-7)
**Day 3:**
- Create BailHistory.tsx
- Create BailConditionsBuilder.tsx

**Day 4:**
- Create SentencingPrecedents.tsx
- Create BenchMemoTemplates.tsx

**Day 5:**
- Create MootScenarioLibrary.tsx
- Update VirtualMootCourt.tsx

**Day 6:**
- Create SmartOrders.tsx (Skill 16 - NEW)
- Create OrderTemplateGallery.tsx

**Day 7:**
- Create WellnessAnalytics.tsx
- Create PriorityMatrix.tsx

### Week 3: Polish (Days 8-10)
**Day 8:**
- Update JudgmentValidator.tsx
- Create placeholder pages

**Day 9:**
- Testing and bug fixes
- Responsive design checks

**Day 10:**
- Final testing
- Performance optimization

---

## Summary

### What You're Getting

**Phase 1: Fixed Navigation (1-2h)**
- ✅ All existing pages accessible from sidebar
- ✅ Organized 5-section sidebar
- ✅ Hindi language support

**Phase 2: Skill Enhancements (15-18h)**
- 🆕 8 new pages for skills 12-18
- 🆕 Advanced features (history, analytics, templates)
- 🆕 Smart Orders (Skill 16 - completely new)
- 🔧 Multiple component enhancements

**Phase 3: Supporting Features (4-5h)**
- 🆕 Judgment validator updates
- 🆕 Placeholder pages

### Total Deliverables
- **22+ pages** (existing + new)
- **Organized 5-section sidebar**
- **All 7 skills (12-18) enhanced**
- **Complete workflow coverage**
- **Production-ready features**

### Time Estimate
- **Phase 1:** 1-2 hours
- **Phase 2:** 15-18 hours
- **Phase 3:** 4-5 hours
- **Total:** 20-25 hours

---

**Critical Issue to Fix First:** Add existing pages (Sentencing, Bench Memo, Moot Court, Case Queue, Wellness) to sidebar so they become accessible! ⚡

**Ready to implement!** 🚀
