from datetime import datetime
from sqlalchemy import Column, String, Text, Integer, DateTime, ForeignKey, Enum, Boolean, Float
from sqlalchemy.orm import relationship
from app.models.base_model import *
from app.models.enums import ResourceType

class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    grade_level = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    chapters = relationship("Chapter", back_populates="subject", cascade="all, delete-orphan")
    assignments = relationship("Assignment", back_populates="subject")

class Chapter(Base):
    __tablename__ = "chapters"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)
    order = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    subject = relationship("Subject", back_populates="chapters")
    resources = relationship("Resource", back_populates="chapter", cascade="all, delete-orphan")
    lessons = relationship("Lesson", back_populates="chapter", cascade="all, delete-orphan")
    student_progress = relationship("StudentProgress", back_populates="chapter")
    assignments = relationship("Assignment", back_populates="chapter")

class Resource(Base):
    __tablename__ = "resources"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    chapter_id = Column(Integer, ForeignKey("chapters.id"), nullable=False)
    resource_type = Column(Enum(ResourceType), nullable=False)
    content = Column(Text)  # For text-based content
    file_url = Column(String)  # For uploaded files or external links
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    chapter = relationship("Chapter", back_populates="resources")

class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    chapter_id = Column(Integer, ForeignKey("chapters.id"), nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    is_published = Column(Boolean, default=False)
    time_limit = Column(Integer)  # in minutes
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    chapter = relationship("Chapter")
    creator = relationship("User", foreign_keys=[created_by])
    questions = relationship("QuizQuestion", back_populates="quiz", cascade="all, delete-orphan")
    results = relationship("QuizResult", back_populates="quiz")

class QuizQuestion(Base):
    __tablename__ = "quiz_questions"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=False)
    question_text = Column(Text, nullable=False)
    correct_answer = Column(String, nullable=False)
    options = Column(Text, nullable=False)  # JSON string of options
    points = Column(Integer, default=1)
    order = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    quiz = relationship("Quiz", back_populates="questions")

class QuizResult(Base):
    __tablename__ = "quiz_results"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    score = Column(Float, nullable=False)
    max_score = Column(Float, nullable=False)
    completed_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    quiz = relationship("Quiz", back_populates="results")
    student = relationship("User", foreign_keys=[student_id])

class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    order = Column(Integer, nullable=False)
    chapter_id = Column(Integer, ForeignKey("chapters.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    chapter = relationship("Chapter", back_populates="lessons") 