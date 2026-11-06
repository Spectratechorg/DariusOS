"""Strider K3: Golden case test suite and hand arithmetic verification.

This test suite:
1. Validates that rules.yaml loads and contains required geometric parameters.
2. Verifies ground heights on generated synthetic terrains (fake_data/*.csv).
3. Verifies hand-calculated cross-section areas, interval volumes, and mass haul
   cumulative sums across all three golden terrains (flat, slope, hill).
4. Provides placeholder xfail tests for future engine integration (Tasks K14/K16).

No client data is used. All inputs and geometries are purely synthetic.
"""
import csv
import json
from pathlib import Path
import pytest
import yaml

from gen_terrain import ground_height, BASE_H, SLOPE, HILL_H, HILL_CENTRE, HILL_FLANK

REPO_ROOT = Path(__file__).resolve().parent.parent
RULES_PATH = REPO_ROOT / "rules.yaml"
FAKE_DATA_DIR = REPO_ROOT / "fake_data"
GOLDEN_CASES_DIR = REPO_ROOT / "golden_cases"


@pytest.fixture(scope="session")
def rules():
    """Load and return geometric design rules configuration."""
    assert RULES_PATH.exists(), f"Configuration file not found: {RULES_PATH}"
    with RULES_PATH.open("r", encoding="utf-8") as f:
        data = yaml.safe_load(f)
    return data


def test_rules_config_validity(rules):
    """Ensure all required engineering parameters exist and are flagged as provisional."""
    assert "geometry" in rules
    assert "earthworks" in rules
    assert "metadata" in rules
    assert "TO BE CONFIRMED" in rules["metadata"]["status"]

    geom = rules["geometry"]
    earth = rules["earthworks"]

    assert geom["carriageway_width_m"] == 7.0
    assert earth["fill_slope_horizontal_run"] == 1.5
    assert earth["cut_slope_horizontal_run"] == 1.5
    assert earth["station_interval_m"] == 25.0
    assert earth["volume_method"] == "AVERAGE_END_AREA"


