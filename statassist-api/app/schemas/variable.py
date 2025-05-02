from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime
from app.models.variable import VariableType, VariableRole

class VariableBase(BaseModel):
    """Base schema for variable data"""
    name: str
    type: VariableType
    role: VariableRole
    constraints: Optional[Dict[str, Any]] = None

class VariableCreate(VariableBase):
    """Schema for variable creation"""
    pass

class VariableUpdate(BaseModel):
    """Schema for variable update"""
    name: Optional[str] = None
    type: Optional[VariableType] = None
    role: Optional[VariableRole] = None
    constraints: Optional[Dict[str, Any]] = None

class VariableResponse(VariableBase):
    """Schema for variable response"""
    id: int
    study_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class VariableList(BaseModel):
    """Schema for list of variables"""
    data: List[VariableResponse]
    meta: Dict[str, Any] = Field(
        default_factory=lambda: {"current_page": 1, "total_pages": 1, "total_count": 0}
    )
