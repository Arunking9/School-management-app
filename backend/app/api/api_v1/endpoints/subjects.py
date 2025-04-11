from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.models.content import Subject
from app.schemas.content import SubjectCreate, SubjectUpdate, Subject as SubjectResponse

router = APIRouter()

@router.get("/", response_model=List[SubjectResponse])
def read_subjects(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve subjects.
    """
    subjects = db.query(Subject).offset(skip).limit(limit).all()
    return subjects

@router.post("/", response_model=SubjectResponse)
def create_subject(
    *,
    db: Session = Depends(deps.get_db),
    subject_in: SubjectCreate,
) -> Any:
    """
    Create new subject.
    """
    subject = Subject(**subject_in.model_dump())
    db.add(subject)
    db.commit()
    db.refresh(subject)
    return subject

@router.get("/{subject_id}", response_model=SubjectResponse)
def read_subject(
    subject_id: int,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get a specific subject by id.
    """
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subject not found",
        )
    return subject 