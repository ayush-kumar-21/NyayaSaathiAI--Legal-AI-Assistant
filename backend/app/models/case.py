"""Case and related models."""
from datetime import datetime
from sqlalchemy import Column, String, Enum, ForeignKey, DateTime, Integer, Text, Float, Boolean
from sqlalchemy.orm import relationship
from app.models.base import Base, TimestampMixin, GUID
from app.models.enums import CaseStatus, CasePriority, PartyType


class Case(TimestampMixin, Base):
    __tablename__ = "cases"

    cnr = Column(String(20), unique=True, nullable=False, index=True)
    citizen_id = Column(GUID(), ForeignKey("users.id"), nullable=False)
    status = Column(
        Enum(CaseStatus, native_enum=False),
        default=CaseStatus.FIR_FILED,
        nullable=False,
        index=True
    )
    priority = Column(
        Enum(CasePriority, native_enum=False),
        default=CasePriority.MEDIUM,
        nullable=False
    )

    # Jurisdiction
    police_station_id = Column(GUID(), ForeignKey("police_stations.id"), nullable=True)
    court_id = Column(GUID(), ForeignKey("courts.id"), nullable=True)

    # Assignment
    assigned_io_id = Column(GUID(), ForeignKey("users.id"), nullable=True)
    assigned_judge_id = Column(GUID(), ForeignKey("users.id"), nullable=True)

    # Dates
    fir_filed_date = Column(DateTime, default=datetime.utcnow)
    fir_registered_date = Column(DateTime, nullable=True)
    chargesheet_filed_date = Column(DateTime, nullable=True)
    judgment_date = Column(DateTime, nullable=True)

    # BNSS Compliance
    bnss_deadline_days = Column(Integer, default=90)
    ai_priority_score = Column(Float, nullable=True)

    # Relationships
    citizen = relationship("User", foreign_keys=[citizen_id], back_populates="filed_cases")
    assigned_io = relationship("User", foreign_keys=[assigned_io_id], back_populates="assigned_cases")
    assigned_judge = relationship("User", foreign_keys=[assigned_judge_id], back_populates="judged_cases")
    police_station = relationship("PoliceStation", back_populates="cases")
    court = relationship("Court", back_populates="cases")

    detail = relationship("CaseDetail", uselist=False, back_populates="case", cascade="all, delete-orphan")
    parties = relationship("CaseParty", back_populates="case", cascade="all, delete-orphan")
    sections = relationship("CaseSection", back_populates="case", cascade="all, delete-orphan")
    evidence = relationship("Evidence", back_populates="case", cascade="all, delete-orphan")
    hearings = relationship("HearingSchedule", back_populates="case")
    timeline = relationship("CaseTimeline", back_populates="case", order_by="CaseTimeline.changed_at")
    notifications = relationship("Notification", back_populates="case")

    @property
    def bnss_days_remaining(self) -> int | None:
        """Calculate days remaining for BNSS 193 compliance."""
        if self.fir_registered_date and self.status in [
            CaseStatus.UNDER_INVESTIGATION,
            CaseStatus.ACCUSED_IDENTIFIED,
            CaseStatus.ACCUSED_ARRESTED,
            CaseStatus.EVIDENCE_COLLECTED,
            CaseStatus.INVESTIGATION_COMPLETE,
        ]:
            elapsed = (datetime.utcnow() - self.fir_registered_date).days
            return max(0, self.bnss_deadline_days - elapsed)
        return None


class CaseDetail(TimestampMixin, Base):
    __tablename__ = "case_details"

    case_id = Column(GUID(), ForeignKey("cases.id"), unique=True, nullable=False)
    complaint_narrative = Column(Text, nullable=False)
    incident_location = Column(String(500), nullable=True)
    incident_lat = Column(Float, nullable=True)
    incident_lng = Column(Float, nullable=True)
    incident_datetime = Column(DateTime, nullable=True)
    accused_description = Column(Text, nullable=True)
    is_women_related = Column(Boolean, default=False)
    is_child_related = Column(Boolean, default=False)

    case = relationship("Case", back_populates="detail")


class CaseParty(TimestampMixin, Base):
    __tablename__ = "case_parties"

    case_id = Column(GUID(), ForeignKey("cases.id"), nullable=False)
    party_type = Column(
        Enum(PartyType, native_enum=False),
        nullable=False
    )
    name = Column(String(255), nullable=False)
    age = Column(Integer, nullable=True)
    gender = Column(String(10), nullable=True)
    address = Column(Text, nullable=True)
    phone = Column(String(20), nullable=True)

    case = relationship("Case", back_populates="parties")
    arrest_records = relationship("ArrestRecord", back_populates="accused")


class CaseSection(TimestampMixin, Base):
    __tablename__ = "case_sections"

    case_id = Column(GUID(), ForeignKey("cases.id"), nullable=False)
    act = Column(String(50), nullable=False)
    section_number = Column(String(20), nullable=False)
    section_description = Column(Text, nullable=True)
    is_primary = Column(Boolean, default=False)
    ai_confidence = Column(Float, nullable=True)

    case = relationship("Case", back_populates="sections")


class CaseTimeline(TimestampMixin, Base):
    __tablename__ = "case_timeline"

    case_id = Column(GUID(), ForeignKey("cases.id"), nullable=False)
    status_from = Column(String(50), nullable=True)
    status_to = Column(String(50), nullable=False)
    changed_by = Column(GUID(), ForeignKey("users.id"), nullable=True)
    changed_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    notes = Column(Text, nullable=True)

    case = relationship("Case", back_populates="timeline")
