from typing import Optional
from pydantic import BaseModel, EmailStr
from datetime import datetime
from app.models.user import UserRole

# Shared properties
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = True
    full_name: Optional[str] = None
    role: Optional[str] = None

# Properties to receive via API on creation
class UserCreate(UserBase):
    email: EmailStr
    password: str
    full_name: str
    role: str

# Properties to receive via API on update
class UserUpdate(UserBase):
    password: Optional[str] = None

# Properties shared by models stored in DB
class UserInDBBase(UserBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Properties to return to client
class UserResponse(UserInDBBase):
    pass

# Properties stored in DB
class UserInDB(UserInDBBase):
    hashed_password: str

# Token
class Token(BaseModel):
    access_token: str
    token_type: str
    user_role: UserRole

class TokenPayload(BaseModel):
    sub: Optional[int] = None

# Student Profile
class StudentProfileBase(BaseModel):
    grade: int
    section: Optional[str] = None
    roll_number: str
    parent_name: Optional[str] = None
    parent_contact: Optional[str] = None

class StudentProfileCreate(StudentProfileBase):
    user_id: int

class StudentProfileUpdate(StudentProfileBase):
    pass

class StudentProfile(StudentProfileBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

# Teacher Profile
class TeacherProfileBase(BaseModel):
    subject: str
    qualification: Optional[str] = None
    experience_years: Optional[int] = None

class TeacherProfileCreate(TeacherProfileBase):
    user_id: int

class TeacherProfileUpdate(TeacherProfileBase):
    pass

class TeacherProfile(TeacherProfileBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

# Principal Profile
class PrincipalProfileBase(BaseModel):
    school_name: str
    school_address: Optional[str] = None
    contact_number: Optional[str] = None

class PrincipalProfileCreate(PrincipalProfileBase):
    user_id: int

class PrincipalProfileUpdate(PrincipalProfileBase):
    pass

class PrincipalProfile(PrincipalProfileBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

# Developer Profile
class DeveloperProfileBase(BaseModel):
    access_level: str
    last_login: Optional[datetime] = None

class DeveloperProfileCreate(DeveloperProfileBase):
    user_id: int

class DeveloperProfileUpdate(DeveloperProfileBase):
    pass

class DeveloperProfile(DeveloperProfileBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True 