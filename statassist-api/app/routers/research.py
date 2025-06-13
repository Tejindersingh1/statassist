from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
import logging

from app.db.database import get_db
from app.routers.auth import get_current_user
from app.models.user import User
from app.schemas.research import (
    PICOTRequest,
    PICOTResponse,
    TIRRequest,
    TIRResponse,
)
from app.utils.gemini import call_gemini

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/research")


@router.post("/picot", response_model=PICOTResponse)
async def refine_to_picot(
    request: PICOTRequest,
    db: Session = Depends(get_db),  # noqa: F401 - future use
    current_user: User = Depends(get_current_user),
):
    """Refine an arbitrary research question into PICOT components using Gemini."""
    prompt = (
        "Convert the following clinical research question into PICOT format. "
        "Respond in JSON with keys population, intervention, comparator, outcome, "
        "and timeframe if available. If any component is missing, set clarification_needed to true "
        "and provide best guess values. Question: "
        f"{request.question}\nAdditional context: {request.additional_details}"
    )
    try:
        response = call_gemini(prompt)
        # The service is expected to return JSON in the text field
        data = response.get("text", "{}")
        picot_data = PICOTResponse.model_validate_json(data)
    except Exception as exc:  # pragma: no cover - external call
        logger.error("Gemini API error: %s", exc)
        raise HTTPException(status_code=500, detail="LLM processing failed")
    return picot_data


@router.post("/tir", response_model=TIRResponse)
async def generate_tir(
    request: TIRRequest,
    db: Session = Depends(get_db),  # noqa: F401 - future use
    current_user: User = Depends(get_current_user),
):
    """Generate a text-based statistical plan using the refined PICOT question."""
    prompt = (
        "Using the following PICOT formatted question, outline the recommended "
        "statistical tests, sample size considerations and interpretation steps.\n"
        f"PICOT: {request.picot}"
    )
    try:
        response = call_gemini(prompt)
        text = response.get("text", "")
    except Exception as exc:  # pragma: no cover - external call
        logger.error("Gemini API error: %s", exc)
        raise HTTPException(status_code=500, detail="LLM processing failed")
    return TIRResponse(analysis_plan=text)
