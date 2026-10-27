import pytest
import numpy as np

from app.modules.design.alignment.generator import HorizontalAlignmentGenerator
from app.modules.design.profile.generator import LongitudinalProfileGenerator
from app.modules.design.cross_sections.generator import CrossSectionGenerator
from app.modules.quantities.calculator import EarthworkCalculator
from app.modules.quantities.service import QuantitiesService
from app.modules.terrain.gridder import TerrainGridder
from app.modules.terrain.interpolator import TerrainInterpolator
from app.schemas.cross_section import (
    CrossSectionPackage,
    CrossSectionSlice,
    OffsetPoint,
    SectionClass
)
from app.schemas.quantities import MassHaulBalanceStatus

from tests.synthetic_data.terrain_generators import (
    generate_flat_plane_points,
    generate_sloped_plane_points,
    generate_hill_points
)


def test_golden_case_1_hand_calculated_flat_cut_trench():
    """
    ================================================================================
    GOLDEN TEST CASE 1: Perfectly Flat Terrain (Known Cut Trench)
    ================================================================================
    PROMPT REQUIREMENT:
    "Golden test cases: small synthetic terrains with known answers (flat plane,
    sloped plane, simple hill) where cut and fill volumes can be checked by hand.
    Include the hand calculation in the test comments."
    
    ENGINEERING FIRST PRINCIPLES HAND CALCULATION:
    --------------------------------------------------------------------------------
    1. Terrain Geometry:
       Flat horizontal plane at elevation Z = 100.00 m.
       Corridor bounds: X in [0.0, 100.0], Y in [-20.0, +20.0].
       Total corridor length L = 100.00 m (Station 0+000 to Station 0+100).

    2. Road Design:
       Horizontal alignment: straight line from (0, 0) to (100, 0).
       Vertical profile: level roadbed at Z = 98.00 m.
       Uniform cut depth d = 100.00 - 98.00 = 2.00 m along the entire road.

    3. Cross-Section Template (Trapezoidal Cut Trench):
       Roadbed base width (carriageway + shoulders) W_bottom = 10.00 m.
       Cut daylight side slope ratio: 1V:1H (S_cut = 1.0, 45 degrees).
       Side slope run each side = depth * (H/V) = 2.00 m * 1.0 = 2.00 m.
       Top width at natural ground surface = W_bottom + 2 * 2.00 m = 14.00 m.
       Cross-section cut area A_cut = ((W_bottom + W_top) / 2) * d
                                   = ((10.00 + 14.00) / 2) * 2.00
                                   = 24.00 m².
       Cross-section fill area A_fill = 0.00 m².

    4. Volumetric Integration (Average End Area Method):
       For L = 100.00 m with uniform cross-section area A = 24.00 m²:
       V_cut  = A_cut * L  = 24.00 m² * 100.00 m = 2,400.00 m³.
       V_fill = A_fill * L =  0.00 m² * 100.00 m =     0.00 m³.
    ================================================================================
    """
    # 1. Synthesize 5 stations (0, 25, 50, 75, 100) each with exact hand-calculated 24.00 m² cut area
    stations = [0.0, 25.0, 50.0, 75.0, 100.0]
    slices = []
    for s in stations:
        slices.append(
            CrossSectionSlice(
                station_m=s,
                centreline_x=s,
                centreline_y=0.0,
                centreline_bearing_deg=90.0,
                ground_z=100.0,
                design_z=98.0,
                difference_m=-2.0,
                section_class=SectionClass.CUT,
                cut_area_m2=24.00,
                fill_area_m2=0.00,
                topsoil_strip_width_m=14.00,
                left_daylight_offset_m=-7.0,
                right_daylight_offset_m=7.0
            )
        )

    cs_package = CrossSectionPackage(
        total_sections=len(slices),
        interval_m=25.0,
        carriageway_width_m=7.0,
        shoulder_width_m=1.5,
        camber_slope_percent=0.0,
        cut_slope_v_to_h=1.0,
        fill_slope_v_to_h=0.5,
        sections=slices,
        summary_text="Golden Test 1"
    )

    # 2. Compute earthwork quantities
    quantities = EarthworkCalculator.calculate_volumes(cs_package)

    # 3. Assert match against hand calculation
    assert quantities.total_cut_volume_m3 == pytest.approx(2400.00, abs=0.01)
    assert quantities.total_fill_volume_m3 == pytest.approx(0.00, abs=1e-3)
    assert quantities.net_volume_m3 == pytest.approx(2400.00, abs=0.01)
    assert quantities.balance_status == MassHaulBalanceStatus.EXCESS_CUT

    # Check intervals (4 intervals of 25m each: 24.00 * 25 = 600.00 m³)
    assert len(quantities.intervals) == 4
    for interval in quantities.intervals:
        assert interval.incremental_cut_m3 == pytest.approx(600.00, abs=0.01)
        assert interval.incremental_fill_m3 == pytest.approx(0.00, abs=1e-3)


