"""
Warrant Manager Service - Skill 16
"""
import uuid
from datetime import date, datetime
from typing import List, Optional, Dict
from app.schemas.warrant import Warrant, WarrantIssueRequest, WarrantUpdateRequest, WarrantStatus, WarrantType


class WarrantManagerService:
    """
    Service for managing warrants
    """
    
    def __init__(self):
        self.warrants: Dict[str, Warrant] = {}
        # Seed mock data
        self._seed_data()
        
    def _seed_data(self):
        w_id = str(uuid.uuid4())
        self.warrants[w_id] = Warrant(
            id=w_id,
            case_id="CASE-2023-001",
            accused_name="Ramesh Gupta",
            warrant_type=WarrantType.ARREST,
            status=WarrantStatus.ISSUED,
            issue_date=date.today(),
            issuing_authority="Magistrate Court 1",
            expiry_date=None,
            execution_notes=None,
        )

    async def issue_warrant(self, request: WarrantIssueRequest) -> Warrant:
        """Issue a new warrant"""
        w_id = str(uuid.uuid4())
        warrant = Warrant(
            id=w_id,
            case_id=request.case_id,
            accused_name=request.accused_name,
            warrant_type=request.warrant_type,
            status=WarrantStatus.ISSUED,
            issue_date=date.today(),
            expiry_date=request.expiry_date,
            issuing_authority=request.issuing_authority,
            execution_notes=None
        )
        self.warrants[w_id] = warrant
        return warrant

    async def update_warrant(self, warrant_id: str, update: WarrantUpdateRequest) -> Warrant:
        """Update warrant status"""
        if warrant_id not in self.warrants:
            raise ValueError("Warrant not found")
        
        warrant = self.warrants[warrant_id]
        warrant.status = update.status
        if update.execution_notes:
            warrant.execution_notes = update.execution_notes
        
        self.warrants[warrant_id] = warrant
        return warrant

    async def list_warrants(self, status: Optional[WarrantStatus] = None) -> List[Warrant]:
        """List all warrants, optionally filtered by status"""
        if status:
            return [w for w in self.warrants.values() if w.status == status]
        return list(self.warrants.values())


# Singleton
warrant_service = WarrantManagerService()
