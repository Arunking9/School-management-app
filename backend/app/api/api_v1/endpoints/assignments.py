from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.models.academic import Assignment
from app.schemas.academic import AssignmentCreate, AssignmentUpdate, Assignment as AssignmentResponse

router = APIRouter()

@router.get("/", response_model=List[AssignmentResponse])
def read_assignments(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve assignments.
    """
    assignments = db.query(Assignment).offset(skip).limit(limit).all()
    return assignments

@router.post("/", response_model=AssignmentResponse)
def create_assignment(
    *,
    db: Session = Depends(deps.get_db),
    assignment_in: AssignmentCreate,
) -> Any:
    """
    Create new assignment.
    """
    assignment = Assignment(**assignment_in.model_dump())
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return assignment

@router.get("/{assignment_id}", response_model=AssignmentResponse)
def read_assignment(
    assignment_id: int,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get a specific assignment by id.
    """
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found",
        )
    return assignment 