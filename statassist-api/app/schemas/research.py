from pydantic import BaseModel, Field
from typing import Optional, Dict, Any


class PICOTRequest(BaseModel):
    """Request schema for refining a research question into PICOT."""

    question: str = Field(..., description="Initial research question")
    additional_details: Optional[str] = Field(
        None, description="Any extra context or notes from the user"
    )


class PICOTResponse(BaseModel):
    """Response schema containing PICOT components."""

    population: str
    intervention: str
    comparator: str
    outcome: str
    timeframe: Optional[str] = None
    clarification_needed: bool = False


class TIRRequest(BaseModel):
    """Request schema for generating a statistical plan from a PICOT question."""

    picot: Dict[str, Any]


class TIRResponse(BaseModel):
    """Response containing the text-based plan from the language model."""

    analysis_plan: str
