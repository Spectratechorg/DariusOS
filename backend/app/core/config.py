import os
from pathlib import Path
from typing import List, Union, Optional
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

    # Database & Neon PostgreSQL Configuration
    DATABASE_URL: str = "sqlite:///./dariusos.db"
    NEON_DATABASE_URL: Optional[str] = None
    POSTGRES_URL: Optional[str] = None

    @property
    def effective_database_url(self) -> str:
        """
        Returns the active database URL, prioritizing NEON_DATABASE_URL or POSTGRES_URL
        over the default DATABASE_URL fallback.
        Normalizes postgres:// -> postgresql+psycopg2:// for SQLAlchemy 2.x compatibility.
        """
        raw_url = self.NEON_DATABASE_URL or self.POSTGRES_URL or self.DATABASE_URL
        if not raw_url:
            return "sqlite:///./dariusos.db"
            
        url = raw_url.strip()
        # Normalize dialect for psycopg2
        if url.startswith("postgres://"):
            url = "postgresql+psycopg2://" + url[len("postgres://"):]
        elif url.startswith("postgresql://") and not url.startswith("postgresql+psycopg2://"):
            url = "postgresql+psycopg2://" + url[len("postgresql://"):]

        # For Neon cloud Postgres, ensure sslmode=require
        if "neon.tech" in url and "sslmode" not in url:
            separator = "&" if "?" in url else "?"
            url = f"{url}{separator}sslmode=require"

        return url

    @property
    def is_neon(self) -> bool:
        url = (self.NEON_DATABASE_URL or self.POSTGRES_URL or self.DATABASE_URL or "").lower()
        return "neon.tech" in url or "neon" in url

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # Storage Paths
    STORAGE_DIR: str = str(BASE_DIR / "storage")
    RAW_UPLOAD_DIR: str = str(BASE_DIR / "storage" / "raw")
    PROCESSED_DIR: str = str(BASE_DIR / "storage" / "processed")
    MAX_UPLOAD_SIZE_BYTES: int = 104857600  # 100 MB

    # Engineering Rules
    ENGINEERING_RULES_PATH: str = str(BASE_DIR / "config" / "engineering_rules.json")

    # CORS. ALLOWED_ORIGINS is the deployment-facing name; the legacy setting remains supported.
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173", "https://dariusos.vercel.app"]
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173", "https://dariusos.vercel.app"]

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
