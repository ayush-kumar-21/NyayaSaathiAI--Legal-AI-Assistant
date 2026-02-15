"""Court and Police Station models."""
from sqlalchemy import Column, String, Boolean, Text
from sqlalchemy.orm import relationship
from app.models.base import Base, TimestampMixin


class Court(TimestampMixin, Base):
    __tablename__ = "courts"

    court_name = Column(String(255), nullable=False)
    court_type = Column(String(50), nullable=True)
    court_code = Column(String(50), unique=True, nullable=True)
    city = Column(String(100), nullable=True)
    district = Column(String(100), nullable=True)
    state = Column(String(100), nullable=False)
    address = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)

    judges = relationship("User", back_populates="court")
    cases = relationship("Case", back_populates="court")
    hearings = relationship("HearingSchedule", back_populates="court")


class PoliceStation(TimestampMixin, Base):
    __tablename__ = "police_stations"

    station_name = Column(String(255), nullable=False)
    station_code = Column(String(50), unique=True, nullable=True)
    city = Column(String(100), nullable=True)
    district = Column(String(100), nullable=True)
    state = Column(String(100), nullable=False)
    address = Column(Text, nullable=True)
    phone = Column(String(20), nullable=True)
    is_active = Column(Boolean, default=True)

    officers = relationship("User", back_populates="police_station")
    cases = relationship("Case", back_populates="police_station")
