from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import Dict, Any
from app.db.database import get_db
from app.models.user import User
from app.schemas.statistical import TestRequest, TestResponse, PowerRequest, PowerResponse
from app.routers.auth import get_current_user
import logging
import uuid
import httpx
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logger = logging.getLogger(__name__)

# Power simulation service URL
POWERSIM_SERVICE_URL = os.getenv("POWERSIM_SERVICE_URL", "http://localhost:8001")

# Create router
router = APIRouter(prefix="/api/v1/statistical")

@router.post("/tests/recommend", response_model=TestResponse)
async def recommend_test(
    request: TestRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Recommend statistical tests based on study design and variables"""
    try:
        # Call the powersim service
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{POWERSIM_SERVICE_URL}/api/recommender/tests",
                json=request.dict()
            )
            
            if response.status_code != 200:
                logger.error(f"Error from powersim service: {response.text}")
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Error getting test recommendations"
                )
            
            return response.json()
    except httpx.RequestError as e:
        logger.error(f"Error connecting to powersim service: {e}")
        # Fallback to local implementation if service is unavailable
        return fallback_test_recommendation(request)

@router.post("/power/calculate", response_model=PowerResponse)
async def calculate_power(
    request: PowerRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Calculate statistical power for a given test and parameters"""
    calculation_id = str(uuid.uuid4())
    
    try:
        # For small calculations, do it synchronously
        if len(request.sample_sizes) <= 3 and request.simulations <= 1000:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{POWERSIM_SERVICE_URL}/api/power/calculate",
                    json=request.dict()
                )
                
                if response.status_code != 200:
                    logger.error(f"Error from powersim service: {response.text}")
                    raise HTTPException(
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        detail="Error calculating power"
                    )
                
                result = response.json()
                return {
                    "calculation_id": calculation_id,
                    "status": "completed",
                    "results": result
                }
        else:
            # For larger calculations, do it asynchronously
            background_tasks.add_task(
                run_power_calculation_async,
                calculation_id,
                request.dict()
            )
            
            return {
                "calculation_id": calculation_id,
                "status": "processing",
                "results": None
            }
    except httpx.RequestError as e:
        logger.error(f"Error connecting to powersim service: {e}")
        # Fallback to local implementation if service is unavailable
        return fallback_power_calculation(request, calculation_id)

@router.get("/power/status/{calculation_id}", response_model=PowerResponse)
async def get_power_calculation_status(
    calculation_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get the status of an asynchronous power calculation"""
    # In a real implementation, this would check a database or cache
    # For this example, we'll just return a mock response
    return {
        "calculation_id": calculation_id,
        "status": "completed",
        "results": {
            "results": [
                {"sample_size": 30, "power": 0.47},
                {"sample_size": 60, "power": 0.77},
                {"sample_size": 90, "power": 0.92}
            ],
            "power_curve": [
                {"sample_size": 10, "power": 0.18},
                {"sample_size": 20, "power": 0.33},
                {"sample_size": 30, "power": 0.47},
                {"sample_size": 40, "power": 0.59},
                {"sample_size": 50, "power": 0.69},
                {"sample_size": 60, "power": 0.77},
                {"sample_size": 70, "power": 0.84},
                {"sample_size": 80, "power": 0.88},
                {"sample_size": 90, "power": 0.92}
            ],
            "explanation": "With an effect size of 0.5, significance level of 0.05, and two groups, you would need approximately 64 participants per group to achieve 80% power."
        }
    }

# Helper functions

async def run_power_calculation_async(calculation_id: str, request_data: Dict[str, Any]):
    """Run a power calculation asynchronously"""
    try:
        async with httpx.AsyncClient() as client:
            await client.post(
                f"{POWERSIM_SERVICE_URL}/api/power/calculate",
                json=request_data
            )
    except Exception as e:
        logger.error(f"Error in async power calculation: {e}")

def fallback_test_recommendation(request: TestRequest) -> TestResponse:
    """Fallback implementation for test recommendations when service is unavailable"""
    if request.design_type == "RCT":
        if request.primary_outcome.get("type") == "Continuous":
            if request.paired:
                return TestResponse(
                    recommended_tests=[
                        {
                            "test_name": "Paired t-test",
                            "alternatives": ["Wilcoxon signed-rank test"],
                            "conditions": ["Normally distributed differences"],
                            "confidence": 0.9
                        }
                    ],
                    explanation="For a paired RCT with a continuous outcome, a paired t-test is recommended if the differences are normally distributed. Otherwise, consider a Wilcoxon signed-rank test."
                )
            else:
                return TestResponse(
                    recommended_tests=[
                        {
                            "test_name": "Independent t-test",
                            "alternatives": ["Mann-Whitney U test"],
                            "conditions": ["Normally distributed data in each group"],
                            "confidence": 0.9
                        }
                    ],
                    explanation="For an RCT with a continuous outcome and independent groups, an independent t-test is recommended if the data in each group is normally distributed. Otherwise, consider a Mann-Whitney U test."
                )
        elif request.primary_outcome.get("type") == "Binary":
            return TestResponse(
                recommended_tests=[
                    {
                        "test_name": "Chi-square test",
                        "alternatives": ["Fisher's exact test"],
                        "conditions": ["Expected cell counts ≥ 5"],
                        "confidence": 0.9
                    }
                ],
                explanation="For an RCT with a binary outcome, a Chi-square test is recommended if all expected cell counts are at least 5. For smaller sample sizes, use Fisher's exact test."
            )
    
    # Default fallback
    return TestResponse(
        recommended_tests=[
            {
                "test_name": "Consult statistician",
                "alternatives": [],
                "conditions": ["Complex study design"],
                "confidence": 0.5
            }
        ],
        explanation="Your study design is complex or unusual. We recommend consulting with a statistician for appropriate test selection."
    )

def fallback_power_calculation(request: PowerRequest, calculation_id: str) -> PowerResponse:
    """Fallback implementation for power calculations when service is unavailable"""
    # Very simple power calculation for t-test (not accurate, just for demonstration)
    if request.test_type == "Independent t-test":
        results = []
        power_curve = []
        
        for n in range(10, 121, 10):
            # Simplified power calculation formula (not accurate)
            power = 1 - 2.71**(-request.effect_size * (n**0.5) / 4)
            power = max(0, min(1, power))  # Clamp between 0 and 1
            power_curve.append({"sample_size": n, "power": round(power, 2)})
        
        for n in request.sample_sizes:
            power = 1 - 2.71**(-request.effect_size * (n**0.5) / 4)
            power = max(0, min(1, power))  # Clamp between 0 and 1
            results.append({"sample_size": n, "power": round(power, 2)})
        
        return {
            "calculation_id": calculation_id,
            "status": "completed",
            "results": {
                "results": results,
                "power_curve": power_curve,
                "explanation": f"With an effect size of {request.effect_size}, significance level of {request.alpha}, and {request.groups} groups, these are the estimated power values for your specified sample sizes. Note: This is a simplified calculation as the service is currently unavailable."
            }
        }
    
    # Default fallback
    return {
        "calculation_id": calculation_id,
        "status": "error",
        "results": {
            "error": "Power calculation service is unavailable and no fallback is available for this test type."
        }
    }
