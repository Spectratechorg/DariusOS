import numpy as np
import pytest

from app.modules.design.alignment.generator import HorizontalAlignmentGenerator
from app.modules.design.profile.geometry import compute_vertical_curve, evaluate_pvi_system_elevation
from app.modules.design.profile.generator import LongitudinalProfileGenerator
from app.modules.design.profile.service import ProfileService
from app.modules.terrain.gridder import TerrainGridder
from app.modules.terrain.interpolator import TerrainInterpolator
from app.schemas.profile import CutFillType, VerticalCurveType

from tests.synthetic_data.terrain_generators import (
    generate_flat_plane_points,
    generate_sloped_plane_points,
    generate_hill_points
)


@pytest.fixture
def flat_alignment():
    pts = generate_flat_plane_points(length_x=100.0, width_y=40.0, spacing=2.0, z_elevation=100.0)
    grid_z, meta = TerrainGridder.create_dem_grid(pts, cell_size_m=1.0)
    terrain = TerrainInterpolator(grid_z, meta)
    return HorizontalAlignmentGenerator.generate(
        start_xy=(0.0, 0.0),
        end_xy=(100.0, 0.0),
        terrain=terrain,
        station_interval_m=20.0
    )


@pytest.fixture
def sloped_alignment():
    pts = generate_sloped_plane_points(length_x=100.0, width_y=40.0, spacing=2.0, grade=0.02, z_base=50.0)
    grid_z, meta = TerrainGridder.create_dem_grid(pts, cell_size_m=1.0)
    terrain = TerrainInterpolator(grid_z, meta)
    return HorizontalAlignmentGenerator.generate(
        start_xy=(0.0, 0.0),
        end_xy=(100.0, 0.0),
        terrain=terrain,
        station_interval_m=20.0
    )


def test_flat_terrain_constant_cut_profile(flat_alignment):
    """
    Verifies that a -2.0m target offset on a flat plane (z=100.0m)
    produces a uniform 2.0m cut profile at design z=98.0m (matching Golden Case 1).
    """
    profile = LongitudinalProfileGenerator.generate(
        alignment=flat_alignment,
        target_offset_m=-2.0
    )

    assert profile.total_length_m == 100.0
    assert profile.max_cut_depth_m == pytest.approx(2.0, abs=1e-2)
    assert profile.max_fill_depth_m == pytest.approx(0.0, abs=1e-2)
    assert profile.is_grade_compliant is True

    # Check station-by-station depths
    for pt in profile.profile_points:
        assert pt.ground_elevation_m == pytest.approx(100.0, abs=1e-2)
        assert pt.design_elevation_m == pytest.approx(98.0, abs=1e-2)
        assert pt.difference_m == pytest.approx(-2.0, abs=1e-2)
        assert pt.cut_or_fill == CutFillType.CUT
        assert pt.grade_percent == pytest.approx(0.0, abs=1e-2)


def test_sloped_terrain_constant_fill_profile(sloped_alignment):
    """
    Verifies that a +1.5m target offset on a 2% sloped plane (z=50.0 + 0.02x)
    produces a uniform 1.5m fill embankment at 2% grade (matching Golden Case 2).
    """
    profile = LongitudinalProfileGenerator.generate(
        alignment=sloped_alignment,
        target_offset_m=1.5
    )

    assert profile.total_length_m == 100.0
    assert profile.max_fill_depth_m == pytest.approx(1.5, abs=1e-2)
    assert profile.max_cut_depth_m == pytest.approx(0.0, abs=1e-2)
    assert profile.is_grade_compliant is True

    for pt in profile.profile_points:
        expected_ground = 50.0 + 0.02 * pt.station_m
        expected_design = expected_ground + 1.5
        assert pt.ground_elevation_m == pytest.approx(expected_ground, abs=0.05)
        assert pt.design_elevation_m == pytest.approx(expected_design, abs=0.05)
        assert pt.difference_m == pytest.approx(1.5, abs=0.05)
        assert pt.cut_or_fill == CutFillType.FILL


