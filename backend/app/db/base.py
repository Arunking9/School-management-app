# Import all the models, so that Base has them before being
# imported by Alembic
from app.db.base_class import Base
from app.models.enums import UserRole, ResourceType, ProgressStatus, TaskStatus
from app.models.user import User, StudentProfile, TeacherProfile, PrincipalProfile, DeveloperProfile
from app.models.content import Subject, Chapter, Resource, Lesson, Quiz, QuizQuestion, QuizResult
from app.models.academic import StudentProgress, Assignment, Task, ClassAssignment

# Define enums
import enum

class ResourceType(str, enum.Enum):
    TEXT = "text"
    VIDEO = "video"
    PDF = "pdf"
    IMAGE = "image"
    LINK = "link"

class ProgressStatus(str, enum.Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"

class TaskStatus(str, enum.Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled" 