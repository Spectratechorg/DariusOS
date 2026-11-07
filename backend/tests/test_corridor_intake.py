"""Tests for corridor survey intake (Pilot Survey Data shape).

The fixture mirrors the client's export layout: a point id, North, East, Height and
a free-text survey code in the fifth column, route blocks introduced by title rows,
and a trailing KEY legend that must never be read as data.
"""

import hashlib
import math
import os
from pathlib import Path

import numpy as np
import pytest

from app.modules.intake.corridor import (
    CLASS_CENTRE,
    CLASS_FEATURE,
    CLASS_LEFT,
    CLASS_RIGHT,
    CorridorReader,
)


def write(tmp_path: Path, text: str, name: str = "corridor.csv") -> Path:
    path = tmp_path / name
    path.write_text(text, encoding="utf-8")
    return path


def section_rows(start_north: float, sections: int, spacing: float = 25.0, east: float = 2000.0):
    """A straight north-heading route with L/C/R picks 5 m either side."""
    rows = []
    for i in range(sections):
        north = start_north + i * spacing
        rows.append(f"P{len(rows) + 1},{north:.3f},{east - 5:.3f},100.0,L")
        rows.append(f"P{len(rows) + 1},{north:.3f},{east:.3f},100.5,C")
        rows.append(f"P{len(rows) + 1},{north:.3f},{east + 5:.3f},99.9,R")
    return rows


HEADER = "POINT,North,East,Height,,,,"


def test_reads_blocks_codes_and_features(tmp_path: Path):
    rows = [
        HEADER,
        *section_rows(1000.0, 3),
        "P10,1050.0,2003.0,101.2,Existing CV 900mm",
        "P11,1075.0,2001.0,101.0,BLD",
        "P12,1075.0,2002.0,101.1,River",
        "P13,1100.0,2000.0,101.2,TBM12",
    ]
    rows += ["", "NWOOP  ROAD DATA,,,,,,,,"]
    rows += section_rows(1200.0, 2, spacing=50.0, east=3000.0)
    rows += ["", ",KEY,,,,,,,", "C,Center line,,,,,,,", "L,Left line,,,,,,,", "R,Right line,,,,,,,", "CV,CULRVET,,,,,,,", "BLD,BUILDING,,,,,,,", "TBM,Temporay bench mark.,,,,,,,"]
    path = write(tmp_path, "\n".join(rows))
    survey = CorridorReader.read(path)

    assert survey.sha256 == hashlib.sha256(path.read_bytes()).hexdigest()
    assert len(survey.routes) == 2
    main, spur = survey.routes
    assert main.key == "MAIN" and spur.key == "NWOOP"
    assert spur.title == "NWOOP ROAD DATA"
    assert len(main.points) == 13
    assert len(spur.points) == 6
    assert survey.total_points == 19
    assert survey.code_counts["C"] == 5

    kinds = {p.point_id: (p.kind, p.feature_kind) for p in main.points}
    assert kinds["P10"] == ("FEATURE", "culvert")
    assert kinds["P11"] == ("FEATURE", "building")
    assert kinds["P12"] == ("FEATURE", "river")
    assert kinds["P13"] == ("FEATURE", "benchmark")
    assert {p.kind for p in main.points if p.point_id in {"P2"}} == {"CENTRE"}

    # the legend is parsed, never surveyed
    assert all(p.kind != "UNKNOWN" for p in survey.routes[0].points)


def test_sections_pair_by_station_and_signed_offset(tmp_path: Path):
    survey = CorridorReader.read(write(tmp_path, "\n".join([HEADER, *section_rows(1000.0, 4)])))
    route = survey.routes[0]
    sections = route.sections()

    assert len(sections) == 4
    assert all(s.is_complete for s in sections)
    assert [round(s.station_m, 3) for s in sections] == [0.0, 25.0, 50.0, 75.0]
    # heading north: left of travel is west (−x) → positive offset
    assert all(s.left_offset_m == pytest.approx(5.0, abs=1e-9) for s in sections)
    assert all(s.right_offset_m == pytest.approx(-5.0, abs=1e-9) for s in sections)
    assert sections[1].left is not None and sections[1].right is not None
    assert route.length_m() == pytest.approx(75.0, abs=1e-9)


def test_missing_pick_is_not_borrowed_from_the_next_section(tmp_path: Path):
    rows = [HEADER]
    # section 1 complete, section 2 has no left pick, section 3 complete
    rows += ["P1,1000.000,1995.000,100.0,L", "P2,1000.000,2000.000,100.5,C", "P3,1000.000,2005.000,99.9,R"]
    rows += ["P4,1025.000,2000.000,100.4,C", "P5,1025.000,2005.000,99.8,R"]
    rows += ["P6,1050.000,1995.000,100.1,L", "P7,1050.000,2000.000,100.6,C", "P8,1050.000,2005.000,100.0,R"]
    survey = CorridorReader.read(write(tmp_path, "\n".join(rows)))
    sections = survey.routes[0].sections()

    assert sections[1].left is None, "section 2 must not steal section 3's left pick"
    assert sections[2].left is not None
    assert sections[1].left_offset_m is None


