"""Integration and contract tests for Stage 9: Web API & RBAC Security."""
import io
import pytest
from app.core.security import get_password_hash
from app.models.user import User
from tests.synthetic_data.terrain_generators import generate_flat_plane_points, points_to_csv_bytes


@pytest.fixture
def auth_tokens(db_session, client):
    """Creates test users (engineer and viewer) and returns their auth tokens."""
    # Engineer
    engineer = User(
        email="chief.engineer@dariusos.com",
        full_name="Chief Road Engineer",
        hashed_password=get_password_hash("ValidPass123!"),
        role="engineer",
        is_active=True
    )
    db_session.add(engineer)

    # Viewer
    viewer = User(
        email="observer@dariusos.com",
        full_name="Civil Project Viewer",
        hashed_password=get_password_hash("ViewerPass123!"),
        role="viewer",
        is_active=True
    )
    db_session.add(viewer)
    db_session.commit()

    resp_eng = client.post(
        "/api/v1/auth/login",
        json={"email": "chief.engineer@dariusos.com", "password": "ValidPass123!"}
    )
    assert resp_eng.status_code == 200
    eng_token = resp_eng.json()["access_token"]

    resp_view = client.post(
        "/api/v1/auth/login",
        json={"email": "observer@dariusos.com", "password": "ViewerPass123!"}
    )
    assert resp_view.status_code == 200
    view_token = resp_view.json()["access_token"]

    return {
        "engineer_token": eng_token,
        "viewer_token": view_token,
        "engineer_id": engineer.id,
        "viewer_id": viewer.id
    }


def test_auth_register_and_login(client):
    """Tests new user registration, login, and token generation."""
    reg_resp = client.post(
        "/api/v1/auth/register",
        json={
            "email": "new.surveyor@dariusos.com",
            "password": "SecurePassword123!",
            "full_name": "New Road Surveyor",
            "role": "engineer"
        }
    )
    assert reg_resp.status_code == 201
    user_data = reg_resp.json()
    assert user_data["email"] == "new.surveyor@dariusos.com"

    # Login
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "new.surveyor@dariusos.com", "password": "SecurePassword123!"}
    )
    assert login_resp.status_code == 200
    token_data = login_resp.json()
    assert "access_token" in token_data
    assert token_data["token_type"] == "bearer"
    assert token_data["role"] == "engineer"


def test_auth_invalid_credentials_and_protected_me(client, auth_tokens):
    """Tests bad password rejection and /auth/me authentication."""
    bad_login = client.post(
        "/api/v1/auth/login",
        json={"email": "chief.engineer@dariusos.com", "password": "WrongPassword!"}
    )
    assert bad_login.status_code == 401

    # Unauthenticated /auth/me
    unauth_resp = client.get("/api/v1/auth/me")
    assert unauth_resp.status_code == 401

    # Authenticated /auth/me
    auth_resp = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {auth_tokens['engineer_token']}"}
    )
    assert auth_resp.status_code == 200
    assert auth_resp.json()["email"] == "chief.engineer@dariusos.com"


def test_projects_crud_and_rbac(client, auth_tokens):
    """Verifies project creation, listing, RBAC restriction for viewers."""
    # 1. Viewer tries to create project -> 403 Forbidden
    forbidden_resp = client.post(
        "/api/v1/projects",
        json={"name": "Forbidden Highway"},
        headers={"Authorization": f"Bearer {auth_tokens['viewer_token']}"}
    )
    assert forbidden_resp.status_code == 403

    # 2. Engineer creates project -> 201 Created
    create_resp = client.post(
        "/api/v1/projects",
        json={"name": "Expressway Corridor 1", "description": "National highway sector"},
        headers={"Authorization": f"Bearer {auth_tokens['engineer_token']}"}
    )
    assert create_resp.status_code == 201
    project_id = create_resp.json()["id"]
    assert project_id is not None
    assert create_resp.json()["name"] == "Expressway Corridor 1"

    # 3. List projects
    list_resp = client.get(
        "/api/v1/projects",
        headers={"Authorization": f"Bearer {auth_tokens['engineer_token']}"}
    )
    assert list_resp.status_code == 200
    projects = list_resp.json()
    assert any(p["id"] == project_id for p in projects)

    # 4. Get project details
    detail_resp = client.get(
        f"/api/v1/projects/{project_id}",
        headers={"Authorization": f"Bearer {auth_tokens['engineer_token']}"}
    )
    assert detail_resp.status_code == 200
    assert detail_resp.json()["name"] == "Expressway Corridor 1"
    assert "surveys" in detail_resp.json()
    assert "runs" in detail_resp.json()


