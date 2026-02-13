"""
Bench Memo Service - Skill 08
Generates legal summaries and analysis for judges
"""
import uuid
from datetime import datetime
from typing import List, Optional, Dict
from app.schemas.bench_memo import (
    BenchMemo, GenerateMemoRequest, MemoStatus,
    CasePrecedent, LegalIssue
)


class BenchMemoService:
    """
    Service for generating bench memos
    """
    
    def __init__(self):
        self.memos: Dict[str, BenchMemo] = {}
        
    async def generate_memo(self, request: GenerateMemoRequest, user: dict) -> BenchMemo:
        """Auto-generate a bench memo from case data"""
        memo_id = str(uuid.uuid4())
        
        # Mock AI Generation Logic
        memo = BenchMemo(
            id=memo_id,
            case_id=request.case_id,
            judge_id=user.get("id", "JUDGE-001"),
            case_summary=f"The prosecution alleges that the accused committed theft under BNS 303(2). The defense argues alibi. Context: {request.focus_area}",
            procedural_history="FIR filed on 10/01/2025. Charge sheet filed on 12/02/2025. Bail rejected twice.",
            legal_issues=[
                LegalIssue(
                    issue="Whether the CCTV footage is admissible without certificate?",
                    rule_of_law="BSA Section 63 (Electronic Evidence)",
                    analysis="The footage lacks 65B (now BSA 63) certificate.",
                    conclusion="Likely inadmissible unless cured."
                )
            ],
            precedents=[
                CasePrecedent(
                    title="Arjun Panditrao Khotkar v. KAILASH GORANTYAL",
                    citation="2020 SCC OnLine SC 571",
                    summary="Certificate under Section 65B(4) is a condition precedent to the admissibility of evidence by way of electronic record.",
                    relevance="Directly impacting the CCTV evidence."
                )
            ],
            recommended_ruling="Grant time to prosecution to produce certificate, else exclude evidence.",
            status=MemoStatus.GENERATED,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        
        self.memos[memo_id] = memo
        return memo

    async def get_memo(self, memo_id: str) -> Optional[BenchMemo]:
        return self.memos.get(memo_id)
    
    async def get_memo_by_case(self, case_id: str) -> Optional[BenchMemo]:
        for memo in self.memos.values():
            if memo.case_id == case_id:
                return memo
        return None


# Singleton
bench_memo_service = BenchMemoService()