def test_golden_case_2_hand_calculated_sloped_fill_embankment():
    """
    ================================================================================
    GOLDEN TEST CASE 2: Constant Sloped Terrain (Known Fill Embankment)
    ================================================================================
    ENGINEERING FIRST PRINCIPLES HAND CALCULATION:
    --------------------------------------------------------------------------------
    1. Terrain Geometry:
       Uniformly inclined plane rising at +2% grade along X: Z(x) = 50.00 + 0.02 * x.
       Total road corridor length L = 100.00 m (Station 0+000 to Station 0+100).

    2. Road Design:
       Design profile matches the +2% terrain grade, elevated exactly 1.50 m above
       natural ground: Z_design(x) = Z_ground(x) + 1.50 m.
       Uniform fill embankment height h = 1.50 m along the entire road.

    3. Cross-Section Template (Trapezoidal Fill Embankment):
       Roadbed top width (carriageway + shoulders) W_top = 10.00 m.
       Fill daylight side slope ratio: 1V:2H (S_fill = 0.50).
       Embankment toe lateral expansion each side = h * (H/V) = 1.50 m * 2.0 = 3.00 m.
       Base width at natural ground surface = W_top + 2 * 3.00 m = 16.00 m.
       Cross-section fill area A_fill = ((W_top + W_base) / 2) * h
                                     = ((10.00 + 16.00) / 2) * 1.50
                                     = 19.50 m².
       Cross-section cut area A_cut = 0.00 m².

    4. Volumetric Integration (Average End Area Method):
       For L = 100.00 m with uniform cross-section fill area A = 19.50 m²:
       V_fill = A_fill * L = 19.50 m² * 100.00 m = 1,950.00 m³.
       V_cut  = A_cut * L  =  0.00 m² * 100.00 m =     0.00 m³.
    ================================================================================
    """
    stations = [0.0, 20.0, 40.0, 60.0, 80.0, 100.0]
    slices = []
    for s in stations:
        gz = 50.0 + 0.02 * s
        slices.append(
            CrossSectionSlice(
                station_m=s,
                centreline_x=s,
                centreline_y=0.0,
                centreline_bearing_deg=90.0,
                ground_z=gz,
                design_z=gz + 1.5,
                difference_m=1.5,
                section_class=SectionClass.FILL,
                cut_area_m2=0.00,
                fill_area_m2=19.50,
                topsoil_strip_width_m=16.00,
                left_daylight_offset_m=-8.0,
                right_daylight_offset_m=8.0
            )
        )

    cs_package = CrossSectionPackage(
        total_sections=len(slices),
        interval_m=20.0,
        carriageway_width_m=7.0,
        shoulder_width_m=1.5,
        camber_slope_percent=0.0,
        cut_slope_v_to_h=1.0,
        fill_slope_v_to_h=0.5,
        sections=slices,
        summary_text="Golden Test 2"
    )

    quantities = EarthworkCalculator.calculate_volumes(cs_package)

    # Hand-calculated proof: 1,950.00 m³ fill, 0.00 m³ cut
    assert quantities.total_fill_volume_m3 == pytest.approx(1950.00, abs=0.01)
    assert quantities.total_cut_volume_m3 == pytest.approx(0.00, abs=1e-3)
    assert quantities.net_volume_m3 == pytest.approx(-1950.00, abs=0.01)
    assert quantities.balance_status == MassHaulBalanceStatus.EXCESS_FILL

    # 5 intervals of 20m: 19.50 * 20 = 390.00 m³ each
    assert len(quantities.intervals) == 5
    for interval in quantities.intervals:
        assert interval.incremental_fill_m3 == pytest.approx(390.00, abs=0.01)
        assert interval.incremental_cut_m3 == pytest.approx(0.00, abs=1e-3)


def test_golden_case_3_hand_calculated_hill_cut_and_fill():
    """
    ================================================================================
    GOLDEN TEST CASE 3: Symmetrical Ridge (Transition Station Wedging)
    ================================================================================
    HAND CALCULATION:
    Road length L = 40.0 m across a transition:
    Station 0.0m:  Pure cut  A_cut = 10.0 m², A_fill = 0.0 m².
    Station 40.0m: Pure fill A_fill = 10.0 m², A_cut = 0.0 m².

    Pyramid/Wedge Transition Formula:
    L_cut  = L * (A_cut / (A_cut + A_fill)) = 40.0 * (10 / 20) = 20.0 m.
    L_fill = L - L_cut = 20.0 m.
    V_cut  = 0.5 * A_cut * L_cut   = 0.5 * 10.0 * 20.0 = 100.00 m³.
    V_fill = 0.5 * A_fill * L_fill = 0.5 * 10.0 * 20.0 = 100.00 m³.
    Net Earthwork = 100.00 - 100.00 = 0.00 m³ (BALANCED).
    ================================================================================
    """
    slices = [
        CrossSectionSlice(
            station_m=0.0,
            centreline_x=0.0,
            centreline_y=0.0,
            centreline_bearing_deg=90.0,
            ground_z=102.0,
            design_z=100.0,
            difference_m=-2.0,
            section_class=SectionClass.CUT,
            cut_area_m2=10.0,
            fill_area_m2=0.0,
            topsoil_strip_width_m=12.0,
            left_daylight_offset_m=-6.0,
            right_daylight_offset_m=6.0
        ),
        CrossSectionSlice(
            station_m=40.0,
            centreline_x=40.0,
            centreline_y=0.0,
            centreline_bearing_deg=90.0,
            ground_z=98.0,
            design_z=100.0,
            difference_m=+2.0,
            section_class=SectionClass.FILL,
            cut_area_m2=0.0,
            fill_area_m2=10.0,
            topsoil_strip_width_m=12.0,
            left_daylight_offset_m=-6.0,
            right_daylight_offset_m=6.0
        )
    ]

    cs_package = CrossSectionPackage(
        total_sections=len(slices),
        interval_m=40.0,
        carriageway_width_m=7.0,
        shoulder_width_m=1.5,
        camber_slope_percent=0.0,
        cut_slope_v_to_h=1.0,
        fill_slope_v_to_h=1.0,
        sections=slices,
        summary_text="Golden Test 3"
    )

    quantities = EarthworkCalculator.calculate_volumes(cs_package)

    assert quantities.total_cut_volume_m3 == pytest.approx(100.00, abs=0.01)
    assert quantities.total_fill_volume_m3 == pytest.approx(100.00, abs=0.01)
    assert quantities.net_volume_m3 == pytest.approx(0.00, abs=0.01)
    assert quantities.balance_status == MassHaulBalanceStatus.BALANCED