@pytest.mark.parametrize("kind", ["flat", "slope", "hill"])
def test_synthetic_terrain_csv_ground_heights(kind):
    """Verify that generated survey CSV points match exact analytical ground heights."""
    csv_file = FAKE_DATA_DIR / f"{kind}.csv"
    assert csv_file.exists(), f"Missing synthetic survey file: {csv_file}. Run gen_terrain.py first."

    origin_e = 100000.0
    origin_n = 200000.0

    with csv_file.open("r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            north = float(row["North"])
            east = float(row["East"])
            height = float(row["Height"])
            e_along = east - origin_e
            n_offset = north - origin_n

            expected_h = round(ground_height(kind, e_along, n_offset), 4)
            assert height == pytest.approx(expected_h, abs=1e-4), (
                f"Ground height mismatch at E={east}, N={north} on {kind} terrain: "
                f"got {height}, expected {expected_h}"
            )


def test_hand_arithmetic_flat(rules):
    """Verify hand calculation arithmetic for Golden Case 1: Flat Terrain."""
    case_file = GOLDEN_CASES_DIR / "flat_case.json"
    assert case_file.exists(), f"Missing golden case definition: {case_file}"
    case = json.loads(case_file.read_text(encoding="utf-8"))

    w = rules["geometry"]["carriageway_width_m"]
    s_fill = rules["earthworks"]["fill_slope_horizontal_run"]
    s_cut = rules["earthworks"]["cut_slope_horizontal_run"]
    design_level = case["design_parameters"]["design_level_m"]

    cum_cut = 0.0
    cum_fill = 0.0

    for i, interval in enumerate(case["earthwork_schedule"]):
        from_st = interval["from_station_m"]
        to_st = interval["to_station_m"]
        dist = interval["distance_m"]
        assert dist == to_st - from_st

        # Ground level is 300.0m everywhere
        g_start = ground_height("flat", from_st)
        g_end = ground_height("flat", to_st)
        assert g_start == 300.0
        assert g_end == 300.0

        # Fill depths: design - ground
        d_start = design_level - g_start
        d_end = design_level - g_end
        assert d_start == 1.0
        assert d_end == 1.0

        # Symmetric trapezoidal area: (W + s * d) * d
        a_fill_start = (w + s_fill * d_start) * d_start
        a_fill_end = (w + s_fill * d_end) * d_end
        assert a_fill_start == pytest.approx(8.50, abs=1e-6)
        assert a_fill_end == pytest.approx(8.50, abs=1e-6)
        assert interval["fill_area_start_m2"] == pytest.approx(a_fill_start, abs=1e-6)
        assert interval["fill_area_end_m2"] == pytest.approx(a_fill_end, abs=1e-6)

        # Average End Area volume: ((A1 + A2) / 2) * dist
        v_fill = ((a_fill_start + a_fill_end) / 2.0) * dist
        assert v_fill == pytest.approx(212.50, abs=1e-6)
        assert interval["fill_volume_m3"] == pytest.approx(v_fill, abs=1e-6)

        v_cut = 0.0
        assert interval["cut_volume_m3"] == 0.0

        cum_fill += v_fill
        cum_cut += v_cut

        assert interval["cumulative_fill_m3"] == pytest.approx(cum_fill, abs=1e-6)
        assert interval["cumulative_cut_m3"] == pytest.approx(cum_cut, abs=1e-6)
        assert interval["cumulative_net_m3"] == pytest.approx(cum_cut - cum_fill, abs=1e-6)

    assert cum_cut == pytest.approx(0.0, abs=1e-6)
    assert cum_fill == pytest.approx(1700.0, abs=1e-6)
    assert case["totals"]["total_fill_volume_m3"] == pytest.approx(1700.0, abs=1e-6)
    assert case["totals"]["final_net_volume_m3"] == pytest.approx(-1700.0, abs=1e-6)


def test_hand_arithmetic_slope(rules):
    """Verify hand calculation arithmetic for Golden Case 2: Slope Terrain."""
    case_file = GOLDEN_CASES_DIR / "slope_case.json"
    assert case_file.exists(), f"Missing golden case definition: {case_file}"
    case = json.loads(case_file.read_text(encoding="utf-8"))

    w = rules["geometry"]["carriageway_width_m"]
    s_fill = rules["earthworks"]["fill_slope_horizontal_run"]
    s_cut = rules["earthworks"]["cut_slope_horizontal_run"]
    design_level = case["design_parameters"]["design_level_m"]

    cum_cut = 0.0
    cum_fill = 0.0

    for interval in case["earthwork_schedule"]:
        from_st = interval["from_station_m"]
        to_st = interval["to_station_m"]
        dist = interval["distance_m"]

        g_start = ground_height("slope", from_st)
        g_end = ground_height("slope", to_st)

        diff_start = design_level - g_start
        diff_end = design_level - g_end

        # Calculate start areas
        if diff_start > 0:  # Fill
            a_fill_start = (w + s_fill * diff_start) * diff_start
            a_cut_start = 0.0
        else:  # Cut
            a_fill_start = 0.0
            a_cut_start = (w + s_cut * abs(diff_start)) * abs(diff_start)

        # Calculate end areas
        if diff_end > 0:  # Fill
            a_fill_end = (w + s_fill * diff_end) * diff_end
            a_cut_end = 0.0
        else:  # Cut
            a_fill_end = 0.0
            a_cut_end = (w + s_cut * abs(diff_end)) * abs(diff_end)

        assert interval["fill_area_start_m2"] == pytest.approx(a_fill_start, abs=1e-6)
        assert interval["fill_area_end_m2"] == pytest.approx(a_fill_end, abs=1e-6)
        assert interval["cut_area_start_m2"] == pytest.approx(a_cut_start, abs=1e-6)
        assert interval["cut_area_end_m2"] == pytest.approx(a_cut_end, abs=1e-6)

        v_fill = ((a_fill_start + a_fill_end) / 2.0) * dist
        v_cut = ((a_cut_start + a_cut_end) / 2.0) * dist

        assert interval["fill_volume_m3"] == pytest.approx(v_fill, abs=1e-6)
        assert interval["cut_volume_m3"] == pytest.approx(v_cut, abs=1e-6)

        cum_fill += v_fill
        cum_cut += v_cut

        assert interval["cumulative_fill_m3"] == pytest.approx(cum_fill, abs=1e-6)
        assert interval["cumulative_cut_m3"] == pytest.approx(cum_cut, abs=1e-6)
        assert interval["cumulative_net_m3"] == pytest.approx(cum_cut - cum_fill, abs=1e-6)

    assert cum_cut == pytest.approx(906.25, abs=1e-6)
    assert cum_fill == pytest.approx(906.25, abs=1e-6)
    assert (cum_cut - cum_fill) == pytest.approx(0.00, abs=1e-6)
    assert case["totals"]["final_net_volume_m3"] == pytest.approx(0.0, abs=1e-6)


def test_hand_arithmetic_hill(rules):
    """Verify hand calculation arithmetic for Golden Case 3: Hill Terrain."""
    case_file = GOLDEN_CASES_DIR / "hill_case.json"
    assert case_file.exists(), f"Missing golden case definition: {case_file}"
    case = json.loads(case_file.read_text(encoding="utf-8"))

    w = rules["geometry"]["carriageway_width_m"]
    s_fill = rules["earthworks"]["fill_slope_horizontal_run"]
    s_cut = rules["earthworks"]["cut_slope_horizontal_run"]
    design_level = case["design_parameters"]["design_level_m"]

    cum_cut = 0.0
    cum_fill = 0.0

    for interval in case["earthwork_schedule"]:
        from_st = interval["from_station_m"]
        to_st = interval["to_station_m"]
        dist = interval["distance_m"]

        g_start = ground_height("hill", from_st)
        g_end = ground_height("hill", to_st)

        diff_start = design_level - g_start
        diff_end = design_level - g_end

        if diff_start > 0:  # Fill
            a_fill_start = (w + s_fill * diff_start) * diff_start
            a_cut_start = 0.0
        else:  # Cut
            a_fill_start = 0.0
            a_cut_start = (w + s_cut * abs(diff_start)) * abs(diff_start)

        if diff_end > 0:  # Fill
            a_fill_end = (w + s_fill * diff_end) * diff_end
            a_cut_end = 0.0
        else:  # Cut
            a_fill_end = 0.0
            a_cut_end = (w + s_cut * abs(diff_end)) * abs(diff_end)

        assert interval["fill_area_start_m2"] == pytest.approx(a_fill_start, abs=1e-6)
        assert interval["fill_area_end_m2"] == pytest.approx(a_fill_end, abs=1e-6)
        assert interval["cut_area_start_m2"] == pytest.approx(a_cut_start, abs=1e-6)
        assert interval["cut_area_end_m2"] == pytest.approx(a_cut_end, abs=1e-6)

        v_fill = ((a_fill_start + a_fill_end) / 2.0) * dist
        v_cut = ((a_cut_start + a_cut_end) / 2.0) * dist

        assert interval["fill_volume_m3"] == pytest.approx(v_fill, abs=1e-6)
        assert interval["cut_volume_m3"] == pytest.approx(v_cut, abs=1e-6)

        cum_fill += v_fill
        cum_cut += v_cut

        assert interval["cumulative_fill_m3"] == pytest.approx(cum_fill, abs=1e-6)
        assert interval["cumulative_cut_m3"] == pytest.approx(cum_cut, abs=1e-6)
        assert interval["cumulative_net_m3"] == pytest.approx(cum_cut - cum_fill, abs=1e-6)

    assert cum_cut == pytest.approx(925.00, abs=1e-6)
    assert cum_fill == pytest.approx(925.00, abs=1e-6)
    assert (cum_cut - cum_fill) == pytest.approx(0.00, abs=1e-6)
    assert case["totals"]["final_net_volume_m3"] == pytest.approx(0.0, abs=1e-6)


@pytest.mark.xfail(reason="Engine (K14) not implemented yet. Scheduled to activate at Task K14/K16.")
@pytest.mark.parametrize("kind", ["flat", "slope", "hill"])
def test_engine_earthworks_matches_golden_case(kind):
    """Placeholder to be enabled when earthwork engine is built in Task K14."""
    # When K14 is built:
    # engine_result = run_earthwork_engine(terrain_kind=kind, rules=rules)
    # golden = json.loads((GOLDEN_CASES_DIR / f"{kind}_case.json").read_text())
    # assert engine_result.total_cut_volume == golden["totals"]["total_cut_volume_m3"]
    # assert engine_result.total_fill_volume == golden["totals"]["total_fill_volume_m3"]
    raise NotImplementedError("Earthworks calculation engine will be implemented in Task K14.")
