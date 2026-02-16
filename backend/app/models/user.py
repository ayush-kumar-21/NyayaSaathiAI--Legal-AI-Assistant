"""User and profile models."""
from sqlalchemy import Column, String, Enum, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import Base, TimestampMixin, GUID
from app.models.enums import UserRole, UserStatus


class User(TimestampMixin, Base):
    __tablename__ = "users"

    email = Column(String(255), unique=True, nullable=False, index=True)
    phone = Column(String(20), unique=True, nullable=True)
    password_hash = Column(String(255), nullable=True)
    full_name = Column(String(255), nullable=False)
    role = Column(
        Enum(UserRole, native_enum=False),
        nullable=False,
        default=UserRole.CITIZEN
    )
    status = Column(
        Enum(UserStatus, native_enum=False),
        nullable=False,
        default=UserStatus.PENDING
    )
    state = Column(String(100), nullable=True)
    district = Column(String(100), nullable=True)
    preferred_language = Column(String(20), default="en")

    # Police-specific
    badge_number = Column(String(50), unique=True, nullable=True)
    rank = Column(String(50), nullable=True)
    police_station_id = Column(GUID(), ForeignKey("police_stations.id"), nullable=True)

    # Judge-specific
    court_id = Column(GUID(), ForeignKey("courts.id"), nullable=True)
    designation = Column(String(50), nullable=True)
    specialization = Column(String(50), nullable=True)

    # Relationships (use strings to avoid circular imports)
    filed_cases = relationship("Case", foreign_keys="Case.citizen_id", back_populates="citizen")
    assigned_cases = relationship("Case", foreign_keys="Case.assigned_io_id", back_populates="assigned_io")
    judged_cases = relationship("Case", foreign_keys="Case.assigned_judge_id", back_populates="assigned_judge")
    police_station = relationship("PoliceStation", back_populates="officers")
    court = relationship("Court", back_populates="judges")
