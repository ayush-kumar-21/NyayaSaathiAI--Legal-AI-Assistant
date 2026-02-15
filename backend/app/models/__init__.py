"""
Models package.
IMPORTANT: Every model MUST be imported here so that:
1. Alembic can detect all tables
2. Base.metadata contains all tables
3. Relationships resolve correctly
"""
from app.models.base import Base, TimestampMixin, GUID
from app.models.enums import (
    CaseStatus, UserRole, UserStatus, CasePriority,
    EvidenceType, EvidenceStatus, HearingType, OrderType,
    CustodyType, PartyType, VALID_TRANSITIONS
)

# Import ORDER matters — tables with no FKs first, then dependents
from app.models.court import Court, PoliceStation
from app.models.user import User
from app.models.case import Case, CaseDetail, CaseParty, CaseSection, CaseTimeline
from app.models.investigation import ArrestRecord, CustodyRecord
from app.models.evidence import Evidence, ChainOfCustody, BlockchainRecord
from app.models.chargesheet import ChargeSheet
from app.models.hearing import HearingSchedule, HearingRecord, Adjournment, CauseList
from app.models.order import CourtOrder, Judgment, BailApplication
from app.models.notification import Notification
from app.models.audit import AuditLog

__all__ = [
    "Base", "TimestampMixin", "GUID",
    "CaseStatus", "UserRole", "UserStatus", "CasePriority",
    "EvidenceType", "EvidenceStatus", "HearingType", "OrderType",
    "CustodyType", "PartyType", "VALID_TRANSITIONS",
    "Court", "PoliceStation",
    "User",
    "Case", "CaseDetail", "CaseParty", "CaseSection", "CaseTimeline",
    "ArrestRecord", "CustodyRecord",
    "Evidence", "ChainOfCustody", "BlockchainRecord",
    "ChargeSheet",
    "HearingSchedule", "HearingRecord", "Adjournment", "CauseList",
    "CourtOrder", "Judgment", "BailApplication",
    "Notification",
    "AuditLog",
]
