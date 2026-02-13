"""
Case Status Tracker Service - Skill 23 (Expert)
Simulated case tracking with stage progression
"""
import uuid
from datetime import datetime
from typing import Dict, Optional
from app.schemas.case_status import (
    CaseStatusRequest, CaseStatusResponse, CaseStage, HearingInfo
)


class CaseStatusService:
    """
    Case status tracker with:
    - CNR-based case lookup (simulated)
    - Stage progression tracking
    - Hearing history with timeline
    """

    # Mock case database
    MOCK_CASES = {
        "DLHC01-000001-2025": {
            "case_title": "State vs. Suresh Kumar",
            "case_type": "Criminal",
            "court": "District Court, Cyber City",
            "judge": "Hon'ble Justice A.K. Sharma",
            "current_stage": CaseStage.EVIDENCE_STAGE,
            "filing_date": "2025-01-15",
            "next_hearing": "2025-03-10",
            "parties": {"petitioner": "State of NCT Delhi", "respondent": "Suresh Kumar S/o Mahesh Kumar"},
            "hearings": [
                HearingInfo(date="2025-01-20", court="District Court", judge="Justice A.K. Sharma",
                           purpose="First Hearing / Remand", result="Judicial Custody for 14 days", next_date="2025-02-05"),
                HearingInfo(date="2025-02-05", court="District Court", judge="Justice A.K. Sharma",
                           purpose="Charge framing", result="Charges framed under BNS 303(2)", next_date="2025-02-20"),
                HearingInfo(date="2025-02-20", court="District Court", judge="Justice A.K. Sharma",
                           purpose="Prosecution Evidence", result="PW-1 and PW-2 examined", next_date="2025-03-10"),
            ]
        },
        "DLHC01-000042-2025": {
            "case_title": "Rahul Sharma vs. Municipal Corporation",
            "case_type": "Civil Writ",
            "court": "High Court of Delhi",
            "judge": "Hon'ble Justice P.K. Mehra",
            "current_stage": CaseStage.ARGUMENTS,
            "filing_date": "2025-01-05",
            "next_hearing": "2025-03-15",
            "parties": {"petitioner": "Rahul Sharma", "respondent": "Municipal Corporation of Delhi"},
            "hearings": [
                HearingInfo(date="2025-01-10", court="High Court", judge="Justice P.K. Mehra",
                           purpose="Admission hearing", result="Notice issued, petition admitted", next_date="2025-02-01"),
                HearingInfo(date="2025-02-01", court="High Court", judge="Justice P.K. Mehra",
                           purpose="Reply filed", result="Respondent reply received, rejoinder due", next_date="2025-02-25"),
                HearingInfo(date="2025-02-25", court="High Court", judge="Justice P.K. Mehra",
                           purpose="Arguments", result="Petitioner argued, respondent to argue next", next_date="2025-03-15"),
            ]
        }
    }

    STAGE_PERCENTAGES = {
        CaseStage.FIR_FILED: 5,
        CaseStage.INVESTIGATION: 15,
        CaseStage.CHARGESHEET_FILED: 25,
        CaseStage.TRIAL_COMMENCED: 35,
        CaseStage.EVIDENCE_STAGE: 55,
        CaseStage.ARGUMENTS: 75,
        CaseStage.JUDGMENT_RESERVED: 90,
        CaseStage.JUDGMENT_DELIVERED: 95,
        CaseStage.APPEAL: 50,
        CaseStage.DISPOSED: 100,
    }

    def __init__(self):
        self.cache: Dict[str, CaseStatusResponse] = {}

    async def get_status(self, request: CaseStatusRequest) -> Optional[CaseStatusResponse]:
        """Lookup case status by CNR or FIR number"""
        result_id = str(uuid.uuid4())

        # Try CNR lookup first
        cnr = request.cnr_number or request.fir_number or "DLHC01-000001-2025"
        case_data = self.MOCK_CASES.get(cnr)

        if not case_data:
            # Return first available mock case for demo
            cnr = list(self.MOCK_CASES.keys())[0]
            case_data = self.MOCK_CASES[cnr]

        stage = case_data["current_stage"]
        stage_pct = self.STAGE_PERCENTAGES.get(stage, 50)

        # Estimate timeline
        remaining_pct = 100 - stage_pct
        est_months = max(1, int(remaining_pct / 15))
        timeline = f"Approximately {est_months} month(s) to disposal" if stage_pct < 100 else "Case disposed"

        response = CaseStatusResponse(
            id=result_id,
            cnr_number=cnr,
            case_title=case_data["case_title"],
            case_type=case_data["case_type"],
            court=case_data["court"],
            judge=case_data["judge"],
            current_stage=stage,
            stage_percentage=stage_pct,
            filing_date=case_data["filing_date"],
            next_hearing=case_data.get("next_hearing"),
            hearings=case_data["hearings"],
            parties=case_data["parties"],
            status_summary=f"Case is currently at {stage.value.replace('_', ' ').title()} stage.",
            estimated_timeline=timeline,
        )

        self.cache[result_id] = response
        return response


# Singleton + Factory
_service = None

def get_case_status_service() -> CaseStatusService:
    global _service
    if _service is None:
        _service = CaseStatusService()
    return _service
