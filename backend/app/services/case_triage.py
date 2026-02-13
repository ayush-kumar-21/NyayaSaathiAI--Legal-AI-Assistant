"""
Case Intake Triage Service - Skill 18 (Expert)
Weighted urgency scoring with statutory deadline awareness
"""
import uuid
from datetime import datetime, timedelta
from typing import Dict, Optional
from app.schemas.triage import (
    TriageRequest, TriageResult, UrgencyLevel, CaseCategory,
    TriageFactor
)


class CaseTriageService:
    """
    Expert triage engine with:
    - Weighted multi-factor urgency scoring
    - Statutory deadline awareness (BNSS timelines)
    - Special category prioritization (women, minors, SC/ST)
    """

    # BNSS Statutory deadlines (days) by offense type
    STATUTORY_DEADLINES = {
        "remand": 15,           # First remand max
        "default_bail": 60,     # Default bail for < 7 years
        "default_bail_serious": 90,  # Default bail for >= 7 years
        "chargesheet": 90,      # Chargesheet filing deadline
        "anticipatory_bail": 7, # Hearing within 7 days
    }

    # BNS Section -> Category mapping
    SECTION_CATEGORY_MAP = {
        "302": CaseCategory.BAIL, "303": CaseCategory.BAIL,
        "304": CaseCategory.BAIL, "376": CaseCategory.BAIL,
        "420": CaseCategory.BAIL, "498A": CaseCategory.FAMILY,
    }

    def __init__(self):
        self.results: Dict[str, TriageResult] = {}

    async def triage_case(self, request: TriageRequest) -> TriageResult:
        """Run multi-factor triage analysis"""
        result_id = str(uuid.uuid4())
        factors = []
        urgency_score = 30.0  # Base score

        # --- Factor 1: Custody Duration ---
        if request.accused_in_custody:
            custody_weight = min(request.custody_days / 90 * 10, 10)
            factors.append(TriageFactor(
                factor="Accused in Custody",
                impact="increases_urgency",
                weight=custody_weight,
                description=f"Accused has been in custody for {request.custody_days} days"
            ))
            urgency_score += custody_weight * 3

            # Default bail warning
            if request.custody_days >= 55:
                factors.append(TriageFactor(
                    factor="Default Bail Approaching",
                    impact="increases_urgency",
                    weight=10.0,
                    description="Default bail under BNSS Section 479 may become applicable"
                ))
                urgency_score += 25

        # --- Factor 2: Statutory Deadline ---
        if request.statutory_deadline_days is not None:
            if request.statutory_deadline_days <= 3:
                urgency_score += 30
                factors.append(TriageFactor(
                    factor="Statutory Deadline Imminent",
                    impact="increases_urgency",
                    weight=10.0,
                    description=f"Only {request.statutory_deadline_days} days remaining"
                ))
            elif request.statutory_deadline_days <= 7:
                urgency_score += 15
                factors.append(TriageFactor(
                    factor="Statutory Deadline Approaching",
                    impact="increases_urgency",
                    weight=7.0,
                    description=f"{request.statutory_deadline_days} days to deadline"
                ))

        # --- Factor 3: Vulnerable Parties ---
        if request.is_minor_involved:
            factors.append(TriageFactor(
                factor="Minor Involved",
                impact="increases_urgency",
                weight=8.0,
                description="Case involves a minor — priority under JJ Act"
            ))
            urgency_score += 15

        if request.is_woman_complainant:
            factors.append(TriageFactor(
                factor="Woman Complainant",
                impact="increases_urgency",
                weight=5.0,
                description="Priority under Supreme Court guidelines"
            ))
            urgency_score += 8

        if request.is_senior_citizen:
            factors.append(TriageFactor(
                factor="Senior Citizen",
                impact="increases_urgency",
                weight=4.0,
                description="Priority for elderly litigants"
            ))
            urgency_score += 6

        # --- Determine Category ---
        category = self._classify_category(request)

        # --- Determine Urgency Level ---
        urgency_score = min(urgency_score, 100)
        urgency_level = self._score_to_level(urgency_score)

        # --- Generate Recommendations ---
        statutory_alerts = self._generate_statutory_alerts(request)
        special_instructions = self._generate_instructions(request, urgency_level)

        result = TriageResult(
            id=result_id,
            case_id=request.case_id,
            case_title=request.case_title,
            urgency_level=urgency_level,
            urgency_score=urgency_score,
            category=category,
            factors=factors,
            recommended_bench="Court No. 1 - Fast Track" if urgency_score > 70 else "Regular Bench",
            recommended_hearing_date=self._recommend_date(urgency_level),
            estimated_hearing_time="30 mins" if urgency_score > 70 else "15 mins",
            special_instructions=special_instructions,
            statutory_alerts=statutory_alerts,
        )

        self.results[result_id] = result
        return result

    def _classify_category(self, req: TriageRequest) -> CaseCategory:
        if req.case_type:
            mapping = {
                "bail": CaseCategory.BAIL,
                "remand": CaseCategory.REMAND,
                "appeal": CaseCategory.APPEALS,
                "civil": CaseCategory.CIVIL,
                "writ": CaseCategory.WRIT,
                "family": CaseCategory.FAMILY,
            }
            for key, cat in mapping.items():
                if key in req.case_type.lower():
                    return cat
        return CaseCategory.OTHER

    def _score_to_level(self, score: float) -> UrgencyLevel:
        if score >= 80: return UrgencyLevel.CRITICAL
        if score >= 60: return UrgencyLevel.HIGH
        if score >= 40: return UrgencyLevel.MEDIUM
        if score >= 20: return UrgencyLevel.LOW
        return UrgencyLevel.DEFERRED

    def _recommend_date(self, level: UrgencyLevel) -> str:
        days_map = {
            UrgencyLevel.CRITICAL: 0,
            UrgencyLevel.HIGH: 1,
            UrgencyLevel.MEDIUM: 3,
            UrgencyLevel.LOW: 7,
            UrgencyLevel.DEFERRED: 14,
        }
        d = datetime.now() + timedelta(days=days_map.get(level, 7))
        return d.strftime("%Y-%m-%d")

    def _generate_statutory_alerts(self, req: TriageRequest) -> list:
        alerts = []
        if req.accused_in_custody and req.custody_days >= 55:
            alerts.append("⚠️ Default bail under BNSS S.479 approaching in "
                         f"{max(60 - req.custody_days, 0)} days")
        if req.statutory_deadline_days is not None and req.statutory_deadline_days <= 7:
            alerts.append(f"⚠️ Statutory deadline in {req.statutory_deadline_days} days")
        return alerts

    def _generate_instructions(self, req: TriageRequest, level: UrgencyLevel) -> list:
        instructions = []
        if level == UrgencyLevel.CRITICAL:
            instructions.append("List immediately before available bench")
            instructions.append("Notify Public Prosecutor")
        if req.is_minor_involved:
            instructions.append("Ensure JJ Act compliance — closed court proceeding")
        if req.accused_in_custody and req.custody_days > 45:
            instructions.append("Verify chargesheet filing status with IO")
        return instructions


# Singleton + Factory
_service = None

def get_triage_service() -> CaseTriageService:
    global _service
    if _service is None:
        _service = CaseTriageService()
    return _service
