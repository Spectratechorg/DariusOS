from enum import Enum
from typing import List, Optional, Tuple
from pydantic import BaseModel, Field


class SectionClass(str, Enum):
    CUT = "CUT"
    FILL = "FILL"
    TRANSITION = "TRANSITION"
    AT_GRADE = "AT_GRADE"


class OffsetPoint(BaseModel):
    offset_m: float
    elevation_m: float


class CrossSectionSlice(BaseModel):
    station_m: float
    centreline_x: float
    centreline_y: float
    centreline_bearing_deg: float
    ground_z: float
    design_z: float
    difference_m: float
    section_class: SectionClass
    cut_area_m2: float
    fill_area_m2: float
    topsoil_strip_width_m: float
    left_daylight_offset_m: float
    right_daylight_offset_m: float
    ground_profile: List[OffsetPoint] = Field(default_factory=list)
    design_template: List[OffsetPoint] = Field(default_factory=list)


class CrossSectionPackage(BaseModel):
    total_sections: int
    interval_m: float
    carriageway_width_m: float
    shoulder_width_m: float
    camber_slope_percent: float
    cut_slope_v_to_h: float
    fill_slope_v_to_h: float
    sections: List[CrossSectionSlice] = Field(default_factory=list)
    total_cut_area_sum_m2: float = 0.0
    total_fill_area_sum_m2: float = 0.0
    summary_text: str
    engineer_notice: str = "CROSS-SECTIONS GENERATED - TO BE CONFIRMED BY A REGISTERED ENGINEER"
