from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

class TestRequest(BaseModel):
    """Schema for statistical test recommendation request"""
    design_type: str = Field(..., description="Study design type (RCT, DiagnosticAccuracy, Cohort)")
    primary_outcome: Dict[str, Any] = Field(..., description="Primary outcome details")
    groups: int = Field(2, description="Number of groups in the study")
    paired: Optional[bool] = Field(False, description="Whether the data is paired")

class TestRecommendation(BaseModel):
    """Schema for a single test recommendation"""
    test_name: str
    alternatives: List[str] = []
    conditions: List[str] = []
    confidence: float = Field(..., ge=0, le=1)

class TestResponse(BaseModel):
    """Schema for statistical test recommendation response"""
    recommended_tests: List[TestRecommendation]
    explanation: str

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
    calculation_id: str
    status: str = "completed"
    results: Dict[str, Any] = {
        "results": List[PowerResult],
        "power_curve": List[PowerCurvePoint],
        "explanation": str
    }
