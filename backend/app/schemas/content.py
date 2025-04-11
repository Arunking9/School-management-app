from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime

# Subject schemas
class SubjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    grade_level: str

class SubjectCreate(SubjectBase):
    pass

class SubjectUpdate(SubjectBase):
    pass

class Subject(SubjectBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Chapter schemas
class ChapterBase(BaseModel):
    title: str
    description: Optional[str] = None
    subject_id: int
    order: int

class ChapterCreate(ChapterBase):
    pass

class ChapterUpdate(ChapterBase):
    pass

class Chapter(ChapterBase):
    id: int
    created_at: datetime
    updated_at: datetime
    resources: List["Resource"] = []

    class Config:
        from_attributes = True

# Resource schemas
class ResourceBase(BaseModel):
    title: str
    description: Optional[str] = None
    chapter_id: int
    resource_type: str
    content: Optional[str] = None
    file_url: Optional[str] = None

class ResourceCreate(ResourceBase):
    pass

class ResourceUpdate(ResourceBase):
    pass

class Resource(ResourceBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Lesson schemas
class LessonBase(BaseModel):
    title: str
    description: Optional[str] = None
    chapter_id: int
    content: str
    order: int

class LessonCreate(LessonBase):
    pass

class LessonUpdate(LessonBase):
    pass

class Lesson(LessonBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Quiz schemas
class QuizBase(BaseModel):
    title: str
    description: Optional[str] = None
    chapter_id: int
    created_by: int
    is_published: bool = False
    time_limit: Optional[int] = None

class QuizCreate(QuizBase):
    pass

class QuizUpdate(QuizBase):
    pass

class Quiz(QuizBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# User-friendly schemas for creating subjects with chapters
class ChapterCreateWithoutSubject(BaseModel):
    title: str
    description: Optional[str] = None
    order: int

class SubjectWithChaptersCreate(BaseModel):
    name: str
    description: Optional[str] = None
    grade_level: str
    chapters: List[ChapterCreateWithoutSubject] = []

# Update forward references
Chapter.model_rebuild()

# Student view schemas
class ChapterWithResources(Chapter):
    resources: List[Resource]

    class Config:
        from_attributes = True 