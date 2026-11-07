"""Corridor survey intake.

The Pilot Survey Data is a *corridor* export: points surveyed along a road
centreline with left/right cross-section picks, grouped into route blocks, with
free-text feature codes (culverts, buildings, river, poles). This is different
from an area/DEM point cloud, and it is the data the MVP must consume.

This module reads that export without losing anything:

* blocks become routes (``MAIN``, ``ALTERNATY ROAD DATA``, ``NWOOP ROAD DATA`` …)
* codes become classes (``CENTRE``/``LEFT``/``RIGHT``) or feature points
* each centre point is paired with its nearest left and right point to form a
  surveyed cross-section, with signed offsets and a station
* every skipped row is counted and explained, never silently dropped

The result feeds the design stages (alignment → profile → sections →
quantities) and the BEME (feature counts). It does not build a DEM.
"""

from __future__ import annotations

import csv
import hashlib
import io
import logging
import math
import re
import statistics
from collections import Counter
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Sequence, Tuple

import numpy as np

from app.modules.intake.readers.base import POINT_DTYPE

logger = logging.getLogger("dariusos.intake.corridor")

# Classification codes written into the standard point-cloud dtype.
CLASS_CENTRE = 1
CLASS_LEFT = 2
CLASS_RIGHT = 3
CLASS_FEATURE = 9

#: Recognised header names. Matching is case- and space-insensitive.
_HEADER_ALIASES = {
    "id": {"point", "pointid", "id", "pt", "pointno", "number"},
    "east": {"east", "easting", "x"},
    "north": {"north", "northing", "y"},
    "height": {"height", "elevation", "elev", "z", "level", "rl"},
    "code": {"code", "description", "desc", "feature", "class", "classification", "remark", "remarks"},
}

#: Free-text code → feature kind. Checked in this order; first match wins.
_FEATURE_PATTERNS: Sequence[Tuple[re.Pattern, str]] = (
    (re.compile(r"TBM|BENCH\s*MARK"), "benchmark"),
    (re.compile(r"BOX\s*CV|BOXCULVERT|BOX\s*CULVERT"), "box_culvert"),
    (re.compile(r"RING"), "culvert_ring"),
    (re.compile(r"CV|CULVERT"), "culvert"),
    (re.compile(r"\bBLD\b|BUILDING"), "building"),
    (re.compile(r"RIVERSIDE"), "river_bank"),
    (re.compile(r"\bRIVER\b"), "river"),
    (re.compile(r"\bBEND\b"), "bend"),
    (re.compile(r"EPOLE|ELEC|POLE"), "pole"),
    (re.compile(r"FENCE"), "fence"),
    (re.compile(r"GRAVE"), "graveyard"),
    (re.compile(r"SEPTIC"), "septic_tank"),
    (re.compile(r"MOSQ|MOSQUE"), "mosque"),
    (re.compile(r"WELL|BOREHOLE|WATER"), "water_point"),
    (re.compile(r"TREE"), "tree"),
    (re.compile(r"\bROAD\b"), "existing_road"),
    (re.compile(r"PROPOSED"), "proposed"),
)

_CENTRE_TOKENS = {"C", "CL", "C/L", "CENTER", "CENTRE", "CNTR"}
_LEFT_TOKENS = {"L", "LT", "LEFT", "LHS"}
_RIGHT_TOKENS = {"R", "RT", "RIGHT", "RHS"}

_FEATURE_REASONS = ("expected point id / easting / northing / height",)


@dataclass(frozen=True)
class SurveyPoint:
    """One surveyed point, as exported by the surveyor."""

    point_id: str
    east: float
    north: float
    height: float
    code: str
    kind: str  # CENTRE | LEFT | RIGHT | FEATURE | UNKNOWN
    feature_kind: Optional[str]
    source_row: int

    @property
    def xy(self) -> Tuple[float, float]:
        return (self.east, self.north)


@dataclass(frozen=True)
class Section:
    """A surveyed cross-section: a centre point and its left/right picks."""

    index: int
    station_m: float
    centre: SurveyPoint
    left: Optional[SurveyPoint]
    right: Optional[SurveyPoint]
    left_offset_m: Optional[float]
    right_offset_m: Optional[float]
    bearing_deg: float
    left_station_m: Optional[float] = None
    right_station_m: Optional[float] = None

    @property
    def is_complete(self) -> bool:
        return self.left is not None and self.right is not None


