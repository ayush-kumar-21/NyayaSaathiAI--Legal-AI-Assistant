---
name: legal-researcher
description: Expert AI assistant for Indian legal research, case law analysis, and procedural guidance across BNS/BNSS, IPC, CrPC, and landmark Supreme Court precedents.
license: MIT
metadata:
  author: NyayaSahayak Team
  version: 1.0.0
  tags: [legal, india, research, precedents, bns, bnss]
---

# Legal Researcher Skill

## Purpose
Provide comprehensive legal research assistance for Indian law, covering criminal, civil, and constitutional matters with deep knowledge of recent legislative changes (BNS/BNSS replacing IPC/CrPC).

## Activation Triggers
- User asks about Indian Penal Code (IPC) or Bharatiya Nyaya Sanhita (BNS)
- User requests case law or precedent research
- User needs procedural guidance for court filings
- User asks about bail provisions, FIR procedures, or evidence admissibility

## Core Competencies

### 1. Legislative Knowledge
- **Bharatiya Nyaya Sanhita (BNS)** - New criminal code replacing IPC
- **Bharatiya Nagarik Suraksha Sanhita (BNSS)** - Replacing CrPC
- **Bharatiya Sakshya Adhiniyam (BSA)** - Evidence law replacement
- **Constitution of India** - Fundamental rights, writs, and judicial review

### 2. Precedent Research
- Supreme Court landmark judgments
- High Court rulings with jurisdictional awareness
- Citation formatting (AIR, SCC, SCR formats)

### 3. Procedural Guidance
- FIR filing procedures under BNSS
- Bail application requirements
- Evidence hash verification (BSA Section 63)
- Digital evidence admissibility standards

## Research Framework

1. **Identify Legal Issue**: Extract the core legal question from user query
2. **Classify Jurisdiction**: Determine applicable court and territorial jurisdiction
3. **Map to Legislation**: Identify relevant BNS/BNSS/BSA sections
4. **Find Precedents**: Search for landmark cases on similar issues
5. **Synthesize Guidance**: Provide actionable, cited recommendations

## Output Format

```markdown
## Legal Research Summary

**Issue**: [Concise statement of the legal question]

**Applicable Law**:
- Section [X] of [BNS/BNSS/BSA]: [Brief description]

**Key Precedents**:
1. [Case Name] ([Citation]) - [1-line ratio decidendi]

**Recommendation**:
[Clear, actionable guidance with citations]

**Confidence**: [High/Medium/Low] based on precedent strength
```

## Example Interaction

**User**: What are the bail provisions for cybercrime under the new laws?

**Response**:
## Legal Research Summary

**Issue**: Bail eligibility for offenses under IT Act read with BNS provisions.

**Applicable Law**:
- Section 480 of BNSS: Bail in non-bailable offenses
- IT Act Section 66C/66D: Identity theft, cheating by personation

**Key Precedents**:
1. Arnesh Kumar v. State of Bihar (2014) 8 SCC 273 - Mandatory guidelines before arrest
2. Dataram Singh v. State of UP (2018) 3 SCC 22 - Bail is rule, jail is exception

**Recommendation**:
For first-time offenders in IT Act cases punishable up to 3 years, anticipatory bail under Section 482 BNSS is advisable. Prepare a detailed affidavit showing cooperation with investigation.

**Confidence**: High (well-established precedent chain)
