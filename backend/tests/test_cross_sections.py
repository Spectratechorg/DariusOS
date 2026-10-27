import pytest
import numpy as np

from app.modules.design.alignment.generator import HorizontalAlignmentGenerator
from app.modules.design.profile.generator import LongitudinalProfileGenerator
from app.modules.design.cross_sections.template import build_roadbed_template_points
from app.modules.design.cross_sections.daylight import solve_daylight_intersection
from app.modules.design.cross_sections.polygon import calculate_cross_section_areas
from app.modules.design.cross_sections.generator import CrossSectionGenerator
from app.modules.design.cross_sections.service import CrossSectionService
from app.modules.terrain.gridder import TerrainGridder
from app.modules.terrain.interpolator import TerrainInterpolator
from app.schemas.cross_section import SectionClass

from tests.synthetic_data.terrain_generators import (
    generate_flat_plane_points,
    generate_sloped_plane_points
)


def test_roadbed_template_generation():
    """
    Verifies that the roadbed template generates symmetric coordinates for carriageway and shoulders.
    Carriageway = 7.0m, Shoulder = 1.5m -> Total formation width = 10.0m.
    """
    pts = build_roadbed_template_points(
        design_z=100.0,
        carriageway_width_m=7.0,
        shoulder_width_m=1.5,
        camber_percent=-2.5,
        shoulder_slope_percent=-4.0
    )

    assert len(pts) == 5
    # Crown at 0
    assert pts[2] == (0.0, 100.0)
    # Left shoulder hinge at -5.0m, right at +5.0m
    assert pts[0][0] == -5.0
    assert pts[-1][0] == 5.0
    # Left and right elevations symmetric
    assert pts[0][1] == pytest.approx(pts[-1][1], abs=1e-4)


def test_golden_case_1_cross_section_cut_trench():
    """
    GOLDEN TEST CASE 1 (Cross-Section Cut Area):
    -------------------------------------------------
    Terrain: Flat plane at z = 100.00m.
    Design: Level roadbed at z = 98.00m (Uniform 2.00m cut).
    Template: 10.0m flat base width, 1V:1H side slopes (S_cut = 1.0).
    
    HAND CALCULATION:
    Cut depth d = 100.0 - 98.0 = 2.00m.
    Side slope width each side = d * (H/V) = 2.00 * 1.0 = 2.00m.
    Top width at ground surface = 10.0 + 2 * 2.00 = 14.00m.
    Theoretical Cut Area = ((W_bottom + W_top) / 2) * d
                         = ((10.00 + 14.00) / 2) * 2.00
                         = 24.00 m².
    Theoretical Fill Area = 0.00 m².
    -------------------------------------------------
    """
    # 1. Synthesize flat terrain at z=100.0m
    pts = generate_flat_plane_points(length_x=100.0, width_y=40.0, spacing=2.0, z_elevation=100.0)
    grid_z, meta = TerrainGridder.create_dem_grid(pts, cell_size_m=1.0)
    terrain = TerrainInterpolator(grid_z, meta)

    # 2. Horizontal alignment along X axis
    alignment = HorizontalAlignmentGenerator.generate(
        start_xy=(0.0, 0.0),
        end_xy=(100.0, 0.0),
        terrain=terrain,
        station_interval_m=20.0
    )

    # 3. Longitudinal profile at z=98.00m (2.0m cut)
    profile = LongitudinalProfileGenerator.generate(
        alignment=alignment,
        target_offset_m=-2.0
    )

    # 4. Generate cross-sections with 1V:1H cut slope and flat 10m bed for exact proof
    # Test polygon calculation directly with 1:1 slopes
    ground_slice = [(-15.0, 100.0), (0.0, 100.0), (15.0, 100.0)]
    left_daylight_w, left_daylight_z, is_cut = solve_daylight_intersection(
        hinge_offset=-5.0,
        hinge_z=98.0,
        side="LEFT",
        ground_pts=ground_slice,
        cut_slope_v_to_h=1.0,
        fill_slope_v_to_h=0.5
    )
    right_daylight_w, right_daylight_z, _ = solve_daylight_intersection(
        hinge_offset=5.0,
        hinge_z=98.0,
        side="RIGHT",
        ground_pts=ground_slice,
        cut_slope_v_to_h=1.0,
        fill_slope_v_to_h=0.5
    )

    # Hand calculation verification for daylight offsets:
    # Left daylight = -5.0 - 2.0 = -7.0m; Right daylight = +5.0 + 2.0 = +7.0m
    assert left_daylight_w == pytest.approx(-7.0, abs=0.05)
    assert right_daylight_w == pytest.approx(7.0, abs=0.05)
    assert is_cut is True

    template_pts = [
        (left_daylight_w, 100.0),
        (-5.0, 98.0),
        (5.0, 98.0),
        (right_daylight_w, 100.0)
    ]
    cut_area, fill_area, foot_w = calculate_cross_section_areas(
        template_pts=template_pts,
        ground_pts=ground_slice,
        left_daylight_w=left_daylight_w,
        right_daylight_w=right_daylight_w
    )

    # Hand-calculated proof: 24.00 m² cut, 0.00 m² fill
    assert cut_area == pytest.approx(24.00, abs=0.05)
    assert fill_area == pytest.approx(0.00, abs=1e-3)
    assert foot_w == pytest.approx(14.00, abs=0.1)


