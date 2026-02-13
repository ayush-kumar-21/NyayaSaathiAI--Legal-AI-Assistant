import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, Float, ForeignKey, JSON, Enum
from sqlalchemy.orm import relationship
from app.db.database import Base
from app.schemas.fir import FIRStatus

class Case(Base):
    __tablename__ = "cases"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    fir_number = Column(String, unique=True, index=True, nullable=False)
    
    # Complainant Details
    complainant_id = Column(String, ForeignKey("users.id"), nullable=True) # Optional for now if anonymous
    complainant_name = Column(String, nullable=False)
    complainant_contact = Column(String, nullable=True)
    
    # Incident Details
    complaint_text = Column(Text, nullable=False)
    incident_location = Column(String, nullable=True)
    incident_datetime = Column(DateTime, nullable=True)
    
    # System Metadata
    status = Column(String, default=FIRStatus.DRAFT) # Enum stored as string
    police_station_id = Column(String, nullable=True)
    
    # AI Analysis (JSON)
    analysis_data = Column(JSON, nullable=True) # Stores analysis.json()
    confidence_score = Column(Float, default=0.0)
    
    # Meta
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    # complainant = relationship("User", back_populates="cases") 
