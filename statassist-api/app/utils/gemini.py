import os
import logging
from typing import Any, Dict

try:
    import google.generativeai as genai
except ImportError:  # pragma: no cover - optional dependency
    genai = None

logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash-latest")


def call_gemini(prompt: str, **kwargs: Any) -> Dict[str, Any]:
    """Call the Gemini Flash API and return the response.

    This is a thin wrapper so that the rest of the code can rely on a single
    function. If the ``google-generativeai`` package is not installed or the
    API key is missing, a ``RuntimeError`` is raised.
    """
    if genai is None:
        raise RuntimeError("google-generativeai package is not installed")
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY environment variable not set")

    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel(GEMINI_MODEL)
    logger.info("Calling Gemini model %s", GEMINI_MODEL)
    response = model.generate_content(prompt, **kwargs)
    return {"text": response.text}