def test_golden_case_2_cross_section_fill_embankment():
    """
    GOLDEN TEST CASE 2 (Cross-Section Fill Area):
    -------------------------------------------------
    Terrain: Uniform plane at z = 50.00m.
    Design: Level roadbed at z = 51.50m (Uniform 1.50m fill).
    Template: 10.0m flat base width, 1V:2H fill slopes (S_fill = 0.50).
    
    HAND CALCULATION:
    Fill height h = 51.50 - 50.00 = 1.50m.
    Toe expansion each side = h * (H/V) = 1.50 * 2.0 = 3.00m.
    Base width at ground surface = 10.0 + 2 * 3.00 = 16.00m.
    Theoretical Fill Area = ((W_top + W_base) / 2) * h
                          = ((10.00 + 16.00) / 2) * 1.50
                          = 19.50 m².
    Theoretical Cut Area = 0.00 m².
    -------------------------------------------------
    """
    ground_slice = [(-15.0, 50.0), (0.0, 50.0), (15.0, 50.0)]
    left_daylight_w, left_daylight_z, is_cut = solve_daylight_intersection(
        hinge_offset=-5.0,
        hinge_z=51.5,
        side="LEFT",
        ground_pts=ground_slice,
        cut_slope_v_to_h=1.0,
        fill_slope_v_to_h=0.5
    )
    right_daylight_w, right_daylight_z, _ = solve_daylight_intersection(
        hinge_offset=5.0,
        hinge_z=51.5,
        side="RIGHT",
        ground_pts=ground_slice,
        cut_slope_v_to_h=1.0,
        fill_slope_v_to_h=0.5
    )

    # Left daylight = -5.0 - 3.0 = -8.0m; Right daylight = +5.0 + 3.0 = +8.0m
    assert left_daylight_w == pytest.approx(-8.0, abs=0.05)
    assert right_daylight_w == pytest.approx(8.0, abs=0.05)
    assert is_cut is False

    template_pts = [
        (left_daylight_w, 50.0),
        (-5.0, 51.5),
        (5.0, 51.5),
        (right_daylight_w, 50.0)
    ]
    cut_area, fill_area, foot_w = calculate_cross_section_areas(
        template_pts=template_pts,
        ground_pts=ground_slice,
        left_daylight_w=left_daylight_w,
        right_daylight_w=right_daylight_w
    )

    # Hand-calculated proof: 19.50 m² fill, 0.00 m² cut
    assert fill_area == pytest.approx(19.50, abs=0.05)
    assert cut_area == pytest.approx(0.00, abs=1e-3)
    assert foot_w == pytest.approx(16.00, abs=0.1)


def test_cross_section_generator_pipeline_flow():
    """
    Verifies that CrossSectionGenerator processes an entire road alignment,
    generating cross sections at each station interval with populated slices.
    """
    pts = generate_flat_plane_points(length_x=100.0, width_y=40.0, spacing=2.0, z_elevation=100.0)
    grid_z, meta = TerrainGridder.create_dem_grid(pts, cell_size_m=1.0)
    terrain = TerrainInterpolator(grid_z, meta)

    alignment = HorizontalAlignmentGenerator.generate((0, 0), (100, 0), terrain, station_interval_m=20.0)
    profile = LongitudinalProfileGenerator.generate(alignment, target_offset_m=-1.5)

    package = CrossSectionGenerator.generate(
        alignment=alignment,
        profile=profile,
        terrain=terrain
    )

    assert package.total_sections == 6
    assert len(package.sections) == 6
    for sec in package.sections:
        assert sec.section_class == SectionClass.CUT
        assert sec.cut_area_m2 > 0.0
        assert sec.fill_area_m2 == 0.0
        assert len(sec.ground_profile) > 0
        assert len(sec.design_template) > 0
        assert sec.left_daylight_offset_m < 0.0
        assert sec.right_daylight_offset_m > 0.0


def test_cross_section_service_audit_logging(db_session):
    """
    Verifies CrossSectionService execution and audit trail recording.
    """
    from app.models.user import User
    from app.models.project import Project
    from app.models.audit_log import AuditLog

    pts = generate_flat_plane_points(length_x=60.0, width_y=30.0, spacing=2.0, z_elevation=100.0)
    grid_z, meta = TerrainGridder.create_dem_grid(pts, cell_size_m=1.0)
    terrain = TerrainInterpolator(grid_z, meta)

    alignment = HorizontalAlignmentGenerator.generate((0, 0), (60, 0), terrain, station_interval_m=20.0)
    profile = LongitudinalProfileGenerator.generate(alignment, target_offset_m=-1.0)

    user = User(email="cs@test.com", full_name="CS Eng", hashed_password="pw", role="engineer")
    db_session.add(user)
    db_session.commit()

    proj = Project(name="CS Project", created_by_user_id=user.id)
    db_session.add(proj)
    db_session.commit()

    pkg = CrossSectionService.generate_cross_sections(
        alignment=alignment,
        profile=profile,
        terrain=terrain,
        db=db_session,
        user_id=user.id,
        project_id=proj.id
    )

    assert pkg.total_sections == 4
    audit = db_session.query(AuditLog).filter_by(action="CROSS_SECTIONS_GENERATED").first()
    assert audit is not None
    assert audit.details["total_sections"] == 4
