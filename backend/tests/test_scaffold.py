import pytest
from app.core.engineering import EngineeringRulesLoader, MANDATORY_DISCLAIMER_KEYWORD
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    decode_token,
    UserRole
)
from app.core.audit import record_audit_event
from app.models.user import User
from app.models.project import Project
from app.models.audit_log import AuditLog


def test_engineering_rules_loading():
    """
    Verifies that engineering rules are loaded with strict registered engineer disclaimers
    and that no design values are invented.
    """
    rules = EngineeringRulesLoader.load()
    assert rules is not None
    assert MANDATORY_DISCLAIMER_KEYWORD in rules.ENGINEERING_STATUS
    assert MANDATORY_DISCLAIMER_KEYWORD in rules.horizontal_alignment.get("notice", "")
    assert MANDATORY_DISCLAIMER_KEYWORD in rules.vertical_alignment.get("notice", "")
    assert MANDATORY_DISCLAIMER_KEYWORD in rules.cross_section.get("notice", "")
    assert MANDATORY_DISCLAIMER_KEYWORD in rules.beme_rates_placeholder.get("notice", "")
    
    # Check SHA-256 hash
    sha256 = EngineeringRulesLoader.get_sha256()
    assert len(sha256) == 64


def test_security_password_hashing():
    """Verifies bcrypt password hashing and verification."""
    password = "EngineerSecret123!"
    hashed = get_password_hash(password)
    assert hashed != password
    assert verify_password(password, hashed) is True
    assert verify_password("WrongPassword", hashed) is False


def test_security_jwt_token_generation_and_roles():
    """Verifies JWT token issuance, decoding, and role embedding."""
    user_id = "user-12345"
    token = create_access_token(subject=user_id, role=UserRole.ENGINEER)
    decoded = decode_token(token)
    assert decoded["sub"] == user_id
    assert decoded["role"] == "engineer"
    assert "exp" in decoded


def test_database_user_and_project_creation(db_session):
    """Verifies SQLAlchemy models creation and relationship integrity."""
    user = User(
        email="lead.engineer@dariusos.test",
        full_name="Chief Road Engineer",
        hashed_password=get_password_hash("Secret123!"),
        role=UserRole.ENGINEER.value
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    assert user.id is not None

    project = Project(
        name="Sector 7 Feeder Road",
        description="Rural access road survey package",
        created_by_user_id=user.id
    )
    db_session.add(project)
    db_session.commit()
    db_session.refresh(project)

    assert project.id is not None
    assert project.created_by_user_id == user.id

    # Verify query
    queried_project = db_session.query(Project).filter_by(id=project.id).first()
    assert queried_project.name == "Sector 7 Feeder Road"


def test_audit_event_logging(db_session):
    """Verifies audit trail persistence for actions and uploads."""
    audit_entry = record_audit_event(
        db=db_session,
        action="TEST_ACTION",
        user_id="user-xyz",
        resource_type="survey_file",
        resource_id="file-123",
        details={"ip": "127.0.0.1", "filename": "terrain.las"}
    )
    assert audit_entry.id is not None

    queried_log = db_session.query(AuditLog).filter_by(id=audit_entry.id).first()
    assert queried_log is not None
    assert queried_log.action == "TEST_ACTION"
    assert queried_log.details["filename"] == "terrain.las"


def test_health_check_endpoint(client):
    """Verifies the /api/v1/health API endpoint responds with the engineer disclaimer and rules hash."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "ENGINEER" in data["engineer_disclaimer"]
    assert len(data["rules_sha256"]) == 64
