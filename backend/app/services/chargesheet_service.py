"""
Charge Sheet Service - Skill 06
Automates the creation of the Final Report under BNSS
"""
import uuid
from datetime import datetime
from typing import List, Optional, Dict
from app.schemas.chargesheet import (
    ChargeSheet, ChargeSheetCreate, ChargeSheetUpdate,
    ChargeSheetStatus, AccusedDetails, OffenseSection,
    WitnessSummary, EvidenceSummary
)


class ChargeSheetService:
    """
    Generates and manages charge sheets
    """
    
    def __init__(self):
        self.repository: Dict[str, ChargeSheet] = {}
        
    async def generate_draft(self, fir_id: str, user: dict) -> ChargeSheet:
        """
        Auto-generate a draft charge sheet from FIR and investigation data using AI/Rules
        """
        # In a real system, we'd fetch this from the FIR/Case module
        draft_id = str(uuid.uuid4())
        
        # Mock Auto-Population logic
        draft = ChargeSheet(
            id=draft_id,
            fir_id=fir_id,
            police_station="PS Sector 4",
            district="Cyber City",
            year=2025,
            complainant_name="Rahul Sharma",
            accused=[
                AccusedDetails(
                    id="ACC-001",
                    name="Suresh Kumar",
                    parentage="S/o Mahesh Kumar",
                    address="H.No 123, Slum Area, Cyber City",
                    is_arrested=True,
                    arrest_date=datetime.now(),
                    remand_status="Judicial Custody"
                )
            ],
            offenses=[
                OffenseSection(
                    act="BNS",
                    section="303(2)",
                    description="Theft",
                    is_bailable=False,
                    max_punishment="3 Years"
                )
            ],
            brief_facts="On dated 12/02/2025, complainant reported theft of...",
            investigation_details="During investigation, CCTV footage was collected...",
            witnesses=[
                WitnessSummary(
                    id="WIT-001",
                    name="Ramesh (Watchman)",
                    statement_summary="Saw the accused entering...",
                    is_key_witness=True
                )
            ],
            evidence_list=[
                EvidenceSummary(
                    id="EVID-001",
                    description="CCTV Footage CD",
                    seizure_memo_ref="SM-2025-01"
                )
            ],
            investigating_officer=user.get("full_name", "Unknown IO"),
            status=ChargeSheetStatus.DRAFT,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        
        self.repository[draft_id] = draft
        return draft

    async def get_chargesheet(self, cs_id: str) -> Optional[ChargeSheet]:
        return self.repository.get(cs_id)

    async def update_chargesheet(self, cs_id: str, update_data: ChargeSheetUpdate) -> Optional[ChargeSheet]:
        cs = self.repository.get(cs_id)
        if not cs:
            return None
            
        # Update fields if provided
        if update_data.brief_facts:
            cs.brief_facts = update_data.brief_facts
        if update_data.investigation_details:
            cs.investigation_details = update_data.investigation_details
        if update_data.status:
            cs.status = update_data.status
        if update_data.offenses:
            cs.offenses = update_data.offenses
        if update_data.accused:
            cs.accused = update_data.accused
            
        cs.updated_at = datetime.now()
        return cs


# Singleton
chargesheet_service = ChargeSheetService()
