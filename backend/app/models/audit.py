"""
Audit logging model for compliance and security monitoring
Tracks all data access and modifications for justice system requirements
"""
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Index, JSON, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base
import enum


class AuditAction(str, enum.Enum):
    """
    Types of actions that can be audited
    """
    # Authentication actions
    LOGIN = "login"
    LOGIN_FAILED = "login_failed"
    LOGOUT = "logout"
    TOKEN_REFRESH = "token_refresh"
    PASSWORD_CHANGE = "password_change"
    PASSWORD_RESET_REQUEST = "password_reset_request"
    PASSWORD_RESET_COMPLETE = "password_reset_complete"
    ACCOUNT_LOCKED = "account_locked"
    ACCOUNT_UNLOCKED = "account_unlocked"
    
    # Data access actions
    VIEW = "view"
    CREATE = "create"
    UPDATE = "update"
    DELETE = "delete"
    EXPORT = "export"
    PRINT = "print"
    
    # Administrative actions
    USER_CREATED = "user_created"
    USER_UPDATED = "user_updated"
    USER_DELETED = "user_deleted"
    ROLE_CHANGED = "role_changed"
    VERIFICATION_COMPLETED = "verification_completed"


class ResourceType(str, enum.Enum):
    """
    Types of resources that can be audited
    """
    USER = "user"
    FIR = "fir"
    JUDGMENT = "judgment"
    EVIDENCE = "evidence"
    WITNESS = "witness"
    CASE = "case"
    WARRANT = "warrant"
    AUDIT_LOG = "audit_log"  # Meta - who views audit logs


class AuditLog(Base):
    """
    Comprehensive audit log for all system actions
    Immutable - never update, only insert
    
    For justice systems, audit trails are legally required
    """
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True)
    
    # Who performed the action
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # NULL for failed logins
    user_email = Column(String(255), nullable=True)  # Denormalized for historical accuracy
    user_role = Column(String(20), nullable=True)
    
    # What action was performed
    action = Column(String(50), nullable=False)  # Use AuditAction enum
    resource_type = Column(String(50), nullable=False)  # Use ResourceType enum
    resource_id = Column(String(100), nullable=True)  # Can be int or UUID as string
    
    # Context
    description = Column(Text, nullable=True)  # Human-readable description
    old_values = Column(JSON, nullable=True)  # Before state (for updates/deletes)
    new_values = Column(JSON, nullable=True)  # After state (for creates/updates)
    
    # Request context
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(String(500), nullable=True)
    request_path = Column(String(500), nullable=True)
    request_method = Column(String(10), nullable=True)
    
    # Success/failure tracking
    success = Column(Boolean, default=True)
    error_message = Column(Text, nullable=True)
    
    # Timestamp (never changes)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="audit_logs")
    
    # Indexes for querying
    __table_args__ = (
        Index('idx_audit_user_action', 'user_id', 'action'),
        Index('idx_audit_resource', 'resource_type', 'resource_id'),
        Index('idx_audit_created_at', 'created_at'),
        Index('idx_audit_action_time', 'action', 'created_at'),
    )
    
    def __repr__(self):
        return f"<AuditLog(id={self.id}, action={self.action}, user={self.user_email})>"


class DataAccessLog(Base):
    """
    Specific log for data access patterns
    Separated from audit_logs for performance when querying access patterns
    """
    __tablename__ = "data_access_logs"
    
    id = Column(Integer, primary_key=True)
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    resource_type = Column(String(50), nullable=False)
    resource_id = Column(String(100), nullable=False)
    access_type = Column(String(20), nullable=False)  # read, write, delete
    
    # Was access allowed or denied (for row-level security testing)
    access_granted = Column(Boolean, nullable=False)
    denial_reason = Column(String(200), nullable=True)  # If access_granted=False
    
    # Query context
    query_filter_applied = Column(Text, nullable=True)  # What filters were applied
    records_accessed = Column(Integer, default=1)  # How many records
    
    # Timestamps
    accessed_at = Column(DateTime, default=func.now(), nullable=False)
    ip_address = Column(String(45), nullable=True)
    
    # Indexes
    __table_args__ = (
        Index('idx_data_access_user', 'user_id', 'accessed_at'),
        Index('idx_data_access_resource', 'resource_type', 'resource_id'),
        Index('idx_data_access_denied', 'access_granted', 'accessed_at'),
    )
