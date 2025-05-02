from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime
from app.models.study import StudyType, StudyStatus

class StudyBase(BaseModel):
    """Base schema for study data"""
    title: str
    description: Optional[str] = None
    design_type: StudyType

class StudyCreate(StudyBase):
    """Schema for study creation"""
    pass

class StudyUpdate(BaseModel):
    """Schema for study update"""
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[StudyStatus] = None
    research_question: Optional[Dict[str, Any]] = None
    statistical_test: Optional[Dict[str, Any]] = None
    power_calculation: Optional[Dict[str, Any]] = None

class ResearchQuestion(BaseModel):
    """Schema for research question data"""
    # For RCT
    intervention: Optional[str] = None
    comparator: Optional[str] = None
    
    # For Diagnostic Accuracy
    index_test: Optional[str] = None
    reference_standard: Optional[str] = None
    target_condition: Optional[str] = None
    
    # For Cohort
    exposure: Optional[str] = None
    timeframe: Optional[str] = None
    
    # Common fields
    population: Optional[str] = None
    outcome: Optional[str] = None

class StudyResponse(StudyBase):
    """Schema for study response"""
    id: int
    status: StudyStatus
    research_question: Optional[Dict[str, Any]] = None
    statistical_test: Optional[Dict[str, Any]] = None
    power_calculation: Optional[Dict[str, Any]] = None
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class StudyList(BaseModel):
    """Schema for list of studies"""
    data: List[StudyResponse]
    meta: Dict[str, Any] = Field(
        default_factory=lambda: {"current_page": 1, "total_pages": 1, "total_count": 0}
    )
