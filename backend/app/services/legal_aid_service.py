"""
Legal Aid Finder Service - Skill 24 (Expert)
Eligibility checker + provider directory for free legal aid
"""
import uuid
from datetime import datetime
from typing import Dict
from app.schemas.legal_aid import (
    LegalAidRequest, LegalAidResponse, LegalAidProvider,
    AidType, EligibilityStatus
)


class LegalAidFinderService:
    """
    Expert legal aid service with:
    - Income-based eligibility under NALSA guidelines
    - Special category auto-qualification (SC/ST, women, minors, disabled)
    - Provider directory with district-level matching
    """

    # NALSA eligibility thresholds
    INCOME_THRESHOLD = 300000  # ₹3 lakh annual income
    
    # Mock provider database
    PROVIDERS_DB = [
        LegalAidProvider(
            id="DLSA-001", name="District Legal Services Authority (South)", type=AidType.DISTRICT_AUTHORITY,
            address="Saket Court Complex, New Delhi - 110017", district="South Delhi", state="Delhi",
            contact_phone="011-26521882", contact_email="dlsa.south@nic.in",
            specialization=["criminal", "civil", "family"], languages=["Hindi", "English"],
            availability="Mon-Sat 10am-5pm", rating=4.5
        ),
        LegalAidProvider(
            id="DLSA-002", name="NALSA Panel Advocate - Adv. Priya Sharma", type=AidType.FREE_LAWYER,
            address="Bar Room, Patiala House Courts, New Delhi", district="Central Delhi", state="Delhi",
            contact_phone="9876543210", specialization=["criminal", "bail"],
            languages=["Hindi", "English", "Punjabi"], availability="Mon-Fri 10am-4pm", rating=4.2
        ),
        LegalAidProvider(
            id="DLSA-003", name="Legal Aid Clinic - Delhi University", type=AidType.LEGAL_CLINIC,
            address="Faculty of Law, University of Delhi", district="North Delhi", state="Delhi",
            contact_phone="011-27667811", specialization=["consumer", "labour", "RTI"],
            languages=["Hindi", "English"], availability="Mon-Fri 2pm-5pm", rating=4.0
        ),
        LegalAidProvider(
            id="NGO-001", name="Human Rights Law Network (HRLN)", type=AidType.NGO,
            address="576, Masjid Road, Jangpura, New Delhi", district="South East Delhi", state="Delhi",
            contact_phone="011-24379855", contact_email="contact@hrln.org",
            specialization=["human_rights", "criminal", "PIL"], languages=["Hindi", "English", "Urdu"],
            availability="Mon-Fri 10am-6pm", rating=4.7
        ),
        LegalAidProvider(
            id="PB-001", name="Pro Bono India", type=AidType.PRO_BONO,
            address="Online Platform", district="All India", state="Delhi",
            contact_phone="1800-111-000", contact_email="help@probonoindia.in",
            specialization=["all"], languages=["Hindi", "English"],
            availability="24x7 Online", rating=4.3
        ),
    ]

    NALSA_SCHEMES = [
        {"name": "NALSA (Legal Aid Clinics) Scheme 2010", "description": "Free legal consultations at Taluk level"},
        {"name": "NALSA (Child-Friendly Legal Services) Scheme 2015", "description": "For children in conflict with law"},
        {"name": "NALSA (Victims of Trafficking) Scheme 2015", "description": "Legal aid for trafficking victims"},
        {"name": "NALSA (Legal Services to Senior Citizens) Scheme 2016", "description": "Priority legal aid for elderly"},
    ]

    HELPLINES = [
        {"name": "NALSA Toll-Free", "number": "15100", "hours": "24x7"},
        {"name": "Tele-Law Service", "number": "1800-111-000", "hours": "Mon-Sat 9am-6pm"},
        {"name": "Legal Aid Helpline", "number": "011-23382778", "hours": "Mon-Fri 10am-5pm"},
    ]

    def __init__(self):
        self.queries: Dict[str, LegalAidResponse] = {}

    async def find_aid(self, request: LegalAidRequest) -> LegalAidResponse:
        """Determine eligibility and find matching providers"""
        result_id = str(uuid.uuid4())

        # --- Eligibility Check ---
        eligibility, reason = self._check_eligibility(request)

        # --- Match Providers ---
        providers = self._match_providers(request)

        # --- Application Steps ---
        steps = [
            "1. Visit your nearest District Legal Services Authority (DLSA)",
            "2. Fill Form 1 (Application for Legal Aid)",
            "3. Submit income certificate (< ₹3 lakh annual)",
            "4. Attach ID proof (Aadhaar/Voter ID) and case details",
            "5. A panel advocate will be assigned within 3-7 days",
            "6. You can also apply online via nalsa.gov.in or Tele-Law app"
        ]

        docs = [
            "Aadhaar Card / Voter ID",
            "Income Certificate (from Tehsildar/SDM)",
            "FIR copy / Case documents (if applicable)",
            "Caste certificate (for SC/ST category)",
            "Disability certificate (if applicable)"
        ]

        response = LegalAidResponse(
            id=result_id,
            eligibility=eligibility,
            eligibility_reason=reason,
            providers=providers,
            nalsa_schemes=self.NALSA_SCHEMES,
            helpline_numbers=self.HELPLINES,
            application_steps=steps,
            documents_required=docs,
        )

        self.queries[result_id] = response
        return response

    def _check_eligibility(self, req: LegalAidRequest) -> tuple:
        """Multi-factor eligibility determination"""
        # Auto-eligible categories under Section 12 of Legal Services Authorities Act
        if req.is_sc_st:
            return EligibilityStatus.ELIGIBLE, "Eligible under Section 12(c) — SC/ST category"
        if req.is_woman:
            return EligibilityStatus.ELIGIBLE, "Eligible under Section 12(e) — Women"
        if req.is_minor:
            return EligibilityStatus.ELIGIBLE, "Eligible under Section 12(h) — Minor"
        if req.is_disabled:
            return EligibilityStatus.ELIGIBLE, "Eligible under Section 12(g) — Person with disability"

        # Income-based eligibility
        if req.annual_income is not None:
            if req.annual_income <= self.INCOME_THRESHOLD:
                return EligibilityStatus.ELIGIBLE, f"Eligible under Section 12(h) — Income ≤ ₹{self.INCOME_THRESHOLD:,}"
            else:
                return EligibilityStatus.NOT_ELIGIBLE, f"Income exceeds ₹{self.INCOME_THRESHOLD:,} threshold. Consider Pro Bono services."

        return EligibilityStatus.NEEDS_VERIFICATION, "Income verification needed. Visit DLSA with income certificate."

    def _match_providers(self, req: LegalAidRequest) -> list:
        """Match providers by district and specialization"""
        matched = []
        for p in self.PROVIDERS_DB:
            # District match or "All India"
            district_match = p.district.lower() in req.district.lower() or p.district == "All India"
            # Specialization match
            spec_match = req.category.lower() in [s.lower() for s in p.specialization] or "all" in p.specialization
            if district_match or spec_match:
                matched.append(p)

        # If no match, return all (fallback)
        return matched if matched else self.PROVIDERS_DB[:3]


# Singleton + Factory
_service = None

def get_legal_aid_service() -> LegalAidFinderService:
    global _service
    if _service is None:
        _service = LegalAidFinderService()
    return _service
