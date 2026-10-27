from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field


class MassHaulBalanceStatus(str, Enum):
    EXCESS_CUT = "EXCESS_CUT"
    EXCESS_FILL = "EXCESS_FILL"
    BALANCED = "BALANCED"


class EarthworkInterval(BaseModel):
    interval_id: int
    from_station_m: float
    to_station_m: float
    distance_m: float
    start_cut_area_m2: float
    end_cut_area_m2: float
    incremental_cut_m3: float
    start_fill_area_m2: float
    end_fill_area_m2: float
    incremental_fill_m3: float
    topsoil_strip_m3: float
    cumulative_cut_m3: float
    cumulative_fill_m3: float
    net_cumulative_m3: float  # cumulative_cut - cumulative_fill (+ = surplus/spoil, - = deficit/borrow)


class EarthworkQuantitiesPackage(BaseModel):
    calculation_method: str = "Average End Area Method with Prismoidal Analysis"
    soil_bulking_factor: float
    compaction_shrinkage_factor: float
    topsoil_strip_depth_m: float
    total_cut_volume_m3: float
    total_fill_volume_m3: float
    factored_fill_volume_m3: float
    total_topsoil_strip_volume_m3: float
    net_volume_m3: float
    balance_status: MassHaulBalanceStatus
    intervals: List[EarthworkInterval] = Field(default_factory=list)
    summary_text: str
    engineer_notice: str = "EARTHWORK QUANTITIES COMPUTED - TO BE CONFIRMED BY A REGISTERED ENGINEER"
