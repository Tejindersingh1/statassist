from pydantic import BaseModel, Field
from typing import Dict, Any, List

class PowerRequest(BaseModel):
    """Schema for power calculation request"""
    test_type: str
    effect_size: float = Field(..., gt=0)
    alpha: float = Field(0.05, gt=0, lt=1)
    sample_sizes: List[int] = Field(..., min_items=1)
    groups: int = Field(2, ge=2)
    simulations: int = Field(1000, ge=100, le=10000)

class PowerResult(BaseModel):
    """Schema for a single power calculation result"""
    sample_size: int
    power: float

class PowerCurvePoint(BaseModel):
    """Schema for a point on the power curve"""
    sample_size: int
    power: float

class PowerResponse(BaseModel):
    """Schema for power calculation response"""
    results: List[PowerResult]
    power_curve: List[PowerCurvePoint]
    explanation: str
