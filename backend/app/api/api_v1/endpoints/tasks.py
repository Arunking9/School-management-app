from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.api import deps
from app.models.academic import Task
from app.schemas.academic import TaskCreate, TaskUpdate, Task as TaskResponse

router = APIRouter()

@router.get("/", response_model=List[TaskResponse])
def read_tasks(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve tasks.
    """
    tasks = db.query(Task).offset(skip).limit(limit).all()
    return tasks

@router.post("/", response_model=TaskResponse)
def create_task(
    *,
    db: Session = Depends(deps.get_db),
    task_in: TaskCreate,
) -> Any:
    """
    Create new task.
    """
    task = Task(**task_in.model_dump())
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@router.get("/{task_id}", response_model=TaskResponse)
def read_task(
    task_id: int,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get a specific task by id.
    """
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    return task

@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    *,
    db: Session = Depends(deps.get_db),
    task_id: int,
    task_in: TaskUpdate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update a task.
    """
    task = crud.task.get(db, id=task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    if not crud.user.is_principal(current_user) and not crud.user.is_teacher(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    task = crud.task.update(db, db_obj=task, obj_in=task_in)
    return task

@router.delete("/{task_id}", response_model=TaskResponse)
def delete_task(
    *,
    db: Session = Depends(deps.get_db),
    task_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Delete a task.
    """
    task = crud.task.get(db, id=task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    if not crud.user.is_principal(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    task = crud.task.remove(db, id=task_id)
    return task 