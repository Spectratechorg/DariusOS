import os
from pathlib import Path
from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent


class Settings(BaseSettings):
    PROJECT_NAME: str = "Dariusos Road Design & Earthworks Platform"
    APP_ENV: str = "development"
    DEBUG: bool = True
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "insecure-development-secret-key-32-bytes-minimum"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480

    # Database
    DATABASE_URL: str = "sqlite:///./dariusos.db"

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # Storage Paths
    STORAGE_DIR: str = str(BASE_DIR / "storage")
    RAW_UPLOAD_DIR: str = str(BASE_DIR / "storage" / "raw")
    PROCESSED_DIR: str = str(BASE_DIR / "storage" / "processed")
    MAX_UPLOAD_SIZE_BYTES: int = 104857600  # 100 MB

    # Engineering Rules
    ENGINEERING_RULES_PATH: str = str(BASE_DIR / "config" / "engineering_rules.json")

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]

    model_config = SettingsConfigDict(
        env_file=str(BASE_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()

# Ensure storage directories exist
os.makedirs(settings.STORAGE_DIR, exist_ok=True)
os.makedirs(settings.RAW_UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.PROCESSED_DIR, exist_ok=True)
