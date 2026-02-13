"""
Sentencing Assistant Service - Skill 10
"""
import uuid
from datetime import datetime
from typing import List, Optional, Dict
from app.schemas.sentencing import (
    SentencingReport, SentencingRequest, SentenceRange,
    SentencingFactor, FactorType, SentenceType
)


class SentencingAssistantService:
    """
    Service for calculating sentences
    """
    
    def __init__(self):
        self.reports: Dict[str, SentencingReport] = {}
        
    async def analyze_sentencing(self, request: SentencingRequest) -> SentencingReport:
        """Analyze sentencing Guidelines"""
        report_id = str(uuid.uuid4())
        
        # Mock Logic for BNS 303(2) (Theft)
        # Statutory Max: 3 Years
        
        aggravating = []
        mitigating = []
        
        if request.prior_convictions > 0:
            aggravating.append(SentencingFactor(
                description=f"Habitual Offender ({request.prior_convictions} priors)",
                type=FactorType.AGGRAVATING,
                weight=8.0
            ))
        
        if request.age < 21:
            mitigating.append(SentencingFactor(
                description="Young Offender",
                type=FactorType.MITIGATING,
                weight=5.0
            ))
            
        if "remorse" in request.background_info.lower():
            mitigating.append(SentencingFactor(
                description="Showed genuine remorse",
                type=FactorType.MITIGATING,
                weight=3.0
            ))

        # Calculate recommendation
        min_years = 0.5
        max_years = 3.0
        
        # Adjust based on factors (Simple heuristic)
        agg_score = sum(f.weight for f in aggravating)
        mit_score = sum(f.weight for f in mitigating)
        
        net_score = agg_score - mit_score
        
        recommended_years = 1.0  # Base
        if net_score > 5:
            recommended_years = 2.5
        elif net_score < -2:
            recommended_years = 0.5 # Probation likely
            
        report = SentencingReport(
            id=report_id,
            case_id=request.case_id,
            convict_id=request.convict_id,
            convict_name="Convict Name",
            offenses=request.offenses,
            statutory_min=SentenceRange(min_years=0, max_years=0, fine_amount=0, type=SentenceType.FINE),
            statutory_max=SentenceRange(min_years=3, max_years=3, fine_amount=5000, type=SentenceType.IMPRISONMENT),
            aggravating_factors=aggravating,
            mitigating_factors=mitigating,
            recommended_sentence=SentenceRange(
                min_years=recommended_years,
                max_years=recommended_years,
                fine_amount=2000,
                type=SentenceType.IMPRISONMENT if recommended_years > 0.5 else SentenceType.PROBATION
            ),
            reasoning="Sentence adjusted based on habitual offender status and age.",
            precedents_cited=["State v. Example (2024)", "In re Youth Sentencing Guidelines"],
            created_at=datetime.now()
        )
        
        self.reports[report_id] = report
        return report

    async def get_report(self, report_id: str) -> Optional[SentencingReport]:
        return self.reports.get(report_id)


# Singleton
sentencing_service = SentencingAssistantService()
