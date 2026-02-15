"""
All enumerations used across the application.
Using Python's str Enum for JSON serialization compatibility.
"""
import enum


class CaseStatus(str, enum.Enum):
    # Phase 1: Filing
    COMPLAINT_DRAFTED = "COMPLAINT_DRAFTED"
    FIR_FILED = "FIR_FILED"
    CASE_REJECTED = "CASE_REJECTED"

    # Phase 2: Police
    FIR_REGISTERED = "FIR_REGISTERED"
    UNDER_INVESTIGATION = "UNDER_INVESTIGATION"
    ACCUSED_IDENTIFIED = "ACCUSED_IDENTIFIED"
    ACCUSED_ARRESTED = "ACCUSED_ARRESTED"
    EVIDENCE_COLLECTED = "EVIDENCE_COLLECTED"
    INVESTIGATION_COMPLETE = "INVESTIGATION_COMPLETE"
    CHARGESHEET_SUBMITTED = "CHARGESHEET_SUBMITTED"
    CHARGESHEET_DEFECTIVE = "CHARGESHEET_DEFECTIVE"
    CASE_CLOSED_UNTRACED = "CASE_CLOSED_UNTRACED"

    # Phase 3: Court
    CHARGESHEET_ACCEPTED = "CHARGESHEET_ACCEPTED"
    CASE_ASSIGNED = "CASE_ASSIGNED"
    HEARING_SCHEDULED = "HEARING_SCHEDULED"
    HEARING_IN_PROGRESS = "HEARING_IN_PROGRESS"
    HEARING_ADJOURNED = "HEARING_ADJOURNED"
    ARGUMENTS_HEARD = "ARGUMENTS_HEARD"
    JUDGMENT_RESERVED = "JUDGMENT_RESERVED"
    JUDGMENT_DELIVERED = "JUDGMENT_DELIVERED"
    CONVICTED = "CONVICTED"
    ACQUITTED = "ACQUITTED"

    # Phase 4: Post-Judgment
    APPEAL_PENDING = "APPEAL_PENDING"
    JUSTICE_SERVED = "JUSTICE_SERVED"
    CASE_CLOSED = "CASE_CLOSED"


