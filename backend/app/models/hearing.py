"""Hearing, Cause List, and Adjournment models."""
from sqlalchemy import Column, String, Enum, ForeignKey, DateTime, Boolean, Text, Integer, Date, Time, Float
from sqlalchemy.orm import relationship
from app.models.base import Base, TimestampMixin, GUID
from app.models.enums import HearingType


class HearingSchedule(TimestampMixin, Base):
    __tablename__ = "hearing_schedules"

    case_id = Column(GUID(), ForeignKey("cases.id"), nullable=False)
    court_id = Column(GUID(), ForeignKey("courts.id"), nullable=True)
    judge_id = Column(GUID(), ForeignKey("users.id"), nullable=True)
    hearing_date = Column(Date, nullable=False)
    hearing_time = Column(Time, nullable=True)
    hearing_type = Column(
        Enum(HearingType, native_enum=False),
        nullable=True
    )
    status = Column(String(20), default="SCHEDULED")
    is_virtual = Column(Boolean, default=False)
    notes = Column(Text, nullable=True)

    case = relationship("Case", back_populates="hearings")
    court = relationship("Court", back_populates="hearings")
    records = relationship("HearingRecord", back_populates="hearing")
    adjournments = relationship("Adjournment", back_populates="hearing")


class HearingRecord(TimestampMixin, Base):
    __tablename__ = "hearing_records"

    hearing_id = Column(GUID(), ForeignKey("hearing_schedules.id"), nullable=False)
    proceedings_summary = Column(Text, nullable=True)
    ai_generated_summary = Column(Text, nullable=True)
    prosecution_present = Column(Boolean, default=False)
    defense_present = Column(Boolean, default=False)
    accused_present = Column(Boolean, default=False)
    next_hearing_date = Column(Date, nullable=True)
    next_hearing_purpose = Column(String(100), nullable=True)
    transcript_url = Column(String(500), nullable=True)

    hearing = relationship("HearingSchedule", back_populates="records")


class Adjournment(TimestampMixin, Base):
    __tablename__ = "adjournments"

    hearing_id = Column(GUID(), ForeignKey("hearing_schedules.id"), nullable=False)
    case_id = Column(GUID(), ForeignKey("cases.id"), nullable=False)
    reason = Column(Text, nullable=False)
    requested_by = Column(GUID(), ForeignKey("users.id"), nullable=True)
    judge_decision = Column(String(20), nullable=True)
    cost_imposed = Column(Float, default=0.0)
    new_hearing_date = Column(Date, nullable=True)

    hearing = relationship("HearingSchedule", back_populates="adjournments")


class CauseList(TimestampMixin, Base):
    __tablename__ = "cause_lists"

    court_id = Column(GUID(), ForeignKey("courts.id"), nullable=False)
    judge_id = Column(GUID(), ForeignKey("users.id"), nullable=False)
    list_date = Column(Date, nullable=False)
    is_published = Column(Boolean, default=False)
    total_cases = Column(Integer, default=0)
