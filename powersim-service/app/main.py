from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import logging
from app.schemas.recommender import TestRequest, TestResponse
from app.schemas.power import PowerRequest, PowerResponse
from app.core.recommender import TestRecommender
from app.core.power_sim import PowerSimulator

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Initialize services
test_recommender = TestRecommender()
power_simulator = PowerSimulator()

# Initialize FastAPI app
app = FastAPI(
    title="PowerSim Service",
    description="Statistical test recommendation and power simulation service for Stat-Assist",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, this should be restricted to specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["Health"])
async def root():
    """Health check endpoint"""
    return {"status": "healthy", "message": "PowerSim Service is running"}

@app.post("/api/recommender/tests", response_model=TestResponse, tags=["Recommender"])
async def recommend_test(request: TestRequest):
    """Recommend statistical tests based on study design and variables"""
    try:
        return test_recommender.recommend_test(request)
    except Exception as e:
        logger.error(f"Error recommending test: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/power/calculate", response_model=PowerResponse, tags=["Power"])
async def calculate_power(request: PowerRequest):
    """Calculate statistical power for a given test and parameters"""
    try:
        return power_simulator.calculate_power(
            test_type=request.test_type,
            effect_size=request.effect_size,
            alpha=request.alpha,
            sample_sizes=request.sample_sizes,
            groups=request.groups,
            simulations=request.simulations
        )
    except Exception as e:
        logger.error(f"Error calculating power: {e}")
        raise HTTPException(status_code=500, detail=str(e))
