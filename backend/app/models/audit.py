"""Audit log model."""
from sqlalchemy import Column, String, ForeignKey, Text, Boolean, Integer
from app.models.base import Base, TimestampMixin, GUID
import enum

class AuditAction(str, enum.Enum):
    VIEW = "VIEW"
    CREATE = "CREATE"
    UPDATE = "UPDATE"
    DELETE = "DELETE"
    LOGIN = "LOGIN"
    LOGOUT = "LOGOUT"
    LOGIN_FAILED = "LOGIN_FAILED"
    ACCOUNT_LOCKED = "ACCOUNT_LOCKED"
    EXPORT = "EXPORT"

class ResourceType(str, enum.Enum):
    USER = "USER"
    CASE = "CASE"
    EVIDENCE = "EVIDENCE"
    AUDIT_LOG = "AUDIT_LOG"
    SYSTEM = "SYSTEM"
    REPORT = "REPORT"

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
    old_values = Column(Text, nullable=True) # JSON stored as text
    new_values = Column(Text, nullable=True) # JSON stored as text
    error_message = Column(Text, nullable=True)
    user_agent = Column(String(255), nullable=True)
    request_path = Column(String(255), nullable=True)
    request_method = Column(String(10), nullable=True)


class DataAccessLog(TimestampMixin, Base):
    __tablename__ = "data_access_logs"

    user_id = Column(GUID(), ForeignKey("users.id"), nullable=False)
    resource_type = Column(String(50), nullable=False)
    resource_id = Column(String(255), nullable=False)
    access_type = Column(String(20), default="read")
    access_granted = Column(Boolean, default=True)
    denial_reason = Column(String(255), nullable=True)
    records_accessed = Column(Integer, default=1)
    ip_address = Column(String(45), nullable=True)
