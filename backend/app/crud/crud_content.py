from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.content import Subject, Chapter, Resource
from app.schemas.content import (
    SubjectCreate, SubjectUpdate,
    ChapterCreate, ChapterUpdate,
    ResourceCreate, ResourceUpdate
)

class CRUDSubject(CRUDBase[Subject, SubjectCreate, SubjectUpdate]):
    def get_by_grade(self, db: Session, *, grade_level: str) -> List[Subject]:
        return db.query(self.model).filter(self.model.grade_level == grade_level).all()

subject = CRUDSubject(Subject)

class CRUDChapter(CRUDBase[Chapter, ChapterCreate, ChapterUpdate]):
    def get_by_subject(self, db: Session, *, subject_id: int) -> List[Chapter]:
        return (
            db.query(self.model)
            .filter(self.model.subject_id == subject_id)
            .order_by(self.model.order)
            .all()
        )

    def reorder_chapters(self, db: Session, *, subject_id: int, chapter_orders: Dict[int, int]) -> List[Chapter]:
        chapters = self.get_by_subject(db, subject_id=subject_id)
        for chapter in chapters:
            if chapter.id in chapter_orders:
                chapter.order = chapter_orders[chapter.id]
        db.commit()
        return chapters

chapter = CRUDChapter(Chapter)

class CRUDResource(CRUDBase[Resource, ResourceCreate, ResourceUpdate]):
    def get_by_chapter(self, db: Session, *, chapter_id: int) -> List[Resource]:
        return db.query(self.model).filter(self.model.chapter_id == chapter_id).all()

    def get_by_type(self, db: Session, *, resource_type: str) -> List[Resource]:
        return db.query(self.model).filter(self.model.resource_type == resource_type).all()

    def get_by_chapter_and_type(
        self, db: Session, *, chapter_id: int, resource_type: str
    ) -> List[Resource]:
        return (
            db.query(self.model)
            .filter(
                self.model.chapter_id == chapter_id,
                self.model.resource_type == resource_type
            )
            .all()
        )

resource = CRUDResource(Resource) 