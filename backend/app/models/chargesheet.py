"""Charge Sheet model."""
from sqlalchemy import Column, String, ForeignKey, DateTime, Boolean, Text, Integer
from sqlalchemy.orm import relationship
from app.models.base import Base, TimestampMixin, GUID


class ChargeSheet(TimestampMixin, Base):
    __tablename__ = "chargesheets"

    case_id = Column(GUID(), ForeignKey("cases.id"), nullable=False)
    chargesheet_number = Column(String(50), unique=True, nullable=True)
    filing_date = Column(DateTime, nullable=True)
    filed_by = Column(GUID(), ForeignKey("users.id"), nullable=True)
    summary = Column(Text, nullable=True)
    evidence_summary = Column(Text, nullable=True)
    sho_approval = Column(Boolean, default=False)
    scrutiny_status = Column(String(20), default="PENDING")
    defects_found = Column(Text, nullable=True)
    resubmission_count = Column(Integer, default=0)
