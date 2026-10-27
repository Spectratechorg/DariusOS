from typing import List, Optional, Tuple
import numpy as np

from app.core.engineering import get_engineering_rules
from app.modules.design.profile.geometry import compute_vertical_curve, evaluate_pvi_system_elevation
from app.schemas.alignment import HorizontalAlignmentPackage
from app.schemas.profile import (
    CutFillType,
    LongitudinalProfilePackage,
    ProfilePoint,
    VerticalCurveType,
    VerticalPVI
)


class LongitudinalProfileGenerator:
    """
    Generates a continuous longitudinal road design profile along a road centreline.
    Samples ground elevation, designs vertical alignment within maximum/minimum grade limits,
    fits vertical curves (crest & sag), and calculates cut/fill depths at every station.
    """

    @classmethod
    def generate(
        cls,
        alignment: HorizontalAlignmentPackage,
        target_offset_m: Optional[float] = None,
        explicit_pvis: Optional[List[Tuple[float, float]]] = None
    ) -> LongitudinalProfilePackage:
        rules = get_engineering_rules()
        v_rules = rules.vertical_alignment

        min_grade = float(v_rules.get("min_grade_percent", 0.5))
        max_grade = float(v_rules.get("max_grade_percent", 8.0))
        k_crest = float(v_rules.get("min_crest_vertical_curve_k", 15.0))
        k_sag = float(v_rules.get("min_sag_vertical_curve_k", 10.0))
        default_offset = float(v_rules.get("default_roadbed_target_offset_m", 0.0))

        offset = target_offset_m if target_offset_m is not None else default_offset

        stations = alignment.stations
        if len(stations) < 2:
            raise ValueError("Horizontal alignment must have at least 2 stations to generate a longitudinal profile.")

        total_length = alignment.total_length_m
        ground_zs = np.array([st.ground_z for st in stations], dtype=float)
        station_vals = np.array([st.station_m for st in stations], dtype=float)

        # 1. Determine raw PVI nodes (station, elevation)
        raw_pvis: List[Tuple[float, float]] = []

        if explicit_pvis and len(explicit_pvis) >= 2:
            raw_pvis = sorted(explicit_pvis, key=lambda p: p[0])
        else:
            # Automated vertical design
            start_z = ground_zs[0] + offset
            end_z = ground_zs[-1] + offset

            # Check if direct line between start and end breaches max grade
            overall_dz = end_z - start_z
            overall_grade = (overall_dz / max(1.0, total_length)) * 100.0

            if abs(overall_grade) > max_grade:
                # Clamp end elevation so design grade does not exceed max_grade
                sign = 1.0 if overall_grade > 0 else -1.0
                end_z = start_z + sign * (max_grade / 100.0) * total_length

            # Check terrain deviation from chord line to detect intermediate hills/valleys
            chord_zs = start_z + (station_vals / max(1.0, total_length)) * (end_z - start_z)
            deviations = ground_zs - chord_zs
            max_dev_idx = int(np.argmax(np.abs(deviations)))
            max_dev = float(deviations[max_dev_idx])

            # If intermediate terrain deviates significantly (> 1.5m) and project is long enough (> 60m),
            # place an intermediate PVI to balance cut/fill
            if abs(max_dev) > 1.5 and 20.0 < station_vals[max_dev_idx] < (total_length - 20.0):
                mid_s = float(station_vals[max_dev_idx])
                # Smooth intermediate elevation
                mid_z = float(ground_zs[max_dev_idx] + offset * 0.5)

                # Ensure leg 1 and leg 2 respect max_grade
                g1 = ((mid_z - start_z) / mid_s) * 100.0
                if abs(g1) > max_grade:
                    mid_z = start_z + (1.0 if g1 > 0 else -1.0) * (max_grade / 100.0) * mid_s

                g2 = ((end_z - mid_z) / (total_length - mid_s)) * 100.0
                if abs(g2) > max_grade:
                    end_z = mid_z + (1.0 if g2 > 0 else -1.0) * (max_grade / 100.0) * (total_length - mid_s)

                raw_pvis = [(0.0, start_z), (mid_s, mid_z), (total_length, end_z)]
            else:
                raw_pvis = [(0.0, start_z), (total_length, end_z)]

        # 2. Build Vertical PVI chain with parabolic curves
        pvi_objects: List[VerticalPVI] = []

        if len(raw_pvis) == 2:
            g = ((raw_pvis[1][1] - raw_pvis[0][1]) / max(1e-4, raw_pvis[1][0] - raw_pvis[0][0])) * 100.0
            pvi_objects.append(
                VerticalPVI(
                    station_m=round(raw_pvis[0][0], 3),
                    elevation_m=round(raw_pvis[0][1], 3),
                    grade_out_percent=round(g, 3),
                    curve_type=VerticalCurveType.TANGENT
                )
            )
            pvi_objects.append(
                VerticalPVI(
                    station_m=round(raw_pvis[1][0], 3),
                    elevation_m=round(raw_pvis[1][1], 3),
                    grade_in_percent=round(g, 3),
                    curve_type=VerticalCurveType.TANGENT
                )
            )
        else:
            # First PVI
            g_start = ((raw_pvis[1][1] - raw_pvis[0][1]) / (raw_pvis[1][0] - raw_pvis[0][0])) * 100.0
            pvi_objects.append(
                VerticalPVI(
                    station_m=round(raw_pvis[0][0], 3),
                    elevation_m=round(raw_pvis[0][1], 3),
                    grade_out_percent=round(g_start, 3),
                    curve_type=VerticalCurveType.TANGENT
                )
            )

            # Intermediate PVIs
            for i in range(1, len(raw_pvis) - 1):
                p_prev = raw_pvis[i - 1]
                p_curr = raw_pvis[i]
                p_next = raw_pvis[i + 1]

                curve_pvi = compute_vertical_curve(
                    pvi_prev_station=p_prev[0],
                    pvi_prev_z=p_prev[1],
                    pvi_station=p_curr[0],
                    pvi_z=p_curr[1],
                    pvi_next_station=p_next[0],
                    pvi_next_z=p_next[1],
                    k_crest=k_crest,
                    k_sag=k_sag
                )
                pvi_objects.append(curve_pvi)

            # Last PVI
            g_end = ((raw_pvis[-1][1] - raw_pvis[-2][1]) / (raw_pvis[-1][0] - raw_pvis[-2][0])) * 100.0
            pvi_objects.append(
                VerticalPVI(
                    station_m=round(raw_pvis[-1][0], 3),
                    elevation_m=round(raw_pvis[-1][1], 3),
                    grade_in_percent=round(g_end, 3),
                    curve_type=VerticalCurveType.TANGENT
                )
            )

        # 3. Discretize profile points at each horizontal station
        profile_points: List[ProfilePoint] = []
        cut_depths: List[float] = []
        fill_depths: List[float] = []
        max_detected_grade = 0.0

        for st in stations:
            s = st.station_m
            gz = st.ground_z
            dz_elev, inst_grade, c_type = evaluate_pvi_system_elevation(s, pvi_objects)

            max_detected_grade = max(max_detected_grade, abs(inst_grade))

            diff = dz_elev - gz  # positive = fill, negative = cut

            if diff > 0.02:
                c_type_cf = CutFillType.FILL
                fill_depths.append(diff)
            elif diff < -0.02:
                c_type_cf = CutFillType.CUT
                cut_depths.append(abs(diff))
            else:
                c_type_cf = CutFillType.AT_GRADE

            profile_points.append(
                ProfilePoint(
                    station_m=round(float(s), 3),
                    ground_elevation_m=round(float(gz), 3),
                    design_elevation_m=round(float(dz_elev), 3),
                    difference_m=round(float(diff), 3),
                    cut_or_fill=c_type_cf,
                    grade_percent=round(float(inst_grade), 3),
                    curve_type=c_type
                )
            )

        max_cut = float(np.max(cut_depths)) if cut_depths else 0.0
        max_fill = float(np.max(fill_depths)) if fill_depths else 0.0
        mean_cut = float(np.mean(cut_depths)) if cut_depths else 0.0
        mean_fill = float(np.mean(fill_depths)) if fill_depths else 0.0

        is_grade_compliant = max_detected_grade <= (max_grade + 1e-3)

        num_curves = sum(1 for p in pvi_objects if p.curve_type != VerticalCurveType.TANGENT)
        curve_desc = f"{num_curves} vertical curve(s) fitted." if num_curves else "Constant grade tangent profile."
        compliance_desc = (
            f"GRADE COMPLIANT: Maximum design road grade is {max_detected_grade:.2f}% (limit: {max_grade:.1f}%)."
            if is_grade_compliant
            else f"GRADE WARNING: Maximum design road grade is {max_detected_grade:.2f}%, exceeding guideline limit of {max_grade:.1f}%."
        )

        summary = (
            f"Longitudinal Profile: {curve_desc} {compliance_desc} "
            f"Max cut depth = {max_cut:.2f}m, Max fill depth = {max_fill:.2f}m. Total length = {total_length:.2f}m."
        )

        return LongitudinalProfilePackage(
            total_length_m=round(total_length, 2),
            station_interval_m=alignment.station_interval_m,
            min_allowable_grade_percent=min_grade,
            max_allowable_grade_percent=max_grade,
            max_detected_design_grade_percent=round(max_detected_grade, 2),
            max_cut_depth_m=round(max_cut, 3),
            max_fill_depth_m=round(max_fill, 3),
            mean_cut_depth_m=round(mean_cut, 3),
            mean_fill_depth_m=round(mean_fill, 3),
            is_grade_compliant=is_grade_compliant,
            pvis=pvi_objects,
            profile_points=profile_points,
            summary_text=summary
        )
