from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.models.user import User
from app.models.study import Study
from app.models.variable import Variable
from app.schemas.variable import VariableCreate, VariableUpdate, VariableResponse, VariableList
from app.routers.auth import get_current_user
import logging

# Configure logging
logger = logging.getLogger(__name__)

# Create router
router = APIRouter(prefix="/api/v1")

@router.post("/studies/{study_id}/variables", response_model=VariableResponse, status_code=status.HTTP_201_CREATED)
async def create_variable(
    study_id: int,
    variable: VariableCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new variable for a study"""
    # Check if study exists and user has access
    study = db.query(Study).filter(Study.id == study_id).first()
    if not study:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Study not found"
        )
    
    if study.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to modify this study"
        )
    
    # Create variable
    db_variable = Variable(
        name=variable.name,
        type=variable.type,
        role=variable.role,
        constraints=variable.constraints,
        study_id=study_id
    )
    
    # Save to database
    db.add(db_variable)
    db.commit()
    db.refresh(db_variable)
    
    logger.info(f"Variable created: {db_variable.id} for study {study_id} by user {current_user.id}")
    return db_variable

@router.get("/studies/{study_id}/variables", response_model=VariableList)
async def list_variables(
    study_id: int,
    role: Optional[str] = None,
    type: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List variables for a study"""
    # Check if study exists and user has access
    study = db.query(Study).filter(Study.id == study_id).first()
    if not study:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Study not found"
        )
    
    if study.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this study"
        )
    
    # Base query
    query = db.query(Variable).filter(Variable.study_id == study_id)
    
    # Apply filters
    if role:
        query = query.filter(Variable.role == role)
    if type:
        query = query.filter(Variable.type == type)
    
    # Count total
    total_count = query.count()
    
    # Paginate
    variables = query.order_by(Variable.created_at.desc()).offset((page - 1) * limit).limit(limit).all()
    
    # Calculate total pages
    total_pages = (total_count + limit - 1) // limit
    
    return {
        "data": variables,
        "meta": {
            "current_page": page,
            "total_pages": total_pages,
            "total_count": total_count
        }
    }

@router.get("/studies/{study_id}/variables/{variable_id}", response_model=VariableResponse)
async def get_variable(
    study_id: int,
    variable_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific variable by ID"""
    # Check if study exists and user has access
    study = db.query(Study).filter(Study.id == study_id).first()
    if not study:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Study not found"
        )
    
    if study.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this study"
        )
    
    # Get variable
    variable = db.query(Variable).filter(Variable.id == variable_id, Variable.study_id == study_id).first()
    if not variable:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Variable not found"
        )
    
    return variable

@router.put("/studies/{study_id}/variables/{variable_id}", response_model=VariableResponse)
async def update_variable(
    study_id: int,
    variable_id: int,
    variable_update: VariableUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a variable"""
    # Check if study exists and user has access
    study = db.query(Study).filter(Study.id == study_id).first()
    if not study:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Study not found"
        )
    
    if study.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to modify this study"
        )
    
    # Get variable
    db_variable = db.query(Variable).filter(Variable.id == variable_id, Variable.study_id == study_id).first()
    if not db_variable:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Variable not found"
        )
    
    # Update fields
    update_data = variable_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_variable, key, value)
    
    # Save changes
    db.commit()
    db.refresh(db_variable)
    
    logger.info(f"Variable updated: {db_variable.id} for study {study_id} by user {current_user.id}")
    return db_variable

@router.delete("/studies/{study_id}/variables/{variable_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_variable(
    study_id: int,
    variable_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a variable"""
    # Check if study exists and user has access
    study = db.query(Study).filter(Study.id == study_id).first()
    if not study:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Study not found"
        )
    
    if study.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to modify this study"
        )
    
    # Get variable
    db_variable = db.query(Variable).filter(Variable.id == variable_id, Variable.study_id == study_id).first()
    if not db_variable:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Variable not found"
        )
    
    # Delete the variable
    db.delete(db_variable)
    db.commit()
    
    logger.info(f"Variable deleted: {variable_id} for study {study_id} by user {current_user.id}")
    return None
