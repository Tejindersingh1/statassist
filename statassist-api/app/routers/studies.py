from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.models.user import User
from app.models.study import Study, StudyStatus
from app.schemas.study import StudyCreate, StudyUpdate, StudyResponse, StudyList, ResearchQuestion
from app.routers.auth import get_current_user
import logging

# Configure logging
logger = logging.getLogger(__name__)

# Create router
router = APIRouter(prefix="/api/v1")

@router.post("/studies", response_model=StudyResponse, status_code=status.HTTP_201_CREATED)
async def create_study(
    study: StudyCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """Create a new study"""
    # Create study object
    db_study = Study(
        title=study.title,
        description=study.description,
        design_type=study.design_type,
        status=StudyStatus.DRAFT,
        user_id=current_user.id
    )
    
    # Save to database
    db.add(db_study)
    db.commit()
    db.refresh(db_study)
    
    logger.info(f"Study created: {db_study.id} by user {current_user.id}")
    return db_study

@router.get("/studies", response_model=StudyList)
async def list_studies(
    status: Optional[StudyStatus] = None,
    design_type: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List studies for the current user"""
    # Base query
    query = db.query(Study).filter(Study.user_id == current_user.id)
    
    # Apply filters
    if status:
        query = query.filter(Study.status == status)
    if design_type:
        query = query.filter(Study.design_type == design_type)
    
    # Count total
    total_count = query.count()
    
    # Paginate
    studies = query.order_by(Study.created_at.desc()).offset((page - 1) * limit).limit(limit).all()
    
    # Calculate total pages
    total_pages = (total_count + limit - 1) // limit
    
    return {
        "data": studies,
        "meta": {
            "current_page": page,
            "total_pages": total_pages,
            "total_count": total_count
        }
    }

@router.get("/studies/{study_id}", response_model=StudyResponse)
async def get_study(
    study_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific study by ID"""
    study = db.query(Study).filter(Study.id == study_id).first()
    
    if not study:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Study not found"
        )
    
    # Check ownership
    if study.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this study"
        )
    
    return study

@router.put("/studies/{study_id}", response_model=StudyResponse)
async def update_study(
    study_id: int,
    study_update: StudyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a study"""
    # Get the study
    db_study = db.query(Study).filter(Study.id == study_id).first()
    
    if not db_study:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Study not found"
        )
    
    # Check ownership
    if db_study.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to modify this study"
        )
    
    # Update fields
    update_data = study_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_study, key, value)
    
    # Save changes
    db.commit()
    db.refresh(db_study)
    
    logger.info(f"Study updated: {db_study.id} by user {current_user.id}")
    return db_study

@router.delete("/studies/{study_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_study(
    study_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a study"""
    # Get the study
    db_study = db.query(Study).filter(Study.id == study_id).first()
    
    if not db_study:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Study not found"
        )
    
    # Check ownership
    if db_study.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this study"
        )
    
    # Delete the study
    db.delete(db_study)
    db.commit()
    
    logger.info(f"Study deleted: {study_id} by user {current_user.id}")
    return None

@router.post("/studies/{study_id}/research-question", response_model=StudyResponse)
async def update_research_question(
    study_id: int,
    research_question: ResearchQuestion,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update the research question for a study"""
    # Get the study
    db_study = db.query(Study).filter(Study.id == study_id).first()
    
    if not db_study:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Study not found"
        )
    
    # Check ownership
    if db_study.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to modify this study"
        )
    
    # Update research question
    db_study.research_question = research_question.dict(exclude_unset=True)
    
    # Save changes
    db.commit()
    db.refresh(db_study)
    
    logger.info(f"Research question updated for study: {db_study.id} by user {current_user.id}")
    return db_study
