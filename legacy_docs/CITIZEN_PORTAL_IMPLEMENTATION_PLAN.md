# Citizen Portal Frontend Implementation Plan
## LegalOS 4.0 - Complete Skill Integration Guide

**Version:** 1.0  
**Date:** February 12, 2026  
**Status:** 📋 Ready for Implementation  
**Estimated Duration:** 30-35 hours  
**Skills Coverage:** 21, 22, 23, 24 (All 4 Citizen Skills)

---

## 📑 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current State Analysis](#current-state-analysis)
3. [Implementation Phases](#implementation-phases)
4. [Phase 1: Critical Missing (Skills 21 & 23)](#phase-1-critical-missing)
5. [Phase 2: Complete Workflows (Skills 22 & 24)](#phase-2-complete-workflows)
6. [Phase 3: Advanced Features](#phase-3-advanced-features)
7. [Phase 4: Polish & UX](#phase-4-polish--ux)
8. [Route Configuration](#route-configuration)
9. [File Structure](#file-structure)
10. [API Integration Points](#api-integration-points)
11. [Testing Checklist](#testing-checklist)
12. [GIGW 3.0 Compliance](#gigw-30-compliance)

---

## Executive Summary

This document provides a complete implementation plan for adding 15 new frontend sections to the Citizen Portal, enabling full utilization of all 4 citizen-facing skills (NyayaBot, e-Filing Pro, Case Status Predictor, Legal Aid Connector).

### Key Objectives
- ✅ Make all 4 skills fully accessible via dedicated UI sections
- ✅ Integrate seamlessly with existing CitizenHome.tsx and CitizenDashboard.tsx
- ✅ Maintain design consistency with existing emerald/cyan/violet theme
- ✅ Ensure GIGW 3.0 compliance (accessibility, multilingual, responsive)
- ✅ Zero breaking changes to existing functionality

---

## Current State Analysis

### Existing Implementation ✅
```
/citizen
├── Home (CitizenHome.tsx) ✅
├── Dashboard (CitizenDashboard.tsx) ✅
├── Track Case (CaseStatusTrackerPage.tsx) ✅
├── Timeline (CitizenTimeline.tsx) ✅
├── Visual Justice (CitizenVisualJustice.tsx) ✅
├── Voice Filing (VoiceFilingInterface.tsx) ✅
└── Complaint (CitizenComplaint.tsx) ✅
```

### Missing Implementation ❌
```
/citizen
├── bot (NyayaBot) - CRITICAL
├── predict (Case Predictor) - CRITICAL
├── file/wizard (e-Filing Wizard) - HIGH
├── file/fees (Fee Calculator) - HIGH
├── legal-aid/eligibility (Eligibility Check) - MEDIUM
└── [11 more pages...]
```

### Navigation Link Issues
Current CitizenHome.tsx has links to:
- `/citizen/bot` → ❌ 404 - Page doesn't exist
- `/citizen/file` → ⚠️ Partial - Only voice filing
- `/citizen/track` → ✅ Exists
- `/citizen/legal-aid` → ⚠️ Partial - Basic only

---

## Implementation Phases

### Phase Overview

| Phase | Pages | Skills | Priority | Duration | Cumulative |
|-------|-------|--------|----------|----------|------------|
| 1 | 2 | 21, 23 | 🔴 Critical | 7-9h | 7-9h |
| 2 | 5 | 22, 24 | 🟠 High | 10-12h | 17-21h |
| 3 | 4 | 23, 24 | 🟡 Medium | 8-10h | 25-31h |
| 4 | 4 | UX | 🟢 Polish | 5-7h | 30-38h |
| **Total** | **15** | **4** | - | **30-38h** | - |

---

## Phase 1: Critical Missing

### 🎯 Objective
Make Skills 21 (NyayaBot) and 23 (Case Predictor) fully accessible. These are currently broken links in the UI.

---

### Page 1: NyayaBot Chat Interface
**File:** `src/personas/citizen/pages/NyayaBotPage.tsx`  
**Route:** `/citizen/bot`  
**Skill:** 21 - NyayaBot (Legal AI)  
**Estimated Time:** 4-5 hours  
**Priority:** 🔴 CRITICAL

#### Purpose
WhatsApp-style chat interface for legal queries with AI-powered responses, voice support, and document suggestions.

#### UI Layout
```
┌─────────────────────────────────────────────────────────────┐
│  ← NyayaBot              Online ●        🌐 🎙️ ⚙️          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐                                               │
│  │ 👋 Hello! │ ← AI Message                                 │
│  └──────────┘                                               │
│                                                             │
│                  ┌──────────────────────┐                   │
│                  │ I need help with...  │ ← User Message   │
│                  └──────────────────────┘                   │
│                                                             │
│  ┌──────────────────────────────────────┐                   │
│  │ 📋 Based on your query, here are... │ ← AI with card   │
│  │ [View Templates] [Chat More]        │                   │
│  └──────────────────────────────────────┘                   │
│                                                             │
│     ● ● ● (typing indicator)                                │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  Quick Replies:                                             │
│  [Check my rights] [File FIR] [Find lawyer] [BNS Section]  │
├─────────────────────────────────────────────────────────────┤
│  🎤  [Type a message...]              [📎] [➤]             │
└─────────────────────────────────────────────────────────────┘
```

#### Component Structure
```typescript
// Main Container
NyayaBotPage.tsx
├── ChatHeader.tsx          // Title, status, language toggle
├── ChatMessages.tsx        // Message list with scroll
│   ├── ChatMessage.tsx     // Individual message bubble
│   ├── TypingIndicator.tsx // Animated dots
│   └── SuggestionCard.tsx  // Template/section suggestions
├── QuickReplies.tsx        // Horizontal scroll buttons
├── ChatInput.tsx           // Input + voice + attach
└── ChatSidebar.tsx         // History, settings (collapsible)
```

#### Key Features

**1. Chat Interface**
```typescript
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: Suggestion[];
  attachments?: Attachment[];
}

interface Suggestion {
  type: 'template' | 'section' | 'procedure' | 'link';
  title: string;
  description: string;
  action: () => void;
}
```

**2. Voice Input/Output**
```typescript
// Voice Input (Web Speech API)
const startVoiceInput = () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = selectedLanguage; // 'hi-IN', 'en-IN', etc.
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    sendMessage(transcript);
  };
  recognition.start();
};

// Text-to-Speech for responses
const speakResponse = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = selectedLanguage;
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
};
```

**3. Quick Reply Buttons**
- "Check my rights" → Opens rights checker
- "File FIR" → Redirects to /citizen/file
- "Find lawyer" → Redirects to /citizen/legal-aid
- "BNS Section lookup" → Opens section search modal
- "Document templates" → Shows template gallery

**4. AI Integration**
```typescript
// Service Integration
import { nyayabotService } from '../../../core/services/nyayabotService';

const sendMessage = async (message: string) => {
  // Add user message to chat
  addMessage({ role: 'user', content: message });
  
  // Show typing indicator
  setIsTyping(true);
  
  // Call AI service
  const response = await nyayabotService.processQuery({
    query: message,
    language: currentLanguage,
    sessionId: chatSessionId,
    context: getChatContext()
  });
  
  // Add AI response
  addMessage({
    role: 'assistant',
    content: response.content,
    suggestions: response.suggestions
  });
  
  setIsTyping(false);
};
```

**5. Multilingual Support (22 Languages)**
```typescript
const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া' },
  { code: 'ur', name: 'Urdu', native: 'اردو' },
  { code: 'sd', name: 'Sindhi', native: 'सिंधी' },
  { code: 'sa', name: 'Sanskrit', native: 'संस्कृत' },
  { code: 'ne', name: 'Nepali', native: 'नेपाली' },
  { code: 'kok', name: 'Konkani', native: 'कोंकणी' },
  { code: 'mai', name: 'Maithili', native: 'मैथिली' },
  { code: 'mni', name: 'Manipuri', native: 'মৈতৈলোন্' },
  { code: 'sat', name: 'Santali', native: 'ᱥᱟᱱᱛᱟᱲᱤ' },
  { code: 'doi', name: 'Dogri', native: 'डोगरी' },
  { code: 'brx', name: 'Bodo', native: 'बड़ो' }
];
```

#### State Management
```typescript
interface NyayaBotState {
  messages: ChatMessage[];
  isTyping: boolean;
  selectedLanguage: string;
  chatHistory: ChatSession[];
  quickReplies: QuickReply[];
  isVoiceMode: boolean;
  isSidebarOpen: boolean;
}
```

#### Integration with Existing Code
**Link from CitizenHome.tsx (Line 393):**
```typescript
// ALREADY EXISTS - just needs the page to be created
<Link to="/citizen/bot" className="block p-6 group">
  <h3>Legal Aid & Rights</h3>
  <p>Ask AI</p>
</Link>
```

**Add to Dashboard Quick Actions:**
```typescript
// In CitizenDashboard.tsx, update quickActions array:
{
  id: 'nyayabot',
  icon: <MessageSquare className="w-6 h-6" />,
  title: 'AI Legal Help',
  description: 'Chat with NyayaBot',
  bgColor: 'rgba(139, 92, 246, 0.2)',  // violet-500
  textColor: '#8B5CF6',
  onClick: () => navigate('/citizen/bot')
}
```

---

### Page 2: Case Status Predictor
**File:** `src/personas/citizen/pages/CasePredictorPage.tsx`  
**Route:** `/citizen/predict`  
**Skill:** 23 - Case Status Predictor  
**Estimated Time:** 3-4 hours  
**Priority:** 🔴 CRITICAL

#### Purpose
AI-powered prediction of case outcomes, timelines, and costs based on case details analysis.

#### UI Layout
```
┌─────────────────────────────────────────────────────────────┐
│  ← Case Predictor                                    🔔 ⚙️ │
├─────────────────────────────────────────────────────────────┤
│  Get AI-powered insights about your case outcome           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  STEP 1: Case Details                                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Case Type: [Criminal ▼]                             │   │
│  │ Court: [District Court ▼]                           │   │
│  │ Judge: [Select or Unknown ▼]                        │   │
│  │ Evidence Strength: [Strong ▼]                       │   │
│  │ Your Lawyer: [Experienced ▼]                        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  STEP 2: Analysis                                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │    ┌─────────────┐                                  │   │
│  │    │   73%       │  Win Probability                 │   │
│  │    │  ┌───────┐  │                                  │   │
│  │    │  │███████░│  │  Based on 1,247 similar cases   │   │
│  │    │  └───────┘  │                                  │   │
│  │    └─────────────┘                                  │   │
│  │                                                     │   │
│  │  📅 Timeline: 8-12 months                          │   │
│  │  🤝 Settlement: 45% likely in 4 months             │   │
│  │  💰 Est. Cost: ₹45,000 - ₹65,000                   │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  [🔍 View Similar Cases]  [💰 Detailed Cost Breakdown]     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Component Structure
```typescript
CasePredictorPage.tsx
├── PredictorHeader.tsx         // Title, back button
├── CaseInputForm.tsx           // Input fields
│   ├── CaseTypeSelector.tsx
│   ├── CourtSelector.tsx
│   ├── JudgeSelector.tsx
│   ├── EvidenceStrength.tsx    // Star rating
│   └── LawyerExperience.tsx    // Experience slider
├── PredictionResults.tsx       // Results display
│   ├── WinProbabilityGauge.tsx // Radial chart
│   ├── TimelineEstimator.tsx   // Timeline bar
│   ├── SettlementIndicator.tsx // Likelihood badge
│   └── CostPreview.tsx         // Cost range
├── SimilarCasesPreview.tsx     // Top 3 similar cases
└── ActionButtons.tsx           // Navigate to detailed views
```

#### Key Features

**1. Win Probability Gauge**
```typescript
// Using recharts RadialBarChart
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

const WinProbabilityGauge = ({ probability }: { probability: number }) => {
  const data = [{ name: 'Win', value: probability }];
  
  return (
    <ResponsiveContainer width="100%" height={200}>
      <RadialBarChart
        innerRadius="60%"
        outerRadius="100%"
        data={data}
        startAngle={180}
        endAngle={0}
      >
        <RadialBar
          background
          dataKey="value"
          cornerRadius={10}
          fill={probability > 60 ? '#10b981' : probability > 40 ? '#f59e0b' : '#ef4444'}
        />
      </RadialBarChart>
    </ResponsiveContainer>
  );
};
```

**2. Case Input Form**
```typescript
interface CaseDetails {
  caseType: 'civil' | 'criminal' | 'family' | 'property' | 'consumer';
  subType: string; // BNS section or case category
  courtId: string;
  judgeId?: string;
  evidenceStrength: 1 | 2 | 3 | 4 | 5; // 1=weak, 5=strong
  lawyerExperience: 'none' | 'junior' | 'mid' | 'senior' | 'expert';
  caseValue?: number; // For civil cases
  urgency: 'normal' | 'urgent' | 'very_urgent';
}
```

**3. Prediction Results**
```typescript
interface PredictionResult {
  winProbability: number; // 0-100
  timelineEstimate: {
    minMonths: number;
    maxMonths: number;
    confidence: number;
  };
  settlementChance: number; // 0-100
  appealSuccessRate?: number; // For appeals
  similarCasesAnalyzed: number;
  confidenceScore: number; // AI confidence
}
```

**4. API Integration**
```typescript
import { predictorService } from '../../../core/services/predictorService';

const handlePredict = async (caseDetails: CaseDetails) => {
  setIsLoading(true);
  
  try {
    const prediction = await predictorService.predictOutcome(caseDetails);
    setResult(prediction);
    
    // Fetch similar cases for preview
    const similar = await predictorService.getSimilarCases(caseDetails, 3);
    setSimilarCases(similar);
  } catch (error) {
    showToast('Prediction failed. Please try again.', 'error');
  } finally {
    setIsLoading(false);
  }
};
```

#### Integration with Existing Code
**New Navigation Link in CitizenHome.tsx:**
```typescript
// Add to Secondary Actions section (around line 416)
{
  icon: TrendingUp, // Add import
  label: 'Case Predictor',
  path: '/citizen/predict',
  gradient: 'from-purple-500 to-indigo-500'
}
```

---

## Phase 2: Complete Workflows

### 🎯 Objective
Complete the workflow implementations for Skills 22 (e-Filing Pro) and 24 (Legal Aid Connector).

---

### Page 3: e-Filing Wizard
**File:** `src/personas/citizen/pages/EFilingWizard.tsx`  
**Route:** `/citizen/file/wizard`  
**Skill:** 22 - e-Filing Pro  
**Estimated Time:** 4-5 hours  
**Priority:** 🟠 HIGH

#### Purpose
Step-by-step wizard for filing new cases with document upload, fee calculation, and digital signature.

#### UI Layout
```
┌─────────────────────────────────────────────────────────────┐
│  ← File New Case                    Step 3 of 10     💾    │
├─────────────────────────────────────────────────────────────┤
│  [1]→[2]→[3]→[4]→[5]→[6]→[7]→[8]→[9]→[10]                │
│       Pet.  Res.  Type  Cause  Pray.  Docs  Fees  Rev.  Sig.  Conf. │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  STEP 3: Case Type Selection                                │
│                                                             │
│  Select the type of case you want to file:                  │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   ⚖️         │  │   🏠         │  │   💼         │      │
│  │   Criminal   │  │   Property   │  │   Civil      │      │
│  │   Selected ✓ │  │              │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                             │
│  BNS Section: [Search or select section ▼]                 │
│  Selected: Section 304 - Snatching                         │
│  Description: Theft by...                                  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ⚠️ Similar Cases Found: 47                          │   │
│  │ Average resolution time: 8 months                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│        [Previous]              [Save Draft] [Next →]       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Wizard Steps
```typescript
const WIZARD_STEPS = [
  { id: 1, key: 'petitioner', title: 'Petitioner', icon: User },
  { id: 2, key: 'respondent', title: 'Respondent', icon: Users },
  { id: 3, key: 'caseType', title: 'Case Type', icon: Scale },
  { id: 4, key: 'causeOfAction', title: 'Cause', icon: FileText },
  { id: 5, key: 'prayer', title: 'Prayer', icon: HelpCircle },
  { id: 6, key: 'documents', title: 'Documents', icon: Upload },
  { id: 7, key: 'fees', title: 'Fees', icon: IndianRupee },
  { id: 8, key: 'review', title: 'Review', icon: Eye },
  { id: 9, key: 'signature', title: 'Signature', icon: PenTool },
  { id: 10, key: 'confirmation', title: 'Done', icon: CheckCircle }
];
```

#### Component Structure
```typescript
EFilingWizard.tsx
├── WizardHeader.tsx            // Progress bar, step indicator
├── WizardNavigation.tsx        // Previous/Next/Save buttons
├── StepContent.tsx             // Dynamic step content
│   ├── PetitionerStep.tsx
│   ├── RespondentStep.tsx
│   ├── CaseTypeStep.tsx
│   ├── CauseOfActionStep.tsx
│   ├── PrayerStep.tsx
│   ├── DocumentsStep.tsx
│   ├── FeesStep.tsx
│   ├── ReviewStep.tsx
│   ├── SignatureStep.tsx
│   └── ConfirmationStep.tsx
└── WizardSidebar.tsx           // Help text, tips
```

#### Key Features

**1. Step 1: Petitioner Details**
```typescript
interface PetitionerData {
  name: string;
  fatherName: string;
  age: number;
  occupation: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  phone: string;
  email: string;
  idProof: {
    type: 'aadhaar' | 'pan' | 'passport' | 'voter';
    number: string;
    file: File;
  };
}
```

**2. Step 3: Case Type with BNS Sections**
```typescript
const CASE_TYPES = [
  {
    id: 'criminal',
    name: 'Criminal',
    icon: '⚖️',
    bnsSections: [
      { code: 'BNS 304', name: 'Snatching', description: '...' },
      { code: 'BNS 306', name: 'Theft', description: '...' },
      // ... all BNS sections
    ]
  },
  { id: 'civil', name: 'Civil', icon: '📜', ... },
  { id: 'family', name: 'Family', icon: '👨‍👩‍👧', ... },
  { id: 'property', name: 'Property', icon: '🏠', ... }
];
```

**3. Step 6: Document Upload**
```typescript
interface DocumentUpload {
  category: 'petition' | 'evidence' | 'id_proof' | 'address_proof' | 'other';
  files: UploadedFile[];
  blockchainHash?: string;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: 'application/pdf';
  progress: number; // 0-100
  status: 'uploading' | 'processing' | 'verified' | 'error';
  hash?: string;
}
```

**4. Step 7: Fee Calculation**
```typescript
const calculateFees = (caseDetails: CaseDetails): FeeBreakdown => {
  const baseFee = getBaseFee(caseDetails.caseType);
  const adValorem = caseDetails.caseValue 
    ? calculateAdValorem(caseDetails.caseValue) 
    : 0;
  const processFee = 500; // Fixed
  const miscFee = 200; // Fixed
  
  return {
    baseFee,
    adValorem,
    processFee,
    miscFee,
    total: baseFee + adValorem + processFee + miscFee,
    formattedTotal: formatINR(baseFee + adValorem + processFee + miscFee)
  };
};
```

**5. Step 9: Digital Signature**
```typescript
// Aadhaar eSign integration placeholder
const handleEsign = async () => {
  const response = await efilingService.initiateEsign({
    filingId: currentFiling.id,
    aadhaarNumber: petitioner.idProof.number,
    returnUrl: window.location.href
  });
  
  // Redirect to eSign gateway
  window.location.href = response.esignUrl;
};
```

#### Integration with Existing Code
**Add Wizard Button in VoiceFilingInterface.tsx:**
```typescript
// Add after voice filing option
<div className="mt-6 text-center">
  <p className="text-sm text-gray-500 mb-3">Or</p>
  <Link 
    to="/citizen/file/wizard"
    className="btn btn-secondary"
  >
    <FileText className="w-4 h-4 mr-2" />
    Use Detailed Filing Form
  </Link>
</div>
```

---

### Page 4: Court Fee Calculator
**File:** `src/personas/citizen/pages/FeeCalculatorPage.tsx`  
**Route:** `/citizen/file/fees`  
**Skill:** 22 - e-Filing Pro  
**Estimated Time:** 2 hours  
**Priority:** 🟠 HIGH

#### Purpose
Standalone tool to calculate court fees before filing.

#### UI Layout
```
┌─────────────────────────────────────────────────────────────┐
│  ← Court Fee Calculator                                     │
├─────────────────────────────────────────────────────────────┤
│  Calculate court fees before you file                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Filing Type:                                               │
│  [●] Civil Suit    [ ] Criminal    [ ] Writ Petition       │
│                                                             │
│  Dispute Value (₹):                                         │
│  ┌─────────────────────────────────────────┐ [Calculate]   │
│  │ ₹ 5,00,000                               │               │
│  └─────────────────────────────────────────┘               │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  FEE BREAKDOWN                                      │   │
│  │                                                     │   │
│  │  Base Court Fee                          ₹  1,500   │   │
│  │  Ad Valorem Fee (2% of ₹5L)              ₹ 10,000   │   │
│  │  Process Fee                             ₹    500   │   │
│  │  Misc Charges                            ₹    200   │   │
│  │  ─────────────────────────────────────────────────  │   │
│  │  TOTAL                                   ₹ 12,200   │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  [📥 Download Fee Structure PDF]  [🚀 Proceed to Filing]   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Fee Calculation Logic
```typescript
const COURT_FEE_STRUCTURE = {
  civil: {
    baseFee: 1500,
    adValoremRate: 0.02, // 2%
    maxAdValorem: 100000,
    processFee: 500,
    miscFee: 200
  },
  criminal: {
    baseFee: 0,
    adValoremRate: 0,
    processFee: 500,
    miscFee: 200
  },
  writ: {
    baseFee: 2000,
    adValoremRate: 0,
    processFee: 1000,
    miscFee: 500
  }
};

const calculateCourtFees = (
  filingType: keyof typeof COURT_FEE_STRUCTURE,
  disputeValue: number
): FeeBreakdown => {
  const structure = COURT_FEE_STRUCTURE[filingType];
  
  const adValorem = Math.min(
    disputeValue * structure.adValoremRate,
    structure.maxAdValorem
  );
  
  return {
    baseFee: structure.baseFee,
    adValorem,
    processFee: structure.processFee,
    miscFee: structure.miscFee,
    total: structure.baseFee + adValorem + structure.processFee + structure.miscFee
  };
};

const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};
```

---

### Page 5: Legal Aid Eligibility Checker
**File:** `src/personas/citizen/pages/EligibilityCheckerPage.tsx`  
**Route:** `/citizen/legal-aid/eligibility`  
**Skill:** 24 - Legal Aid Connector  
**Estimated Time:** 2-3 hours  
**Priority:** 🟠 HIGH

#### Purpose
Interactive quiz to check if citizen qualifies for free legal aid under NALSA.

#### UI Layout
```
┌─────────────────────────────────────────────────────────────┐
│  ← Check Eligibility                                        │
├─────────────────────────────────────────────────────────────┤
│  Find out if you qualify for free legal assistance         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Question 3 of 5                                            │
│  ════════════════════════════════░░░░░░░░░░ 60%            │
│                                                             │
│  What is your approximate annual family income?             │
│                                                             │
│  ○ Less than ₹3,00,000 (Below poverty line)                │
│  ○ ₹3,00,000 - ₹5,00,000                                   │
│  ● ₹5,00,000 - ₹8,00,000 (Eligible in some states)        │
│  ○ More than ₹8,00,000                                     │
│                                                             │
│  💡 Did you know? Legal aid is free for women, children,   │
│     and SC/ST regardless of income in most states.         │
│                                                             │
│        [← Previous]                  [Next →]               │
│                                                             │
│  ─────────────── OR ───────────────                        │
│                                                             │
│  [🚀 Quick Check: I am a Woman/Child/SC/ST/Senior Citizen] │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Eligibility Questions
```typescript
const ELIGIBILITY_QUESTIONS = [
  {
    id: 'gender',
    question: 'What is your gender?',
    type: 'single',
    options: ['Male', 'Female', 'Other'],
    autoQualify: ['Female'] // Women get automatic eligibility
  },
  {
    id: 'age',
    question: 'What is your age?',
    type: 'number',
    autoQualify: { max: 18, min: 60 }, // Children and seniors
    hint: 'Legal aid is free for minors and senior citizens'
  },
  {
    id: 'category',
    question: 'Do you belong to any of these categories?',
    type: 'multiple',
    options: ['SC', 'ST', 'OBC', 'None'],
    autoQualify: ['SC', 'ST']
  },
  {
    id: 'income',
    question: 'What is your annual family income?',
    type: 'single',
    options: [
      { label: 'Below ₹3,00,000', eligible: true },
      { label: '₹3,00,000 - ₹5,00,000', eligible: true },
      { label: 'Above ₹5,00,000', eligible: false }
    ]
  },
  {
    id: 'caseType',
    question: 'What type of legal issue do you have?',
    type: 'single',
    options: [
      { label: 'Criminal case (accused)', alwaysEligible: true },
      { label: 'Family matter (divorce, custody)', eligible: true },
      { label: 'Property dispute', eligible: true },
      { label: 'Civil matter', eligible: true }
    ]
  }
];
```

#### Result Screen
```typescript
interface EligibilityResult {
  isEligible: boolean;
  confidence: number; // 0-100
  reasons: string[];
  nextSteps: string[];
  documentsRequired: string[];
  nearbyProviders: LegalAidProvider[];
}

// Result display
const ResultScreen = ({ result }: { result: EligibilityResult }) => (
  <div className={`p-6 rounded-2xl ${result.isEligible ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}>
    <div className="text-center mb-6">
      {result.isEligible ? (
        <>
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-emerald-500">You are Eligible!</h2>
          <p className="text-gray-600 mt-2">You qualify for free legal aid services</p>
        </>
      ) : (
        <>
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-amber-500">May Not Be Eligible</h2>
          <p className="text-gray-600 mt-2">But you can still apply - each case is reviewed</p>
        </>
      )}
    </div>
    
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold mb-2">Required Documents:</h3>
        <ul className="list-disc list-inside text-sm text-gray-600">
          {result.documentsRequired.map((doc, i) => (
            <li key={i}>{doc}</li>
          ))}
        </ul>
      </div>
      
      <div className="flex gap-4 mt-6">
        <button className="btn btn-primary flex-1">
          Find Legal Aid Near You
        </button>
        <button className="btn btn-secondary flex-1">
          Start Application
        </button>
      </div>
    </div>
  </div>
);
```

---

### Page 6: Filing History Dashboard
**File:** `src/personas/citizen/pages/FilingDashboard.tsx`  
**Route:** `/citizen/file` (index)  
**Skill:** 22 - e-Filing Pro  
**Estimated Time:** 2 hours  
**Priority:** 🟠 HIGH

#### Purpose
Overview of all filings with status tracking and pending actions.

#### UI Layout
```
┌─────────────────────────────────────────────────────────────┐
│  My e-Filings                                    [+ New]   │
├─────────────────────────────────────────────────────────────┤
│  Tabs: [All] [Drafts] [Pending] [Registered] [Disposed]    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🔴 Action Required                                  │   │
│  │                                                     │   │
│  │  FIR #2024/001 (Draft)                              │   │
│  │  Status: Pending Digital Signature                  │   │
│  │  ⏰ Sign before: 24 Oct 2025 (2 days left)         │   │
│  │                                                     │   │
│  │  [Complete Filing] [Delete Draft]                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Recent Filings:                                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 📄 FIR #2023/045                     15 Oct 2024   │   │
│  │ Status: 🟢 Registered    CNR: DLCT/2023/00789      │   │
│  │ [View Details] [Download PDF] [Track Status]       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 📄 Civil Suit #2023/012              03 Sep 2024   │   │
│  │ Status: 🟡 Under Review  [Pending Verification]    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase 3: Advanced Features

### Page 7: Appointment Booking
**File:** `src/personas/citizen/pages/AppointmentBooking.tsx`  
**Route:** `/citizen/legal-aid/book`  
**Skill:** 24 - Legal Aid Connector  
**Estimated Time:** 3 hours

#### Key Components
- Calendar view (react-calendar or custom)
- Time slot selector
- Provider selection with map
- Confirmation modal
- Reminder setup

---

### Page 8: Similar Cases Analysis
**File:** `src/personas/citizen/pages/SimilarCasesPage.tsx`  
**Route:** `/citizen/predict/similar`  
**Skill:** 23 - Case Status Predictor  
**Estimated Time:** 3 hours

#### Key Components
- List of comparable cases
- Outcome statistics charts
- Judge analytics (win rates by judge)
- Court-specific timelines
- Filter by case type, year, outcome

---

### Page 9: Cost Estimator
**File:** `src/personas/citizen/pages/CostEstimatorPage.tsx`  
**Route:** `/citizen/predict/costs`  
**Skill:** 23 - Case Status Predictor  
**Estimated Time:** 2 hours

#### Key Components
- Lawyer fee tiers (junior/mid/senior)
- Court fees (from fee calculator)
- Misc expenses calculator
- Total cost projection
- Payment schedule suggestion

---

### Page 10: Legal Aid Providers Directory
**File:** `src/personas/citizen/pages/LegalAidProviders.tsx`  
**Route:** `/citizen/legal-aid/providers`  
**Skill:** 24 - Legal Aid Connector  
**Estimated Time:** 3 hours

#### Key Components
- Map integration (Mapbox/Google Maps)
- NALSA/DALSA office listings
- Pro bono lawyer profiles
- Filter sidebar (distance, language, case type)
- Contact information cards

---

## Phase 4: Polish & UX

### Page 11: Legal Action Center
**File:** `src/personas/citizen/pages/LegalActionCenter.tsx`  
**Route:** `/citizen/action`  
**Purpose:** Unified AI tools and filing center  
**Estimated Time:** 3 hours

#### Tabs Structure
```typescript
const ACTION_CENTER_TABS = [
  {
    id: 'ai-tools',
    label: 'AI Legal Tools',
    icon: Sparkles,
    tools: [
      { id: 'transcriber', name: 'Audio Transcriber', description: 'Convert voice to legal text' },
      { id: 'analyzer', name: 'Argument Analyzer', description: 'AI review of case strengths' },
      { id: 'tutor', name: 'AI Tutor', description: 'Step-by-step legal guidance' },
      { id: 'document', name: 'Document Analyzer', description: 'BNS section detection' }
    ]
  },
  {
    id: 'file-complaint',
    label: 'File Complaint',
    icon: FileText,
    modes: ['voice', 'text']
  }
];
```

---

### Page 12: Citizen Settings
**File:** `src/personas/citizen/pages/CitizenSettings.tsx`  
**Route:** `/citizen/settings`  
**Purpose:** User preferences and accessibility  
**Estimated Time:** 2 hours

#### Sections
1. **Profile Management** - Edit personal details
2. **Language** - Select from 22 Indian languages
3. **Accessibility:**
   - High contrast mode toggle
   - Font size (A-, A, A+, A++)
   - Reduce motion
   - Screen reader optimizations
4. **Notifications** - Email/SMS preferences
5. **Privacy** - Data download, delete account

---

### Page 13: Notifications Center
**File:** `src/personas/citizen/pages/NotificationsPage.tsx`  
**Route:** `/citizen/notifications`  
**Purpose:** Unified alerts and reminders  
**Estimated Time:** 2 hours

#### Notification Types
- Case hearing reminders (24hrs, 2hrs before)
- e-FIR signature deadlines (BNSS 173)
- Legal aid appointment alerts
- Document upload requests
- System announcements

---

## Route Configuration

### Complete Routes to Add

```typescript
// Add to App.tsx or router configuration

import { Route, Routes } from 'react-router-dom';

// Phase 1: Critical
import NyayaBotPage from './personas/citizen/pages/NyayaBotPage';
import CasePredictorPage from './personas/citizen/pages/CasePredictorPage';

// Phase 2: Complete Workflows
import EFilingWizard from './personas/citizen/pages/EFilingWizard';
import FilingDashboard from './personas/citizen/pages/FilingDashboard';
import FeeCalculatorPage from './personas/citizen/pages/FeeCalculatorPage';
import EligibilityCheckerPage from './personas/citizen/pages/EligibilityCheckerPage';

// Phase 3: Advanced
import SimilarCasesPage from './personas/citizen/pages/SimilarCasesPage';
import CostEstimatorPage from './personas/citizen/pages/CostEstimatorPage';
import AppointmentBooking from './personas/citizen/pages/AppointmentBooking';
import LegalAidProviders from './personas/citizen/pages/LegalAidProviders';

// Phase 4: Polish
import LegalActionCenter from './personas/citizen/pages/LegalActionCenter';
import CitizenSettings from './personas/citizen/pages/CitizenSettings';
import NotificationsPage from './personas/citizen/pages/NotificationsPage';

// Inside Routes component:
<Route element={<ProtectedRoute allowedRoles={['CITIZEN']} />}>
  <Route path="/citizen" element={<CitizenLayout />}>
    {/* Existing routes ✅ */}
    <Route index element={<CitizenHome />} />
    <Route path="dashboard" element={<CitizenDashboard />} />
    <Route path="track" element={<CaseStatusTrackerPage />} />
    <Route path="timeline" element={<CitizenTimeline />} />
    <Route path="visuals" element={<CitizenVisualJustice />} />
    <Route path="complaint" element={<CitizenComplaint />} />
    
    {/* Phase 1: Critical - NEW */}
    <Route path="bot" element={<NyayaBotPage />} />
    <Route path="predict" element={<CasePredictorPage />} />
    
    {/* Phase 2: Complete Workflows - NEW */}
    <Route path="file" element={<FilingDashboard />}>
      <Route index element={<FilingOverview />} />
      <Route path="wizard" element={<EFilingWizard />} />
      <Route path="fees" element={<FeeCalculatorPage />} />
    </Route>
    
    <Route path="legal-aid" element={<LegalAidLayout />}>
      <Route index element={<LegalAidOverview />} />
      <Route path="eligibility" element={<EligibilityCheckerPage />} />
      <Route path="providers" element={<LegalAidProviders />} />
      <Route path="book" element={<AppointmentBooking />} />
    </Route>
    
    {/* Phase 3: Advanced - NEW */}
    <Route path="predict/similar" element={<SimilarCasesPage />} />
    <Route path="predict/costs" element={<CostEstimatorPage />} />
    
    {/* Phase 4: Polish - NEW */}
    <Route path="action" element={<LegalActionCenter />} />
    <Route path="settings" element={<CitizenSettings />} />
    <Route path="notifications" element={<NotificationsPage />} />
  </Route>
</Route>
```

---

## File Structure

### Complete Directory Tree

```
src/personas/citizen/
├── pages/
│   ├── CitizenHome.tsx ✅ (existing)
│   ├── CitizenDashboard.tsx ✅ (existing)
│   ├── CitizenTimeline.tsx ✅ (existing)
│   ├── CitizenVisualJustice.tsx ✅ (existing)
│   ├── CaseStatusTrackerPage.tsx ✅ (existing)
│   ├── CaseTrack.tsx ✅ (existing)
│   ├── VoiceFilingInterface.tsx ✅ (existing)
│   ├── CitizenComplaint.tsx ✅ (existing)
│   ├── LegalAidFinderPage.tsx ✅ (existing)
│   │
│   ├── Phase 1: Critical (NEW)
│   ├── NyayaBotPage.tsx 🔴
│   │   └── components/
│   │       ├── ChatHeader.tsx
│   │       ├── ChatMessages.tsx
│   │       ├── ChatInput.tsx
│   │       ├── QuickReplies.tsx
│   │       └── ChatSidebar.tsx
│   ├── CasePredictorPage.tsx 🔴
│   │   └── components/
│   │       ├── CaseInputForm.tsx
│   │       ├── PredictionResults.tsx
│   │       ├── WinProbabilityGauge.tsx
│   │       └── SimilarCasesPreview.tsx
│   │
│   ├── Phase 2: Complete Workflows (NEW)
│   ├── EFilingWizard.tsx 🟠
│   │   └── steps/
│   │       ├── PetitionerStep.tsx
│   │       ├── RespondentStep.tsx
│   │       ├── CaseTypeStep.tsx
│   │       ├── CauseOfActionStep.tsx
│   │       ├── PrayerStep.tsx
│   │       ├── DocumentsStep.tsx
│   │       ├── FeesStep.tsx
│   │       ├── ReviewStep.tsx
│   │       ├── SignatureStep.tsx
│   │       └── ConfirmationStep.tsx
│   ├── FilingDashboard.tsx 🟠
│   ├── FeeCalculatorPage.tsx 🟠
│   ├── EligibilityCheckerPage.tsx 🟠
│   │
│   ├── Phase 3: Advanced (NEW)
│   ├── SimilarCasesPage.tsx 🟡
│   ├── CostEstimatorPage.tsx 🟡
│   ├── AppointmentBooking.tsx 🟡
│   └── LegalAidProviders.tsx 🟡
│
├── components/ ✅ (existing)
│   ├── RightsAssistant.tsx
│   ├── NyayaPath.tsx
│   ├── EmergencySOS.tsx
│   └── EFirSignatureTimer.tsx
│
├── hooks/ 🟢 (NEW)
│   ├── useNyayaBot.ts
│   ├── useCasePrediction.ts
│   ├── useEFiling.ts
│   └── useLegalAid.ts
│
└── types/ 🟢 (NEW)
    ├── nyayabot.types.ts
    ├── predictor.types.ts
    ├── efiling.types.ts
    └── legalaid.types.ts
```

---

## API Integration Points

### Service Files to Create

```typescript
// src/core/services/nyayabotService.ts
export const nyayabotService = {
  async processQuery(request: ChatRequest): Promise<ChatResponse> {
    return api.post('/citizen/nyayabot/chat', request);
  },
  
  async getChatHistory(sessionId: string): Promise<ChatMessage[]> {
    return api.get(`/citizen/nyayabot/history/${sessionId}`);
  },
  
  async getSuggestions(query: string): Promise<Suggestion[]> {
    return api.get('/citizen/nyayabot/suggestions', { params: { q: query } });
  }
};

// src/core/services/predictorService.ts
export const predictorService = {
  async predictOutcome(caseDetails: CaseDetails): Promise<PredictionResult> {
    return api.post('/citizen/predictor/outcome', caseDetails);
  },
  
  async getSimilarCases(caseDetails: CaseDetails, limit: number): Promise<SimilarCase[]> {
    return api.post('/citizen/predictor/similar', { caseDetails, limit });
  },
  
  async estimateCosts(caseDetails: CaseDetails): Promise<CostEstimate> {
    return api.post('/citizen/predictor/costs', caseDetails);
  }
};

// src/core/services/efilingService.ts
export const efilingService = {
  async createFiling(data: FilingData): Promise<Filing> {
    return api.post('/citizen/efiling', data);
  },
  
  async uploadDocument(filingId: string, file: File): Promise<Document> {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/citizen/efiling/${filingId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  async calculateFees(filingType: string, value: number): Promise<FeeBreakdown> {
    return api.get('/citizen/efiling/fees', { params: { type: filingType, value } });
  },
  
  async getMyFilings(): Promise<Filing[]> {
    return api.get('/citizen/efiling/my-filings');
  }
};

// src/core/services/legalaidService.ts
export const legalaidService = {
  async checkEligibility(data: EligibilityData): Promise<EligibilityResult> {
    return api.post('/citizen/legalaid/eligibility', data);
  },
  
  async findProviders(filters: ProviderFilters): Promise<LegalAidProvider[]> {
    return api.get('/citizen/legalaid/providers', { params: filters });
  },
  
  async bookAppointment(providerId: string, slot: Date): Promise<Appointment> {
    return api.post('/citizen/legalaid/appointments', { providerId, slot });
  }
};
```

---

## Testing Checklist

### Functional Testing

#### NyayaBot (Skill 21)
- [ ] Chat interface loads correctly
- [ ] Messages send and receive
- [ ] Quick reply buttons work
- [ ] Voice input captures speech
- [ ] Text-to-speech plays responses
- [ ] Language switching updates UI
- [ ] Chat history persists
- [ ] Suggestions display correctly
- [ ] Scroll to bottom on new messages

#### Case Predictor (Skill 23)
- [ ] All form fields accept input
- [ ] Prediction API returns results
- [ ] Win probability gauge displays
- [ ] Timeline estimate shows range
- [ ] Similar cases load
- [ ] Cost calculator works
- [ ] Form validation works
- [ ] Loading states show

#### e-Filing (Skill 22)
- [ ] Wizard navigation works (prev/next)
- [ ] Step validation prevents progression
- [ ] Document upload shows progress
- [ ] Fee calculation is accurate
- [ ] Review page shows all data
- [ ] Digital signature flow works
- [ ] Confirmation shows CNR number
- [ ] Draft save/load works

#### Legal Aid (Skill 24)
- [ ] Eligibility quiz flows correctly
- [ ] Results show accurate status
- [ ] Provider search returns results
- [ ] Map displays correctly
- [ ] Appointment booking saves
- [ ] Calendar shows available slots
- [ ] Confirmation email sent

### Accessibility Testing
- [ ] All pages have proper heading hierarchy (h1 → h2 → h3)
- [ ] Form labels are associated with inputs
- [ ] Error messages are clear and linked
- [ ] Color contrast meets WCAG 4.5:1
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Focus indicators are visible
- [ ] Screen reader announces page changes
- [ ] Skip links work

### Responsive Testing
- [ ] Mobile (320px): All features accessible
- [ ] Tablet (768px): Layout adapts
- [ ] Desktop (1024px+): Full experience
- [ ] Touch targets are minimum 44x44px
- [ ] Text is readable at all sizes

### Performance Testing
- [ ] Page load < 3 seconds
- [ ] Chat response < 2 seconds
- [ ] File upload shows progress
- [ ] No memory leaks in chat
- [ ] Lazy loading works for heavy components

---

## GIGW 3.0 Compliance

### Accessibility Requirements

#### 1. WCAG 2.1 Level AA
```typescript
// All pages must have:

// Proper headings
<h1>Page Title</h1>
<h2>Section Title</h2>
<h3>Subsection</h3>

// ARIA labels
<button aria-label="Close dialog">×</button>
<input aria-describedby="error-message" />
<div role="alert" id="error-message">Error text</div>

// Focus management
const modalRef = useRef<HTMLDivElement>(null);
useEffect(() => {
  if (isOpen) {
    modalRef.current?.focus();
    // Trap focus inside modal
  }
}, [isOpen]);

// Color contrast (test with WebAIM tool)
// Minimum 4.5:1 for normal text
// Minimum 3:1 for large text (18pt+)
```

#### 2. Multilingual Support (22 Languages)
```typescript
// Language switcher component
const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  
  return (
    <select 
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      aria-label="Select language"
    >
      {SUPPORTED_LANGUAGES.map(lang => (
        <option key={lang.code} value={lang.code}>
          {lang.native} ({lang.name})
        </option>
      ))}
    </select>
  );
};

// Translation hook
const useTranslation = () => {
  const { language } = useLanguage();
  
  const t = (key: string) => {
    return TRANSLATIONS[language][key] || TRANSLATIONS['en'][key];
  };
  
  return { t };
};
```

#### 3. Font Size Controls
```typescript
// Settings provider
const AccessibilityProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'x-large'>('normal');
  
  const fontSizeClasses = {
    normal: 'text-base',
    large: 'text-lg',
    'x-large': 'text-xl'
  };
  
  return (
    <div className={fontSizeClasses[fontSize]}>
      {children}
    </div>
  );
};

// Font size buttons in settings
<button onClick={() => setFontSize('normal')}>A</button>
<button onClick={() => setFontSize('large')}>A+</button>
<button onClick={() => setFontSize('x-large')}>A++</button>
```

#### 4. High Contrast Mode
```typescript
// Tailwind config extension
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  // ...
};

// High contrast toggle
const [highContrast, setHighContrast] = useState(false);

// Apply class to root
<html className={highContrast ? 'high-contrast' : ''}>

// CSS for high contrast
.high-contrast {
  --bg-primary: #000;
  --text-primary: #fff;
  --border-color: #fff;
  /* Override all colors for maximum contrast */
}
```

#### 5. Keyboard Navigation
```typescript
// Keyboard shortcut hook
const useKeyboardShortcuts = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + / to open help
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        openHelpModal();
      }
      
      // Escape to close modals
      if (e.key === 'Escape') {
        closeAllModals();
      }
      
      // Alt + 1-9 for quick navigation
      if (e.altKey && e.key >= '1' && e.key <= '9') {
        navigateToSection(parseInt(e.key));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
};
```

---

## Implementation Timeline

### Week 1: Foundation
- Day 1-2: Phase 1 (NyayaBot, Case Predictor)
- Day 3-4: Phase 2 part 1 (e-Filing Wizard)
- Day 5: Testing & bug fixes

### Week 2: Workflows
- Day 6-7: Phase 2 part 2 (Fee Calc, Eligibility, Filing Dashboard)
- Day 8-9: Phase 3 (Advanced features)
- Day 10: Accessibility & polish

### Week 3: Polish
- Day 11-12: Phase 4 (Action Center, Settings, Notifications)
- Day 13-14: Integration testing
- Day 15: Final review & deployment

---

## Integration Checklist

### Before Starting
- [ ] Create all page files with boilerplate
- [ ] Set up routing configuration
- [ ] Create API service stubs
- [ ] Define TypeScript interfaces

### During Implementation
- [ ] Implement one page at a time
- [ ] Test each page individually
- [ ] Add to navigation links
- [ ] Update dashboard quick actions

### After Completion
- [ ] Run full test suite
- [ ] Check accessibility with axe-core
- [ ] Test on mobile devices
- [ ] Verify all skill integrations
- [ ] Update documentation

---

## Success Metrics

### Functionality
- ✅ All 4 skills have dedicated UI sections
- ✅ No 404 errors on navigation
- ✅ All forms submit successfully
- ✅ API integrations work

### User Experience
- ✅ Page load < 3 seconds
- ✅ Chat response < 2 seconds
- ✅ Mobile-responsive
- ✅ Accessible (WCAG 2.1 AA)

### Code Quality
- ✅ TypeScript strict mode passes
- ✅ ESLint warnings < 10
- ✅ No console errors
- ✅ Test coverage > 70%

---

## Next Steps

### Immediate Actions
1. **Create file structure** - Set up all directories and empty files
2. **Add routes** - Update router configuration
3. **Start Phase 1** - Build NyayaBot and Case Predictor
4. **Test integrations** - Verify backend APIs are ready

### Development Order
```
Priority 1 (Start Here):
├── NyayaBotPage.tsx
├── CasePredictorPage.tsx
└── Update CitizenHome.tsx links

Priority 2 (Next):
├── EFilingWizard.tsx
├── FilingDashboard.tsx
└── FeeCalculatorPage.tsx

Priority 3 (Then):
├── EligibilityCheckerPage.tsx
├── AppointmentBooking.tsx
└── LegalAidProviders.tsx

Priority 4 (Finally):
├── SimilarCasesPage.tsx
├── CostEstimatorPage.tsx
├── LegalActionCenter.tsx
├── CitizenSettings.tsx
└── NotificationsPage.tsx
```

---

## Support & Resources

### Existing Assets to Reuse
- **VoiceFilingInterface.tsx** - Use as base for e-Filing
- **CaseStatusTrackerPage.tsx** - Extend for predictions
- **CitizenDashboard.tsx** - Add quick action buttons
- **LegalAidFinderPage.tsx** - Enhance with new features

### Libraries Already Available
```json
{
  "@google/genai": "For NyayaBot AI",
  "recharts": "For prediction charts",
  "framer-motion": "For animations",
  "lucide-react": "For icons",
  "@tanstack/react-query": "For data fetching"
}
```

### Design Tokens
```css
--citizen-primary: #10b981;
--citizen-secondary: #06b6d4;
--citizen-accent: #8b5cf6;
--citizen-bg: clean-white;
```

---

## Document Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-02-12 | Initial comprehensive plan | Research Agent |

---

**END OF DOCUMENT**

**Total Pages to Implement:** 15  
**Total Estimated Time:** 30-38 hours  
**Skills Coverage:** 100% (All 4 citizen skills)  
**Breaking Changes:** 0  
**Backward Compatible:** ✅ Yes

---

**Ready to start implementation!** 🚀
