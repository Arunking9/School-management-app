from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime

# Subject schemas
class SubjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    grade_level: int

class SubjectCreate(SubjectBase):
    pass

class SubjectUpdate(SubjectBase):
    pass

class SubjectResponse(SubjectBase):
    id: int

    class Config:
        from_attributes = True

# Chapter schemas
class ChapterBase(BaseModel):
    title: str
    description: Optional[str] = None
    order: int
    subject_id: int

class ChapterCreate(ChapterBase):
    pass

class ChapterUpdate(ChapterBase):
    pass

class ChapterResponse(ChapterBase):
    id: int

    class Config:
        from_attributes = True

# Resource schemas
class ResourceBase(BaseModel):
    title: str
    description: Optional[str] = None
    resource_type: str
    url: str
    chapter_id: int

class ResourceCreate(ResourceBase):
    pass

class ResourceUpdate(ResourceBase):
    pass

class ResourceResponse(ResourceBase):
    id: int

    class Config:
        from_attributes = True

# Lesson schemas
class LessonBase(BaseModel):
    title: str
    content: str
    chapter_id: int

class LessonCreate(LessonBase):
    pass

class LessonUpdate(LessonBase):
    pass

class LessonResponse(LessonBase):
    id: int

    class Config:
        from_attributes = True

# Assignment schemas
class AssignmentBase(BaseModel):
    title: str
    description: str
    due_date: str
    lesson_id: int

class AssignmentCreate(AssignmentBase):
    pass

class AssignmentUpdate(AssignmentBase):
    pass

class Assignment(AssignmentBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Task schemas
class TaskBase(BaseModel):
    title: str
    description: str
    due_date: str
    assignment_id: int

class TaskCreate(TaskBase):
    pass

class TaskUpdate(TaskBase):
    pass

class Task(TaskBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Quiz schemas
class QuizBase(BaseModel):
    title: str
    description: str
    lesson_id: int

class QuizCreate(QuizBase):
    pass

class QuizUpdate(QuizBase):
    pass

class QuizResponse(QuizBase):
    id: int

    class Config:
        from_attributes = True

# Student Progress schemas
class StudentProgressBase(BaseModel):
    student_id: int
    chapter_id: int
    status: str
    completion_percentage: float = 0.0
    last_accessed: Optional[datetime] = None
    completed_at: Optional[datetime] = None

class StudentProgressCreate(StudentProgressBase):
    pass

class StudentProgressUpdate(StudentProgressBase):
    pass

class StudentProgress(StudentProgressBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Class Assignment schemas
class ClassAssignmentBase(BaseModel):
    teacher_id: int
    subject_id: int
    grade: int
    section: str

class ClassAssignmentCreate(ClassAssignmentBase):
    pass

class ClassAssignmentUpdate(ClassAssignmentBase):
    pass

class ClassAssignment(ClassAssignmentBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True 