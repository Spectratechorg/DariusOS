#!/usr/bin/env python3
"""Strider K2: synthetic terrain generator (no client data).

One command:
    python gen_terrain.py --out fake_data

Writes, for each terrain kind (flat, slope, hill):
    <kind>.csv         clean survey file: POINT,North,East,Height,Code
    <kind>_messy.csv   same points with real-world mess (banner rows, restarted
                       IDs, empty columns, inconsistent codes, legend block)
    <kind>.truth.json  the exact terrain definition, for hand-calculated
                       golden cases (K3) and tests

Terrains are piecewise-linear and the survey grid lines up with every break
line, so ground height between points is exact and volumes can be hand-checked.

Coordinates use a deliberately fake origin. Column order is North, East (as in
real survey exports), not X, Y.
"""
import argparse
import csv
import json
import random
from pathlib import Path

ORIGIN_E = 100000.0   # fake easting of road start
ORIGIN_N = 200000.0   # fake northing of road centreline
BASE_H = 300.0        # base ground level (m)
ROAD_LEN = 200.0      # road runs due East, metres
STEP_E = 5.0          # point spacing along the road
OFFSETS = [-15, -10, -5, 0, 5, 10, 15]   # metres from centreline (+ = North = left)
SLOPE = 0.02          # 2 % fall/rise along the road for "slope"
HILL_H = 4.0          # ridge height (m)
HILL_CENTRE = 100.0   # ridge crest, metres along road
HILL_FLANK = 0.04     # ridge side slope (4 %)
KINDS = ["flat", "slope", "hill"]


def ground_height(kind: str, e: float, n: float = 0.0) -> float:
    """Exact ground level. e = metres along road from start (not absolute)."""
    if kind == "flat":
        return BASE_H
    if kind == "slope":
        return BASE_H + SLOPE * e
    if kind == "hill":
        # triangular ridge across the road: peak HILL_H at HILL_CENTRE,
        # falling linearly to base level at +/- HILL_H / HILL_FLANK
        return BASE_H + max(0.0, HILL_H - HILL_FLANK * abs(e - HILL_CENTRE))
    raise ValueError(kind)


def code_for(offset: float) -> str:
    return {0: "C", 10: "L", -10: "R"}.get(offset, "GND")


def make_points(kind: str):
    pts, i = [], 1
    e = 0.0
    while e <= ROAD_LEN + 1e-9:
        for off in OFFSETS:
            pts.append((f"P{i}", ORIGIN_N + off, ORIGIN_E + e,
                        round(ground_height(kind, e, off), 4), code_for(off)))
            i += 1
        e += STEP_E
    return pts


def write_clean(path: Path, pts):
    with path.open("w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["POINT", "North", "East", "Height", "Code"])
        w.writerows(pts)


def write_messy(path: Path, pts, seed: int):
    """Mimic quirks seen in real survey exports (invented values only)."""
    rng = random.Random(seed)
    junk_cols = [""] * 7
    half = len(pts) // 2
    variants = {"C": ["C", "c"], "L": ["L"], "R": ["R", "Rigth"], "GND": ["GND", "gnd"]}
    with path.open("w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["POINT", "North", "East", "Height", ""] + junk_cols)
        for p in pts[:half]:
            code = rng.choice(variants[p[4]])
            w.writerow(list(p[:4]) + [code] + junk_cols)
        w.writerow(["SECOND ROAD DATA"] + [""] * 11)       # banner row
        for k, p in enumerate(pts[half:], start=1):         # IDs restart at P1
            code = rng.choice(variants[p[4]])
            w.writerow([f"P{k}"] + list(p[1:4]) + [code] + junk_cols)
        for _ in range(3):
            w.writerow([""] * 12)                           # blank rows
        w.writerow(["", "KEY"] + [""] * 10)                 # legend block
        w.writerow(["C", "Center line"] + [""] * 10)
        w.writerow(["L", "Left line"] + [""] * 10)
        w.writerow(["R", "Right line"] + [""] * 10)


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--out", default="fake_data", help="output folder")
    ap.add_argument("--kind", choices=KINDS + ["all"], default="all")
    ap.add_argument("--seed", type=int, default=1, help="seed for messy variants")
    a = ap.parse_args()

    out = Path(a.out)
    out.mkdir(parents=True, exist_ok=True)
    for kind in (KINDS if a.kind == "all" else [a.kind]):
        pts = make_points(kind)
        write_clean(out / f"{kind}.csv", pts)
        write_messy(out / f"{kind}_messy.csv", pts, a.seed)
        truth = {
            "kind": kind, "origin_east": ORIGIN_E, "origin_north": ORIGIN_N,
            "base_height_m": BASE_H, "road_length_m": ROAD_LEN,
            "point_spacing_m": STEP_E, "offsets_m": OFFSETS,
            "point_count": len(pts), "axis": "road runs due East; +offset = North = left",
            "slope_along_road": SLOPE if kind == "slope" else 0.0,
            "ridge": ({"height_m": HILL_H, "crest_m": HILL_CENTRE,
                       "flank_slope": HILL_FLANK} if kind == "hill" else None),
            "note": "synthetic data, no client data",
        }
        (out / f"{kind}.truth.json").write_text(json.dumps(truth, indent=2))
        print(f"{kind}: {len(pts)} points -> {out}")


if __name__ == "__main__":
    main()
