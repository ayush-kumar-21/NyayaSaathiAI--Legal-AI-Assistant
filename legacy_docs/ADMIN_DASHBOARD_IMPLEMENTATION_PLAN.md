# Admin Dashboard Implementation Plan
## LegalOS 4.0 - Sidebar & Skill Enhancement Guide

**Version:** 1.0  
**Date:** February 12, 2026  
**Status:** 📋 Ready for Implementation  
**Estimated Duration:** 20-25 hours  
**Skills Coverage:** 19, 20 (Enhanced utilization)

---

## 📑 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current State Analysis](#current-state-analysis)
3. [Sidebar Restructuring](#sidebar-restructuring)
4. [Phase 1: Fix Missing Links](#phase-1-fix-missing-links)
5. [Phase 2: Skill 19 Enhancements](#phase-2-skill-19-enhancements)
6. [Phase 3: Skill 20 Enhancements](#phase-3-skill-20-enhancements)
7. [Phase 4: Supporting Pages](#phase-4-supporting-pages)
8. [Implementation Details](#implementation-details)
9. [Testing Checklist](#testing-checklist)

---

## Executive Summary

Your Admin Dashboard has **9 sidebar items** but **several are broken links** (pages don't exist). Additionally, Skills 19 & 20 have basic implementations but lack advanced features that would make them production-ready.

### Key Issues Found

| Issue | Current State | Impact |
|-------|--------------|--------|
| PendencyMap | Page exists, NOT in sidebar | 🔴 Broken navigation |
| BNSTransition | Page exists, NOT in sidebar | 🔴 Broken navigation |
| Resource Allocator | Link exists, page unknown | ⚠️ May be broken |
| Document Analysis | Link exists, page unknown | ⚠️ May be broken |
| Registry Automator | Basic implementation | 🟡 Missing advanced features |
| Listing Optimizer | Basic implementation | 🟡 Missing advanced features |

### Solution Overview

**Phase 1:** Add missing pages to sidebar (PendencyMap, BNSTransition)
**Phase 2:** Enhance Skill 19 with batch processing, templates, analytics
**Phase 3:** Enhance Skill 20 with multi-court scheduling, templates, history
**Phase 4:** Create placeholder/supporting pages for remaining sidebar items

---

## Current State Analysis

### Existing Sidebar Structure (AdminLayout.tsx)

```typescript
const navItems = [
    { path: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },           // ✅ Works
    { path: '/admin/resources', label: 'Resource Allocator', icon: Cpu },            // ❓ Unknown
    { path: '/admin/registry', label: 'Registry Automator', icon: FileText },        // ✅ Basic
    { path: '/admin/listing', label: 'Listing Optimizer', icon: LayoutDashboard },   // ✅ Basic
    { path: '/admin/analysis', label: 'Document Analysis', icon: FileText },         // ❓ Unknown
    { path: '/admin/history', label: 'Activity Log', icon: History },                // ❓ Unknown
    { path: '/admin/quantum', label: 'Quantum Verify', icon: Fingerprint },          // ❓ Unknown
    { path: '/admin/transition', label: 'BNS Transition', icon: TrendingUp },        // ✅ Page exists!
    { path: '/admin/infrastructure', label: 'System Health', icon: Activity },       // ❓ Unknown
];
```

### Existing Pages Inventory

| Page File | Route | In Sidebar? | Status | Completeness |
|-----------|-------|-------------|--------|--------------|
| AdminDashboard.tsx | /admin/dashboard | ✅ Yes | Working | 90% |
| RegistryDashboard.tsx | /admin/registry | ✅ Yes | Working | 60% |
| ListingOptimizer.tsx | /admin/listing | ✅ Yes | Working | 70% |
| PendencyMap.tsx | /admin/pendency | ❌ **NO** | Working | 85% |
| BNSTransition.tsx | /admin/transition | ✅ Yes | Unknown | ? |

**Critical Finding:** `PendencyMap.tsx` exists but is NOT linked in the sidebar!

---

## Sidebar Restructuring

### Proposed New Sidebar Structure

```typescript
const navItems = [
    // 📊 DASHBOARD
    { 
        path: '/admin/dashboard', 
        label: 'Overview', 
        icon: LayoutDashboard,
        category: 'dashboard'
    },
    
    // 🏛️ SKILL 19: REGISTRY AUTOMATOR
    { 
        path: '/admin/registry', 
        label: 'Document Scrutiny', 
        icon: FileCheck,
        category: 'registry',
        skill: 19
    },
    { 
        path: '/admin/registry/batch', 
        label: 'Batch Processing', 
        icon: Layers,
        category: 'registry',
        skill: 19
    },
    { 
        path: '/admin/registry/templates', 
        label: 'Filing Templates', 
        icon: FilePlus,
        category: 'registry',
        skill: 19
    },
    { 
        path: '/admin/registry/analytics', 
        label: 'Registry Analytics', 
        icon: BarChart3,
        category: 'registry',
        skill: 19
    },
    
    // 📅 SKILL 20: LISTING OPTIMIZER
    { 
        path: '/admin/listing', 
        label: 'Daily Scheduling', 
        icon: Calendar,
        category: 'listing',
        skill: 20
    },
    { 
        path: '/admin/listing/multi-court', 
        label: 'Multi-Court View', 
        icon: LayoutGrid,
        category: 'listing',
        skill: 20
    },
    { 
        path: '/admin/listing/templates', 
        label: 'Schedule Templates', 
        icon: Save,
        category: 'listing',
        skill: 20
    },
    { 
        path: '/admin/listing/history', 
        label: 'Schedule History', 
        icon: History,
        category: 'listing',
        skill: 20
    },
    
    // 🗺️ ANALYTICS & MAPS
    { 
        path: '/admin/pendency', 
        label: 'Pendency Map', 
        icon: Map,
        category: 'analytics'
    },
    { 
        path: '/admin/transition', 
        label: 'BNS Transition', 
        icon: TrendingUp,
        category: 'analytics'
    },
    { 
        path: '/admin/analytics', 
        label: 'Document Analysis', 
        icon: PieChart,
        category: 'analytics'
    },
    
    // ⚙️ SYSTEM
    { 
        path: '/admin/resources', 
        label: 'Resource Allocator', 
        icon: Cpu,
        category: 'system'
    },
    { 
        path: '/admin/audit', 
        label: 'Activity Log', 
        icon: ClipboardList,
        category: 'system'
    },
    { 
        path: '/admin/health', 
        label: 'System Health', 
        icon: Activity,
        category: 'system'
    },
    { 
        path: '/admin/quantum', 
        label: 'Quantum Verify', 
        icon: Fingerprint,
        category: 'system'
    },
];
```

### Visual Sidebar Layout

```
┌─ 📊 DASHBOARD ─────────────────────┐
│  ◉ Overview                         │
├─ 🏛️ REGISTRY AUTOMATOR ────────────┤
│  ○ Document Scrutiny               │
│  ○ Batch Processing                │
│  ○ Filing Templates                │
│  ○ Registry Analytics              │
├─ 📅 LISTING OPTIMIZER ─────────────┤
│  ○ Daily Scheduling                │
│  ○ Multi-Court View                │
│  ○ Schedule Templates              │
│  ○ Schedule History                │
├─ 🗺️ ANALYTICS ─────────────────────┤
│  ○ Pendency Map                    │
│  ○ BNS Transition                  │
│  ○ Document Analysis               │
├─ ⚙️ SYSTEM ────────────────────────┤
│  ○ Resource Allocator              │
│  ○ Activity Log                    │
│  ○ System Health                   │
│  ○ Quantum Verify                  │
└─────────────────────────────────────┘
```

---

## Phase 1: Fix Missing Links

### 🎯 Objective
Fix broken navigation by adding existing pages to sidebar and creating missing pages.

**Estimated Time:** 2-3 hours

---

### Task 1.1: Add PendencyMap to Sidebar
**File:** `src/shared/layout/AdminLayout.tsx`  
**Priority:** 🔴 CRITICAL

#### Current Issue
`PendencyMap.tsx` exists at `/admin/pendency` but is NOT in the sidebar navigation.

#### Fix Required
```typescript
// In AdminLayout.tsx navItems array, ADD:
{ 
    path: '/admin/pendency', 
    label: 'Pendency Map', 
    icon: Map 
},

// Add Map import if missing:
import { Map } from 'lucide-react';
```

#### Route Verification
Check `App.tsx` has this route:
```typescript
<Route path="pendency" element={<PendencyMapPage />} />
```

---

### Task 1.2: Group Sidebar Items
**File:** `src/shared/layout/AdminLayout.tsx`  
**Priority:** 🟡 MEDIUM

#### Enhancement
Add collapsible sections to sidebar for better organization:

```typescript
// New component: CollapsibleNavSection
interface NavSection {
    title: string;
    icon: LucideIcon;
    items: NavItem[];
    defaultOpen?: boolean;
}

const navSections: NavSection[] = [
    {
        title: 'Dashboard',
        icon: LayoutDashboard,
        items: [
            { path: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard }
        ],
        defaultOpen: true
    },
    {
        title: 'Registry Automator',
        icon: FileText,
        items: [
            { path: '/admin/registry', label: 'Document Scrutiny', icon: FileCheck },
            { path: '/admin/registry/batch', label: 'Batch Processing', icon: Layers },
            { path: '/admin/registry/templates', label: 'Filing Templates', icon: FilePlus },
            { path: '/admin/registry/analytics', label: 'Analytics', icon: BarChart3 }
        ]
    },
    {
        title: 'Listing Optimizer',
        icon: Calendar,
        items: [
            { path: '/admin/listing', label: 'Daily Scheduling', icon: Calendar },
            { path: '/admin/listing/multi-court', label: 'Multi-Court View', icon: LayoutGrid },
            { path: '/admin/listing/templates', label: 'Templates', icon: Save },
            { path: '/admin/listing/history', label: 'History', icon: History }
        ]
    },
    {
        title: 'Analytics',
        icon: PieChart,
        items: [
            { path: '/admin/pendency', label: 'Pendency Map', icon: Map },
            { path: '/admin/transition', label: 'BNS Transition', icon: TrendingUp },
            { path: '/admin/analysis', label: 'Document Analysis', icon: PieChart }
        ]
    },
    {
        title: 'System',
        icon: Cpu,
        items: [
            { path: '/admin/resources', label: 'Resource Allocator', icon: Cpu },
            { path: '/admin/audit', label: 'Activity Log', icon: ClipboardList },
            { path: '/admin/health', label: 'System Health', icon: Activity },
            { path: '/admin/quantum', label: 'Quantum Verify', icon: Fingerprint }
        ]
    }
];
```

---

## Phase 2: Skill 19 Enhancements

### 🎯 Objective
Add advanced features to Registry Automator (Skill 19) for production use.

**Estimated Time:** 8-10 hours

---

### Page 2.1: Batch Document Processing
**File:** `src/personas/admin/pages/RegistryBatchProcessing.tsx`  
**Route:** `/admin/registry/batch`  
**Skill:** 19 - Registry Automator  
**Priority:** 🟠 HIGH

#### Purpose
Process multiple documents simultaneously for bulk scrutiny.

#### UI Layout
```
┌─────────────────────────────────────────────────────────────┐
│  Batch Document Processing                        [+ Upload] │
├─────────────────────────────────────────────────────────────┤
│  Upload multiple documents for AI scrutiny                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Drop files here or click to upload                        │
│  Supported: PDF, DOCX, TIFF (Max 50MB each)               │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 📁 Documents to Process (12)                        │   │
│  │                                                     │   │
│  │ ⏳ petition_001.pdf          [Analyzing...]  45%   │   │
│  │ ✅ petition_002.pdf          [Complete]  0 defects │   │
│  │ ⚠️ petition_003.pdf          [Complete]  3 defects │   │
│  │ ❌ petition_004.pdf          [Failed]  Retry?      │   │
│  │ ⏳ petition_005.pdf          [Queued]              │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  📊 Summary: 8 Complete | 1 Processing | 1 Failed | 2 Queued│
│                                                             │
│  [⏸️ Pause]  [🔄 Retry Failed]  [📥 Export Results]       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Key Features
1. **Multi-file Upload** - Drag & drop or file picker
2. **Progress Tracking** - Real-time status for each file
3. **Batch Operations** - Pause, resume, retry failed
4. **Results Export** - CSV/Excel download
5. **Defect Aggregation** - Summary of all defects found

#### Component Structure
```typescript
RegistryBatchProcessing.tsx
├── BatchUploadZone.tsx      // Drag & drop area
├── FileQueue.tsx            // List of files with status
├── ProgressBar.tsx          // Overall progress
├── BatchResults.tsx         // Summary statistics
├── DefectSummary.tsx        // Aggregated defects
└── ExportOptions.tsx        // Download formats
```

---

### Page 2.2: Filing Templates Manager
**File:** `src/personas/admin/pages/RegistryTemplates.tsx`  
**Route:** `/admin/registry/templates`  
**Skill:** 19 - Registry Automator  
**Priority:** 🟡 MEDIUM

#### Purpose
Manage reusable document templates for common filings.

#### UI Layout
```
┌─────────────────────────────────────────────────────────────┐
│  Filing Templates                               [+ Create]  │
├─────────────────────────────────────────────────────────────┤
│  Pre-configured templates for common filing types          │
├─────────────────────────────────────────────────────────────┤
│  Filter: [All ▼] [Search templates...]              [🔍]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │ 📄           │ │ 📄           │ │ ➕           │       │
│  │ Civil Suit   │ │ Writ Petition│ │ Create New   │       │
│  │ Default Fee  │ │ Default Fee  │ │ Template     │       │
│  │ ₹1,500       │ │ ₹1,000       │ │              │       │
│  │              │ │              │ │              │       │
│  │ [Edit] [Use] │ │ [Edit] [Use] │ │              │       │
│  └──────────────┘ └──────────────┘ └──────────────┘       │
│                                                             │
│  Template Details: Civil Suit Default                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Base Fee: ₹1,500                                    │   │
│  │ Ad Valorem: 2% (max ₹100,000)                      │   │
│  │ Process Fee: ₹500                                   │   │
│  │ Required Docs: Petition, ID Proof, Address Proof   │   │
│  │ Compliance Checklist: [View]                        │   │
│  │                                                     │   │
│  │ Last Modified: 15 Jan 2025                          │   │
│  │ Modified By: Registry Officer A                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Key Features
1. **Template Gallery** - Grid of available templates
2. **Template Editor** - Create/edit templates
3. **Fee Configuration** - Set default fees per template
4. **Document Checklist** - Required documents per type
5. **Compliance Rules** - Auto-validation rules
6. **Version History** - Track template changes

---

### Page 2.3: Registry Analytics Dashboard
**File:** `src/personas/admin/pages/RegistryAnalytics.tsx`  
**Route:** `/admin/registry/analytics`  
**Skill:** 19 - Registry Automator  
**Priority:** 🟡 MEDIUM

#### Purpose
Analytics and insights on filing patterns, defect trends, and processing efficiency.

#### UI Layout
```
┌─────────────────────────────────────────────────────────────┐
│  Registry Analytics                              [Export ↓] │
├─────────────────────────────────────────────────────────────┤
│  Period: [Last 30 Days ▼]                    🔄 Auto-refresh │
├─────────────────────────────────────────────────────────────┤
│  KPI Cards:                                                 │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐│
│  │ 📄 1,247   │ │ ⚠️ 23%     │ │ ⏱️ 4.2 min │ │ 💰 ₹4.2M   ││
│  │ Filings    │ │ Defect Rate│ │ Avg Process│ │ Fees Col.  ││
│  │ +12%       │ │ -5%        │ │ -15%       │ │ +8%        ││
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘│
├─────────────────────────────────────────────────────────────┤
│  Charts Row 1:                                              │
│  ┌─────────────────────┐ ┌─────────────────────┐           │
│  │ Filing Trend        │ │ Defects by Type     │           │
│  │ [Line Chart]        │ │ [Pie Chart]         │           │
│  │ Daily/Weekly/Monthly│ │ Critical/Major/Minor│           │
│  └─────────────────────┘ └─────────────────────┘           │
│  Charts Row 2:                                              │
│  ┌─────────────────────┐ ┌─────────────────────┐           │
│  │ Top Defects         │ │ Processing Time     │           │
│  │ [Bar Chart]         │ │ [Histogram]         │           │
│  │ Missing stamp, etc. │ │ Distribution        │           │
│  └─────────────────────┘ └─────────────────────┘           │
│                                                             │
│  Bottom Section:                                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ⚠️ Alerts & Recommendations                          │   │
│  │ • Defect rate for "Writ Petitions" increased 15%    │   │
│  │ • Consider additional training on BNS Section 173   │   │
│  │ • Peak filing hours: 10 AM - 12 PM (staff accordingly)│   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Key Metrics
1. **Filing Volume** - Total filings, trends, peak times
2. **Defect Analysis** - Rate by type, trending defects
3. **Processing Time** - Average time per filing
4. **Fee Collection** - Revenue, exemptions granted
5. **Compliance Rate** - % filings meeting standards

---

## Phase 3: Skill 20 Enhancements

### 🎯 Objective
Add advanced features to Listing Optimizer (Skill 20) for production use.

**Estimated Time:** 8-10 hours

---

### Page 3.1: Multi-Court Scheduling View
**File:** `src/personas/admin/pages/ListingMultiCourt.tsx`  
**Route:** `/admin/listing/multi-court`  
**Skill:** 20 - Listing Optimizer  
**Priority:** 🟠 HIGH

#### Purpose
View and manage schedules across multiple courts simultaneously.

#### UI Layout
```
┌─────────────────────────────────────────────────────────────┐
│  Multi-Court Schedule                           [⚙️ Config] │
├─────────────────────────────────────────────────────────────┤
│  View all court schedules at a glance                      │
├─────────────────────────────────────────────────────────────┤
│  Court Filter: [All Courts ▼]    Date: [📅 12 Feb 2025 ▼]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Court 1: District Court - Civil                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Judge: Hon. R.K. Sharma    Utilization: 82%         │   │
│  │ 10:00 [Case 1]  11:30 [Case 2]  13:30 [Lunch]      │   │
│  │ 14:00 [Case 3]  15:30 [Case 4]  [+ 3 more]         │   │
│  │ [View Details] [Optimize] [Export]                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Court 2: District Court - Criminal                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Judge: Hon. S. Gupta        Utilization: 65%        │   │
│  │ 10:00 [Case 5]  11:00 [Case 6]  12:00 [Available]  │   │
│  │ 13:30 [Lunch]   14:30 [Case 7]  [+ 1 more]         │   │
│  │ [View Details] [Optimize] [Export]                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Court 3: Fast Track Court                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Judge: Hon. M. Patel        Utilization: 91%        │   │
│  │ ⚠️ Overbooked! Consider redistributing cases        │   │
│  │ 10:00 [Case 8]  10:30 [Case 9]  ... [+ 12 more]    │   │
│  │ [View Details] [Rebalance] [Export]                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Summary: 3 Courts | 45 Cases | 78% Avg Utilization        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Key Features
1. **Court Grid** - Multiple court cards
2. **Utilization Indicators** - Color-coded (Green/Yellow/Red)
3. **Quick Actions** - Optimize, Export, Rebalance per court
4. **Conflict Alerts** - Overbooked courts, double-booked lawyers
5. **Comparison View** - Side-by-side schedule comparison

---

### Page 3.2: Schedule Templates
**File:** `src/personas/admin/pages/ListingTemplates.tsx`  
**Route:** `/admin/listing/templates`  
**Skill:** 20 - Listing Optimizer  
**Priority:** 🟡 MEDIUM

#### Purpose
Save and reuse common scheduling patterns.

#### UI Layout
```
┌─────────────────────────────────────────────────────────────┐
│  Schedule Templates                             [+ Create]  │
├─────────────────────────────────────────────────────────────┤
│  Reusable scheduling patterns for different court types    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Template Categories:                                       │
│  [Civil Courts] [Criminal Courts] [Fast Track] [Custom ▼]  │
│                                                             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │ 📅           │ │ 📅           │ │ 📅           │       │
│  │ Standard     │ │ Heavy        │ │ Minimal      │       │
│  │ Civil Day    │ │ Criminal Day │ │ Schedule     │       │
│  │              │ │              │ │              │       │
│  │ 8 cases      │ │ 12 cases     │ │ 4 cases      │       │
│  │ 5.5 hrs      │ │ 5.5 hrs      │ │ 3 hrs        │       │
│  │              │ │              │ │              │       │
│  │ [Apply] [✏️] │ │ [Apply] [✏️] │ │ [Apply] [✏️] │       │
│  └──────────────┘ └──────────────┘ └──────────────┘       │
│                                                             │
│  Template: Standard Civil Day                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Time Blocks:                                        │   │
│  │ 10:00-11:30  Admission matters (2 cases, 45m each) │   │
│  │ 11:30-13:00  Arguments (2 cases, 45m each)         │   │
│  │ 13:00-14:00  Lunch Break                           │   │
│  │ 14:00-15:30  Evidence (2 cases, 45m each)          │   │
│  │ 15:30-16:00  Judgment pronouncements               │   │
│  │                                                     │   │
│  │ Case Type Priority: Civil > Property > Family      │   │
│  │ Urgency Weight: Urgent > High > Normal > Low       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Key Features
1. **Template Gallery** - Pre-built and custom templates
2. **Template Editor** - Configure time blocks, priorities
3. **Quick Apply** - Apply template to specific date/court
4. **Template Variables** - Dynamic case counts, time adjustments
5. **Auto-Schedule** - Use template for auto-generating schedules

---

### Page 3.3: Schedule History & Analytics
**File:** `src/personas/admin/pages/ListingHistory.tsx`  
**Route:** `/admin/listing/history`  
**Skill:** 20 - Listing Optimizer  
**Priority:** 🟡 MEDIUM

#### Purpose
View historical schedules, track efficiency trends, and analyze patterns.

#### UI Layout
```
┌─────────────────────────────────────────────────────────────┐
│  Schedule History & Analytics                   [Export ↓]  │
├─────────────────────────────────────────────────────────────┤
│  Analyze past scheduling efficiency and patterns           │
├─────────────────────────────────────────────────────────────┤
│  Period: [Last 90 Days ▼]  Court: [All Courts ▼]           │
├─────────────────────────────────────────────────────────────┤
│  KPI Cards:                                                 │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐│
│  │ 📅 127     │ │ 📊 76%     │ │ ⏱️ 4.5 hrs │ │ 🎯 89%     ││
│  │ Schedules  │ │ Avg Util.  │ │ Avg Time   │ │ On-Time    ││
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘│
├─────────────────────────────────────────────────────────────┤
│  Recent Schedules:                                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Date       Court              Cases  Util.  Status   │   │
│  │ ─────────────────────────────────────────────────────│   │
│  │ 12 Feb     District Civil     12     82%    ✅       │   │
│  │ 12 Feb     District Criminal  8      65%    ✅       │   │
│  │ 11 Feb     Fast Track         15     91%    ⚠️       │   │
│  │ 11 Feb     District Civil     10     78%    ✅       │   │
│  │ ...                                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Efficiency Trends:                                         │
│  ┌─────────────────────┐ ┌─────────────────────┐           │
│  │ Utilization Trend   │ │ Cases per Day       │           │
│  │ [Line Chart]        │ │ [Bar Chart]         │           │
│  └─────────────────────┘ └─────────────────────┘           │
│                                                             │
│  Insights:                                                  │
│  • Tuesday & Thursday show highest efficiency (82%)        │
│  • Criminal courts consistently under-utilized (65% avg)   │
│  • Morning slots (10-12 PM) have highest completion rate   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Key Features
1. **Schedule Archive** - Browse historical schedules
2. **Efficiency Metrics** - Utilization, completion rates
3. **Trend Analysis** - Visual charts of performance
4. **Insights & Recommendations** - AI-generated suggestions
5. **Export Reports** - PDF/Excel for management

---

## Phase 4: Supporting Pages

### 🎯 Objective
Create placeholder pages for remaining sidebar items.

**Estimated Time:** 4-5 hours

---

### Page 4.1: Resource Allocator
**File:** `src/features/admin/pages/ResourceAllocatorPage.tsx`  
**Route:** `/admin/resources`  
**Priority:** 🟡 MEDIUM

#### Purpose
Allocate judges, staff, and courtrooms efficiently.

#### Key Features
- Judge workload balancing
- Courtroom assignment
- Staff scheduling
- Resource conflict detection

---

### Page 4.2: Document Analysis
**File:** `src/features/admin/pages/DocumentAnalysisPage.tsx`  
**Route:** `/admin/analysis`  
**Priority:** 🟡 MEDIUM

#### Purpose
Advanced document analytics and insights.

#### Key Features
- Document type classification
- Content extraction
- BNS section detection
- Compliance verification

---

### Page 4.3: Activity Log / Audit Trail
**File:** `src/features/admin/pages/ActivityLogPage.tsx`  
**Route:** `/admin/audit`  
**Priority:** 🟢 LOW

#### Purpose
System-wide activity logging for audit purposes.

#### Key Features
- User action tracking
- Document access logs
- Schedule change history
- Export audit reports

---

### Page 4.4: System Health Monitor
**File:** `src/features/admin/pages/SystemHealthPage.tsx`  
**Route:** `/admin/health`  
**Priority:** 🟢 LOW

#### Purpose
Monitor system performance and health metrics.

#### Key Features
- Server status
- API response times
- Database health
- Error rate monitoring

---

### Page 4.5: Quantum Verification (Placeholder)
**File:** `src/features/admin/pages/QuantumVerifyPage.tsx`  
**Route:** `/admin/quantum`  
**Priority:** 🟢 LOW

#### Purpose
Placeholder for future quantum verification features.

#### Content
```typescript
// Simple placeholder page
const QuantumVerifyPage: React.FC = () => (
  <div className="p-8 text-center">
    <Fingerprint className="w-16 h-16 text-amber-400 mx-auto mb-4" />
    <h2 className="text-2xl font-bold text-white mb-2">Quantum Verification</h2>
    <p className="text-slate-400 max-w-md mx-auto">
      Future feature for quantum-safe document verification and blockchain attestation.
    </p>
    <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl inline-block">
      <span className="text-amber-400 text-sm">🚧 Coming Soon</span>
    </div>
  </div>
);
```

---

## Implementation Details

### Complete File Structure

```
src/
├── shared/layout/
│   └── AdminLayout.tsx                    # UPDATE - New sidebar structure
│
├── personas/admin/pages/
│   ├── AdminDashboard.tsx                 # ✅ Existing
│   ├── RegistryDashboard.tsx              # ✅ Existing (Skill 19 main)
│   ├── ListingOptimizer.tsx               # ✅ Existing (Skill 20 main)
│   ├── PendencyMap.tsx                    # ✅ Existing
│   ├── BNSTransition.tsx                  # ✅ Existing
│   │
│   ├── NEW PAGES - Skill 19 Enhancements
│   ├── RegistryBatchProcessing.tsx        # 🆕 Batch document processing
│   ├── RegistryTemplates.tsx              # 🆕 Filing templates manager
│   ├── RegistryAnalytics.tsx              # 🆕 Analytics dashboard
│   │
│   ├── NEW PAGES - Skill 20 Enhancements
│   ├── ListingMultiCourt.tsx              # 🆕 Multi-court view
│   ├── ListingTemplates.tsx               # 🆕 Schedule templates
│   ├── ListingHistory.tsx                 # 🆕 History & analytics
│   │
│   └── NEW PAGES - Supporting
│       ├── ResourceAllocatorPage.tsx      # 🆕 Resource allocation
│       ├── DocumentAnalysisPage.tsx       # 🆕 Document analytics
│       ├── ActivityLogPage.tsx            # 🆕 Audit trail
│       ├── SystemHealthPage.tsx           # 🆕 Health monitor
│       └── QuantumVerifyPage.tsx          # 🆕 Quantum placeholder
│
├── personas/admin/components/             # 🆕 NEW DIRECTORY
│   ├── sidebar/
│   │   ├── CollapsibleNavSection.tsx      # Collapsible sidebar sections
│   │   ├── NavItem.tsx                    # Individual nav item
│   │   └── SidebarWidget.tsx              # BNS adoption widget
│   │
│   ├── registry/                          # Skill 19 components
│   │   ├── BatchUploadZone.tsx
│   │   ├── FileQueue.tsx
│   │   ├── TemplateCard.tsx
│   │   ├── DefectChart.tsx
│   │   └── AnalyticsCard.tsx
│   │
│   └── listing/                           # Skill 20 components
│       ├── CourtScheduleCard.tsx
│       ├── TimelineView.tsx
│       ├── ScheduleTemplateCard.tsx
│       ├── UtilizationGauge.tsx
│       └── EfficiencyChart.tsx
│
├── core/services/
│   ├── registryService.ts                 # ✅ Existing - Add batch methods
│   └── listingService.ts                  # ✅ Existing - Add history methods
│
└── core/hooks/
    ├── useRegistry.ts                     # 🆕 Registry-specific hooks
    └── useListing.ts                      # 🆕 Listing-specific hooks
```

---

### Route Configuration Updates

```typescript
// App.tsx - Update admin routes

<Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
  <Route path="/admin" element={<AdminLayout />}>
    
    {/* Dashboard */}
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard" element={<AdminDashboard />} />
    
    {/* Skill 19: Registry Automator */}
    <Route path="registry" element={<RegistryDashboard />} />
    <Route path="registry/batch" element={<RegistryBatchProcessing />} />
    <Route path="registry/templates" element={<RegistryTemplates />} />
    <Route path="registry/analytics" element={<RegistryAnalytics />} />
    
    {/* Skill 20: Listing Optimizer */}
    <Route path="listing" element={<ListingOptimizer />} />
    <Route path="listing/multi-court" element={<ListingMultiCourt />} />
    <Route path="listing/templates" element={<ListingTemplates />} />
    <Route path="listing/history" element={<ListingHistory />} />
    
    {/* Analytics */}
    <Route path="pendency" element={<PendencyMap />} />
    <Route path="transition" element={<BNSTransition />} />
    <Route path="analysis" element={<DocumentAnalysisPage />} />
    
    {/* System */}
    <Route path="resources" element={<ResourceAllocatorPage />} />
    <Route path="audit" element={<ActivityLogPage />} />
    <Route path="health" element={<SystemHealthPage />} />
    <Route path="quantum" element={<QuantumVerifyPage />} />
    
  </Route>
</Route>
```

---

### Sidebar Component Update

```typescript
// AdminLayout.tsx - New collapsible sidebar structure

import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface NavSection {
    title: string;
    items: Array<{
        path: string;
        label: string;
        icon: LucideIcon;
    }>;
}

const navSections: NavSection[] = [
    {
        title: 'Dashboard',
        items: [
            { path: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard }
        ]
    },
    {
        title: 'Registry Automator',
        items: [
            { path: '/admin/registry', label: 'Document Scrutiny', icon: FileCheck },
            { path: '/admin/registry/batch', label: 'Batch Processing', icon: Layers },
            { path: '/admin/registry/templates', label: 'Filing Templates', icon: FilePlus },
            { path: '/admin/registry/analytics', label: 'Analytics', icon: BarChart3 }
        ]
    },
    {
        title: 'Listing Optimizer',
        items: [
            { path: '/admin/listing', label: 'Daily Scheduling', icon: Calendar },
            { path: '/admin/listing/multi-court', label: 'Multi-Court View', icon: LayoutGrid },
            { path: '/admin/listing/templates', label: 'Templates', icon: Save },
            { path: '/admin/listing/history', label: 'History', icon: History }
        ]
    },
    {
        title: 'Analytics',
        items: [
            { path: '/admin/pendency', label: 'Pendency Map', icon: Map },
            { path: '/admin/transition', label: 'BNS Transition', icon: TrendingUp },
            { path: '/admin/analysis', label: 'Document Analysis', icon: PieChart }
        ]
    },
    {
        title: 'System',
        items: [
            { path: '/admin/resources', label: 'Resource Allocator', icon: Cpu },
            { path: '/admin/audit', label: 'Activity Log', icon: ClipboardList },
            { path: '/admin/health', label: 'System Health', icon: Activity },
            { path: '/admin/quantum', label: 'Quantum Verify', icon: Fingerprint }
        ]
    }
];

const CollapsibleSection: React.FC<{
    section: NavSection;
    isCollapsed: boolean;
}> = ({ section, isCollapsed }) => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(
        section.items.some(item => location.pathname.startsWith(item.path))
    );
    
    return (
        <div className="mb-4">
            {!isCollapsed && (
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-between w-full px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-300 transition-colors"
                >
                    {section.title}
                    {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
            )}
            
            {(isOpen || isCollapsed) && (
                <nav className="space-y-1">
                    {section.items.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                                    isActive
                                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                        : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                                } ${isCollapsed ? 'justify-center' : ''}`
                            }
                            title={isCollapsed ? item.label : undefined}
                        >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>
            )}
        </div>
    );
};
```

---

## Testing Checklist

### Sidebar Navigation Tests
- [ ] All sidebar links navigate correctly
- [ ] Active state shows correctly for each route
- [ ] Collapsible sections expand/collapse properly
- [ ] Sidebar collapse button works
- [ ] Tooltips show on collapsed sidebar
- [ ] BNS adoption widget displays correctly

### Skill 19 - Registry Tests
- [ ] Document scrutiny works
- [ ] Fee calculator is accurate
- [ ] Batch upload accepts multiple files
- [ ] Batch processing shows progress
- [ ] Templates can be created/edited
- [ ] Analytics charts load
- [ ] Export functions work

### Skill 20 - Listing Tests
- [ ] Schedule generation works
- [ ] Multi-court view displays all courts
- [ ] Utilization gauges are accurate
- [ ] Templates can be applied
- [ ] History page shows past schedules
- [ ] Export schedule works

### General Tests
- [ ] All pages are responsive
- [ ] No console errors
- [ ] Loading states display correctly
- [ ] Error boundaries catch errors
- [ ] Mobile navigation works

---

## Implementation Timeline

### Week 1: Foundation (Days 1-3)
**Day 1:**
- Update AdminLayout.tsx with new sidebar structure
- Add PendencyMap to sidebar
- Test all navigation links

**Day 2:**
- Create RegistryBatchProcessing.tsx
- Create RegistryTemplates.tsx (basic)
- Create RegistryAnalytics.tsx (basic)

**Day 3:**
- Create ListingMultiCourt.tsx
- Create ListingTemplates.tsx (basic)
- Create ListingHistory.tsx (basic)

### Week 2: Supporting Pages (Days 4-7)
**Day 4:**
- Create ResourceAllocatorPage.tsx
- Create DocumentAnalysisPage.tsx

**Day 5:**
- Create ActivityLogPage.tsx
- Create SystemHealthPage.tsx

**Day 6:**
- Create QuantumVerifyPage.tsx (placeholder)
- Add all routes to App.tsx

**Day 7:**
- Testing and bug fixes
- Responsive design checks

### Week 3: Polish (Days 8-10)
**Day 8:**
- Enhance Registry pages with advanced features
- Add charts and analytics

**Day 9:**
- Enhance Listing pages with advanced features
- Multi-court optimizations

**Day 10:**
- Final testing
- Performance optimization
- Documentation

---

## Summary

### What You're Getting

**Phase 1:** Fixed Navigation
- ✅ PendencyMap added to sidebar
- ✅ Collapsible sidebar sections
- ✅ Organized menu structure

**Phase 2:** Skill 19 Enhancements (3 pages)
- 🆕 Batch document processing
- 🆕 Filing templates manager
- 🆕 Registry analytics dashboard

**Phase 3:** Skill 20 Enhancements (3 pages)
- 🆕 Multi-court scheduling view
- 🆕 Schedule templates
- 🆕 Schedule history & analytics

**Phase 4:** Supporting Pages (5 pages)
- 🆕 Resource allocator
- 🆕 Document analysis
- 🆕 Activity log
- 🆕 System health
- 🆕 Quantum verification (placeholder)

### Total Deliverables
- **14 new/updated pages**
- **Organized 4-section sidebar**
- **Enhanced Skills 19 & 20**
- **Complete navigation coverage**
- **Production-ready features**

### Time Estimate
- **Phase 1:** 2-3 hours
- **Phase 2:** 8-10 hours
- **Phase 3:** 8-10 hours
- **Phase 4:** 4-5 hours
- **Total:** 22-28 hours

---

**Ready to implement! Start with Phase 1 (fixing the sidebar) and work through each phase.** 🚀
