from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, studies, variables, statistical
from app.db.database import create_tables
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Stat-Assist API",
    description="API for the Stat-Assist platform for clinical research design and analysis",
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

# Include routers
app.include_router(auth.router, tags=["Authentication"])
app.include_router(studies.router, tags=["Studies"])
app.include_router(variables.router, tags=["Variables"])
app.include_router(statistical.router, tags=["Statistical"])

@app.on_event("startup")
async def startup_event():
    """Create database tables on startup if they don't exist"""
    logger.info("Creating database tables if they don't exist")
    create_tables()

@app.get("/", tags=["Health"])
async def root():
    """Health check endpoint"""
    return {"status": "healthy", "message": "Stat-Assist API is running"}
