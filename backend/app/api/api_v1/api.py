from fastapi import APIRouter
from app.api.api_v1.endpoints import (
    auth,
    users,
    subjects,
    chapters,
    resources,
    lessons,
    assignments,
    tasks,
    quizzes,
    content_structure
)

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(subjects.router, prefix="/subjects", tags=["subjects"])
api_router.include_router(chapters.router, prefix="/chapters", tags=["chapters"])
api_router.include_router(resources.router, prefix="/resources", tags=["resources"])
api_router.include_router(lessons.router, prefix="/lessons", tags=["lessons"])
api_router.include_router(assignments.router, prefix="/assignments", tags=["assignments"])
api_router.include_router(tasks.router, prefix="/tasks", tags=["tasks"])
api_router.include_router(quizzes.router, prefix="/quizzes", tags=["quizzes"])
api_router.include_router(content_structure.router, prefix="/content", tags=["content structure"]) 