def test_survey_upload_and_pipeline_run_workflow(client, auth_tokens):
    """
    End-to-end API test:
    1. Create Project
    2. Upload synthetic survey CSV
    3. Trigger Pipeline Run (M1-M5)
    4. Fetch Results (Alignment, Profile, Cross-sections, Quantities)
    5. Download Deliverables (BEME Excel, Pilot Report PDF)
    """
    headers = {"Authorization": f"Bearer {auth_tokens['engineer_token']}"}

    # Step 1: Create Project
    p_resp = client.post(
        "/api/v1/projects",
        json={"name": "API Test Expressway"},
        headers=headers
    )
    assert p_resp.status_code == 201
    project_id = p_resp.json()["id"]

    # Step 2: Upload Survey Point File
    points = generate_flat_plane_points(length_x=100.0, width_y=40.0, spacing=2.0, z_elevation=100.0)
    csv_bytes = points_to_csv_bytes(points)

    upload_resp = client.post(
        f"/api/v1/projects/{project_id}/surveys",
        files={"file": ("terrain_corridor.csv", io.BytesIO(csv_bytes), "text/csv")},
        data={"crs_epsg": 32632},
        headers=headers
    )
    assert upload_resp.status_code == 201
    survey_data = upload_resp.json()
    survey_id = survey_data["file_id"]
    assert survey_id is not None
    assert survey_data["quality_report"]["total_raw_points"] == len(points)
    assert "TO BE CONFIRMED BY A REGISTERED ENGINEER" in survey_data["quality_report"]["engineer_notice"]

    # Verify survey report endpoint
    rep_resp = client.get(f"/api/v1/surveys/{survey_id}/report", headers=headers)
    assert rep_resp.status_code == 200
    assert rep_resp.json()["point_count"] == len(points)

    # Step 3: Trigger Pipeline Run
    run_resp = client.post(
        f"/api/v1/projects/{project_id}/runs",
        json={
            "survey_file_id": survey_id,
            "start_point": [0.0, 0.0],
            "end_point": [100.0, 0.0],
            "station_interval_m": 20.0,
            "target_elevation_offset_m": -2.0,
            "force_recompute": False
        },
        headers=headers
    )
    assert run_resp.status_code == 201
    run_data = run_resp.json()
    run_id = run_data["run_id"]
    assert run_id is not None
    assert run_data["status"] == "COMPLETED"
    assert run_data["summary"]["total_cut_volume_m3"] > 2000.0
    assert "alignment" in run_data["stages"]

    # Step 4: Fetch Engineering Results
    # 4a. Alignment
    align_resp = client.get(f"/api/v1/runs/{run_id}/alignment", headers=headers)
    assert align_resp.status_code == 200
    assert align_resp.json()["total_length_m"] == pytest.approx(100.0, 0.1)

    # 4b. Profile
    prof_resp = client.get(f"/api/v1/runs/{run_id}/profile", headers=headers)
    assert prof_resp.status_code == 200
    assert len(prof_resp.json()["profile_points"]) > 0

    # 4c. Sections
    sec_resp = client.get(f"/api/v1/runs/{run_id}/sections", headers=headers)
    assert sec_resp.status_code == 200
    assert sec_resp.json()["total_sections"] == len(align_resp.json()["stations"])

    # 4d. Quantities
    quant_resp = client.get(f"/api/v1/runs/{run_id}/quantities", headers=headers)
    assert quant_resp.status_code == 200
    assert quant_resp.json()["total_cut_volume_m3"] > 2000.0

    # Step 5: Deliverables Exports
    # 5a. BEME Excel Download
    beme_resp = client.get(f"/api/v1/runs/{run_id}/export/beme", headers=headers)
    assert beme_resp.status_code == 200
    assert "spreadsheetml" in beme_resp.headers["content-type"]
    assert len(beme_resp.content) > 1000  # valid excel file size

    # 5b. Pilot Report PDF Download
    pdf_resp = client.get(f"/api/v1/runs/{run_id}/export/pilot-report", headers=headers)
    assert pdf_resp.status_code == 200
    assert "pdf" in pdf_resp.headers["content-type"]
    assert pdf_resp.content.startswith(b"%PDF-")
