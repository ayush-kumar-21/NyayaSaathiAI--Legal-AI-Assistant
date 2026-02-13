"""
Witness Protection Service - Skill 04
Manages high-risk witness data with strict access controls
"""
import uuid
from datetime import datetime
from typing import List, Optional, Dict
from app.schemas.witness import (
    Witness, WitnessCreate, WitnessResponse,
    ThreatLevel, ProtectionStatus, IdentityStatus,
    RiskAssessment
)


class WitnessProtectionService:
    """
    Secure witness management service
    """
    
    def __init__(self):
        self.witness_store: Dict[str, Witness] = {}
        self.assessments: Dict[str, List[RiskAssessment]] = {}
    
    async def register_witness(self, request: WitnessCreate, current_user: dict) -> Witness:
        """Register a new witness into protection program"""
        witness_id = str(uuid.uuid4())
        
        # In a real system, sensitive fields would be encrypted at rest
        witness = Witness(
            id=witness_id,
            case_id=request.case_id,
            real_name=request.real_name,
            date_of_birth=request.date_of_birth,
            contact_number=request.contact_number,
            address=request.address,
            alias_name=f"Witness-{witness_id[:8]}", # Auto-generated alias
            identity_status=IdentityStatus.CONCEALED,
            threat_level=request.threat_level,
            protection_status=ProtectionStatus.ACTIVE,
            assigned_officer_id=current_user.get("id"),
            risk_factors=request.risk_factors,
            protection_measures=request.protection_measures,
            last_check_in=datetime.now()
        )
        
        self.witness_store[witness_id] = witness
        return witness

    async def get_witness(self, witness_id: str, current_user: dict) -> Optional[WitnessResponse]:
        """
        Get witness details.
        Sensitive info is redacted unless user is the assigned officer or admin.
        """
        witness = self.witness_store.get(witness_id)
        if not witness:
            return None
        
        # Check access permission
        has_full_access = (
            current_user.get("role") == "ADMIN" or 
            current_user.get("id") == witness.assigned_officer_id
        )
        
        response = WitnessResponse(
            id=witness.id,
            case_id=witness.case_id,
            alias_name=witness.alias_name,
            threat_level=witness.threat_level,
            protection_status=witness.protection_status
        )
        
        if has_full_access:
            response.real_name = witness.real_name
            response.contact_number = witness.contact_number
            response.address = witness.address
            
        return response

    async def list_witnesses_by_case(self, case_id: str, current_user: dict) -> List[WitnessResponse]:
        """List witnesses for a case with appropriate redaction"""
        # In memory filter
        witnesses = [w for w in self.witness_store.values() if w.case_id == case_id]
        
        results = []
        for w in witnesses:
            # Re-use get logic for consistency (implied)
            # For list view, we generally show minimal info
            results.append(WitnessResponse(
                id=w.id,
                case_id=w.case_id,
                alias_name=w.alias_name,
                threat_level=w.threat_level,
                protection_status=w.protection_status
            ))
        return results

    async def add_risk_assessment(self, witness_id: str, assessment: RiskAssessment, current_user: dict) -> RiskAssessment:
        """Log a new risk assessment"""
        if witness_id not in self.witness_store:
            raise ValueError("Witness not found")
            
        if witness_id not in self.assessments:
            self.assessments[witness_id] = []
        
        assessment.id = str(uuid.uuid4())
        assessment.assessment_date = datetime.now()
        assessment.assessed_by = current_user.get("id")
        
        self.assessments[witness_id].append(assessment)
        
        # Update main witness object if threat level changes
        witness = self.witness_store[witness_id]
        witness.threat_level = assessment.threat_level
        
        return assessment

    async def update_status(self, witness_id: str, status: ProtectionStatus, current_user: dict) -> bool:
        """Update protection status"""
        if witness_id not in self.witness_store:
            return False
        
        self.witness_store[witness_id].protection_status = status
        return True


# Singleton
witness_service = WitnessProtectionService()
