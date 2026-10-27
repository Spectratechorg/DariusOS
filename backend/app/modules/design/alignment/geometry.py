import math
from typing import List, Optional, Tuple
import numpy as np

from app.schemas.alignment import AlignmentCurve, AlignmentElementType, HorizontalPoint


def calculate_bearing(p1: Tuple[float, float], p2: Tuple[float, float]) -> float:
    """
    Computes whole-circle bearing (azimuth in degrees, 0 = North, 90 = East, 180 = South, 270 = West).
    """
    dx = p2[0] - p1[0]
    dy = p2[1] - p1[1]
    rad = math.atan2(dx, dy)
    deg = math.degrees(rad)
    return (deg + 360.0) % 360.0


def compute_circular_curve(
    p_prev: Tuple[float, float],
    p_pi: Tuple[float, float],
    p_next: Tuple[float, float],
    radius: float,
    curve_id: int = 1
) -> Optional[Tuple[AlignmentCurve, List[Tuple[float, float]]]]:
    """
    Calculates circular curve geometry at a Point of Intersection (PI) between two tangents.
    Returns (AlignmentCurve, sampled_arc_points) or None if deflection is negligible.
    """
    v1 = np.array([p_pi[0] - p_prev[0], p_pi[1] - p_prev[1]], dtype=float)
    v2 = np.array([p_next[0] - p_pi[0], p_next[1] - p_pi[1]], dtype=float)

    len1 = np.linalg.norm(v1)
    len2 = np.linalg.norm(v2)

    if len1 < 1e-4 or len2 < 1e-4:
        return None

    u1 = v1 / len1
    u2 = v2 / len2

    dot = np.clip(np.dot(u1, u2), -1.0, 1.0)
    deflection_rad = math.acos(dot)
    deflection_deg = math.degrees(deflection_rad)

    # If deflection is near zero (straight tangent), no curve is needed
    if deflection_deg < 0.5 or deflection_deg > 175.0:
        return None

    # Tangent distance T = R * tan(delta / 2)
    half_delta = deflection_rad / 2.0
    tangent_len = radius * math.tan(half_delta)

    # Check if tangent fits within available leg lengths
    max_allowable_t = min(len1 * 0.49, len2 * 0.49)
    if tangent_len > max_allowable_t:
        # Scale radius to fit available tangent space
        radius = max_allowable_t / math.tan(half_delta)
        tangent_len = radius * math.tan(half_delta)

    arc_length = radius * deflection_rad

    # Point of Curvature (PC) and Point of Tangency (PT)
    pc = np.array(p_pi) - tangent_len * u1
    pt = np.array(p_pi) + tangent_len * u2

    # Cross product to determine curve turn direction (+ = right/clockwise, - = left)
    cross = u1[0] * u2[1] - u1[1] * u2[0]
    turn_dir = 1.0 if cross >= 0 else -1.0

    # Normal to u1 towards center of curve
    # If turn_dir > 0 (right turn), normal is (u1_y, -u1_x)
    # If turn_dir < 0 (left turn), normal is (-u1_y, u1_x)
    normal = np.array([u1[1] * turn_dir, -u1[0] * turn_dir])
    center = pc + radius * normal

    # Sample arc points (at least 10 points along curve)
    num_arc_pts = max(10, int(math.ceil(arc_length / 2.0)))
    angle_start = math.atan2(pc[1] - center[1], pc[0] - center[0])
    
    # Sweep angle
    sweep = -deflection_rad * turn_dir
    arc_points: List[Tuple[float, float]] = []
    for i in range(num_arc_pts + 1):
        fraction = i / float(num_arc_pts)
        theta = angle_start + fraction * sweep
        ax = center[0] + radius * math.cos(theta)
        ay = center[1] + radius * math.sin(theta)
        arc_points.append((float(ax), float(ay)))

    curve_record = AlignmentCurve(
        curve_id=curve_id,
        pi_x=float(p_pi[0]),
        pi_y=float(p_pi[1]),
        pc_station_m=0.0,  # Will be resolved with continuous chainage
        pt_station_m=0.0,
        radius_m=float(radius),
        deflection_angle_deg=float(deflection_deg),
        tangent_length_m=float(tangent_len),
        arc_length_m=float(arc_length)
    )

    return curve_record, arc_points


