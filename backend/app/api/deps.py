from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import SessionLocal
from app.models.user import User
from app.schemas.token import TokenPayload

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login/access-token"
)

def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(reusable_oauth2),
) -> User:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (jwt.JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    user = db.query(User).filter(User.id == token_data.sub).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user

def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user",
        )
    return current_user

async def get_current_teacher(
    current_user: User = Depends(get_current_active_user),
) -> User:
    """
    Get current teacher profile.
    Verifies user has teacher role and returns teacher profile.
    
    Raises:
        HTTPException: If user is not a teacher
    """
    if not current_user.role == "teacher":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient privileges - Teacher access required"
        )
    if not current_user.teacher_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Teacher profile not found"
        )
    return current_user

async def get_current_student(
    current_user: User = Depends(get_current_active_user),
) -> User:
    """
    Get current student profile.
    Verifies user has student role and returns student profile.
    
    Raises:
        HTTPException: If user is not a student
    """
    if not current_user.role == "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient privileges - Student access required"
        )
    if not current_user.student_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found"
        )
    return current_user

async def get_current_principal(
    current_user: User = Depends(get_current_active_user),
) -> User:
    """
    Get current principal profile.
    Verifies user has principal role and returns principal profile.
    
    Raises:
        HTTPException: If user is not a principal
    """
    if not current_user.role == "principal":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient privileges - Principal access required"
        )
    if not current_user.principal_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Principal profile not found"
        )
    return current_user

async def get_current_developer(
    current_user: User = Depends(get_current_active_user),
) -> User:
    """
    Get current developer profile.
    Verifies user has developer role and returns developer profile.
    
    Raises:
        HTTPException: If user is not a developer
    """
    if not current_user.role == "developer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient privileges - Developer access required"
        )
    if not current_user.developer_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Developer profile not found"
        )
    return current_user 