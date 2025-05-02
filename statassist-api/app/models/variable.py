from sqlalchemy import Column, Integer, String, ForeignKey, JSON, Enum, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from app.db.database import Base

class VariableType(str, enum.Enum):
    """Enumeration of variable types"""
    CONTINUOUS = "Continuous"
    CATEGORICAL = "Categorical"
    BINARY = "Binary"
    TIME = "Time"

class VariableRole(str, enum.Enum):
    """Enumeration of variable roles"""
    PRIMARY = "Primary"
    SECONDARY = "Secondary"
    COVARIATE = "Covariate"
    DEMOGRAPHIC = "Demographic"
    OTHER = "Other"

class Variable(Base):
    """Variable model representing a study variable"""
    __tablename__ = "variables"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    type = Column(Enum(VariableType))
    role = Column(Enum(VariableRole))
    constraints = Column(JSON, nullable=True)  # For units, ranges, categories, etc.
    
    # Foreign keys
    study_id = Column(Integer, ForeignKey("studies.id"))
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    study = relationship("Study", back_populates="variables")
