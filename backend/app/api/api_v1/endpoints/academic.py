from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.api import deps

router = APIRouter()

# Subject endpoints
@router.get("/subjects", response_model=List[schemas.Subject])
def read_subjects(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve subjects.
    """
    subjects = crud.subject.get_multi(db, skip=skip, limit=limit)
    return subjects

@router.get("/subjects/{grade}", response_model=List[schemas.Subject])
def read_subjects_by_grade(
    grade: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get subjects by grade level.
    """
    subjects = crud.subject.get_by_grade(db, grade=grade)
    return subjects

# Chapter endpoints
@router.get("/chapters/{subject_id}", response_model=List[schemas.Chapter])
def read_chapters_by_subject(
    subject_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get chapters by subject.
    """
    chapters = crud.chapter.get_by_subject(db, subject_id=subject_id)
    return chapters

# Resource endpoints
@router.get("/resources/{chapter_id}", response_model=List[schemas.Resource])
def read_resources_by_chapter(
    chapter_id: int,
    resource_type: str = None,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get resources by chapter, optionally filtered by type.
    """
    if resource_type:
        resources = crud.resource.get_by_type(db, chapter_id=chapter_id, resource_type=resource_type)
    else:
        resources = crud.resource.get_by_chapter(db, chapter_id=chapter_id)
    return resources

# Student Progress endpoints
@router.get("/progress/student/{student_id}", response_model=List[schemas.StudentProgress])
def read_student_progress(
    student_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get student progress for all chapters.
    """
    if not crud.user.is_teacher(current_user) and not crud.user.is_principal(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    progress = crud.student_progress.get_by_student(db, student_id=student_id)
    return progress

@router.post("/progress/update", response_model=schemas.StudentProgress)
def update_student_progress(
    *,
    db: Session = Depends(deps.get_db),
    progress_in: schemas.StudentProgressCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update student progress for a chapter.
    """
    if not crud.user.is_student(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    progress = crud.student_progress.update_progress(
        db,
        student_id=progress_in.student_id,
        chapter_id=progress_in.chapter_id,
        completion_percentage=progress_in.completion_percentage
    )
    return progress

# Assignment endpoints
@router.get("/assignments/student/{student_id}", response_model=List[schemas.Assignment])
def read_student_assignments(
    student_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get assignments for a student.
    """
    if not crud.user.is_teacher(current_user) and not crud.user.is_principal(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    assignments = crud.assignment.get_by_student(db, student_id=student_id)
    return assignments

@router.get("/assignments/teacher/{teacher_id}", response_model=List[schemas.Assignment])
def read_teacher_assignments(
    teacher_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get assignments created by a teacher.
    """
    if not crud.user.is_teacher(current_user) and not crud.user.is_principal(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    assignments = crud.assignment.get_by_teacher(db, teacher_id=teacher_id)
    return assignments

# Task endpoints
@router.get("/tasks/teacher/{teacher_id}", response_model=List[schemas.Task])
def read_teacher_tasks(
    teacher_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get tasks assigned to a teacher.
    """
    if not crud.user.is_principal(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    tasks = crud.task.get_by_teacher(db, teacher_id=teacher_id)
    return tasks

@router.post("/tasks/update-status/{task_id}", response_model=schemas.Task)
def update_task_status(
    task_id: int,
    status: str,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update task status.
    """
    if not crud.user.is_teacher(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    task = crud.task.update_status(db, task_id=task_id, status=status)
    return task 