@dataclass
class Route:
    """One survey block (a road alignment option or the spur)."""

    key: str
    title: str
    points: List[SurveyPoint] = field(default_factory=list)
    _ordered: Optional[List[SurveyPoint]] = field(default=None, repr=False, compare=False)

    def by_kind(self, kind: str) -> List[SurveyPoint]:
        return [p for p in self.points if p.kind == kind]

    @property
    def centre_points(self) -> List[SurveyPoint]:
        return self.by_kind("CENTRE")

    @property
    def left_points(self) -> List[SurveyPoint]:
        return self.by_kind("LEFT")

    @property
    def right_points(self) -> List[SurveyPoint]:
        return self.by_kind("RIGHT")

    @property
    def features(self) -> List[SurveyPoint]:
        return self.by_kind("FEATURE")

    # -- geometry ---------------------------------------------------------

    def ordered_centreline(self) -> List[SurveyPoint]:
        """Return centre points in chainage order.

        Survey exports are normally already in order; when the file is shuffled
        we fall back to a nearest-neighbour walk from the end point so the
        centreline never self-crosses.
        """
        if self._ordered is not None:
            return self._ordered
        pts = self.centre_points
        if len(pts) < 3:
            self._ordered = pts
            return pts
        chain = _nearest_neighbour_chain(pts)
        # A survey export is written in chainage order, so its path length is
        # close to the shortest walk. A shuffled file is much longer.
        if _path_length(pts) <= _path_length(chain) * 1.25 + 1e-9:
            self._ordered = pts
        else:
            logger.info("Route %s: centre points are out of order; using nearest-neighbour chain.", self.key)
            self._ordered = chain
        return self._ordered

    def centreline_xy(self) -> np.ndarray:
        pts = self.ordered_centreline()
        return np.array([p.xy for p in pts], dtype=np.float64)

    def sections(self, pair_radius_m: float = 30.0) -> List[Section]:
        """Pair each centre point with the left/right pick that belongs to it.

        Picks are assigned by station and lateral offset, not by raw distance:
        a pick 20 m away along the road belongs to the *next* section, so distance
        alone would silently pair the wrong section whenever a pick is missing.
        """
        ordered = self.ordered_centreline()
        if not ordered:
            return []
        chain = _Centreline(ordered)
        stations = chain.stations
        spacing = _median_spacing(stations)
        window = max(5.0, 0.55 * spacing)
        lefts = self.left_points
        rights = self.right_points

        picks_left = chain.project_picks(lefts, pair_radius_m, window, max_lateral_m=25.0)
        picks_right = chain.project_picks(rights, pair_radius_m, window, max_lateral_m=25.0)

        sections: List[Section] = []
        for i, centre in enumerate(ordered):
            left_pick = picks_left.get(i)
            right_pick = picks_right.get(i)
            sections.append(
                Section(
                    index=i,
                    station_m=stations[i],
                    centre=centre,
                    left=None if left_pick is None else left_pick.point,
                    right=None if right_pick is None else right_pick.point,
                    left_offset_m=None if left_pick is None else left_pick.lateral_m,
                    right_offset_m=None if right_pick is None else right_pick.lateral_m,
                    bearing_deg=chain.bearings[i],
                    left_station_m=None if left_pick is None else left_pick.station_m,
                    right_station_m=None if right_pick is None else right_pick.station_m,
                )
            )
        return sections

    def length_m(self) -> float:
        pts = self.ordered_centreline()
        return float(sum(_dist(a, b) for a, b in zip(pts, pts[1:])))

    def to_dict(self, pair_radius_m: float = 30.0) -> Dict[str, Any]:
        sections = self.sections(pair_radius_m)
        offsets_left = [abs(s.left_offset_m) for s in sections if s.left_offset_m is not None]
        offsets_right = [abs(s.right_offset_m) for s in sections if s.right_offset_m is not None]
        stations = [s.station_m for s in sections]
        gaps = [b - a for a, b in zip(stations, stations[1:])]
        return {
            "key": self.key,
            "title": self.title,
            "points": len(self.points),
            "centre_points": len(self.centre_points),
            "left_points": len(self.left_points),
            "right_points": len(self.right_points),
            "feature_points": len(self.features),
            "centreline_length_m": round(self.length_m(), 2),
            "sections": len(sections),
            "complete_sections": sum(1 for s in sections if s.is_complete),
            "missing_left": sum(1 for s in sections if s.left is None),
            "missing_right": sum(1 for s in sections if s.right is None),
            "station_spacing_median_m": round(statistics.median(gaps), 2) if gaps else None,
            "left_offset_median_m": round(statistics.median(offsets_left), 2) if offsets_left else None,
            "right_offset_median_m": round(statistics.median(offsets_right), 2) if offsets_right else None,
            "features": dict(Counter(p.feature_kind or "unknown" for p in self.features)),
        }


