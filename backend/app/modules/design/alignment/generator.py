import math
from typing import List, Optional, Tuple
import numpy as np

from app.core.engineering import get_engineering_rules
from app.modules.design.alignment.geometry import (
    build_continuous_centreline,
    discretize_centreline_stations
)
from app.modules.terrain.interpolator import TerrainInterpolator
from app.schemas.alignment import HorizontalAlignmentPackage, HorizontalPoint


class HorizontalAlignmentGenerator:
    """
    Generates a horizontal road centreline between start and end coordinates.
    Samples ground elevation, computes grade compliance against configurable limits,
    and inserts circular curves with minimum radii at deflection points.
    """

    @classmethod
    def generate(
        cls,
        start_xy: Tuple[float, float],
        end_xy: Tuple[float, float],
        terrain: TerrainInterpolator,
        intermediate_pis: Optional[List[Tuple[float, float]]] = None,
        station_interval_m: Optional[float] = None
    ) -> HorizontalAlignmentPackage:
        rules = get_engineering_rules()
        h_rules = rules.horizontal_alignment

        design_speed = float(h_rules.get("design_speed_kph", 60.0))
        min_radius = float(h_rules.get("min_curve_radius_m", 150.0))
        max_grade = float(h_rules.get("max_ground_grade_percent", 12.0))
        interval = float(station_interval_m or h_rules.get("station_interval_m", 20.0))

        # Check bounds
        if not terrain.is_within_bounds(start_xy[0], start_xy[1]):
            raise ValueError(
                f"Start coordinate ({start_xy[0]:.1f}, {start_xy[1]:.1f}) is outside the survey terrain bounds."
            )
        if not terrain.is_within_bounds(end_xy[0], end_xy[1]):
            raise ValueError(
                f"End coordinate ({end_xy[0]:.1f}, {end_xy[1]:.1f}) is outside the survey terrain bounds."
            )

        # Build initial vertex chain: Start -> [Intermediate PIs] -> End
        vertices: List[Tuple[float, float]] = [start_xy]
        if intermediate_pis:
            for pi in intermediate_pis:
                vertices.append(pi)
        vertices.append(end_xy)

        # 1. Sample straight/initial path to evaluate natural ground grade
        initial_samples = terrain.sample_corridor_line(start_xy, end_xy, interval_m=2.0)
        max_detected_grade = 0.0

        for i in range(1, len(initial_samples)):
            ds = initial_samples[i][0] - initial_samples[i - 1][0]
            dz = abs(initial_samples[i][3] - initial_samples[i - 1][3])
            if ds > 0.1:
                grade_pct = (dz / ds) * 100.0
                if grade_pct > max_detected_grade:
                    max_detected_grade = grade_pct

        # 2. If direct path severely breaches max_grade and no intermediate PIs were supplied,
        # generate a gentle contour deviation around the steep peak
        if not intermediate_pis and max_detected_grade > max_grade:
            # Locate midpoint of steepest slope
            mid_x = (start_xy[0] + end_xy[0]) / 2.0
            mid_y = (start_xy[1] + end_xy[1]) / 2.0
            dx = end_xy[0] - start_xy[0]
            dy = end_xy[1] - start_xy[1]
            length = math.hypot(dx, dy)

            # Lateral offset normal to path (try +offset and -offset to find gentler terrain)
            normal_x = -dy / max(1e-6, length)
            normal_y = dx / max(1e-6, length)

            best_pi = None
            best_grade = max_detected_grade

            # Test lateral offsets of 10m, 20m, 30m on left and right
            for offset_m in [15.0, -15.0, 30.0, -30.0]:
                test_pi = (mid_x + normal_x * offset_m, mid_y + normal_y * offset_m)
                if terrain.is_within_bounds(test_pi[0], test_pi[1]):
                    # Sample leg 1 and leg 2
                    leg1 = terrain.sample_corridor_line(start_xy, test_pi, interval_m=2.0)
                    leg2 = terrain.sample_corridor_line(test_pi, end_xy, interval_m=2.0)
                    leg_grade = 0.0
                    for leg in [leg1, leg2]:
                        for i in range(1, len(leg)):
                            ds = leg[i][0] - leg[i - 1][0]
                            dz = abs(leg[i][3] - leg[i - 1][3])
                            if ds > 0.1:
                                leg_grade = max(leg_grade, (dz / ds) * 100.0)
                    if leg_grade < best_grade:
                        best_grade = leg_grade
                        best_pi = test_pi

            if best_pi is not None and best_grade < max_detected_grade:
                vertices = [start_xy, best_pi, end_xy]
                max_detected_grade = best_grade

        # 3. Construct continuous centreline with circular curves
        centreline_pts, curves = build_continuous_centreline(vertices, radius_m=min_radius)

        # 4. Discretize at station intervals (e.g. 20m)
        stations, total_len = discretize_centreline_stations(
            centreline_pts,
            station_interval_m=interval,
            terrain_interpolator=terrain
        )

        is_compliant = max_detected_grade <= max_grade

        # 5. Compile summary text
        curve_desc = f"{len(curves)} circular curve(s) fitted with min radius {min_radius:.1f}m." if curves else "Straight tangent alignment."
        compliance_desc = (
            f"GRADE COMPLIANT: Maximum terrain grade is {max_detected_grade:.2f}% (limit: {max_grade:.1f}%)."
            if is_compliant
            else f"GRADE WARNING: Maximum natural terrain grade along route is {max_detected_grade:.2f}%, exceeding guideline limit of {max_grade:.1f}%."
        )

        summary = (
            f"Horizontal Alignment: Total length = {total_len:.2f}m. {curve_desc} {compliance_desc} "
            f"Stationing interval = {interval:.1f}m ({len(stations)} stations generated)."
        )

        return HorizontalAlignmentPackage(
            start_point=start_xy,
            end_point=end_xy,
            total_length_m=round(total_len, 2),
            station_interval_m=interval,
            design_speed_kph=design_speed,
            min_radius_m=min_radius,
            max_allowable_ground_grade_percent=max_grade,
            max_detected_ground_grade_percent=round(max_detected_grade, 2),
            is_grade_compliant=is_compliant,
            curves=curves,
            stations=stations,
            summary_text=summary
        )
