from typing import Dict, List, Tuple


def build_roadbed_template_points(
    design_z: float,
    carriageway_width_m: float = 7.0,
    shoulder_width_m: float = 1.5,
    camber_percent: float = -2.5,
    shoulder_slope_percent: float = -4.0
) -> List[Tuple[float, float]]:
    """
    Constructs the 2D offset coordinates (offset_m, elevation_m) for the road formation:
    Left shoulder hinge -> Left lane edge -> Crown (offset 0) -> Right lane edge -> Right shoulder hinge.
    """
    half_c = carriageway_width_m / 2.0
    camber_drop = (abs(camber_percent) / 100.0) * half_c
    shoulder_drop = (abs(shoulder_slope_percent) / 100.0) * shoulder_width_m

    z_crown = design_z
    z_lane_left = z_crown - camber_drop
    z_lane_right = z_crown - camber_drop

    w_shoulder_left = -(half_c + shoulder_width_m)
    w_shoulder_right = +(half_c + shoulder_width_m)

    z_shoulder_left = z_lane_left - shoulder_drop
    z_shoulder_right = z_lane_right - shoulder_drop

    points = [
        (round(w_shoulder_left, 4), round(z_shoulder_left, 4)),
        (round(-half_c, 4), round(z_lane_left, 4)),
        (0.0, round(z_crown, 4)),
        (round(half_c, 4), round(z_lane_right, 4)),
        (round(w_shoulder_right, 4), round(z_shoulder_right, 4))
    ]
    return points