@dataclass
class SkippedRow:
    row_number: int
    cells: List[str]
    reason: str


@dataclass
class CorridorSurvey:
    """Everything the design stages need from a corridor survey export."""

    source_name: str
    sha256: str
    size_bytes: int
    routes: List[Route]
    header: List[str]
    code_counts: Counter
    skipped: List[SkippedRow]
    warnings: List[str] = field(default_factory=list)

    @property
    def total_points(self) -> int:
        return sum(len(r.points) for r in self.routes)

    def route(self, key: str) -> Optional[Route]:
        for r in self.routes:
            if r.key == key:
                return r
        return None

    def to_point_cloud(self) -> np.ndarray:
        """Flatten to the standard point dtype (for validators/area tooling)."""
        rows = []
        for route in self.routes:
            for p in route.points:
                cls = {
                    "CENTRE": CLASS_CENTRE,
                    "LEFT": CLASS_LEFT,
                    "RIGHT": CLASS_RIGHT,
                    "FEATURE": CLASS_FEATURE,
                }.get(p.kind, 0)
                rows.append((p.east, p.north, p.height, cls))
        return np.array(rows, dtype=POINT_DTYPE)

    def summary(self, pair_radius_m: float = 30.0) -> Dict[str, Any]:
        routes = [r.to_dict(pair_radius_m) for r in self.routes]
        return {
            "source": self.source_name,
            "sha256": self.sha256,
            "size_bytes": self.size_bytes,
            "header": self.header,
            "total_points": self.total_points,
            "total_centreline_length_m": round(sum(r["centreline_length_m"] for r in routes), 2),
            "routes": routes,
            "code_counts": dict(self.code_counts.most_common()),
            "skipped_rows": len(self.skipped),
            "skipped": [{"row": s.row_number, "reason": s.reason, "cells": s.cells[:4]} for s in self.skipped[:50]],
            "warnings": list(self.warnings),
        }


