
from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    role = Column(String)  # CITIZEN, POLICE, JUDGE, ADMIN
    
    # Optional fields for specific roles
    avatar = Column(String, nullable=True)
    department = Column(String, nullable=True)
    station_id = Column(String, nullable=True)
    court_id = Column(String, nullable=True)
    badge_number = Column(String, nullable=True)
    date_of_birth = Column(String, nullable=True)  # For citizen signup
    
    is_active = Column(Boolean, default=True)

    audit_logs = relationship("AuditLog", back_populates="user")
