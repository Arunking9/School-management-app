from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import ValidationError
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.core import security
from app.core.config import settings
from app.db.session import SessionLocal

reusable_oauth2 = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/login")

def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(reusable_oauth2)
) -> models.User:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        token_data = schemas.TokenPayload(**payload)
    except (JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    user = crud.user.get_user(db, user_id=token_data.sub)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

def get_current_active_user(
    current_user: models.User = Depends(get_current_user),
) -> models.User:
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

def get_current_active_superuser(
    current_user: models.User = Depends(get_current_user),
) -> models.User:
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=400, detail="The user doesn't have enough privileges"
        )
    return current_user

async def get_current_teacher(
    current_user: models.User = Depends(get_current_active_user),
) -> models.User:
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
    current_user: models.User = Depends(get_current_active_user),
) -> models.User:
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
    current_user: models.User = Depends(get_current_active_user),
) -> models.User:
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
    current_user: models.User = Depends(get_current_active_user),
) -> models.User:
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