class CorridorReader:
    """Reads a corridor survey export (CSV/whitespace, block + code aware)."""

    @classmethod
    def read(cls, file_path: Path) -> CorridorSurvey:
        raw = Path(file_path).read_bytes()
        sha256 = hashlib.sha256(raw).hexdigest()
        text = raw.decode("utf-8-sig", errors="replace")
        rows = [[c.strip() for c in row] for row in csv.reader(io.StringIO(text))]
        rows = [r for r in rows if any(c for c in r)]

        if not rows:
            raise ValueError("Corridor survey file is empty.")

        header, columns, start = _detect_header(rows)
        routes: List[Route] = []
        current = Route(key="MAIN", title="MAIN")
        skipped: List[SkippedRow] = []
        warnings: List[str] = []
        code_counts: Counter = Counter()
        seen_xy: Counter = Counter()

        legend_reached = False
        for row_index in range(start, len(rows)):
            row = rows[row_index]
            row_number = row_index + 1
            coords = _parse_coords(row, columns)

            if coords is None:
                text_cells = [c for c in row if c]
                if not text_cells:
                    skipped.append(SkippedRow(row_number, row, "empty row"))
                    continue
                title = " ".join(text_cells).strip()
                if re.match(r"^key\b", title, re.IGNORECASE):
                    legend_reached = True
                    skipped.append(SkippedRow(row_number, row, "legend/key block (not survey data)"))
                    continue
                if legend_reached:
                    skipped.append(SkippedRow(row_number, row, "after key block (legend definition)"))
                    continue
                # A row made only of words is a block title → new route.
                if _is_title_row(row):
                    if current.points:
                        routes.append(current)
                    title_clean = re.sub(r"\s+", " ", title).strip()
                    current = Route(key=_slug(title_clean), title=title_clean)
                    continue
                skipped.append(SkippedRow(row_number, row, "no numeric easting/northing/height"))
                continue

            east, north, height = coords
            point_id = _point_id(row, columns, row_number)
            code = _cell(row, columns["code"]) if columns.get("code") is not None else ""
            kind, feature_kind = _classify(code)
            if kind == "UNKNOWN":
                warnings.append(f"Row {row_number}: unrecognised survey code {code!r}.")
                kind = "FEATURE"
                feature_kind = "unknown"

            point = SurveyPoint(
                point_id=point_id,
                east=east,
                north=north,
                height=height,
                code=code,
                kind=kind,
                feature_kind=feature_kind,
                source_row=row_number,
            )
            current.points.append(point)
            code_counts[code or "(blank)"] += 1
            seen_xy[(round(east, 3), round(north, 3))] += 1

        if current.points:
            routes.append(current)

        # Drop blocks that contain no points (e.g. an empty title in the legend).
        routes = [r for r in routes if r.points]

        if not routes:
            raise ValueError("No survey points could be read from the corridor file.")

        duplicates = sum(c - 1 for c in seen_xy.values() if c > 1)
        if duplicates:
            warnings.append(f"{duplicates} duplicate coordinate(s) found; kept for engineer review.")

        for route in routes:
            if len(route.centre_points) < 3:
                warnings.append(f"Route {route.key!r} has fewer than 3 centre points; sections cannot be built.")
                continue
            ordered = route.ordered_centreline()
            jumps = [d for a, b in zip(ordered, ordered[1:]) if (d := _dist(a, b)) > 100.0]
            if jumps:
                warnings.append(
                    f"Route {route.key!r}: {len(jumps)} centreline step(s) over 100 m "
                    f"(max {max(jumps):.0f} m); check survey gaps."
                )
            sections = route.sections()
            missing_left = sum(1 for s in sections if s.left is None)
            missing_right = sum(1 for s in sections if s.right is None)
            if missing_left or missing_right:
                warnings.append(
                    f"Route {route.key!r}: {missing_left} section(s) have no left pick and {missing_right} have "
                    f"no right pick (survey gaps); those sections fall back to interpolated offsets."
                )

        return CorridorSurvey(
            source_name=Path(file_path).name,
            sha256=sha256,
            size_bytes=len(raw),
            routes=routes,
            header=header,
            code_counts=code_counts,
            skipped=skipped,
            warnings=warnings,
        )


# ---------------------------------------------------------------------------
# parsing helpers
# ---------------------------------------------------------------------------


def _norm(text: str) -> str:
    return re.sub(r"[^a-z0-9/]+", " ", (text or "").lower()).strip()


def _detect_header(rows: List[List[str]]) -> Tuple[List[str], Dict[str, Optional[int]], int]:
    """Work out the column layout and where data starts."""
    header: List[str] = []
    columns: Dict[str, Optional[int]] = {"id": None, "east": None, "north": None, "height": None, "code": None}

    for row in rows[:5]:
        names = [_norm(c) for c in row]
        hits = {role for role, aliases in _HEADER_ALIASES.items() if any(n in aliases for n in names)}
        if {"east", "north", "height"} <= hits:
            header = row
            for role in ("id", "east", "north", "height", "code"):
                for idx, name in enumerate(names):
                    if name in _HEADER_ALIASES[role]:
                        columns[role] = idx
                        break
            start = rows.index(row) + 1
            break
    else:
        start = 0

    if columns["east"] is None:
        # Positional fallback: east, north, height (in that order) as exported.
        columns.update({"east": 0, "north": 1, "height": 2, "id": None, "code": None})
        start = 0

    if columns["code"] is None:
        columns["code"] = _infer_code_column(rows, start, columns)
    if columns["id"] is None:
        columns["id"] = 0 if columns["east"] != 0 else None
    return header, columns, start


