import sys
from pathlib import Path
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient

# Ensure backend root is on sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.core.database import Base, get_db
from app.core.engineering import EngineeringRulesLoader
from app.main import app

# Test database: SQLite in-memory
TEST_DATABASE_URL = "sqlite:///:memory:"

test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


@pytest.fixture(scope="session", autouse=True)
def setup_test_environment():
    """Ensure engineering rules are loaded once for test session."""
    EngineeringRulesLoader.load(force_reload=True)


@pytest.fixture(scope="function")
def db_session():
    """Provides a transactional database session rolled back after every test."""
    Base.metadata.create_all(bind=test_engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=test_engine)


@pytest.fixture(scope="function")
def client(db_session):
    """Test client overriding get_db dependency with test database."""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    from app.core.database import get_db as core_get_db
    from app.api.deps import get_db as deps_get_db

    app.dependency_overrides[core_get_db] = override_get_db
    app.dependency_overrides[deps_get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
