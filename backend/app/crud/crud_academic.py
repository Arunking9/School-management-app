from typing import List, Optional
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.content import Subject, Chapter, Resource
from app.models.academic import StudentProgress, Assignment, Task, ClassAssignment
from app.schemas.academic import (
    SubjectCreate, SubjectUpdate,
    ChapterCreate, ChapterUpdate,
    ResourceCreate, ResourceUpdate,
    StudentProgressCreate, StudentProgressUpdate,
    AssignmentCreate, AssignmentUpdate,
    TaskCreate, TaskUpdate,
    ClassAssignmentCreate, ClassAssignmentUpdate
)

class CRUDSubject(CRUDBase[Subject, SubjectCreate, SubjectUpdate]):
    def get_by_grade(self, db: Session, *, grade: int) -> List[Subject]:
        return db.query(Subject).filter(Subject.grade_level == grade).all()

subject = CRUDSubject(Subject)

class CRUDChapter(CRUDBase[Chapter, ChapterCreate, ChapterUpdate]):
    def get_by_subject(self, db: Session, *, subject_id: int) -> List[Chapter]:
        return db.query(Chapter).filter(Chapter.subject_id == subject_id).order_by(Chapter.order).all()

chapter = CRUDChapter(Chapter)

class CRUDResource(CRUDBase[Resource, ResourceCreate, ResourceUpdate]):
    def get_by_chapter(self, db: Session, *, chapter_id: int) -> List[Resource]:
        return db.query(Resource).filter(Resource.chapter_id == chapter_id).all()

    def get_by_type(self, db: Session, *, chapter_id: int, resource_type: str) -> List[Resource]:
        return db.query(Resource).filter(
            Resource.chapter_id == chapter_id,
            Resource.resource_type == resource_type
        ).all()

resource = CRUDResource(Resource)

class CRUDStudentProgress(CRUDBase[StudentProgress, StudentProgressCreate, StudentProgressUpdate]):
    def get_by_student(self, db: Session, *, student_id: int) -> List[StudentProgress]:
        return db.query(StudentProgress).filter(StudentProgress.student_id == student_id).all()

    def get_by_chapter(self, db: Session, *, chapter_id: int) -> List[StudentProgress]:
        return db.query(StudentProgress).filter(StudentProgress.chapter_id == chapter_id).all()

    def get_student_chapter_progress(
        self, db: Session, *, student_id: int, chapter_id: int
    ) -> Optional[StudentProgress]:
        return db.query(StudentProgress).filter(
            StudentProgress.student_id == student_id,
            StudentProgress.chapter_id == chapter_id
        ).first()

    def update_progress(
        self, db: Session, *, student_id: int, chapter_id: int, completion_percentage: float
    ) -> StudentProgress:
        progress = self.get_student_chapter_progress(db, student_id=student_id, chapter_id=chapter_id)
        if not progress:
            progress = StudentProgress(
                student_id=student_id,
                chapter_id=chapter_id,
                status="in_progress",
                completion_percentage=completion_percentage
            )
            db.add(progress)
        else:
            progress.completion_percentage = completion_percentage
            if completion_percentage >= 100:
                progress.status = "completed"
        
        db.commit()
        db.refresh(progress)
        return progress

student_progress = CRUDStudentProgress(StudentProgress)

class CRUDAssignment(CRUDBase[Assignment, AssignmentCreate, AssignmentUpdate]):
    def get_by_student(self, db: Session, *, student_id: int) -> List[Assignment]:
        return db.query(Assignment).filter(Assignment.student_id == student_id).all()

    def get_by_teacher(self, db: Session, *, teacher_id: int) -> List[Assignment]:
        return db.query(Assignment).filter(Assignment.teacher_id == teacher_id).all()

    def get_by_subject(self, db: Session, *, subject_id: int) -> List[Assignment]:
        return db.query(Assignment).filter(Assignment.subject_id == subject_id).all()

assignment = CRUDAssignment(Assignment)

class CRUDTask(CRUDBase[Task, TaskCreate, TaskUpdate]):
    def get_by_teacher(self, db: Session, *, teacher_id: int) -> List[Task]:
        return db.query(Task).filter(Task.assigned_to_id == teacher_id).all()

    def get_by_principal(self, db: Session, *, principal_id: int) -> List[Task]:
        return db.query(Task).filter(Task.assigned_by_id == principal_id).all()

    def update_status(self, db: Session, *, task_id: int, status: str) -> Task:
        task = self.get(db, id=task_id)
        if task:
            task.status = status
            db.commit()
            db.refresh(task)
        return task

task = CRUDTask(Task)

class CRUDClassAssignment(CRUDBase[ClassAssignment, ClassAssignmentCreate, ClassAssignmentUpdate]):
    def get_by_teacher(self, db: Session, *, teacher_id: int) -> List[ClassAssignment]:
        return db.query(ClassAssignment).filter(ClassAssignment.teacher_id == teacher_id).all()

    def get_by_subject(self, db: Session, *, subject_id: int) -> List[ClassAssignment]:
        return db.query(ClassAssignment).filter(ClassAssignment.subject_id == subject_id).all()

    def get_by_grade_section(
        self, db: Session, *, grade: int, section: str
    ) -> List[ClassAssignment]:
        return db.query(ClassAssignment).filter(
            ClassAssignment.grade == grade,
            ClassAssignment.section == section
        ).all()

class_assignment = CRUDClassAssignment(ClassAssignment) 