def _infer_code_column(rows: List[List[str]], start: int, columns: Dict[str, Optional[int]]) -> Optional[int]:
    """The code column is the first non-numeric column after the heights."""
    used = {columns["east"], columns["north"], columns["height"], columns["id"]}
    used.discard(None)
    width = max((len(r) for r in rows[start : start + 200]), default=0)
    best: Optional[int] = None
    for idx in range(width):
        if idx in used:
            continue
        text_hits = 0
        numeric_hits = 0
        for row in rows[start : start + 200]:
            if idx >= len(row):
                continue
            value = row[idx]
            if not value:
                continue
            if _to_float(value) is None:
                text_hits += 1
            else:
                numeric_hits += 1
        if text_hits >= 3 and text_hits >= numeric_hits:
            return idx
        if text_hits:
            best = best if best is not None else idx
    return best


def _to_float(value: Any) -> Optional[float]:
    if value is None:
        return None
    text = str(value).strip()
    if not text:
        return None
    try:
        return float(text)
    except (TypeError, ValueError):
        return None


def _cell(row: List[str], idx: Optional[int]) -> str:
    if idx is None or idx >= len(row):
        return ""
    return row[idx]


def _parse_coords(row: List[str], columns: Dict[str, Optional[int]]) -> Optional[Tuple[float, float, float]]:
    east = _to_float(_cell(row, columns["east"]))
    north = _to_float(_cell(row, columns["north"]))
    height = _to_float(_cell(row, columns["height"]))
    if east is None or north is None or height is None:
        return None
    if not (math.isfinite(east) and math.isfinite(north) and math.isfinite(height)):
        return None
    return (east, north, height)


def _point_id(row: List[str], columns: Dict[str, Optional[int]], row_number: int) -> str:
    value = _cell(row, columns["id"])
    if value and _to_float(value) is None:
        return value
    return f"R{row_number}"


_TITLE_KEYWORDS = re.compile(r"\b(ROAD|DATA|ALIGNMENT|ROUTE|SPUR|BASELINE|CHAINAGE|CENTERLINE|CENTRELINE)\b")


def _is_title_row(row: List[str]) -> bool:
    """A block title has words but no numbers, and looks like a route heading.

    Prose junk ("garbage row with no coordinates") must be skipped and explained,
    not mistaken for a new route, so we require either a road-survey keyword or an
    all-caps heading.
    """
    words = [c for c in row if c and _to_float(c) is None]
    numbers = [c for c in row if c and _to_float(c) is not None]
    if not words or numbers:
        return False
    text = " ".join(words).strip()
    if len(text.split()) > 8:
        return False
    if _TITLE_KEYWORDS.search(text.upper()):
        return True
    letters = [ch for ch in text if ch.isalpha()]
    return bool(letters) and text.upper() == text and len(text.split()) >= 2


def _slug(title: str) -> str:
    slug = re.sub(r"[^A-Za-z0-9]+", "_", title).strip("_").upper()
    slug = re.sub(r"_?ROAD_?DATA$", "", slug) or slug
    replacements = {"ALTERNATY": "ALTERNATE", "ALTERNATE": "ALTERNATE", "MAIN": "MAIN", "NWOOP": "NWOOP"}
    return replacements.get(slug, slug) or "ROUTE"


def _classify(code: str) -> Tuple[str, Optional[str]]:
    text = (code or "").strip()
    if not text:
        return "UNKNOWN", None
    upper = text.upper()
    tokens = set(re.split(r"[^A-Z0-9]+", upper))
    tokens.discard("")

    # Free-text features first: "EXISTING CV", "RIVERSIDE C", "PROPOSED CV" must
    # never be mistaken for a bare C/L/R centreline code.
    for pattern, kind in _FEATURE_PATTERNS:
        if pattern.search(upper):
            return "FEATURE", kind
    if tokens & {"RIVERSIDE", "RIVER"}:
        return "FEATURE", "river"

    if tokens & _CENTRE_TOKENS or upper in _CENTRE_TOKENS:
        return "CENTRE", None
    if tokens & _LEFT_TOKENS or upper in _LEFT_TOKENS:
        return "LEFT", None
    if tokens & _RIGHT_TOKENS or upper in _RIGHT_TOKENS:
        return "RIGHT", None
    return "UNKNOWN", None


def _dist(a: SurveyPoint, b: SurveyPoint) -> float:
    return math.hypot(a.east - b.east, a.north - b.north)


def _path_length(points: List[SurveyPoint]) -> float:
    return float(sum(_dist(a, b) for a, b in zip(points, points[1:])))


