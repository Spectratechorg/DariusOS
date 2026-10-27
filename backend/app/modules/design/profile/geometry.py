import math
from typing import Optional, Tuple
from app.schemas.profile import VerticalCurveType, VerticalPVI


def compute_vertical_curve(
    pvi_prev_station: float,
    pvi_prev_z: float,
    pvi_station: float,
    pvi_z: float,
    pvi_next_station: float,
    pvi_next_z: float,
    k_crest: float = 15.0,
    k_sag: float = 10.0
) -> VerticalPVI:
    """
    Computes standard equal-tangent parabolic vertical curve parameters at a Point of Vertical Intersection (PVI).
    """
    len_in = max(1e-4, pvi_station - pvi_prev_station)
    len_out = max(1e-4, pvi_next_station - pvi_station)

    g1 = ((pvi_z - pvi_prev_z) / len_in) * 100.0
    g2 = ((pvi_next_z - pvi_z) / len_out) * 100.0
    algebraic_diff = g2 - g1  # positive = sag, negative = crest

    if abs(algebraic_diff) < 0.2:
        # Negligible grade change, tangent intersection
        return VerticalPVI(
            station_m=round(pvi_station, 3),
            elevation_m=round(pvi_z, 3),
            grade_in_percent=round(g1, 3),
            grade_out_percent=round(g2, 3),
            curve_length_m=0.0,
            pvc_station_m=round(pvi_station, 3),
            pvt_station_m=round(pvi_station, 3),
            k_value=0.0,
            curve_type=VerticalCurveType.TANGENT
        )

    is_crest = algebraic_diff < 0.0
    k_val = k_crest if is_crest else k_sag
    curve_type = VerticalCurveType.CREST if is_crest else VerticalCurveType.SAG

    # L = K * |A|
    desired_length = k_val * abs(algebraic_diff)

    # Max length bounded by 90% of adjacent tangents to avoid curve overlap
    max_len = 2.0 * min(len_in, len_out) * 0.90
    actual_length = max(10.0, min(desired_length, max_len))

    half_len = actual_length / 2.0
    pvc_s = pvi_station - half_len
    pvt_s = pvi_station + half_len

    return VerticalPVI(
        station_m=round(pvi_station, 3),
        elevation_m=round(pvi_z, 3),
        grade_in_percent=round(g1, 3),
        grade_out_percent=round(g2, 3),
        curve_length_m=round(actual_length, 3),
        pvc_station_m=round(pvc_s, 3),
        pvt_station_m=round(pvt_s, 3),
        k_value=round(k_val, 2),
        curve_type=curve_type
    )


def evaluate_pvi_system_elevation(
    station: float,
    pvis: list[VerticalPVI]
) -> Tuple[float, float, VerticalCurveType]:
    """
    Evaluates design elevation and instantaneous grade at a given station across a chain of PVIs.
    """
    if not pvis:
        raise ValueError("At least one PVI is required.")

    # 1. First check if station falls within any active vertical curve
    for pvi in pvis:
        if pvi.curve_length_m and pvi.curve_length_m > 0 and pvi.pvc_station_m is not None and pvi.pvt_station_m is not None:
            if pvi.pvc_station_m <= station <= pvi.pvt_station_m:
                g1 = pvi.grade_in_percent or 0.0
                g2 = pvi.grade_out_percent or 0.0
                lv = pvi.curve_length_m
                x = station - pvi.pvc_station_m  # distance from PVC

                # Elevation at PVC
                z_pvc = pvi.elevation_m - (g1 / 100.0) * (lv / 2.0)
                # Parabola: y(x) = z_pvc + (g1/100)*x + ((g2 - g1)/(200*lv))*x^2
                y = z_pvc + (g1 / 100.0) * x + ((g2 - g1) / (200.0 * lv)) * (x ** 2)
                # Instantaneous grade: g(x) = g1 + ((g2 - g1)/lv)*x
                inst_g = g1 + ((g2 - g1) / lv) * x
                return float(y), float(inst_g), pvi.curve_type

    if len(pvis) == 1:
        return float(pvis[0].elevation_m), 0.0, VerticalCurveType.TANGENT

    # 2. Station before first PVI
    if station <= pvis[0].station_m:
        g = pvis[0].grade_out_percent or 0.0
        dz = (g / 100.0) * (station - pvis[0].station_m)
        return float(pvis[0].elevation_m + dz), float(g), VerticalCurveType.TANGENT

    # 3. Station after last PVI
    if station >= pvis[-1].station_m:
        g = pvis[-1].grade_in_percent or 0.0
        dz = (g / 100.0) * (station - pvis[-1].station_m)
        return float(pvis[-1].elevation_m + dz), float(g), VerticalCurveType.TANGENT

    # 4. Station on tangent between adjacent PVIs
    for i in range(len(pvis) - 1):
        p1 = pvis[i]
        p2 = pvis[i + 1]
        if p1.station_m <= station <= p2.station_m:
            seg_len = max(1e-4, p2.station_m - p1.station_m)
            g = ((p2.elevation_m - p1.elevation_m) / seg_len) * 100.0
            dz = (g / 100.0) * (station - p1.station_m)
            return float(p1.elevation_m + dz), float(g), VerticalCurveType.TANGENT

    last_pvi = pvis[-1]
    return float(last_pvi.elevation_m), 0.0, VerticalCurveType.TANGENT
