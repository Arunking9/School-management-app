from typing import Any, Dict, List, Optional, Union
from pydantic import AnyHttpUrl, EmailStr, HttpUrl, field_validator, computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict
import secrets
from pathlib import Path

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    SERVER_NAME: str = "School Management System"
    SERVER_HOST: AnyHttpUrl = "http://localhost:8000"
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []

    @field_validator("BACKEND_CORS_ORIGINS", mode='before')
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    PROJECT_NAME: str = "School Management System"
    
    @computed_field
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        return "sqlite:///./school_management.db"

    FIRST_SUPERUSER: EmailStr = "admin@school.com"
    FIRST_SUPERUSER_PASSWORD: str = "admin123"

    model_config = SettingsConfigDict(case_sensitive=True, env_file=".env", extra='allow')

settings = Settings() 