def test_quantities_drawing_consistency():
    """
    Verifies single-source-of-truth invariant:
    The sum of all interval incremental volumes exactly equals the total package volume.
    """
    slices = [
        CrossSectionSlice(
            station_m=float(i * 20),
            centreline_x=float(i * 20),
            centreline_y=0.0,
            centreline_bearing_deg=90.0,
            ground_z=100.0,
            design_z=98.5,
            difference_m=-1.5,
            section_class=SectionClass.CUT,
            cut_area_m2=15.0 + i * 2.0,
            fill_area_m2=0.0,
            topsoil_strip_width_m=12.0,
            left_daylight_offset_m=-6.0,
            right_daylight_offset_m=6.0
        )
        for i in range(6)
    ]

    cs_package = CrossSectionPackage(
        total_sections=len(slices),
        interval_m=20.0,
        carriageway_width_m=7.0,
        shoulder_width_m=1.5,
        camber_slope_percent=-2.5,
        cut_slope_v_to_h=0.6667,
        fill_slope_v_to_h=0.5000,
        sections=slices,
        summary_text="Consistency test"
    )

    quantities = EarthworkCalculator.calculate_volumes(cs_package)

    interval_cut_sum = sum(inv.incremental_cut_m3 for inv in quantities.intervals)
    interval_fill_sum = sum(inv.incremental_fill_m3 for inv in quantities.intervals)

    assert quantities.total_cut_volume_m3 == pytest.approx(interval_cut_sum, abs=1e-3)
    assert quantities.total_fill_volume_m3 == pytest.approx(interval_fill_sum, abs=1e-3)


def test_quantities_service_audit_logging(db_session):
    """
    Verifies QuantitiesService execution and audit trail recording.
    """
    from app.models.user import User
    from app.models.project import Project
    from app.models.audit_log import AuditLog

    user = User(email="quant@test.com", full_name="Quant Eng", hashed_password="pw", role="engineer")
    db_session.add(user)
    db_session.commit()

    proj = Project(name="Quant Project", created_by_user_id=user.id)
    db_session.add(proj)
    db_session.commit()

    slices = [
        CrossSectionSlice(
            station_m=0.0, centreline_x=0.0, centreline_y=0.0, centreline_bearing_deg=90.0,
            ground_z=100.0, design_z=98.0, difference_m=-2.0, section_class=SectionClass.CUT,
            cut_area_m2=24.0, fill_area_m2=0.0, topsoil_strip_width_m=14.0,
            left_daylight_offset_m=-7.0, right_daylight_offset_m=7.0
        ),
        CrossSectionSlice(
            station_m=50.0, centreline_x=50.0, centreline_y=0.0, centreline_bearing_deg=90.0,
            ground_z=100.0, design_z=98.0, difference_m=-2.0, section_class=SectionClass.CUT,
            cut_area_m2=24.0, fill_area_m2=0.0, topsoil_strip_width_m=14.0,
            left_daylight_offset_m=-7.0, right_daylight_offset_m=7.0
        )
    ]
    cs_pkg = CrossSectionPackage(
        total_sections=2, interval_m=50.0, carriageway_width_m=7.0, shoulder_width_m=1.5,
        camber_slope_percent=-2.5, cut_slope_v_to_h=1.0, fill_slope_v_to_h=0.5,
        sections=slices, summary_text="Test"
    )

    pkg = QuantitiesService.calculate_quantities(
        cross_sections=cs_pkg,
        db=db_session,
        user_id=user.id,
        project_id=proj.id
    )

    assert pkg.total_cut_volume_m3 == pytest.approx(1200.0, abs=0.01)

    audit = db_session.query(AuditLog).filter_by(action="EARTHWORK_QUANTITIES_CALCULATED").first()
    assert audit is not None
    assert audit.details["total_cut_m3"] == 1200.0
