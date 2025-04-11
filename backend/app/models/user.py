from app.models.base_model import *
from app.models.enums import UserRole
from app.core.security import verify_password

class User(Base):
    __tablename__ = "users"

    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)

    # Relationships
    student_profile = relationship("StudentProfile", back_populates="user", uselist=False)
    teacher_profile = relationship("TeacherProfile", back_populates="user", uselist=False)
    principal_profile = relationship("PrincipalProfile", back_populates="user", uselist=False)
    developer_profile = relationship("DeveloperProfile", back_populates="user", uselist=False)
    created_assignments = relationship("Assignment", back_populates="creator", foreign_keys="Assignment.created_by")
    created_tasks = relationship("Task", back_populates="creator", foreign_keys="Task.created_by")
    assigned_tasks = relationship("Task", back_populates="assigned_to_user", foreign_keys="Task.assigned_to")
    student_progress = relationship("StudentProgress", back_populates="student")

    def verify_password(self, password: str) -> bool:
        return verify_password(password, self.hashed_password)

class StudentProfile(Base):
    __tablename__ = "student_profiles"

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    grade = Column(String, nullable=False)
    section = Column(String)
    roll_number = Column(String, unique=True)

    # Relationships
    user = relationship("User", back_populates="student_profile")

class TeacherProfile(Base):
    __tablename__ = "teacher_profiles"

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    department = Column(String)
    qualification = Column(String)
    experience_years = Column(Integer)

    # Relationships
    user = relationship("User", back_populates="teacher_profile")

class PrincipalProfile(Base):
    __tablename__ = "principal_profiles"

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    qualification = Column(String)
    experience_years = Column(Integer)

    # Relationships
    user = relationship("User", back_populates="principal_profile")

class DeveloperProfile(Base):
    __tablename__ = "developer_profiles"

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    specialization = Column(String)
    github_url = Column(String)

    # Relationships
    user = relationship("User", back_populates="developer_profile") 