def build_continuous_centreline(
    raw_vertices: List[Tuple[float, float]],
    radius_m: float
) -> Tuple[List[Tuple[float, float, AlignmentElementType]], List[AlignmentCurve]]:
    """
    Builds a continuous composite centreline of tangents and circular curves from a sequence of PIs.
    """
    if len(raw_vertices) < 2:
        raise ValueError("At least 2 points (start and end) are required for a horizontal alignment.")

    if len(raw_vertices) == 2:
        # Simple straight tangent
        path = [
            (raw_vertices[0][0], raw_vertices[0][1], AlignmentElementType.TANGENT),
            (raw_vertices[1][0], raw_vertices[1][1], AlignmentElementType.TANGENT)
        ]
        return path, []

    path: List[Tuple[float, float, AlignmentElementType]] = [
        (raw_vertices[0][0], raw_vertices[0][1], AlignmentElementType.TANGENT)
    ]
    curves: List[AlignmentCurve] = []

    for i in range(1, len(raw_vertices) - 1):
        p_prev = raw_vertices[i - 1]
        p_pi = raw_vertices[i]
        p_next = raw_vertices[i + 1]

        curve_res = compute_circular_curve(p_prev, p_pi, p_next, radius=radius_m, curve_id=len(curves) + 1)
        if curve_res is not None:
            curve_record, arc_pts = curve_res
            # Add line up to PC
            path.append((arc_pts[0][0], arc_pts[0][1], AlignmentElementType.TANGENT))
            # Add curve arc points
            for apt in arc_pts[1:]:
                path.append((apt[0], apt[1], AlignmentElementType.CIRCULAR_CURVE))
            curves.append(curve_record)
        else:
            # Sharp angle or straight: connect directly through PI
            path.append((p_pi[0], p_pi[1], AlignmentElementType.TANGENT))

    # Add final endpoint
    path.append((raw_vertices[-1][0], raw_vertices[-1][1], AlignmentElementType.TANGENT))
    return path, curves


def discretize_centreline_stations(
    path_points: List[Tuple[float, float, AlignmentElementType]],
    station_interval_m: float,
    terrain_interpolator
) -> Tuple[List[HorizontalPoint], float]:
    """
    Interpolates exact station points at fixed station intervals (e.g. 20m)
    along the composite centreline path, sampling ground elevation at each station.
    """
    if len(path_points) < 2:
        raise ValueError("Centreline path must contain at least 2 points.")

    # Calculate cumulative chainage along polyline vertices
    cum_dist = [0.0]
    for i in range(1, len(path_points)):
        p1 = path_points[i - 1]
        p2 = path_points[i]
        d = math.hypot(p2[0] - p1[0], p2[1] - p1[1])
        cum_dist.append(cum_dist[-1] + d)

    total_len = cum_dist[-1]

    # Target station schedule: 0, 20, 40, ..., total_len
    target_stations = list(np.arange(0.0, total_len, station_interval_m))
    if len(target_stations) == 0 or target_stations[-1] < total_len - 1e-3:
        target_stations.append(total_len)

    station_records: List[HorizontalPoint] = []
    seg_idx = 0

    for s in target_stations:
        # Find segment containing s
        while seg_idx < len(cum_dist) - 2 and cum_dist[seg_idx + 1] < s:
            seg_idx += 1

        s0 = cum_dist[seg_idx]
        s1 = cum_dist[seg_idx + 1]
        seg_len = max(1e-6, s1 - s0)
        t = (s - s0) / seg_len

        p0 = path_points[seg_idx]
        p1 = path_points[seg_idx + 1]

        x = p0[0] + t * (p1[0] - p0[0])
        y = p0[1] + t * (p1[1] - p0[1])

        # Tangent vector and bearing
        dx = (p1[0] - p0[0]) / seg_len
        dy = (p1[1] - p0[1]) / seg_len
        bearing = calculate_bearing((p0[0], p0[1]), (p1[0], p1[1]))

        seg_type = p1[2] if t > 0.5 else p0[2]
        ground_z = terrain_interpolator.get_elevation(x, y)

        station_records.append(
            HorizontalPoint(
                station_m=round(float(s), 3),
                x=round(float(x), 3),
                y=round(float(y), 3),
                bearing_deg=round(float(bearing), 2),
                ground_z=round(float(ground_z), 3),
                segment_type=seg_type,
                tangent_dx=round(float(dx), 5),
                tangent_dy=round(float(dy), 5)
            )
        )

    return station_records, total_len