# Valid status transitions — prevents illegal state changes
VALID_TRANSITIONS: dict[CaseStatus, list[CaseStatus]] = {
    CaseStatus.COMPLAINT_DRAFTED: [
        CaseStatus.FIR_FILED,
    ],
    CaseStatus.FIR_FILED: [
        CaseStatus.FIR_REGISTERED,
        CaseStatus.CASE_REJECTED,
    ],
    CaseStatus.FIR_REGISTERED: [
        CaseStatus.UNDER_INVESTIGATION,
    ],
    CaseStatus.UNDER_INVESTIGATION: [
        CaseStatus.ACCUSED_IDENTIFIED,
        CaseStatus.EVIDENCE_COLLECTED,
        CaseStatus.INVESTIGATION_COMPLETE,
        CaseStatus.CASE_CLOSED_UNTRACED,
    ],
    CaseStatus.ACCUSED_IDENTIFIED: [
        CaseStatus.ACCUSED_ARRESTED,
        CaseStatus.EVIDENCE_COLLECTED,
        CaseStatus.INVESTIGATION_COMPLETE,
    ],
    CaseStatus.ACCUSED_ARRESTED: [
        CaseStatus.EVIDENCE_COLLECTED,
        CaseStatus.INVESTIGATION_COMPLETE,
    ],
    CaseStatus.EVIDENCE_COLLECTED: [
        CaseStatus.INVESTIGATION_COMPLETE,
    ],
    CaseStatus.INVESTIGATION_COMPLETE: [
        CaseStatus.CHARGESHEET_SUBMITTED,
        CaseStatus.CASE_CLOSED_UNTRACED,
    ],
    CaseStatus.CHARGESHEET_SUBMITTED: [
        CaseStatus.CHARGESHEET_ACCEPTED,
        CaseStatus.CHARGESHEET_DEFECTIVE,
    ],
    CaseStatus.CHARGESHEET_DEFECTIVE: [
        CaseStatus.CHARGESHEET_SUBMITTED,  # Resubmission
    ],
    CaseStatus.CHARGESHEET_ACCEPTED: [
        CaseStatus.CASE_ASSIGNED,
    ],
    CaseStatus.CASE_ASSIGNED: [
        CaseStatus.HEARING_SCHEDULED,
    ],
    CaseStatus.HEARING_SCHEDULED: [
        CaseStatus.HEARING_IN_PROGRESS,
        CaseStatus.HEARING_ADJOURNED,
    ],
    CaseStatus.HEARING_IN_PROGRESS: [
        CaseStatus.HEARING_ADJOURNED,
        CaseStatus.ARGUMENTS_HEARD,
        CaseStatus.JUDGMENT_RESERVED,
    ],
    CaseStatus.HEARING_ADJOURNED: [
        CaseStatus.HEARING_SCHEDULED,  # Rescheduled
    ],
    CaseStatus.ARGUMENTS_HEARD: [
        CaseStatus.JUDGMENT_RESERVED,
    ],
    CaseStatus.JUDGMENT_RESERVED: [
        CaseStatus.JUDGMENT_DELIVERED,
    ],
    CaseStatus.JUDGMENT_DELIVERED: [
        CaseStatus.CONVICTED,
        CaseStatus.ACQUITTED,
        CaseStatus.APPEAL_PENDING,
        CaseStatus.JUSTICE_SERVED,
    ],
    CaseStatus.CONVICTED: [
        CaseStatus.APPEAL_PENDING,
        CaseStatus.JUSTICE_SERVED,
    ],
    CaseStatus.ACQUITTED: [
        CaseStatus.APPEAL_PENDING,
        CaseStatus.JUSTICE_SERVED,
    ],
    CaseStatus.APPEAL_PENDING: [
        CaseStatus.HEARING_SCHEDULED,  # Re-enters trial
        CaseStatus.JUSTICE_SERVED,
    ],
    CaseStatus.JUSTICE_SERVED: [
        CaseStatus.CASE_CLOSED,
    ],
    # Dead-end states (no transitions out):
    CaseStatus.CASE_REJECTED: [],
    CaseStatus.CASE_CLOSED: [],
    CaseStatus.CASE_CLOSED_UNTRACED: [
        CaseStatus.UNDER_INVESTIGATION,  # Reopened
    ],
}


class UserRole(str, enum.Enum):
    CITIZEN = "CITIZEN"
    POLICE = "POLICE"
    JUDGE = "JUDGE"
    ADMIN = "ADMIN"


class UserStatus(str, enum.Enum):
    PENDING = "PENDING"
    ACTIVE = "ACTIVE"
    SUSPENDED = "SUSPENDED"
    REJECTED = "REJECTED"


class CasePriority(str, enum.Enum):
    URGENT = "URGENT"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


class EvidenceType(str, enum.Enum):
    DOCUMENT = "DOCUMENT"
    PHOTO = "PHOTO"
    VIDEO = "VIDEO"
    AUDIO = "AUDIO"
    PHYSICAL = "PHYSICAL"
    DIGITAL = "DIGITAL"
    FORENSIC_REPORT = "FORENSIC_REPORT"


class EvidenceStatus(str, enum.Enum):
    UPLOADED = "UPLOADED"
    VERIFIED = "VERIFIED"
    TAMPERED = "TAMPERED"
    REJECTED = "REJECTED"


class HearingType(str, enum.Enum):
    BAIL = "BAIL"
    REMAND = "REMAND"
    CHARGE_FRAMING = "CHARGE_FRAMING"
    EVIDENCE = "EVIDENCE"
    ARGUMENTS = "ARGUMENTS"
    JUDGMENT = "JUDGMENT"


class OrderType(str, enum.Enum):
    BAIL = "BAIL"
    INTERIM = "INTERIM"
    FINAL = "FINAL"
    REMAND = "REMAND"
    WARRANT = "WARRANT"
    SUMMONS = "SUMMONS"


class CustodyType(str, enum.Enum):
    POLICE = "POLICE"
    JUDICIAL = "JUDICIAL"


class PartyType(str, enum.Enum):
    COMPLAINANT = "COMPLAINANT"
    ACCUSED = "ACCUSED"
    WITNESS = "WITNESS"
    VICTIM = "VICTIM"
