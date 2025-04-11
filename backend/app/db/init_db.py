from sqlalchemy.orm import Session
from app.db.base import Base
from app.db.session import engine
from app.core.config import settings
from app.models.user import User, UserRole
from app.core.security import get_password_hash

def init_db(db: Session) -> None:
    # Create tables
    Base.metadata.create_all(bind=engine)

    # Create initial superuser if it doesn't exist
    user = db.query(User).filter(User.email == settings.FIRST_SUPERUSER).first()
    if not user:
        user = User(
            email=settings.FIRST_SUPERUSER,
            hashed_password=get_password_hash(settings.FIRST_SUPERUSER_PASSWORD),
            full_name="Initial Superuser",
            role=UserRole.DEVELOPER,
            is_superuser=True,
            is_active=True,
        )
        db.add(user)
        db.commit() 