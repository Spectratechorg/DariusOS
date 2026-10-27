from typing import List, Tuple
import numpy as np


def solve_daylight_intersection(
    hinge_offset: float,
    hinge_z: float,
    side: str,  # 'LEFT' or 'RIGHT'
    ground_pts: List[Tuple[float, float]],
    cut_slope_v_to_h: float,
    fill_slope_v_to_h: float
) -> Tuple[float, float, bool]:
    """
    Computes the intersection of the road side slope with the natural ground surface.
    Returns (daylight_offset_m, daylight_elevation_m, is_cut).
    """
    ground_w = np.array([p[0] for p in ground_pts], dtype=float)
    ground_z = np.array([p[1] for p in ground_pts], dtype=float)

    # Ground elevation at hinge
    z_ground_at_hinge = float(np.interp(hinge_offset, ground_w, ground_z))

    is_cut = hinge_z < z_ground_at_hinge
    slope_ratio = cut_slope_v_to_h if is_cut else fill_slope_v_to_h
    slope_sign = +1.0 if is_cut else -1.0  # cut rises up, fill drops down

    dir_sign = -1.0 if side == "LEFT" else +1.0

    # Search outward from hinge
    test_dists = np.linspace(0.01, 35.0, 350)
    best_w = hinge_offset + dir_sign * 5.0
    best_z = hinge_z

    found = False
    for dist in test_dists:
        w_cur = hinge_offset + dir_sign * dist
        z_slope = hinge_z + slope_sign * (slope_ratio * dist)
        z_grd = float(np.interp(w_cur, ground_w, ground_z))

        diff = z_slope - z_grd
        # Cut: slope starts below ground (diff < 0) and rises above (diff >= 0)
        # Fill: slope starts above ground (diff > 0) and drops below (diff <= 0)
        if (is_cut and diff >= 0.0) or (not is_cut and diff <= 0.0):
            # Interpolate exact crossing between previous step and current
            prev_dist = max(0.0, dist - 0.1)
            prev_w = hinge_offset + dir_sign * prev_dist
            prev_z_slope = hinge_z + slope_sign * (slope_ratio * prev_dist)
            prev_z_grd = float(np.interp(prev_w, ground_w, ground_z))
            prev_diff = prev_z_slope - prev_z_grd

            denom = abs(diff - prev_diff)
            t = abs(prev_diff) / denom if denom > 1e-6 else 0.5
            best_w = prev_w + t * (w_cur - prev_w)
            best_z = prev_z_slope + t * (z_slope - prev_z_slope)
            found = True
            break

    if not found:
        # Extrapolate to terrain boundary if daylight goes beyond sampled corridor
        extreme_dist = 20.0
        best_w = hinge_offset + dir_sign * extreme_dist
        best_z = hinge_z + slope_sign * (slope_ratio * extreme_dist)

    return float(round(best_w, 4)), float(round(best_z, 4)), is_cut
