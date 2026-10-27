from typing import List, Tuple
import numpy as np


def calculate_cross_section_areas(
    template_pts: List[Tuple[float, float]],
    ground_pts: List[Tuple[float, float]],
    left_daylight_w: float,
    right_daylight_w: float
) -> Tuple[float, float, float]:
    """
    Computes exact cut area (m2), fill area (m2), and ground footprint width (m)
    by integrating vertical differences between existing ground and design template.
    """
    tmpl_w = np.array([p[0] for p in template_pts], dtype=float)
    tmpl_z = np.array([p[1] for p in template_pts], dtype=float)

    grd_w = np.array([p[0] for p in ground_pts], dtype=float)
    grd_z = np.array([p[1] for p in ground_pts], dtype=float)

    min_w = min(left_daylight_w, right_daylight_w)
    max_w = max(left_daylight_w, right_daylight_w)
    footprint_width = max(0.0, max_w - min_w)

    if footprint_width <= 1e-4:
        return 0.0, 0.0, 0.0

    # Build evaluation breakpoints including all template vertices inside footprint
    eval_w = [min_w]
    for w in tmpl_w:
        if min_w < w < max_w:
            eval_w.append(w)
    for w in grd_w:
        if min_w < w < max_w:
            eval_w.append(w)
    eval_w.append(max_w)

    # Add dense points (every 0.2m) for fine integration
    dense_w = np.arange(min_w, max_w, 0.2)
    all_w = np.unique(np.concatenate([eval_w, dense_w]))
    all_w.sort()

    cut_area = 0.0
    fill_area = 0.0

    for i in range(len(all_w) - 1):
        w1 = all_w[i]
        w2 = all_w[i + 1]
        dw = w2 - w1
        if dw <= 1e-6:
            continue

        zg1 = float(np.interp(w1, grd_w, grd_z))
        zg2 = float(np.interp(w2, grd_w, grd_z))

        zt1 = float(np.interp(w1, tmpl_w, tmpl_z))
        zt2 = float(np.interp(w2, tmpl_w, tmpl_z))

        dz1 = zg1 - zt1  # positive = cut, negative = fill
        dz2 = zg2 - zt2

        if dz1 >= 0 and dz2 >= 0:
            # Entirely in cut
            cut_area += 0.5 * (dz1 + dz2) * dw
        elif dz1 <= 0 and dz2 <= 0:
            # Entirely in fill
            fill_area += 0.5 * (abs(dz1) + abs(dz2)) * dw
        else:
            # Zero-crossing between w1 and w2
            t = abs(dz1) / (abs(dz1) + abs(dz2))
            w_zero = w1 + t * dw
            dw1 = w_zero - w1
            dw2 = w2 - w_zero

            if dz1 >= 0:
                cut_area += 0.5 * dz1 * dw1
                fill_area += 0.5 * abs(dz2) * dw2
            else:
                fill_area += 0.5 * abs(dz1) * dw1
                cut_area += 0.5 * dz2 * dw2

    return float(round(cut_area, 3)), float(round(fill_area, 3)), float(round(footprint_width, 3))
