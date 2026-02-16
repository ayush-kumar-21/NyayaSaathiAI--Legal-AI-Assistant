"""Notification model."""
from sqlalchemy import Column, String, ForeignKey, DateTime, Boolean, Text
from sqlalchemy.orm import relationship
from app.models.base import Base, TimestampMixin, GUID


class Notification(TimestampMixin, Base):
    __tablename__ = "notifications"

    user_id = Column(GUID(), ForeignKey("users.id"), nullable=False)
    case_id = Column(GUID(), ForeignKey("cases.id"), nullable=True)
    type = Column(String(50), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    channel = Column(String(20), default="IN_APP")
    priority = Column(String(20), default="NORMAL")
    is_read = Column(Boolean, default=False)
    read_at = Column(DateTime, nullable=True)

    case = relationship("Case", back_populates="notifications")
