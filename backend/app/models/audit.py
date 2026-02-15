"""Audit log model."""
from sqlalchemy import Column, String, ForeignKey, Text, Boolean
from app.models.base import Base, TimestampMixin, GUID


class AuditLog(TimestampMixin, Base):
    __tablename__ = "audit_logs"

    user_id = Column(GUID(), ForeignKey("users.id"), nullable=True)
    user_email = Column(String(255), nullable=True)
    user_role = Column(String(20), nullable=True)
    action = Column(String(50), nullable=False)
    resource_type = Column(String(50), nullable=False)
    resource_id = Column(GUID(), nullable=True)
    description = Column(Text, nullable=True)
    ip_address = Column(String(45), nullable=True)
    success = Column(Boolean, default=True)
