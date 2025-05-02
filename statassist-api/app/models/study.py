from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from app.db.database import Base

class StudyType(str, enum.Enum):
    """Enumeration of study types"""
    RCT = "RCT"
    DIAGNOSTIC_ACCURACY = "DiagnosticAccuracy"
    COHORT = "Cohort"

class StudyStatus(str, enum.Enum):
    """Enumeration of study statuses"""
    DRAFT = "draft"
    ACTIVE = "active"
    COMPLETED = "completed"
    ARCHIVED = "archived"

class Study(Base):
    """Study model representing a research study"""
    __tablename__ = "studies"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text, nullable=True)
    design_type = Column(Enum(StudyType))
    status = Column(Enum(StudyStatus), default=StudyStatus.DRAFT)
    
    # Research question components
    research_question = Column(JSON, nullable=True)
    
    # Statistical test and power calculation
    statistical_test = Column(JSON, nullable=True)
    power_calculation = Column(JSON, nullable=True)
    
    # Ownership and timestamps
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", backref="studies")
    variables = relationship("Variable", back_populates="study", cascade="all, delete-orphan")
