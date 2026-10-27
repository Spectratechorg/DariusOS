from enum import Enum
from typing import List, Optional, Tuple
from pydantic import BaseModel, Field


class AlignmentElementType(str, Enum):
    TANGENT = "TANGENT"
    CIRCULAR_CURVE = "CIRCULAR_CURVE"


class HorizontalPoint(BaseModel):
    station_m: float
    x: float
    y: float
    bearing_deg: float
    ground_z: float
    segment_type: AlignmentElementType = AlignmentElementType.TANGENT
    tangent_dx: float = 0.0
    tangent_dy: float = 1.0


class AlignmentCurve(BaseModel):
    curve_id: int
    pi_x: float
    pi_y: float
    pc_station_m: float
    pt_station_m: float
    radius_m: float
    deflection_angle_deg: float
    tangent_length_m: float
    arc_length_m: float


class HorizontalAlignmentPackage(BaseModel):
    start_point: Tuple[float, float]
    end_point: Tuple[float, float]
    total_length_m: float
    station_interval_m: float = 20.0
    design_speed_kph: float
    min_radius_m: float
    max_allowable_ground_grade_percent: float
    max_detected_ground_grade_percent: float
    is_grade_compliant: bool
    curves: List[AlignmentCurve] = Field(default_factory=list)
    stations: List[HorizontalPoint] = Field(default_factory=list)
    summary_text: str
    engineer_notice: str = "ALIGNMENT GEOMETRY GENERATED - TO BE CONFIRMED BY A REGISTERED ENGINEER"
