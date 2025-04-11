from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.models.content import Chapter
from app.schemas.content import ChapterCreate, ChapterUpdate, Chapter as ChapterResponse

router = APIRouter()

@router.get("/", response_model=List[ChapterResponse])
def read_chapters(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve chapters.
    """
    chapters = db.query(Chapter).offset(skip).limit(limit).all()
    return chapters

@router.post("/", response_model=ChapterResponse)
def create_chapter(
    *,
    db: Session = Depends(deps.get_db),
    chapter_in: ChapterCreate,
) -> Any:
    """
    Create new chapter.
    """
    chapter = Chapter(**chapter_in.model_dump())
    db.add(chapter)
    db.commit()
    db.refresh(chapter)
    return chapter

@router.get("/{chapter_id}", response_model=ChapterResponse)
def read_chapter(
    chapter_id: int,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get a specific chapter by id.
    """
    chapter = db.query(Chapter).filter(Chapter.id == chapter_id).first()
    if not chapter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chapter not found",
        )
    return chapter 