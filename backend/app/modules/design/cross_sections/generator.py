import math
from typing import List, Optional, Tuple
import numpy as np

from app.core.engineering import get_engineering_rules
from app.modules.design.cross_sections.daylight import solve_daylight_intersection
from app.modules.design.cross_sections.polygon import calculate_cross_section_areas
from app.modules.design.cross_sections.template import build_roadbed_template_points
from app.modules.terrain.interpolator import TerrainInterpolator
from app.schemas.alignment import HorizontalAlignmentPackage
from app.schemas.cross_section import (
    CrossSectionPackage,
    CrossSectionSlice,
    OffsetPoint,
    SectionClass
)
from app.schemas.profile import LongitudinalProfilePackage


class CrossSectionGenerator:
    """
    Generates transverse road cross-sections at configured station intervals.
    Slices natural ground perpendicular to the centreline, projects the roadbed formation,
    determines cut/fill side daylight intersections, and calculates exact cut/fill polygon areas.
    """

    @classmethod
    def generate(
        cls,
        alignment: HorizontalAlignmentPackage,
        profile: LongitudinalProfilePackage,
        terrain: TerrainInterpolator,
        custom_corridor_half_width_m: Optional[float] = None
    ) -> CrossSectionPackage:
        rules = get_engineering_rules()
        cs_rules = rules.cross_section

        carriageway_w = float(cs_rules.get("carriageway_width_m", 7.0))
        shoulder_w = float(cs_rules.get("shoulder_width_m", 1.5))
        camber_pct = float(cs_rules.get("camber_cross_slope_percent", -2.5))
        shoulder_slope_pct = float(cs_rules.get("shoulder_cross_slope_percent", -4.0))
        cut_slope = float(cs_rules.get("cut_slope_v_to_h", 0.6667))
        fill_slope = float(cs_rules.get("fill_slope_v_to_h", 0.5000))
        half_width = float(custom_corridor_half_width_m or cs_rules.get("corridor_sampling_half_width_m", 25.0))

        # Build station lookup for profile design elevations
        profile_map = {pt.station_m: pt for pt in profile.profile_points}

        slices: List[CrossSectionSlice] = []
        total_cut_area = 0.0
        total_fill_area = 0.0

        for h_st in alignment.stations:
            s = h_st.station_m
            p_st = profile_map.get(s)

            if p_st is None:
                # Interpolate if exact station match is missing
                design_z = h_st.ground_z
                diff_z = 0.0
            else:
                design_z = p_st.design_elevation_m
                diff_z = p_st.difference_m

            # Normal vector (perpendicular to centreline tangent)
            # Tangent unit vector: (tx, ty)
            # Normal to the right: (ty, -tx); Normal to the left: (-ty, tx)
            # Using standard left-to-right transverse slicing (-offset = Left, +offset = Right)
            tx = h_st.tangent_dx
            ty = h_st.tangent_dy

            # Offset axis: vector pointing from Left (-half_width) to Right (+half_width)
            # Right vector = (ty, -tx), so for offset w, delta = w * (ty, -tx)
            # Left vector (-w) = -w * (ty, -tx) = w * (-ty, tx)
            norm_x = ty
            norm_y = -tx

            # 1. Sample natural ground profile across transverse line
            offsets = np.arange(-half_width, half_width + 0.5, 1.0)
            ground_pts_list: List[Tuple[float, float]] = []

            for w in offsets:
                gx = h_st.x + w * norm_x
                gy = h_st.y + w * norm_y
                gz = terrain.get_elevation(gx, gy)
                ground_pts_list.append((round(float(w), 3), round(float(gz), 3)))

            # 2. Build roadbed template points (shoulder hinge -> crown -> shoulder hinge)
            roadbed = build_roadbed_template_points(
                design_z=design_z,
                carriageway_width_m=carriageway_w,
                shoulder_width_m=shoulder_w,
                camber_percent=camber_pct,
                shoulder_slope_percent=shoulder_slope_pct
            )

            left_hinge = roadbed[0]   # (w_left_hinge, z_left_hinge)
            right_hinge = roadbed[-1] # (w_right_hinge, z_right_hinge)

            # 3. Solve daylight intersections on Left and Right sides
            left_daylight_w, left_daylight_z, _ = solve_daylight_intersection(
                hinge_offset=left_hinge[0],
                hinge_z=left_hinge[1],
                side="LEFT",
                ground_pts=ground_pts_list,
                cut_slope_v_to_h=cut_slope,
                fill_slope_v_to_h=fill_slope
            )

            right_daylight_w, right_daylight_z, _ = solve_daylight_intersection(
                hinge_offset=right_hinge[0],
                hinge_z=right_hinge[1],
                side="RIGHT",
                ground_pts=ground_pts_list,
                cut_slope_v_to_h=cut_slope,
                fill_slope_v_to_h=fill_slope
            )

            # 4. Construct complete design template path including daylight catch lines
            full_template: List[Tuple[float, float]] = [
                (left_daylight_w, left_daylight_z),
                *roadbed,
                (right_daylight_w, right_daylight_z)
            ]

            # 5. Calculate exact cut and fill polygon areas
            cut_area, fill_area, footprint_w = calculate_cross_section_areas(
                template_pts=full_template,
                ground_pts=ground_pts_list,
                left_daylight_w=left_daylight_w,
                right_daylight_w=right_daylight_w
            )

            total_cut_area += cut_area
            total_fill_area += fill_area

            # 6. Classify cross section
            if cut_area > 0.05 and fill_area > 0.05:
                sec_class = SectionClass.TRANSITION
            elif cut_area > 0.05:
                sec_class = SectionClass.CUT
            elif fill_area > 0.05:
                sec_class = SectionClass.FILL
            else:
                sec_class = SectionClass.AT_GRADE

            slices.append(
                CrossSectionSlice(
                    station_m=round(float(s), 3),
                    centreline_x=round(float(h_st.x), 3),
                    centreline_y=round(float(h_st.y), 3),
                    centreline_bearing_deg=round(float(h_st.bearing_deg), 2),
                    ground_z=round(float(h_st.ground_z), 3),
                    design_z=round(float(design_z), 3),
                    difference_m=round(float(diff_z), 3),
                    section_class=sec_class,
                    cut_area_m2=round(float(cut_area), 3),
                    fill_area_m2=round(float(fill_area), 3),
                    topsoil_strip_width_m=round(float(footprint_w), 3),
                    left_daylight_offset_m=round(float(left_daylight_w), 3),
                    right_daylight_offset_m=round(float(right_daylight_w), 3),
                    ground_profile=[OffsetPoint(offset_m=p[0], elevation_m=p[1]) for p in ground_pts_list],
                    design_template=[OffsetPoint(offset_m=p[0], elevation_m=p[1]) for p in full_template]
                )
            )

        summary = (
            f"Cross-Sections Package: {len(slices)} sections generated at {alignment.station_interval_m:.1f}m intervals. "
            f"Carriageway width = {carriageway_w:.1f}m, Shoulders = {shoulder_w:.1f}m. "
            f"Total cut area sum = {total_cut_area:.2f} m², Total fill area sum = {total_fill_area:.2f} m²."
        )

        return CrossSectionPackage(
            total_sections=len(slices),
            interval_m=alignment.station_interval_m,
            carriageway_width_m=carriageway_w,
            shoulder_width_m=shoulder_w,
            camber_slope_percent=camber_pct,
            cut_slope_v_to_h=cut_slope,
            fill_slope_v_to_h=fill_slope,
            sections=slices,
            total_cut_area_sum_m2=round(total_cut_area, 2),
            total_fill_area_sum_m2=round(total_fill_area, 2),
            summary_text=summary
        )
