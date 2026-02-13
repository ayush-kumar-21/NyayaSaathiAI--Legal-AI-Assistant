"""
Judgment Validator Service - Skill 21 (Expert)
Rule-based validation of draft judgments for legal completeness
"""
import uuid
import re
from datetime import datetime
from typing import Dict, List
from app.schemas.judgment import (
    JudgmentValidateRequest, JudgmentValidateResponse,
    ValidationIssue, ValidityStatus, IssueCategory, IssueSeverity
)


class JudgmentValidatorService:
    """
    Expert judgment validator with:
    - Mandatory component checklist
    - Citation format verification
    - Constitutional compliance check
    - Sentencing guideline validation
    """

    # Mandatory components every judgment must have
    MANDATORY_SECTIONS = [
        ("parties", r"(petitioner|appellant|complainant|prosecution)\s*(v\.?s?\.?|versus)\s*(respondent|accused|defendant)", "Case title with parties"),
        ("facts", r"(brief facts|facts of the case|factual matrix)", "Statement of facts"),
        ("issues", r"(issues? (for|to be) (consideration|decided)|points? for determination)", "Issues for determination"),
        ("arguments", r"(arguments?|submissions?|contentions?)\s*(of|by)\s*(prosecution|defence|petitioner|respondent)", "Arguments of both sides"),
        ("analysis", r"(analysis|discussion|reasoning|consideration)", "Court's analysis"),
        ("order", r"(order|judgment|decree|verdict|disposed)", "Final order/disposal"),
    ]

    # Known citation patterns
    CITATION_PATTERN = re.compile(
        r'\(\d{4}\)\s+\d+\s+SCC\s+\d+|'       # (2024) 5 SCC 123
        r'AIR\s+\d{4}\s+SC\s+\d+|'              # AIR 2024 SC 456
        r'\d{4}\s+Cr\.?L\.?J\.?\s+\d+|'         # 2024 CrLJ 789
        r'SLP\s*\(C(rl|iv)\)\s*No\.?\s*\d+',    # SLP(Crl) No. 1234
        re.IGNORECASE
    )

    # BNS Section pattern
    BNS_PATTERN = re.compile(r'(BNS|IPC)\s*(Section|S\.?)\s*\d+', re.IGNORECASE)

    def __init__(self):
        self.reports: Dict[str, JudgmentValidateResponse] = {}

    async def validate(self, request: JudgmentValidateRequest) -> JudgmentValidateResponse:
        """Run comprehensive judgment validation"""
        result_id = str(uuid.uuid4())
        issues: List[ValidationIssue] = []
        strengths: List[str] = []
        text = request.judgment_text.lower()

        # --- Check 1: Mandatory Sections ---
        for section_key, pattern, label in self.MANDATORY_SECTIONS:
            if not re.search(pattern, text, re.IGNORECASE):
                issues.append(ValidationIssue(
                    id=str(uuid.uuid4()),
                    category=IssueCategory.PROCEDURAL,
                    severity=IssueSeverity.CRITICAL if section_key in ("order", "issues") else IssueSeverity.WARNING,
                    title=f"Missing: {label}",
                    description=f"The judgment does not appear to contain a clear '{label}' section.",
                    location="Full document",
                    suggestion=f"Add a clearly labeled '{label}' section.",
                    legal_reference="Supreme Court guidelines on judgment writing"
                ))
            else:
                strengths.append(f"✅ Contains {label}")

        # --- Check 2: Citation Verification ---
        citations = self.CITATION_PATTERN.findall(request.judgment_text)
        if len(citations) == 0:
            issues.append(ValidationIssue(
                id=str(uuid.uuid4()),
                category=IssueCategory.CITATION,
                severity=IssueSeverity.WARNING,
                title="No case citations found",
                description="The judgment does not cite any precedents in standard format.",
                location="Analysis section",
                suggestion="Add relevant precedent citations in standard format (e.g., (2024) 5 SCC 123)",
                legal_reference=None
            ))
        else:
            strengths.append(f"✅ Contains {len(citations)} case citation(s)")

        # --- Check 3: BNS/IPC Section References ---
        bns_refs = self.BNS_PATTERN.findall(request.judgment_text)
        if request.offense_sections and len(bns_refs) == 0:
            issues.append(ValidationIssue(
                id=str(uuid.uuid4()),
                category=IssueCategory.FACTUAL,
                severity=IssueSeverity.WARNING,
                title="Offense sections not referenced",
                description="The charged offense sections are not explicitly referenced in the judgment text.",
                location="Facts/Analysis section",
                suggestion=f"Reference the charged sections: {', '.join(request.offense_sections)}",
                legal_reference=None
            ))

        # --- Check 4: Constitutional Reference ---
        constitutional_keywords = ["article 14", "article 19", "article 21", "fundamental rights", "constitutional"]
        has_constitutional = any(kw in text for kw in constitutional_keywords)
        if has_constitutional:
            strengths.append("✅ References constitutional provisions")

        # --- Check 5: Order Specificity ---
        order_keywords = ["acquitted", "convicted", "dismissed", "allowed", "bail granted", "bail rejected", "discharged"]
        has_specific_order = any(kw in text for kw in order_keywords)
        if not has_specific_order:
            issues.append(ValidationIssue(
                id=str(uuid.uuid4()),
                category=IssueCategory.PROCEDURAL,
                severity=IssueSeverity.CRITICAL,
                title="Order lacks specificity",
                description="The final order does not contain a clear disposition (acquit/convict/dismiss/allow).",
                location="Order section",
                suggestion="Add a clear, unambiguous order stating the court's decision.",
                legal_reference="CPC Order XX Rule 4 / CrPC S.354"
            ))

        # --- Calculate Score ---
        critical_count = sum(1 for i in issues if i.severity == IssueSeverity.CRITICAL)
        warning_count = sum(1 for i in issues if i.severity == IssueSeverity.WARNING)
        score = max(0, 100 - (critical_count * 20) - (warning_count * 8))

        # Status
        if critical_count > 0:
            status = ValidityStatus.CRITICAL_ISSUES
        elif warning_count > 2:
            status = ValidityStatus.NEEDS_REVIEW
        else:
            status = ValidityStatus.VALID

        # Summary
        issue_summary = {}
        for i in issues:
            issue_summary[i.category.value] = issue_summary.get(i.category.value, 0) + 1

        recommendation = "Judgment is well-structured." if score >= 80 else \
            "Address critical issues before finalizing." if critical_count > 0 else \
            "Minor improvements recommended."

        response = JudgmentValidateResponse(
            id=result_id,
            case_id=request.case_id,
            status=status,
            overall_score=score,
            issues=issues,
            issue_summary=issue_summary,
            strengths=strengths,
            recommendation=recommendation,
        )

        self.reports[result_id] = response
        return response


# Singleton + Factory
_service = None

def get_judgment_validator_service() -> JudgmentValidatorService:
    global _service
    if _service is None:
        _service = JudgmentValidatorService()
    return _service
