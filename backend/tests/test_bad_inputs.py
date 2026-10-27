from pathlib import Path
import numpy as np
import pytest

from app.modules.intake.readers.csv_reader import CsvReader
from app.modules.intake.readers.registry import get_reader_for_file
from app.modules.intake.validator import SurveyValidator
from app.modules.intake.cleaner import SurveyCleaner
from app.modules.intake.service import IntakeService
from app.models.user import User
from app.models.project import Project
from app.schemas.survey import QualityVerdict

from tests.synthetic_data.terrain_generators import (
    generate_flat_plane_points,
    points_to_csv_bytes
)


@pytest.fixture
def test_project_and_user(db_session):
    user = User(
        email="qa.engineer@dariusos.test",
        full_name="QA Engineer",
        hashed_password="pw",
        role="engineer"
    )
    db_session.add(user)
    db_session.commit()

    project = Project(
        name="QA Test Project",
        description="Testing bad inputs",
        created_by_user_id=user.id
    )
    db_session.add(project)
    db_session.commit()
    return project, user


def test_bad_input_1_empty_file(db_session, test_project_and_user):
    """Scenario 1: Uploading a 0-byte empty file must be rejected immediately."""
    project, user = test_project_and_user

    with pytest.raises(ValueError, match="empty \\(0 bytes\\)"):
        IntakeService.process_file_upload(
            db=db_session,
            project_id=project.id,
            user_id=user.id,
            filename="empty_survey.csv",
            raw_bytes=b""
        )


def test_bad_input_2_corrupt_file(tmp_path):
    """Scenario 2: Non-ASCII binary garbage with CSV extension."""
    reader = CsvReader()
    corrupt_bytes = b"\x00\xff\xfe\x00\x12\x34\xaa\xbb\xcc\xdd\xee"
    file_path = tmp_path / "corrupt.csv"
    file_path.write_bytes(corrupt_bytes)

    # Reading should either report 0 valid points or handle gracefully without crashing
    pts, meta = reader.read(file_path)
    assert len(pts) == 0
    assert meta["valid_points_parsed"] == 0


def test_bad_input_3_wrong_file_type():
    """Scenario 3: Uploading non-survey file formats (.exe, .pdf, .jpg)."""
    with pytest.raises(ValueError, match="Unsupported file format"):
        get_reader_for_file("malicious_tool.exe", b"MZ\x90\x00\x03")

    with pytest.raises(ValueError, match="Unsupported file format"):
        get_reader_for_file("specification.pdf", b"%PDF-1.5")


def test_bad_input_4_oversized_file(tmp_path):
    """Scenario 4: File exceeding maximum upload size limit."""
    file_path = tmp_path / "oversized.csv"
    file_path.write_bytes(b"X,Y,Z\n" + (b"1,2,3\n" * 50))

    with pytest.raises(ValueError, match="exceeds maximum allowed limit"):
        SurveyValidator.validate_raw_file(file_path, max_bytes=50)


def test_bad_input_5_duplicate_file(db_session, test_project_and_user):
    """Scenario 5: Uploading identical file twice to same project is rejected."""
    project, user = test_project_and_user
    points = generate_flat_plane_points(length_x=50.0, width_y=20.0, spacing=5.0)
    csv_bytes = points_to_csv_bytes(points)

    # First upload succeeds
    record1, _ = IntakeService.process_file_upload(
        db=db_session,
        project_id=project.id,
        user_id=user.id,
        filename="road_survey.csv",
        raw_bytes=csv_bytes
    )
    assert record1.id is not None

    # Second upload with identical bytes/hash fails
    with pytest.raises(ValueError, match="Duplicate survey file detected"):
        IntakeService.process_file_upload(
            db=db_session,
            project_id=project.id,
            user_id=user.id,
            filename="road_survey_copy.csv",
            raw_bytes=csv_bytes
        )


def test_bad_input_6_blank_and_null_values(tmp_path):
    """Scenario 6: CSV with blank lines, missing columns, and text nulls."""
    dirty_csv = (
        "Easting,Northing,Elevation\n"
        "100.0,200.0,50.0\n"
        "\n"                         # Blank line
        "105.0,200.0,NaN\n"          # NaN value
        "110.0,NULL,50.2\n"          # Text null
        "115.0,200.0\n"               # Missing column
        "120.0,200.0,50.5\n"         # Valid line
    )
    file_path = tmp_path / "dirty.csv"
    file_path.write_text(dirty_csv, encoding="utf-8")

    reader = CsvReader()
    pts, meta = reader.read(file_path)

    # Should retain the 2 valid points and report invalid rows
    assert len(pts) == 2
    assert meta["blank_or_invalid_rows"] >= 3
    assert pts[0]["x"] == 100.0
    assert pts[1]["x"] == 120.0


def test_bad_input_7_planted_spike():
    """Scenario 7: Planted elevation spike (+1000m anomaly) detected and filtered."""
    points = generate_flat_plane_points(length_x=100.0, width_y=40.0, spacing=5.0, z_elevation=100.0)
    original_count = len(points)

    # Plant spike at index 10
    points[10]["z"] = 1100.0  # +1000m spike above 100m plane

    validation = SurveyValidator.validate_points(points, {})
    assert len(validation.spike_indices) == 1
    assert 10 in validation.spike_indices
    assert any("elevation spikes" in w for w in validation.warnings)

    cleaned = SurveyCleaner.clean_points(points, validation)
    assert len(cleaned) == original_count - 1
    assert np.max(cleaned["z"]) == 100.0


def test_bad_input_8_planted_hole():
    """Scenario 8: Planted elevation hole (-500m anomaly) detected and filtered."""
    points = generate_flat_plane_points(length_x=100.0, width_y=40.0, spacing=5.0, z_elevation=100.0)
    original_count = len(points)

    # Plant hole at index 25
    points[25]["z"] = -400.0  # -500m hole below 100m plane

    validation = SurveyValidator.validate_points(points, {})
    assert len(validation.hole_indices) == 1
    assert 25 in validation.hole_indices
    assert any("elevation holes" in w for w in validation.warnings)

    cleaned = SurveyCleaner.clean_points(points, validation)
    assert len(cleaned) == original_count - 1
    assert np.min(cleaned["z"]) == 100.0


def test_bad_input_9_wrong_coordinate_system():
    """Scenario 9: Unprojected geographic coordinates (degrees) trigger a warning."""
    # Create points in lat/lon range: X in [-118.0, -117.9], Y in [34.0, 34.1]
    points = generate_flat_plane_points(length_x=0.01, width_y=0.01, spacing=0.002, z_elevation=100.0)
    points["x"] += 12.0
    points["y"] += 45.0

    validation = SurveyValidator.validate_points(points, {})
    assert any("geographic (degrees WGS84)" in w for w in validation.warnings)


def test_bad_input_10_too_sparse_survey():
    """Scenario 10: Survey density below minimum engineering threshold flagged."""
    from app.modules.intake.readers.base import POINT_DTYPE
    # 4 points across 10,000 m² (density = 0.0004 pts/m²)
    sparse_points = np.zeros(4, dtype=POINT_DTYPE)
    sparse_points[0] = (0.0, 0.0, 100.0, 0)
    sparse_points[1] = (100.0, 0.0, 100.0, 0)
    sparse_points[2] = (0.0, 100.0, 100.0, 0)
    sparse_points[3] = (100.0, 100.0, 100.0, 0)

    validation = SurveyValidator.validate_points(sparse_points, {})
    assert any("sparse" in w.lower() for w in validation.warnings)
