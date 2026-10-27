from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field


class CutFillType(str, Enum):
    CUT = "CUT"
    FILL = "FILL"
    AT_GRADE = "AT_GRADE"


class VerticalCurveType(str, Enum):
    CREST = "CREST"
    SAG = "SAG"
    TANGENT = "TANGENT"


class VerticalPVI(BaseModel):
    station_m: float
    elevation_m: float
    grade_in_percent: Optional[float] = None
    grade_out_percent: Optional[float] = None
    curve_length_m: Optional[float] = 0.0
    pvc_station_m: Optional[float] = None
    pvt_station_m: Optional[float] = None
    k_value: Optional[float] = None
    curve_type: VerticalCurveType = VerticalCurveType.TANGENT


class ProfilePoint(BaseModel):
    station_m: float
    ground_elevation_m: float
    design_elevation_m: float
    difference_m: float  # design - ground (+ = fill, - = cut)
    cut_or_fill: CutFillType
    grade_percent: float
    curve_type: VerticalCurveType = VerticalCurveType.TANGENT


class LongitudinalProfilePackage(BaseModel):
    total_length_m: float
    station_interval_m: float = 20.0
    min_allowable_grade_percent: float
    max_allowable_grade_percent: float
    max_detected_design_grade_percent: float
    max_cut_depth_m: float
    max_fill_depth_m: float
    mean_cut_depth_m: float
    mean_fill_depth_m: float
    is_grade_compliant: bool
    pvis: List[VerticalPVI] = Field(default_factory=list)
    profile_points: List[ProfilePoint] = Field(default_factory=list)
    summary_text: str
    engineer_notice: str = "LONGITUDINAL PROFILE GENERATED - TO BE CONFIRMED BY A REGISTERED ENGINEER"
