"""
Expert Implementation: Bench Memo Generator (Skill 08)
Uses template-based memo generation with structured legal analysis.
"""
import uuid
from datetime import datetime
from typing import Optional, Dict

from app.core.architecture import BaseService, InMemoryRepository
from app.schemas.bench_memo import (
    BenchMemo, GenerateMemoRequest, MemoStatus,
    CasePrecedent, LegalIssue
)

# ── Legal Knowledge Base (Demo) ──
CASE_TEMPLATES: Dict[str, dict] = {
    "General": {
        "issues": [
            LegalIssue(
                issue="Whether the evidence presented is sufficient to establish prima facie case?",
                rule_of_law="BSA Section 63 (Electronic Evidence), BNS Section 61 (Criminal Conspiracy)",
                analysis="The prosecution must demonstrate a clear chain of custody and produce certificates under BSA 63 for all digital evidence.",
                conclusion="Evidence must be weighed with corroborating testimony."
            ),
        ],
        "precedents": [
            CasePrecedent(
                title="Arjun Panditrao Khotkar v. Kailash Gorantyal",
                citation="2020 SCC OnLine SC 571",
                summary="Certificate under Section 65B(4) is a condition precedent to admissibility of electronic record.",
                relevance="Sets the standard for admissibility of electronic evidence."
            ),
            CasePrecedent(
                title="Shafhi Mohammad v. State of HP",
                citation="(2018) 2 SCC 801",
                summary="Requirement of 65B certificate may be relaxed if original device is produced.",
                relevance="Provides exception to strict certificate requirement."
            ),
        ],
    },
    "Bail": {
        "issues": [
            LegalIssue(
                issue="Whether the accused is entitled to bail under BNSS Section 480?",
                rule_of_law="BNSS Section 480 (Bail in Non-Bailable Offences)",
                analysis="Court must consider gravity of offence, criminal antecedents, flight risk, and likelihood of tampering with evidence.",
                conclusion="Bail may be granted with conditions if risk factors are manageable."
            ),
            LegalIssue(
                issue="Whether continued detention violates Article 21 of the Constitution?",
                rule_of_law="Article 21 - Right to Life and Personal Liberty",
                analysis="Prolonged incarceration without trial is a violation of fundamental rights per settled jurisprudence.",
                conclusion="Default bail must be considered if charge sheet not filed within statutory period."
            ),
        ],
        "precedents": [
            CasePrecedent(
                title="Arnesh Kumar v. State of Bihar",
                citation="(2014) 8 SCC 273",
                summary="Automatic arrest in cases with punishment < 7 years is discouraged. Police must justify necessity of arrest.",
                relevance="Directly applicable to bail consideration for moderate offences."
            ),
            CasePrecedent(
                title="Satender Kumar Antil v. CBI",
                citation="(2022) 10 SCC 51",
                summary="Supreme Court issued detailed guidelines on bail, emphasizing bail as rule and jail as exception.",
                relevance="Landmark case establishing modern bail jurisprudence."
            ),
        ],
    },
    "Sentencing": {
        "issues": [
            LegalIssue(
                issue="What is the appropriate sentence considering mitigating and aggravating factors?",
                rule_of_law="BNS Section 4 (Punishments), Supreme Court Sentencing Guidelines",
                analysis="The court must balance the gravity of offence against reformation potential, age, social background, and circumstances.",
                conclusion="Proportionality principle must guide sentencing."
            ),
        ],
        "precedents": [
            CasePrecedent(
                title="Bachan Singh v. State of Punjab",
                citation="(1980) 2 SCC 684",
                summary="Death sentence only in 'rarest of rare' cases. Life imprisonment is the rule.",
                relevance="Foundational precedent for sentencing philosophy in India."
            ),
        ],
    },
}


class BenchMemoService(BaseService[BenchMemo, str]):
    """
    Expert Bench Memo Generator using template-based legal analysis.
    Matches focus_area to curated legal knowledge templates.
    """

    async def generate_memo(self, request: GenerateMemoRequest, user: dict) -> BenchMemo:
        memo_id = str(uuid.uuid4())
        focus = request.focus_area or "General"
        
        # Template lookup with fallback
        template = CASE_TEMPLATES.get(focus, CASE_TEMPLATES["General"])
        
        memo = BenchMemo(
            id=memo_id,
            case_id=request.case_id,
            judge_id=user.get("id", "JUDGE-001"),
            case_summary=f"Auto-generated bench memo for Case {request.case_id}. Focus: {focus}. "
                         f"This memo provides a structured analysis of key legal issues, relevant precedents, "
                         f"and a recommended ruling based on established jurisprudence.",
            procedural_history="FIR registered. Investigation completed. Charge sheet filed. "
                              "Case listed for hearing. Previous orders reviewed.",
            legal_issues=template["issues"],
            precedents=template["precedents"],
            recommended_ruling=f"Based on the analysis of legal issues and cited precedents, "
                              f"the court may proceed with consideration of the {focus.lower()} aspects "
                              f"while ensuring compliance with due process requirements.",
            status=MemoStatus.GENERATED,
            created_at=datetime.now(),
            updated_at=datetime.now(),
            metadata={
                "generated_by": "BenchMemoService v2.0",
                "focus_area": focus,
                "template_used": focus,
                "issues_count": len(template["issues"]),
                "precedents_count": len(template["precedents"]),
            }
        )
        
        return await self.create(memo)

    async def get_memo(self, memo_id: str) -> Optional[BenchMemo]:
        return await self.get(memo_id)

    async def get_memo_by_case(self, case_id: str) -> Optional[BenchMemo]:
        # Linear scan — acceptable for demo; production would use an index
        for item in self.repository._store.values():
            if item.case_id == case_id:
                return item
        return None


# Factory
_service_instance = None

def get_bench_memo_service() -> BenchMemoService:
    global _service_instance
    if _service_instance is None:
        repo = InMemoryRepository[BenchMemo, str]()
        _service_instance = BenchMemoService(repo)
    return _service_instance

# Backward compatibility alias
bench_memo_service = get_bench_memo_service()
