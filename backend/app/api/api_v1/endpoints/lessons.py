from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.models.content import Lesson
from app.schemas.content import LessonCreate, LessonUpdate, Lesson as LessonResponse

router = APIRouter()

@router.get("/", response_model=List[LessonResponse])
def read_lessons(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve lessons.
    """
    lessons = db.query(Lesson).offset(skip).limit(limit).all()
    return lessons

@router.post("/", response_model=LessonResponse)
def create_lesson(
    *,
    db: Session = Depends(deps.get_db),
    lesson_in: LessonCreate,
) -> Any:
    """
    Create new lesson.
    """
    lesson = Lesson(**lesson_in.model_dump())
    db.add(lesson)
    db.commit()
    db.refresh(lesson)
    return lesson

@router.get("/{lesson_id}", response_model=LessonResponse)
def read_lesson(
    lesson_id: int,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get a specific lesson by id.
    """
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lesson not found",
        )
    return lesson 