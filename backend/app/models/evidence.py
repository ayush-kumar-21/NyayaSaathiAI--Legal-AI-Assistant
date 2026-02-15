"""Evidence and Blockchain models."""
from sqlalchemy import Column, String, Enum, ForeignKey, DateTime, BigInteger, Text, Integer
from sqlalchemy.orm import relationship
from datetime import datetime
from app.models.base import Base, TimestampMixin, GUID
from app.models.enums import EvidenceType, EvidenceStatus


class Evidence(TimestampMixin, Base):
    __tablename__ = "evidence"

    case_id = Column(GUID(), ForeignKey("cases.id"), nullable=False)
    evidence_type = Column(
        Enum(EvidenceType, native_enum=False),
        nullable=False
    )
    description = Column(Text, nullable=True)
    file_name = Column(String(255), nullable=True)
    file_path = Column(String(500), nullable=True)
    mime_type = Column(String(100), nullable=True)

    # Integrity
    sha256_hash = Column(String(64), nullable=False, index=True)
    blockchain_block_number = Column(BigInteger, nullable=True)
    verification_status = Column(
        Enum(EvidenceStatus, native_enum=False),
        default=EvidenceStatus.UPLOADED
    )
    last_verified_at = Column(DateTime, nullable=True)

    # Collection
    collected_by = Column(GUID(), ForeignKey("users.id"), nullable=True)
    collected_at = Column(DateTime, default=datetime.utcnow)
    collected_location = Column(Text, nullable=True)

    case = relationship("Case", back_populates="evidence")
    chain_of_custody = relationship("ChainOfCustody", back_populates="evidence", cascade="all, delete-orphan")


class ChainOfCustody(TimestampMixin, Base):
    __tablename__ = "chain_of_custody"

    evidence_id = Column(GUID(), ForeignKey("evidence.id"), nullable=False)
    transferred_from = Column(GUID(), ForeignKey("users.id"), nullable=True)
    transferred_to = Column(GUID(), ForeignKey("users.id"), nullable=False)
    transfer_datetime = Column(DateTime, default=datetime.utcnow)
    purpose = Column(Text, nullable=True)
    condition_description = Column(Text, nullable=True)

    evidence = relationship("Evidence", back_populates="chain_of_custody")


class BlockchainRecord(TimestampMixin, Base):
    __tablename__ = "blockchain_records"

    record_type = Column(String(50), nullable=False)
    reference_id = Column(GUID(), nullable=False)
    reference_table = Column(String(50), nullable=False)
    data_hash = Column(String(64), nullable=False, index=True)
    previous_hash = Column(String(64), nullable=True)
    block_hash = Column(String(128), nullable=False)
    block_number = Column(BigInteger, nullable=False)
    nonce = Column(Integer, nullable=True)
    verified = Column(String(5), default="false")
