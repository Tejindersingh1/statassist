from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional

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
