"""Court Orders, Judgments, Bail, and Warrants."""
from sqlalchemy import Column, String, Enum, ForeignKey, DateTime, Boolean, Text, Float
from sqlalchemy.orm import relationship
from app.models.base import Base, TimestampMixin, GUID
from app.models.enums import OrderType


class CourtOrder(TimestampMixin, Base):
    __tablename__ = "court_orders"

    case_id = Column(GUID(), ForeignKey("cases.id"), nullable=False)
    judge_id = Column(GUID(), ForeignKey("users.id"), nullable=False)
    order_type = Column(
        Enum(OrderType, native_enum=False),
        nullable=False
    )
    order_number = Column(String(50), nullable=True)
    order_date = Column(DateTime, nullable=True)
    content = Column(Text, nullable=False)
    operative_part = Column(Text, nullable=True)
    is_interim = Column(Boolean, default=False)
    compliance_required = Column(Boolean, default=False)
    compliance_deadline = Column(DateTime, nullable=True)
    digital_signature = Column(Text, nullable=True)
    blockchain_anchor = Column(String(128), nullable=True)


class Judgment(TimestampMixin, Base):
    __tablename__ = "judgments"

    case_id = Column(GUID(), ForeignKey("cases.id"), unique=True, nullable=False)
    judge_id = Column(GUID(), ForeignKey("users.id"), nullable=False)
    judgment_type = Column(String(20), nullable=True)
    judgment_date = Column(DateTime, nullable=True)
    facts_of_case = Column(Text, nullable=True)
    evidence_evaluation = Column(Text, nullable=True)
    legal_analysis = Column(Text, nullable=True)
    operative_part = Column(Text, nullable=True)
    plain_language_summary = Column(Text, nullable=True)
    ai_draft_used = Column(Boolean, default=False)
    digital_signature_hash = Column(String(128), nullable=True)
    blockchain_anchor = Column(String(128), nullable=True)


class BailApplication(TimestampMixin, Base):
    __tablename__ = "bail_applications"

    case_id = Column(GUID(), ForeignKey("cases.id"), nullable=False)
    applicant_id = Column(GUID(), ForeignKey("case_parties.id"), nullable=True)
    application_type = Column(String(30), nullable=True)
    grounds = Column(Text, nullable=True)
    status = Column(String(20), default="PENDING")
    ai_risk_score = Column(Float, nullable=True)
    ai_recommendation = Column(String(20), nullable=True)
    hearing_date = Column(DateTime, nullable=True)
