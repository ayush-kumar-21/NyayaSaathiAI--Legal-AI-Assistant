"""Investigation, Arrest, and Custody models."""
from datetime import datetime
from sqlalchemy import Column, String, Enum, ForeignKey, DateTime, Boolean, Text, Integer
from sqlalchemy.orm import relationship
from app.models.base import Base, TimestampMixin, GUID
from app.models.enums import CustodyType


class ArrestRecord(TimestampMixin, Base):
    __tablename__ = "arrest_records"

    case_id = Column(GUID(), ForeignKey("cases.id"), nullable=False)
    accused_id = Column(GUID(), ForeignKey("case_parties.id"), nullable=False)
    arrested_by = Column(GUID(), ForeignKey("users.id"), nullable=False)
    arrest_datetime = Column(DateTime, nullable=False, default=datetime.utcnow)
    arrest_location = Column(Text, nullable=True)
    grounds_of_arrest = Column(Text, nullable=True)
    family_notified = Column(Boolean, default=False)
    family_notification_time = Column(DateTime, nullable=True)
    medical_examination_done = Column(Boolean, default=False)
    produced_before_magistrate = Column(DateTime, nullable=True)

    accused = relationship("CaseParty", back_populates="arrest_records")

    @property
    def hours_since_arrest(self) -> float:
        """Calculate hours since arrest for 24-hour production check."""
        if self.arrest_datetime:
            return (datetime.utcnow() - self.arrest_datetime).total_seconds() / 3600
        return 0

    @property
    def production_deadline_breached(self) -> bool:
        """Check if 24-hour magistrate production is breached."""
        return self.hours_since_arrest > 24 and self.produced_before_magistrate is None


class CustodyRecord(TimestampMixin, Base):
    __tablename__ = "custody_records"

    case_id = Column(GUID(), ForeignKey("cases.id"), nullable=False)
    accused_id = Column(GUID(), ForeignKey("case_parties.id"), nullable=False)
    custody_type = Column(
        Enum(CustodyType, native_enum=False),
        nullable=False
    )
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=True)
    extension_count = Column(Integer, default=0)
    next_production_date = Column(DateTime, nullable=True)
    status = Column(String(20), default="ACTIVE")