def test_unknown_codes_are_reported_not_dropped(tmp_path: Path):
    rows = [HEADER, *section_rows(1000.0, 2), "P9,1050.0,2010.0,101.0,alien feature"]
    survey = CorridorReader.read(write(tmp_path, "\n".join(rows)))
    unknown = [p for p in survey.routes[0].points if p.kind == "FEATURE" and p.feature_kind == "unknown"]
    assert len(unknown) == 1
    assert any("unrecognised survey code" in w for w in survey.warnings)
    assert survey.total_points == 7  # unknown code is kept, not skipped


def test_headerless_positional_file(tmp_path: Path):
    rows = ["2000.0,1000.0,100.0,C", "1995.0,1000.0,100.1,L", "2005.0,1000.0,99.9,R"]
    survey = CorridorReader.read(write(tmp_path, "\n".join(rows)))
    assert survey.total_points == 3
    assert survey.routes[0].key == "MAIN"
    assert len(survey.routes[0].centre_points) == 1


def test_legend_and_junk_rows_are_counted_with_reasons(tmp_path: Path):
    rows = [
        HEADER,
        *section_rows(1000.0, 2),
        "garbage row with no coordinates",
        ",KEY,,,",
        "C,Center line,,,,",
    ]
    survey = CorridorReader.read(write(tmp_path, "\n".join(rows)))
    assert survey.total_points == 6
    assert {s.reason for s in survey.skipped} >= {"no numeric easting/northing/height", "legend/key block (not survey data)", "after key block (legend definition)"}
    # nothing vanished: every non-empty input row is either a point, a title, or an explained skip
    assert len(survey.skipped) >= 3


def test_point_cloud_export_keeps_classification(tmp_path: Path):
    rows = [HEADER, *section_rows(1000.0, 2), "P9,1050.0,2010.0,101.0,Existing CV"]
    survey = CorridorReader.read(write(tmp_path, "\n".join(rows)))
    cloud = survey.to_point_cloud()
    assert cloud.dtype.names == ("x", "y", "z", "classification")
    counts = dict(zip(*np.unique(cloud["classification"], return_counts=True)))
    assert counts[CLASS_CENTRE] == 2
    assert counts[CLASS_LEFT] == 2
    assert counts[CLASS_RIGHT] == 2
    assert counts[CLASS_FEATURE] == 1


def test_shuffled_centre_points_are_ordered(tmp_path: Path):
    # Written out of sequence (end, start, middle, ...): the reader must walk the
    # chain instead of following the file, otherwise stationing would zig-zag.
    coords = [(1100, 2010), (900, 1985), (1050, 2005), (950, 1990), (1000, 2000)]
    rows = [HEADER] + [f"P{i},{n}.000,{e}.000,100.0,C" for i, (n, e) in enumerate(coords)]
    route = CorridorReader.read(write(tmp_path, "\n".join(rows))).routes[0]
    ordered = route.ordered_centreline()
    steps = [math.dist(a.xy, b.xy) for a, b in zip(ordered, ordered[1:])]
    assert max(steps) < 60.0, f"chain still jumps: {steps}"
    assert 195.0 < route.length_m() < 210.0


def test_empty_file_is_rejected(tmp_path: Path):
    with pytest.raises(ValueError):
        CorridorReader.read(write(tmp_path, ""))


def test_summary_is_json_serialisable(tmp_path: Path):
    import json

    survey = CorridorReader.read(write(tmp_path, "\n".join([HEADER, *section_rows(1000.0, 3)])))
    summary = survey.summary()
    json.dumps(summary)
    route = summary["routes"][0]
    assert route["centre_points"] == 3
    assert route["complete_sections"] == 3
    assert summary["total_centreline_length_m"] == pytest.approx(50.0, abs=1e-9)


@pytest.mark.skipif(
    not os.environ.get("DARIUS_PILOT_SURVEY"),
    reason="set DARIUS_PILOT_SURVEY=/path/to/LDF DATA_110713.csv to run against the pilot export",
)
def test_real_pilot_export():
    survey = CorridorReader.read(Path(os.environ["DARIUS_PILOT_SURVEY"]))
    assert survey.total_points > 2000
    assert len(survey.routes) == 3
    keys = [r.key for r in survey.routes]
    assert "MAIN" in keys and "NWOOP" in keys
    assert survey.summary()["total_centreline_length_m"] > 15000
    culverts = sum(
        r.to_dict()["features"].get("culvert", 0) + r.to_dict()["features"].get("box_culvert", 0)
        for r in survey.routes
    )
    assert culverts > 100
