import time
import logging
from typing import Generator, Dict, Any
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from app.core.config import settings

logger = logging.getLogger("dariusos.database")

db_url = settings.effective_database_url

# Configure database engine specifically for Neon / PostgreSQL vs SQLite
connect_args = {}
engine_kwargs: Dict[str, Any] = {
    "pool_pre_ping": True,
}

if db_url.startswith("sqlite"):
    connect_args["check_same_thread"] = False
else:
    # PostgreSQL / Neon optimizations
    connect_args["sslmode"] = "require"
    engine_kwargs.update({
        "pool_size": 10,
        "max_overflow": 20,
        "pool_recycle": 300,  # recycle serverless connections every 5 mins
        "pool_timeout": 30,
    })

engine = create_engine(
    db_url,
    connect_args=connect_args,
    **engine_kwargs
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    """Creates all database tables defined in models."""
    logger.info("Initializing database schema on %s...", "Neon PostgreSQL" if settings.is_neon else "SQLite")
    Base.metadata.create_all(bind=engine)
    logger.info("Database schema initialized successfully.")


def check_database_health() -> Dict[str, Any]:
    """
    Actively probes database connection, measures ping latency,
    and returns engine type and Neon status.
    """
    start_time = time.time()
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        latency_ms = round((time.time() - start_time) * 1000, 2)
        return {
            "status": "connected",
            "engine": "neon_postgresql" if settings.is_neon else ("postgresql" if "postgres" in db_url else "sqlite"),
            "is_neon": settings.is_neon,
            "latency_ms": latency_ms,
            "error": None
        }
    except Exception as e:
        logger.error("Database connection check failed: %s", str(e))
        return {
            "status": "disconnected",
            "engine": "neon_postgresql" if settings.is_neon else "unknown",
            "is_neon": settings.is_neon,
            "latency_ms": None,
            "error": str(e)
        }
