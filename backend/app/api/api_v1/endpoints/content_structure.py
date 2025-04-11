from typing import Any, List, Dict
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.models.content import Subject, Chapter, Resource, Lesson
from app.schemas.content import (
    Subject as SubjectResponse, 
    Chapter as ChapterResponse,
    SubjectWithChaptersCreate
)

router = APIRouter()

@router.get("/subjects-with-chapters", response_model=List[Dict[str, Any]])
def get_subjects_with_chapters(
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get a hierarchical view of all subjects with their chapters, including IDs.
    This makes it easier to see the content structure and reference specific items.
    """
    subjects = db.query(Subject).all()
    
    result = []
    for subject in subjects:
        chapters = db.query(Chapter).filter(Chapter.subject_id == subject.id).order_by(Chapter.order).all()
        
        chapter_list = []
        for chapter in chapters:
            chapter_info = {
                "id": chapter.id,
                "title": chapter.title,
                "description": chapter.description,
                "order": chapter.order
            }
            chapter_list.append(chapter_info)
        
        subject_info = {
            "id": subject.id,
            "name": subject.name,
            "description": subject.description,
            "grade_level": subject.grade_level,
            "chapters": chapter_list
        }
        result.append(subject_info)
    
    return result

@router.get("/subjects/{subject_id}/full-structure", response_model=Dict[str, Any])
def get_subject_full_structure(
    subject_id: int,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get a complete structure of a subject including all chapters, resources, and lessons.
    """
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subject not found",
        )
    
    chapters = db.query(Chapter).filter(Chapter.subject_id == subject_id).order_by(Chapter.order).all()
    
    chapter_list = []
    for chapter in chapters:
        # Get resources for this chapter
        resources = db.query(Resource).filter(Resource.chapter_id == chapter.id).all()
        resource_list = []
        for resource in resources:
            resource_info = {
                "id": resource.id,
                "title": resource.title,
                "description": resource.description,
                "resource_type": resource.resource_type
            }
            resource_list.append(resource_info)
        
        # Get lessons for this chapter
        lessons = db.query(Lesson).filter(Lesson.chapter_id == chapter.id).order_by(Lesson.order).all()
        lesson_list = []
        for lesson in lessons:
            lesson_info = {
                "id": lesson.id,
                "title": lesson.title,
                "description": lesson.description,
                "order": lesson.order
            }
            lesson_list.append(lesson_info)
        
        chapter_info = {
            "id": chapter.id,
            "title": chapter.title,
            "description": chapter.description,
            "order": chapter.order,
            "resources": resource_list,
            "lessons": lesson_list
        }
        chapter_list.append(chapter_info)
    
    result = {
        "id": subject.id,
        "name": subject.name,
        "description": subject.description,
        "grade_level": subject.grade_level,
        "chapters": chapter_list
    }
    
    return result

@router.post("/subjects-with-chapters", response_model=Dict[str, Any])
def create_subject_with_chapters(
    *,
    db: Session = Depends(deps.get_db),
    subject_in: SubjectWithChaptersCreate,
) -> Any:
    """
    Create a new subject with multiple chapters in a single request.
    This makes it easier to set up the content structure.
    """
    # Create the subject
    subject = Subject(
        name=subject_in.name,
        description=subject_in.description,
        grade_level=subject_in.grade_level
    )
    db.add(subject)
    db.flush()  # This will assign an ID to the subject without committing
    
    # Create the chapters
    chapters = []
    for chapter_data in subject_in.chapters:
        chapter = Chapter(
            title=chapter_data.title,
            description=chapter_data.description,
            order=chapter_data.order,
            subject_id=subject.id
        )
        db.add(chapter)
        chapters.append(chapter)
    
    db.commit()
    db.refresh(subject)
    
    # Prepare the response
    chapter_list = []
    for chapter in chapters:
        chapter_info = {
            "id": chapter.id,
            "title": chapter.title,
            "description": chapter.description,
            "order": chapter.order
        }
        chapter_list.append(chapter_info)
    
    result = {
        "id": subject.id,
        "name": subject.name,
        "description": subject.description,
        "grade_level": subject.grade_level,
        "chapters": chapter_list
    }
    
    return result 