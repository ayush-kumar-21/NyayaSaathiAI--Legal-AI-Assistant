import uuid
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models import (
    Case, CaseDetail, CaseTimeline, CaseSection,
    CaseStatus, CasePriority, VALID_TRANSITIONS
)
from app.core.exceptions import InvalidStatusTransition, CaseNotFound
from app.core.logging_config import logger


class CaseService:
    def __init__(self, db: Session):
        self.db = db

    def generate_cnr(self, state_code: str = "DL") -> str:
        """Generate unique CNR: STATE/YEAR/SEQUENCE"""
        year = datetime.utcnow().year
        count = self.db.query(func.count(Case.id)).scalar() or 0
        return f"{state_code}/{year}/{str(count + 1).zfill(7)}"

    def create_case(self, citizen_id: str, narrative: str,
                    location: str = None, priority: CasePriority = CasePriority.MEDIUM,
                    state_code: str = "DL") -> Case:
        """Create a new case with FIR_FILED status."""
        cnr = self.generate_cnr(state_code)

        case = Case(
            id=str(uuid.uuid4()),
            cnr=cnr,
            citizen_id=citizen_id,
            status=CaseStatus.FIR_FILED,
            priority=priority,
            fir_filed_date=datetime.utcnow(),
        )
        self.db.add(case)

        # Add detail
        detail = CaseDetail(
            id=str(uuid.uuid4()),
            case_id=case.id,
            complaint_narrative=narrative,
            incident_location=location,
        )
        self.db.add(detail)

        # Add timeline entry
        timeline = CaseTimeline(
            id=str(uuid.uuid4()),
            case_id=case.id,
            status_from=None,
            status_to=CaseStatus.FIR_FILED.value,
            changed_at=datetime.utcnow(),
            notes="FIR filed by citizen"
        )
        self.db.add(timeline)

        self.db.commit()
        self.db.refresh(case)
        logger.info(f"Case created: {cnr}")
        return case

    def update_status(self, case_id: str, new_status: CaseStatus,
                      actor_id: str = None, notes: str = None) -> Case:
        """Update case status with transition validation."""
        case = self.db.query(Case).filter(Case.id == case_id).first()
        if not case:
            raise CaseNotFound(case_id)

        # Validate transition
        valid_next = VALID_TRANSITIONS.get(case.status, [])
        if new_status not in valid_next:
            raise InvalidStatusTransition(case.status.value, new_status.value)

        old_status = case.status
        case.status = new_status
        case.updated_at = datetime.utcnow()

        # Set dates based on status
        if new_status == CaseStatus.FIR_REGISTERED:
            case.fir_registered_date = datetime.utcnow()
        elif new_status == CaseStatus.CHARGESHEET_SUBMITTED:
            case.chargesheet_filed_date = datetime.utcnow()
        elif new_status == CaseStatus.JUDGMENT_DELIVERED:
            case.judgment_date = datetime.utcnow()

        # Audit trail
        timeline = CaseTimeline(
            id=str(uuid.uuid4()),
            case_id=case_id,
            status_from=old_status.value,
            status_to=new_status.value,
            changed_by=actor_id,
            changed_at=datetime.utcnow(),
            notes=notes
        )
        self.db.add(timeline)
        self.db.commit()
        self.db.refresh(case)

        logger.info(f"Case {case.cnr}: {old_status.value} → {new_status.value}")
        return case

    def get_case(self, cnr: str) -> Case:
        """Get case by CNR."""
        case = self.db.query(Case).filter(Case.cnr == cnr).first()
        if not case:
            raise CaseNotFound(cnr)
        return case

    def get_case_by_id(self, case_id: str) -> Case:
        """Get case by ID."""
        case = self.db.query(Case).filter(Case.id == case_id).first()
        if not case:
            raise CaseNotFound(case_id)
        return case

    def list_cases(self, status: CaseStatus = None, limit: int = 50,
                   offset: int = 0) -> tuple[list[Case], int]:
        """List cases with optional status filter."""
        query = self.db.query(Case)
        if status:
            query = query.filter(Case.status == status)
        total = query.count()
        cases = query.order_by(Case.created_at.desc()).offset(offset).limit(limit).all()
        return cases, total
