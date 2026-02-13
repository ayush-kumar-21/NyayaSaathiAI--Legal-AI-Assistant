"""
Digital Evidence Locker Service - Skill 03
Maintains integrity and chain of custody for digital evidence
"""
import uuid
import hashlib
import json
from datetime import datetime
from typing import List, Optional, Dict
from app.schemas.evidence import (
    Evidence, EvidenceCreate, ChainOfCustodyEvent, 
    EvidenceResponse, CustodyAction, EvidenceStatus,
    CustodyTransferRequest
)


class EvidenceLockerService:
    """
    Manages digital evidence with simulated blockchain integrity
    """
    
    def __init__(self):
        self.evidence_store: Dict[str, Evidence] = {}
        self.chain_store: Dict[str, List[ChainOfCustodyEvent]] = {}
    
    def _calculate_hash(self, data: Dict) -> str:
        """Calculate SHA-256 hash of data"""
        json_str = json.dumps(data, sort_keys=True, default=str)
        return hashlib.sha256(json_str.encode()).hexdigest()

    async def create_evidence(self, request: EvidenceCreate, current_user: dict) -> Evidence:
        """Log new evidence into the system"""
        evidence_id = str(uuid.uuid4())
        
        # Simulate file hashing (in a real system, this would hash the actual file)
        file_hash = hashlib.sha256(f"{request.title}-{datetime.now()}".encode()).hexdigest()
        
        evidence = Evidence(
            id=evidence_id,
            case_id=request.case_id,
            title=request.title,
            description=request.description,
            evidence_type=request.evidence_type,
            file_url=f"https://storage.legalos.gov.in/{evidence_id}/{request.evidence_type}.dat",
            file_hash=file_hash,
            file_size_bytes=1024 * 1024 * 2,  # Mock 2MB
            collection_date=request.collection_date or datetime.now(),
            collection_location=request.collection_location,
            collected_by=current_user.get("full_name", "Officer"),
            current_status=EvidenceStatus.COLLECTED,
            custodian_id=current_user.get("id", "officer-001"),
            tags=request.tags,
            metadata=request.metadata,
            blockchain_tx_id=f"0x{hashlib.sha256(evidence_id.encode()).hexdigest()[:16]}"
        )
        
        self.evidence_store[evidence_id] = evidence
        
        # Create initial chain event
        self._add_chain_event(
            evidence_id=evidence_id,
            user=current_user,
            action=CustodyAction.COLLECTED,
            location=request.collection_location,
            comments="Initial collection and logging"
        )
        
        return evidence

    async def get_evidence(self, evidence_id: str) -> Optional[EvidenceResponse]:
        """Retrieve evidence and its full chain of custody"""
        evidence = self.evidence_store.get(evidence_id)
        if not evidence:
            return None
            
        chain = self.chain_store.get(evidence_id, [])
        integrity = self._verify_chain_integrity(chain)
        
        return EvidenceResponse(
            evidence=evidence,
            chain_of_custody=chain,
            integrity_status="VERIFIED" if integrity else "TAMPERED"
        )

    async def list_evidence_by_case(self, case_id: str) -> List[Evidence]:
        """List all evidence for a specific case"""
        return [
            e for e in self.evidence_store.values() 
            if e.case_id == case_id
        ]

    async def transfer_custody(self, request: CustodyTransferRequest, current_user: dict) -> EvidenceResponse:
        """Transfer custody from one officer/dept to another"""
        evidence = self.evidence_store.get(request.evidence_id)
        if not evidence:
            raise ValueError("Evidence not found")
            
        # Update evidence status
        evidence.custodian_id = request.to_user_id
        if request.action == CustodyAction.SEALED:
            evidence.current_status = EvidenceStatus.SEALED
        
        # Log event
        self._add_chain_event(
            evidence_id=request.evidence_id,
            user=current_user,
            action=request.action,
            location=request.location,
            comments=request.comments
        )
        
        return await self.get_evidence(request.evidence_id)

    def _add_chain_event(self, evidence_id: str, user: dict, action: CustodyAction, location: str, comments: str):
        """Append an event to the immutable chain"""
        if evidence_id not in self.chain_store:
            self.chain_store[evidence_id] = []
            
        chain = self.chain_store[evidence_id]
        previous_hash = chain[-1].event_hash if chain else "GENESIS_HASH"
        
        event_dict = {
            "evidence_id": evidence_id,
            "timestamp": str(datetime.now()),
            "actor_id": user.get("id"),
            "action": action,
            "previous_hash": previous_hash
        }
        
        event_hash = self._calculate_hash(event_dict)
        
        event = ChainOfCustodyEvent(
            id=str(uuid.uuid4()),
            evidence_id=evidence_id,
            timestamp=datetime.now(),
            actor_id=user.get("id", "unknown"),
            actor_name=user.get("full_name", "Unknown Officer"),
            actor_role=user.get("role", "POLICE"),
            action=action,
            location=location,
            comments=comments,
            previous_hash=previous_hash,
            event_hash=event_hash
        )
        
        chain.append(event)

    def _verify_chain_integrity(self, chain: List[ChainOfCustodyEvent]) -> bool:
        """Verify the cryptographic link between all events in the chain"""
        if not chain:
            return True
            
        for i in range(1, len(chain)):
            current_event = chain[i]
            previous_event = chain[i-1]
            
            if current_event.previous_hash != previous_event.event_hash:
                return False
                
        return True


# Singleton instance
evidence_service = EvidenceLockerService()
