from app.crud.crud_user import user
from app.crud.crud_content import subject, chapter, resource
from app.crud.crud_academic import student_progress, assignment, task

# Export all CRUD operations
__all__ = [
    "user",
    "subject",
    "chapter",
    "resource",
    "student_progress",
    "assignment",
    "task"
] 