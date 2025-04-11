from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.models.content import Quiz
from app.schemas.content import QuizCreate, QuizUpdate, Quiz as QuizResponse

router = APIRouter()

@router.get("/", response_model=List[QuizResponse])
def read_quizzes(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve quizzes.
    """
    quizzes = db.query(Quiz).offset(skip).limit(limit).all()
    return quizzes

@router.post("/", response_model=QuizResponse)
def create_quiz(
    *,
    db: Session = Depends(deps.get_db),
    quiz_in: QuizCreate,
) -> Any:
    """
    Create new quiz.
    """
    quiz = Quiz(**quiz_in.model_dump())
    db.add(quiz)
    db.commit()
    db.refresh(quiz)
    return quiz

@router.get("/{quiz_id}", response_model=QuizResponse)
def read_quiz(
    quiz_id: int,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get a specific quiz by id.
    """
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz not found",
        )
    return quiz 