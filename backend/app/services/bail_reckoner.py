"""
Bail Reckoner Service - Skill 09
Analyzes bail eligibility based on BNSS/CrPC
"""
import uuid
from datetime import datetime
from typing import List, Optional, Dict
from app.schemas.bail_reckoner import (
    BailReport, BailAnalysisRequest, RiskFactor,
    RiskLevel, BailRecommendation
)


class BailReckonerService:
    """
    Service for analyzing bail eligibility
    """
    
    def __init__(self):
        self.reports: Dict[str, BailReport] = {}
        
    async def analyze_bail(self, request: BailAnalysisRequest) -> BailReport:
        """Analyze bail eligibility"""
        report_id = str(uuid.uuid4())
        
        # Mock Logic for Demo
        # In real system, this would query the Offense DB and Act definitions
        
        is_bailable = "302" not in "".join(request.offenses)  # Simple check
        max_punishment = 7 if "303" in "".join(request.offenses) else 3
        
        # Calculate Risk Score (Simple formula)
        base_score = 0
        risk_factors = []
        
        if request.prior_convictions > 0:
            base_score += 30
            risk_factors.append(RiskFactor(
                category="Criminal History",
                description=f"{request.prior_convictions} prior convictions found.",
                risk_level=RiskLevel.HIGH,
                weight=30
            ))
            
        if request.is_flight_risk:
            base_score += 40
            risk_factors.append(RiskFactor(
                category="Flight Risk",
                description="Accused has no local ties/history of absconding.",
                risk_level=RiskLevel.CRITICAL,
                weight=40
            ))
            
        if request.is_witness_tampering_risk:
            base_score += 20
            risk_factors.append(RiskFactor(
                category="Tampering",
                description="Potential to influence witnesses.",
                risk_level=RiskLevel.MEDIUM,
                weight=20
            ))
            
        # Recommendation Logic
        recommendation = BailRecommendation.GRANT
        conditions = ["Standard personal bond"]
        
        if base_score > 60 or not is_bailable:
            recommendation = BailRecommendation.REJECT
            conditions = []
        elif base_score > 30:
            recommendation = BailRecommendation.GRANT_WITH_CONDITIONS
            conditions = [
                "Surrender Passport",
                "Weekly PS Visit",
                "Two Local Sureties"
            ]
            
        report = BailReport(
            id=report_id,
            case_id=request.case_id,
            accused_id=request.accused_id,
            accused_name="Unknown Accused", # Fetch from DB in real app
            offenses=request.offenses,
            is_bailable_offense=is_bailable,
            max_punishment_years=max_punishment,
            criminal_history_score=30 if request.prior_convictions else 0,
            flight_risk_score=40 if request.is_flight_risk else 0,
            tampering_risk_score=20 if request.is_witness_tampering_risk else 0,
            overall_risk_score=base_score,
            risk_factors=risk_factors,
            recommendation=recommendation,
            suggested_conditions=conditions,
            created_at=datetime.now()
        )
        
        self.reports[report_id] = report
        return report

    async def get_report(self, report_id: str) -> Optional[BailReport]:
        return self.reports.get(report_id)


# Singleton
bail_reckoner_service = BailReckonerService()
