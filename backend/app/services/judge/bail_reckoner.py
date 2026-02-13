"""
Expert Implementation: Bail Reckoner (Skill 09)
Weighted scoring algorithm for bail eligibility analysis.
Uses BNS/BNSS offense classification database.
"""
import uuid
from datetime import datetime
from typing import Optional, Dict, List

from app.core.architecture import BaseService, InMemoryRepository
from app.schemas.bail_reckoner import (
    BailReport, BailAnalysisRequest, RiskFactor,
    RiskLevel, BailRecommendation
)

# ── BNS Offense Classification Database ──
OFFENSE_DB: Dict[str, dict] = {
    "BNS 103": {"desc": "Murder", "max_years": 20, "bailable": False, "severity": "heinous"},
    "BNS 115": {"desc": "Voluntarily causing hurt", "max_years": 1, "bailable": True, "severity": "minor"},
    "BNS 303": {"desc": "Theft", "max_years": 3, "bailable": True, "severity": "moderate"},
    "BNS 303(2)": {"desc": "Theft in dwelling house", "max_years": 7, "bailable": False, "severity": "serious"},
    "BNS 309": {"desc": "Robbery", "max_years": 10, "bailable": False, "severity": "serious"},
    "BNS 318": {"desc": "Cheating", "max_years": 3, "bailable": True, "severity": "moderate"},
    "BNS 318(4)": {"desc": "Cheating involving delivery of property", "max_years": 7, "bailable": False, "severity": "serious"},
    "BNS 351": {"desc": "Criminal intimidation", "max_years": 2, "bailable": True, "severity": "minor"},
    "BNS 61": {"desc": "Criminal conspiracy", "max_years": 7, "bailable": False, "severity": "serious"},
    "BNS 74": {"desc": "Dowry death", "max_years": 10, "bailable": False, "severity": "heinous"},
}


class BailReckonerService(BaseService[BailReport, str]):
    """
    Expert Bail Reckoner using weighted multi-factor scoring.
    
    Scoring Algorithm:
    - Criminal History: 0-30 points (prior_convictions * 10, capped)
    - Flight Risk:      0-40 points (binary + severity modifier)
    - Tampering Risk:   0-20 points (binary)
    - Offense Severity: 0-10 points (from OFFENSE_DB)
    
    Total Score: 0-100
    - 0-30:  GRANT bail
    - 31-60: GRANT_WITH_CONDITIONS
    - 61+:   REJECT
    """

    def _lookup_offenses(self, offenses: List[str]) -> tuple:
        """Look up offense details from the BNS database. O(n) scan."""
        is_bailable = True
        max_punishment = 0
        severity_score = 0

        severity_map = {"minor": 2, "moderate": 4, "serious": 7, "heinous": 10}

        for code in offenses:
            normalized = code.strip().upper().replace("SECTION ", "").replace("SEC ", "")
            entry = OFFENSE_DB.get(normalized) or OFFENSE_DB.get(f"BNS {normalized}")
            if entry:
                if not entry["bailable"]:
                    is_bailable = False
                max_punishment = max(max_punishment, entry["max_years"])
                severity_score = max(severity_score, severity_map.get(entry["severity"], 5))
            else:
                # Unknown offense — assume moderate
                max_punishment = max(max_punishment, 3)
                severity_score = max(severity_score, 5)

        return is_bailable, max_punishment, severity_score

    async def analyze_bail(self, request: BailAnalysisRequest) -> BailReport:
        report_id = str(uuid.uuid4())

        is_bailable, max_punishment, severity_score = self._lookup_offenses(request.offenses)

        # ── Multi-Factor Scoring ──
        risk_factors: List[RiskFactor] = []
        total_score = 0

        # Factor 1: Criminal History (0-30)
        history_score = min(request.prior_convictions * 10, 30)
        total_score += history_score
        if request.prior_convictions > 0:
            level = RiskLevel.HIGH if request.prior_convictions >= 3 else RiskLevel.MEDIUM
            risk_factors.append(RiskFactor(
                category="Criminal History",
                description=f"{request.prior_convictions} prior conviction(s) on record.",
                risk_level=level,
                weight=history_score
            ))

        # Factor 2: Flight Risk (0-40)
        flight_score = 40 if request.is_flight_risk else 0
        total_score += flight_score
        if request.is_flight_risk:
            risk_factors.append(RiskFactor(
                category="Flight Risk",
                description="Accused assessed as flight risk — no local ties or history of absconding.",
                risk_level=RiskLevel.CRITICAL,
                weight=flight_score
            ))

        # Factor 3: Tampering Risk (0-20)
        tamper_score = 20 if request.is_witness_tampering_risk else 0
        total_score += tamper_score
        if request.is_witness_tampering_risk:
            risk_factors.append(RiskFactor(
                category="Witness Tampering",
                description="Potential to influence or intimidate witnesses.",
                risk_level=RiskLevel.MEDIUM,
                weight=tamper_score
            ))

        # Factor 4: Offense Severity (0-10)
        total_score += severity_score
        if severity_score >= 7:
            risk_factors.append(RiskFactor(
                category="Offense Severity",
                description=f"Charged with serious/heinous offense(s). Max punishment: {max_punishment} years.",
                risk_level=RiskLevel.HIGH,
                weight=severity_score
            ))

        # ── Recommendation Logic ──
        if total_score > 60 or (not is_bailable and total_score > 40):
            recommendation = BailRecommendation.REJECT
            conditions = ["Bail denied — accused to remain in judicial custody."]
        elif total_score > 30 or not is_bailable:
            recommendation = BailRecommendation.GRANT_WITH_CONDITIONS
            conditions = [
                "Surrender passport to the court",
                "Report to nearest police station every Monday",
                "Furnish two local sureties of ₹50,000 each",
                "Not to leave the jurisdiction without prior permission",
            ]
        else:
            recommendation = BailRecommendation.GRANT
            conditions = [
                "Personal bond of ₹25,000",
                "One surety of like amount",
            ]

        report = BailReport(
            id=report_id,
            case_id=request.case_id,
            accused_id=request.accused_id,
            accused_name=f"Accused-{request.accused_id}",
            offenses=request.offenses,
            is_bailable_offense=is_bailable,
            max_punishment_years=max_punishment,
            criminal_history_score=history_score,
            flight_risk_score=flight_score,
            tampering_risk_score=tamper_score,
            overall_risk_score=total_score,
            risk_factors=risk_factors,
            recommendation=recommendation,
            suggested_conditions=conditions,
            created_at=datetime.now(),
            metadata={
                "algorithm": "weighted_multi_factor_v2",
                "severity_score": severity_score,
                "offense_db_hits": len([o for o in request.offenses if OFFENSE_DB.get(o.strip())]),
            }
        )

        return await self.create(report)

    async def get_report(self, report_id: str) -> Optional[BailReport]:
        return await self.get(report_id)


# Factory
_service_instance = None

def get_bail_reckoner_service() -> BailReckonerService:
    global _service_instance
    if _service_instance is None:
        repo = InMemoryRepository[BailReport, str]()
        _service_instance = BailReckonerService(repo)
    return _service_instance

# Backward compatibility alias
bail_reckoner_service = get_bail_reckoner_service()
