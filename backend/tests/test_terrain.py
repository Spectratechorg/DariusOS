import numpy as np
import pytest

from app.modules.terrain.gridder import TerrainGridder
from app.modules.terrain.interpolator import TerrainInterpolator
from app.modules.terrain.service import TerrainService
from tests.synthetic_data.terrain_generators import (
    generate_flat_plane_points,
    generate_sloped_plane_points,
    generate_hill_points
)


def test_terrain_gridder_flat_plane():
    """
    Verifies that gridding a flat plane at z=100.0m yields exact 100.0m everywhere.
    """
    points = generate_flat_plane_points(length_x=100.0, width_y=40.0, spacing=2.0, z_elevation=100.0)
    grid_z, meta = TerrainGridder.create_dem_grid(points, cell_size_m=1.0)

    assert meta.min_z == pytest.approx(100.0, abs=1e-3)
    assert meta.max_z == pytest.approx(100.0, abs=1e-3)
    assert meta.mean_z == pytest.approx(100.0, abs=1e-3)

    interpolator = TerrainInterpolator(grid_z, meta)

    # Test arbitrary query points across the grid
    for test_x, test_y in [(0.0, 0.0), (33.3, 12.7), (78.9, -15.4), (100.0, 20.0)]:
        z = interpolator.get_elevation(test_x, test_y)
        assert z == pytest.approx(100.0, abs=1e-3)

    # Slope on a flat plane should be 0.0%
    slope = interpolator.get_slope_percent(50.0, 0.0)
    assert slope == pytest.approx(0.0, abs=1e-2)


def test_terrain_gridder_sloped_plane():
    """
    Verifies that a uniformly sloped plane Z(x) = 50.0 + 0.02*x interpolates
    accurately and reports a 2.0% ground slope.
    """
    points = generate_sloped_plane_points(length_x=100.0, width_y=40.0, spacing=2.0, grade=0.02, z_base=50.0)
    grid_z, meta = TerrainGridder.create_dem_grid(points, cell_size_m=1.0)
    interpolator = TerrainInterpolator(grid_z, meta)

    # Analytical verification: Z(x) = 50.0 + 0.02 * x
    test_stations = [0.0, 20.0, 45.5, 70.0, 100.0]
    for x in test_stations:
        expected_z = 50.0 + 0.02 * x
        computed_z = interpolator.get_elevation(x, 0.0)
        assert computed_z == pytest.approx(expected_z, abs=0.05)

    # Slope check: gradient along X is 0.02 -> 2.0% slope
    slope = interpolator.get_slope_percent(50.0, 0.0)
    assert slope == pytest.approx(2.0, abs=0.1)


def test_terrain_gridder_parabolic_hill():
    """
    Verifies that a symmetrical hill with summit at x=50m (peak z=104.0m) and base z=100.0m
    is accurately reconstructed in the elevation grid.
    """
    points = generate_hill_points(length_x=100.0, width_y=40.0, spacing=2.0, peak_height=4.0, z_base=100.0)
    grid_z, meta = TerrainGridder.create_dem_grid(points, cell_size_m=1.0)
    interpolator = TerrainInterpolator(grid_z, meta)

    # Check summit at (50, 0)
    peak_z = interpolator.get_elevation(50.0, 0.0)
    assert peak_z == pytest.approx(104.0, abs=0.1)

    # Check flanks at x=0 and x=100
    base_start_z = interpolator.get_elevation(0.0, 0.0)
    base_end_z = interpolator.get_elevation(100.0, 0.0)
    assert base_start_z == pytest.approx(100.0, abs=0.1)
    assert base_end_z == pytest.approx(100.0, abs=0.1)


def test_terrain_interpolator_vectorized_and_corridor_sampling():
    """
    Verifies vectorized elevation sampling and line corridor profile sampling.
    """
    points = generate_sloped_plane_points(length_x=100.0, width_y=40.0, spacing=2.0, grade=0.05, z_base=100.0)
    grid_z, meta = TerrainGridder.create_dem_grid(points, cell_size_m=1.0)
    interpolator = TerrainInterpolator(grid_z, meta)

    # Vectorized test
    xs = np.array([0.0, 25.0, 50.0, 75.0, 100.0])
    ys = np.array([0.0, 0.0, 0.0, 0.0, 0.0])
    zs = interpolator.get_elevations(xs, ys)

    expected = 100.0 + 0.05 * xs
    np.testing.assert_allclose(zs, expected, atol=0.05)

    # Corridor line sampling from (0,0) to (100,0) with 10m interval
    samples = interpolator.sample_corridor_line((0.0, 0.0), (100.0, 0.0), interval_m=10.0)
    assert len(samples) == 11  # 0, 10, 20, ..., 100
    assert samples[0][0] == 0.0
    assert samples[-1][0] == 100.0
    assert samples[0][3] == pytest.approx(100.0, abs=0.05)
    assert samples[-1][3] == pytest.approx(105.0, abs=0.05)


def test_terrain_service_caching_and_persistence():
    """
    Verifies that TerrainService creates and caches the DEM on disk,
    allowing sub-second reloads without recalculation.
    """
    points = generate_flat_plane_points(length_x=50.0, width_y=20.0, spacing=2.0)
    fake_hash = "abc123456789deadbeef1234567890abcdef1234567890abcdef1234567890ab"

    # Initial build
    surface_data1, interp1 = TerrainService.build_terrain_model(
        survey_file_id="file-1",
        survey_sha256=fake_hash,
        cleaned_points=points,
        cell_size_m=1.0,
        force_recompute=True
    )
    assert surface_data1.grid_metadata.ncols > 0

    # Cached load
    surface_data2, interp2 = TerrainService.build_terrain_model(
        survey_file_id="file-1",
        survey_sha256=fake_hash,
        cleaned_points=points,
        cell_size_m=1.0,
        force_recompute=False
    )
    assert surface_data2.grid_storage_path == surface_data1.grid_storage_path
    assert interp2.get_elevation(10.0, 5.0) == pytest.approx(interp1.get_elevation(10.0, 5.0), abs=1e-4)


def test_terrain_boundary_clamping_robustness():
    """
    Verifies that querying coordinates slightly outside bounds clamps safely without raising exceptions or returning NaNs.
    """
    points = generate_flat_plane_points(length_x=50.0, width_y=20.0, spacing=2.0, z_elevation=100.0)
    grid_z, meta = TerrainGridder.create_dem_grid(points, cell_size_m=1.0)
    interpolator = TerrainInterpolator(grid_z, meta)

    # Point slightly outside bounds
    z_out = interpolator.get_elevation(-5.0, 50.0)
    assert not np.isnan(z_out)
    assert z_out == pytest.approx(100.0, abs=1e-3)
