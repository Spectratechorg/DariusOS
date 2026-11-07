#!/usr/bin/env python3
"""Print an intake audit for a corridor survey export (Pilot Survey Data).

Usage:
    python scripts/audit_corridor_survey.py "LDF DATA_110713.csv"
    python scripts/audit_corridor_survey.py data.csv --json > audit.json

The audit proves nothing was lost on the way in: route blocks, point counts by
class, surveyed section pairing, feature inventory and every skipped row with a
reason. It does not modify the file.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "backend"))

from app.modules.intake.corridor import CorridorReader  # noqa: E402


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("csv_path", help="Corridor survey export (CSV)")
    parser.add_argument("--json", action="store_true", help="Print the full summary as JSON")
    parser.add_argument("--pair-radius", type=float, default=15.0, help="Section pairing radius (m)")
    args = parser.parse_args()

    survey = CorridorReader.read(Path(args.csv_path))
    summary = survey.summary(pair_radius_m=args.pair_radius)
    if args.json:
        print(json.dumps(summary, indent=2))
        return 0

    print(f"Corridor survey audit — {summary['source']}")
    print(f"sha256 {summary['sha256']}")
    print(f"{summary['total_points']:,} points in {len(summary['routes'])} route block(s)\n")

    header = f"{'route':<22}{'points':>8}{'centre':>8}{'L':>6}{'R':>6}{'feat':>7}{'length m':>11}{'sections':>9}{'spacing m':>11}"
    print(header)
    print("-" * len(header))
    for route in summary["routes"]:
        print(
            f"{route['title'][:21]:<22}{route['points']:>8}{route['centre_points']:>8}{route['left_points']:>6}"
            f"{route['right_points']:>6}{route['feature_points']:>7}{route['centreline_length_m']:>11,.0f}"
            f"{route['sections']:>9}{route['station_spacing_median_m'] or 0:>11.1f}"
        )

    print("\nfeatures")
    for route in summary["routes"]:
        if route["features"]:
            items = ", ".join(f"{k} {v}" for k, v in sorted(route["features"].items()))
            print(f"  {route['title']}: {items}")

    print("\ncodes")
    for code, count in summary["code_counts"].items():
        print(f"  {code:<28}{count:>6}")

    print(f"\nskipped rows: {summary['skipped_rows']}")
    for row in summary["skipped"][:15]:
        print(f"  row {row['row']:>5}  {row['reason']}  {row['cells']}")

    if summary["warnings"]:
        print("\nwarnings")
        for warning in summary["warnings"]:
            print(f"  - {warning}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
