import enum

class UserRole(str, enum.Enum):
    STUDENT = "student"
    TEACHER = "teacher"
    PRINCIPAL = "principal"
    DEVELOPER = "developer"

class ResourceType(str, enum.Enum):
    TEXT = "text"
    VIDEO = "video"
    AUDIO = "audio"
    PDF = "pdf"
    LINK = "link"

class ProgressStatus(str, enum.Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"

class TaskStatus(str, enum.Enum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    DONE = "done" 