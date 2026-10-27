import tempfile
from pathlib import Path
import numpy as np
import pytest

from app.modules.intake.readers.csv_reader import CsvReader
from app.modules.intake.readers.xyz_reader import XyzReader
from app.modules.intake.readers.las_reader import LasReader
from app.modules.intake.readers.registry import get_reader_for_file
from app.modules.intake.validator import SurveyValidator
from app.modules.intake.cleaner import SurveyCleaner
from app.modules.intake.report import IntakeReportGenerator
from app.modules.intake.service import IntakeService
from app.models.user import User
from app.models.project import Project
from app.schemas.survey import QualityVerdict

from tests.synthetic_data.terrain_generators import (
    generate_flat_plane_points,
    generate_sloped_plane_points,
    generate_hill_points,
    points_to_csv_bytes,
    points_to_xyz_bytes,
    points_to_las_bytes
)


@pytest.fixture
def clean_flat_points():
    return generate_flat_plane_points(length_x=100.0, width_y=40.0, spacing=2.0, z_elevation=100.0)


def test_csv_reader_with_headers_and_different_delimiters(clean_flat_points, tmp_path):
    """Verifies that CsvReader parses comma-, semicolon-, and tab-delimited files with headers."""
    reader = CsvReader()

    for delim, ext in [(",", ".csv"), (";", ".csv"), ("\t", ".txt")]:
        csv_bytes = points_to_csv_bytes(clean_flat_points, header=True, delimiter=delim)
        file_path = tmp_path / f"test_delim_{ext}"
        file_path.write_bytes(csv_bytes)

        assert reader.can_read(file_path.name, csv_bytes[:256]) is True
        pts, meta = reader.read(file_path)

        assert len(pts) == len(clean_flat_points)
        assert meta["format"] == "CSV"
        assert meta["blank_or_invalid_rows"] == 0
        np.testing.assert_allclose(pts["x"], clean_flat_points["x"], atol=1e-3)
        np.testing.assert_allclose(pts["z"], 100.0, atol=1e-3)


def test_csv_reader_without_header(clean_flat_points, tmp_path):
    """Verifies positional fallback when no header is present in CSV."""
    reader = CsvReader()
    csv_bytes = points_to_csv_bytes(clean_flat_points, header=False, delimiter=",")
    file_path = tmp_path / "test_no_header.csv"
    file_path.write_bytes(csv_bytes)

    pts, meta = reader.read(file_path)
    assert len(pts) == len(clean_flat_points)
    assert meta["has_header"] is False


def test_xyz_reader(clean_flat_points, tmp_path):
    """Verifies raw space-delimited XYZ reading."""
    reader = XyzReader()
    xyz_bytes = points_to_xyz_bytes(clean_flat_points)
    file_path = tmp_path / "survey.xyz"
    file_path.write_bytes(xyz_bytes)

    assert reader.can_read(file_path.name, xyz_bytes[:256]) is True
    pts, meta = reader.read(file_path)
    assert len(pts) == len(clean_flat_points)
    assert meta["format"] == "XYZ"


def test_las_reader(clean_flat_points, tmp_path):
    """Verifies ASPRS LAS format parsing via LasReader."""
    reader = LasReader()
    las_path = tmp_path / "survey.las"
    las_bytes = points_to_las_bytes(clean_flat_points, las_path)

    assert reader.can_read(las_path.name, las_bytes[:256]) is True
    pts, meta = reader.read(las_path)
    assert len(pts) == len(clean_flat_points)
    assert meta["format"] == "LAS"
    np.testing.assert_allclose(pts["z"], 100.0, atol=1e-2)


def test_reader_registry_auto_selection(tmp_path):
    """Verifies format reader resolution from registry."""
    csv_reader = get_reader_for_file("survey.csv", b"X,Y,Z\n1,2,3")
    assert csv_reader.format_name == "CSV"

    xyz_reader = get_reader_for_file("survey.xyz", b"10.0 20.0 30.0")
    assert xyz_reader.format_name == "XYZ"

    las_reader = get_reader_for_file("survey.las", b"LASF\x01\x00")
    assert las_reader.format_name == "LAS"

    with pytest.raises(ValueError, match="Unsupported file format"):
        get_reader_for_file("malicious.exe", b"\x4D\x5A\x90")


def test_validation_on_clean_survey(clean_flat_points):
    """Verifies that clean synthetic survey receives PASSED verdict with zero anomalies."""
    validation = SurveyValidator.validate_points(clean_flat_points, {"format": "CSV"})
    assert validation.verdict == QualityVerdict.PASSED
    assert validation.total_raw_points == len(clean_flat_points)
    assert validation.valid_points_count == len(clean_flat_points)
    assert len(validation.duplicate_indices) == 0
    assert len(validation.spike_indices) == 0
    assert len(validation.hole_indices) == 0
    assert len(validation.nan_or_inf_indices) == 0
    assert validation.bounds.min_x == 0.0
    assert validation.bounds.max_x == 100.0
    assert validation.bounds.min_z == 100.0
    assert validation.bounds.max_z == 100.0


def test_cleaner_and_deduplication(clean_flat_points):
    """Verifies that duplicates are detected and removed by cleaner."""
    # Plant a duplicate point
    duplicated = np.append(clean_flat_points, clean_flat_points[0])
    validation = SurveyValidator.validate_points(duplicated, {})
    assert len(validation.duplicate_indices) == 1

    cleaned = SurveyCleaner.clean_points(duplicated, validation)
    assert len(cleaned) == len(clean_flat_points)


def test_plain_language_report_generation(clean_flat_points):
    """Verifies that the generated plain-language intake report contains clear human-readable metrics."""
    validation = SurveyValidator.validate_points(clean_flat_points, {})
    report = IntakeReportGenerator.generate(
        filename="road_survey.csv",
        sha256_hash="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        file_size_bytes=24500,
        validation=validation
    )

    assert report.verdict == QualityVerdict.PASSED
    assert "SURVEY FILE ACCEPTED" in report.summary_text
    assert "100.0" in report.summary_text
    assert "REGISTERED ENGINEER" in report.engineer_notice


def test_intake_service_full_workflow(db_session, clean_flat_points):
    """Verifies the complete IntakeService workflow from upload to database record and cleaned storage."""
    # Create test user and project
    user = User(
        email="surveyor@dariusos.test",
        full_name="Staff Surveyor",
        hashed_password="pw",
        role="engineer"
    )
    db_session.add(user)
    db_session.commit()

    project = Project(
        name="Highway Access Road",
        description="Test project",
        created_by_user_id=user.id
    )
    db_session.add(project)
    db_session.commit()

    csv_bytes = points_to_csv_bytes(clean_flat_points)

    record, cloud = IntakeService.process_file_upload(
        db=db_session,
        project_id=project.id,
        user_id=user.id,
        filename="survey_01.csv",
        raw_bytes=csv_bytes
    )

    assert record.id is not None
    assert record.sha256_hash == cloud.sha256_hash
    assert record.status == "VALIDATED"
    assert record.point_count == len(clean_flat_points)
    assert Path(record.storage_path).exists()
    assert cloud.density_pts_m2 > 0.0