def test_vertical_crest_curve_parabolic_fitting():
    """
    Verifies calculation of an equal-tangent parabolic crest vertical curve.
    g1 = +8.0%, g2 = -8.0%, PVI at station 50m, elev 104m.
    """
    pvi = compute_vertical_curve(
        pvi_prev_station=0.0,
        pvi_prev_z=100.0,
        pvi_station=50.0,
        pvi_z=104.0,
        pvi_next_station=100.0,
        pvi_next_z=100.0,
        k_crest=15.0
    )

    assert pvi.curve_type == VerticalCurveType.CREST
    assert pvi.grade_in_percent == pytest.approx(8.0, abs=0.1)
    assert pvi.grade_out_percent == pytest.approx(-8.0, abs=0.1)
    assert pvi.curve_length_m > 0.0
    assert pvi.pvc_station_m < 50.0
    assert pvi.pvt_station_m > 50.0

    # Evaluate at summit (station 50)
    pvis = [
        compute_vertical_curve(0, 100, 0, 100, 50, 104),
        pvi,
        compute_vertical_curve(50, 104, 100, 100, 100, 100)
    ]
    # Grade at summit of symmetric curve should be 0.0%
    elev, inst_grade, c_type = evaluate_pvi_system_elevation(50.0, [pvi])
    assert c_type == VerticalCurveType.CREST
    assert inst_grade == pytest.approx(0.0, abs=0.2)


def test_vertical_sag_curve_parabolic_fitting():
    """
    Verifies calculation of an equal-tangent parabolic sag vertical curve (valley).
    g1 = -6.0%, g2 = +6.0%, PVI at station 50m, elev 96m.
    """
    pvi = compute_vertical_curve(
        pvi_prev_station=0.0,
        pvi_prev_z=100.0,
        pvi_station=50.0,
        pvi_z=97.0,
        pvi_next_station=100.0,
        pvi_next_z=100.0,
        k_sag=10.0
    )

    assert pvi.curve_type == VerticalCurveType.SAG
    assert pvi.grade_in_percent == pytest.approx(-6.0, abs=0.1)
    assert pvi.grade_out_percent == pytest.approx(6.0, abs=0.1)
    assert pvi.curve_length_m > 0.0

    elev, inst_grade, c_type = evaluate_pvi_system_elevation(50.0, [pvi])
    assert c_type == VerticalCurveType.SAG
    assert inst_grade == pytest.approx(0.0, abs=0.2)


def test_grade_limit_enforcement_on_steep_slope():
    """
    Verifies that if natural ground slope is excessively steep (e.g. 15%),
    the automated design clamps the roadbed profile within the maximum grade limit (8.0%).
    """
    # Create terrain with 15% slope along 100m (ground rises 15m)
    pts = generate_sloped_plane_points(length_x=100.0, width_y=40.0, spacing=2.0, grade=0.15, z_base=100.0)
    grid_z, meta = TerrainGridder.create_dem_grid(pts, cell_size_m=1.0)
    terrain = TerrainInterpolator(grid_z, meta)
    alignment = HorizontalAlignmentGenerator.generate((0, 0), (100, 0), terrain, station_interval_m=20.0)

    profile = LongitudinalProfileGenerator.generate(alignment)

    # Max design grade should be capped at 8.0%
    assert profile.max_detected_design_grade_percent <= 8.01
    assert profile.is_grade_compliant is True


def test_profile_service_logging(flat_alignment, db_session):
    """
    Verifies ProfileService execution and audit trail recording.
    """
    from app.models.user import User
    from app.models.project import Project
    from app.models.audit_log import AuditLog

    user = User(email="profile@test.com", full_name="Profile Eng", hashed_password="pw", role="engineer")
    db_session.add(user)
    db_session.commit()

    proj = Project(name="Profile Project", created_by_user_id=user.id)
    db_session.add(proj)
    db_session.commit()

    pkg = ProfileService.generate_profile(
        alignment=flat_alignment,
        target_offset_m=-1.5,
        db=db_session,
        user_id=user.id,
        project_id=proj.id
    )

    assert pkg.max_cut_depth_m == pytest.approx(1.5, abs=0.05)

    audit = db_session.query(AuditLog).filter_by(action="LONGITUDINAL_PROFILE_GENERATED").first()
    assert audit is not None
    assert audit.details["max_cut_depth_m"] == pytest.approx(1.5, abs=0.05)