def _nearest_neighbour_chain(points: List[SurveyPoint]) -> List[SurveyPoint]:
    """Order points by a greedy nearest-neighbour walk starting at an end point."""
    if len(points) < 3:
        return points
    # Start at the point with the greatest distance from the centroid (an end).
    cx = sum(p.east for p in points) / len(points)
    cy = sum(p.north for p in points) / len(points)
    start = max(points, key=lambda p: (p.east - cx) ** 2 + (p.north - cy) ** 2)
    remaining = [p for p in points if p is not start]
    chain = [start]
    while remaining:
        last = chain[-1]
        nxt = min(remaining, key=lambda p: (p.east - last.east) ** 2 + (p.north - last.north) ** 2)
        remaining.remove(nxt)
        chain.append(nxt)
    return chain


def _stations(ordered: List[SurveyPoint]) -> List[float]:
    stations = [0.0]
    for a, b in zip(ordered, ordered[1:]):
        stations.append(stations[-1] + _dist(a, b))
    return stations


def _bearings(ordered: List[SurveyPoint]) -> List[float]:
    bearings: List[float] = []
    for i, point in enumerate(ordered):
        if i == 0:
            nxt = ordered[min(1, len(ordered) - 1)]
            prev = point
        elif i == len(ordered) - 1:
            nxt = point
            prev = ordered[i - 1]
        else:
            nxt = ordered[i + 1]
            prev = ordered[i - 1]
        dx = nxt.east - prev.east
        dy = nxt.north - prev.north
        bearings.append((math.degrees(math.atan2(dx, dy)) + 360.0) % 360.0)
    return bearings


@dataclass(frozen=True)
class _Pick:
    point: SurveyPoint
    station_m: float
    lateral_m: float
    distance_m: float


class _Centreline:
    """Cumulative stationing plus point projection for an ordered centre chain."""

    def __init__(self, points: List[SurveyPoint]) -> None:
        self.points = points
        stations = [0.0]
        for a, b in zip(points, points[1:]):
            stations.append(stations[-1] + _dist(a, b))
        self.stations = stations
        self.bearings = _bearings(points)
        self.total_length = stations[-1]

    def project(self, east: float, north: float) -> Optional[Tuple[float, float, float]]:
        """Project (east, north) onto the chain → (station, lateral, distance)."""
        best: Optional[Tuple[float, float, float]] = None
        for i in range(len(self.points) - 1):
            a, b = self.points[i], self.points[i + 1]
            ax, ay = a.east, a.north
            bx, by = b.east, b.north
            vx, vy = bx - ax, by - ay
            seg_len2 = vx * vx + vy * vy
            if seg_len2 <= 1e-9:
                continue
            t = ((east - ax) * vx + (north - ay) * vy) / seg_len2
            t = max(0.0, min(1.0, t))
            px, py = ax + t * vx, ay + t * vy
            distance = math.hypot(east - px, north - py)
            if best is None or distance < best[2]:
                seg_len = math.sqrt(seg_len2)
                bearing = math.radians(self.bearings[i])
                left_normal = (-math.cos(bearing), math.sin(bearing))
                lateral = (east - px) * left_normal[0] + (north - py) * left_normal[1]
                best = (self.stations[i] + t * seg_len, lateral, distance)
        return best

    def project_picks(
        self,
        picks: List[SurveyPoint],
        radius_m: float,
        station_window_m: float,
        max_lateral_m: float,
    ) -> Dict[int, _Pick]:
        """Assign picks to their section index; one pick per section, closest wins."""
        assigned: Dict[int, _Pick] = {}
        for point in picks:
            projected = self.project(point.east, point.north)
            if projected is None:
                continue
            station, lateral, distance = projected
            if distance > radius_m or abs(lateral) > max_lateral_m:
                continue
            idx = min(range(len(self.points)), key=lambda i: abs(self.stations[i] - station))
            if abs(self.stations[idx] - station) > station_window_m:
                continue
            candidate = _Pick(point=point, station_m=station, lateral_m=lateral, distance_m=distance)
            previous = assigned.get(idx)
            if previous is None or abs(candidate.lateral_m) < abs(previous.lateral_m):
                assigned[idx] = candidate
        return assigned


def _median_spacing(stations: List[float]) -> float:
    gaps = [b - a for a, b in zip(stations, stations[1:]) if b - a > 1e-6]
    return statistics.median(gaps) if gaps else 25.0
