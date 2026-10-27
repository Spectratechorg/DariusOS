import math
import numpy as np
import pytest

from app.modules.design.alignment.geometry import (
    calculate_bearing,
    compute_circular_curve,
    build_continuous_centreline,
    discretize_centreline_stations
)
from app.modules.design.alignment.generator import HorizontalAlignmentGenerator
from app.modules.design.alignment.service import AlignmentService
from app.modules.terrain.gridder import TerrainGridder
from app.modules.terrain.interpolator import TerrainInterpolator
from app.schemas.alignment import AlignmentElementType

from tests.synthetic_data.terrain_generators import (
    generate_flat_plane_points,
    generate_sloped_plane_points,
    generate_hill_points
)


@pytest.fixture
def flat_terrain():
    pts = generate_flat_plane_points(length_x=120.0, width_y=60.0, spacing=2.0, z_elevation=100.0)
    grid_z, meta = TerrainGridder.create_dem_grid(pts, cell_size_m=1.0)
    return TerrainInterpolator(grid_z, meta)


@pytest.fixture
def sloped_terrain():
    pts = generate_sloped_plane_points(length_x=120.0, width_y=60.0, spacing=2.0, grade=0.03, z_base=100.0)
    grid_z, meta = TerrainGridder.create_dem_grid(pts, cell_size_m=1.0)
    return TerrainInterpolator(grid_z, meta)


def test_calculate_bearing_cardinal_directions():
    """Verifies whole-circle bearing calculations across cardinal quadrants."""
    assert calculate_bearing((0, 0), (0, 10)) == pytest.approx(0.0, abs=1e-3)    # North
    assert calculate_bearing((0, 0), (10, 0)) == pytest.approx(90.0, abs=1e-3)   # East
    assert calculate_bearing((0, 0), (0, -10)) == pytest.approx(180.0, abs=1e-3) # South
    assert calculate_bearing((0, 0), (-10, 0)) == pytest.approx(270.0, abs=1e-3) # West
    assert calculate_bearing((0, 0), (10, 10)) == pytest.approx(45.0, abs=1e-3)  # North-East


def test_straight_horizontal_alignment(flat_terrain):
    """
    Verifies generation of a straight road centreline between (0, 0) and (100, 0).
    Checks stationing at 20m intervals, bearings, and grade compliance.
    """
    package = HorizontalAlignmentGenerator.generate(
        start_xy=(0.0, 0.0),
        end_xy=(100.0, 0.0),
        terrain=flat_terrain,
        station_interval_m=20.0
    )

    assert package.total_length_m == pytest.approx(100.0, abs=0.01)
    assert len(package.curves) == 0
    assert package.is_grade_compliant is True
    assert package.max_detected_ground_grade_percent == pytest.approx(0.0, abs=1e-2)

    # Check station intervals: 0, 20, 40, 60, 80, 100
    stations = package.stations
    assert len(stations) == 6
    assert stations[0].station_m == 0.0
    assert stations[-1].station_m == 100.0
    for i, st in enumerate(stations):
        expected_s = i * 20.0
        assert st.station_m == pytest.approx(expected_s, abs=0.01)
        assert st.bearing_deg == pytest.approx(90.0, abs=0.1)  # Due East
        assert st.ground_z == pytest.approx(100.0, abs=0.01)
        assert st.segment_type == AlignmentElementType.TANGENT


def test_curved_horizontal_alignment_with_intermediate_pi(flat_terrain):
    """
    Verifies insertion of a circular curve at an intermediate Point of Intersection.
    """
    start = (0.0, 0.0)
    pi = (50.0, 15.0)
    end = (100.0, 0.0)

    package = HorizontalAlignmentGenerator.generate(
        start_xy=start,
        end_xy=end,
        terrain=flat_terrain,
        intermediate_pis=[pi],
        station_interval_m=10.0
    )

    assert package.total_length_m > 100.0
    assert len(package.curves) == 1
    curve = package.curves[0]

    assert curve.radius_m > 0.0
    assert curve.tangent_length_m > 0.0
    assert curve.arc_length_m > 0.0
    assert curve.deflection_angle_deg > 0.0

    # Ensure curve stations exist in discretized stations
    curve_stations = [st for st in package.stations if st.segment_type == AlignmentElementType.CIRCULAR_CURVE]
    assert len(curve_stations) > 0


def test_grade_evaluation_on_sloping_terrain(sloped_terrain):
    """
    Verifies that ground slope along the road corridor is accurately detected and reported.
    Terrain has 3% grade along X.
    """
    package = HorizontalAlignmentGenerator.generate(
        start_xy=(0.0, 0.0),
        end_xy=(100.0, 0.0),
        terrain=sloped_terrain,
        station_interval_m=20.0
    )

    assert package.is_grade_compliant is True
    # Ground grade along X should be approximately 3.0%
    assert package.max_detected_ground_grade_percent == pytest.approx(3.0, abs=0.3)


def test_stationing_monotonic_and_continuous(flat_terrain):
    """
    Verifies that station chainage s is strictly monotonically increasing.
    """
    package = HorizontalAlignmentGenerator.generate(
        start_xy=(10.0, -10.0),
        end_xy=(90.0, 10.0),
        terrain=flat_terrain,
        station_interval_m=15.0
    )

    stations = package.stations
    for i in range(1, len(stations)):
        assert stations[i].station_m > stations[i - 1].station_m
        step = stations[i].station_m - stations[i - 1].station_m
        assert step <= 15.01


def test_alignment_out_of_bounds_error(flat_terrain):
    """
    Verifies that start or end coordinates outside terrain survey bounds are rejected.
    """
    with pytest.raises(ValueError, match="outside the survey terrain bounds"):
        HorizontalAlignmentGenerator.generate(
            start_xy=(-500.0, 0.0),
            end_xy=(100.0, 0.0),
            terrain=flat_terrain
        )


def test_alignment_service_logging(flat_terrain, db_session):
    """
    Verifies AlignmentService execution and audit trail recording.
    """
    from app.models.user import User
    from app.models.project import Project
    from app.models.audit_log import AuditLog

    user = User(email="align@test.com", full_name="Align Eng", hashed_password="pw", role="engineer")
    db_session.add(user)
    db_session.commit()

    proj = Project(name="Route Alpha", created_by_user_id=user.id)
    db_session.add(proj)
    db_session.commit()

    package = AlignmentService.generate_alignment(
        start_xy=(0.0, 0.0),
        end_xy=(100.0, 0.0),
        terrain=flat_terrain,
        db=db_session,
        user_id=user.id,
        project_id=proj.id
    )

    assert package.total_length_m == pytest.approx(100.0, abs=0.1)

    # Check audit log
    audit = db_session.query(AuditLog).filter_by(action="HORIZONTAL_ALIGNMENT_GENERATED").first()
    assert audit is not None
    assert audit.details["total_length_m"] == 100.0
