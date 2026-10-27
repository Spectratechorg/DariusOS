from enum import Enum
from typing import Any, Dict, List, Optional, Tuple
from pydantic import BaseModel, Field


class StageRunStatus(str, Enum):
    CACHED = "CACHED"
    EXECUTED = "EXECUTED"
    SKIPPED = "SKIPPED"
    FAILED = "FAILED"


class StageRecord(BaseModel):
    stage_name: str
    status: StageRunStatus
    duration_sec: float
    cache_key: str


class PipelineRunRequest(BaseModel):
    project_id: str
    survey_file_id: str
    start_point: Tuple[float, float]
    end_point: Tuple[float, float]
    intermediate_pis: Optional[List[Tuple[float, float]]] = None
    target_elevation_offset_m: Optional[float] = 0.0
    station_interval_m: Optional[float] = 20.0
    force_recompute: bool = False


class PipelineRunSummary(BaseModel):
    total_length_m: float
    total_stations: int
    total_cut_volume_m3: float
    total_fill_volume_m3: float
    net_volume_m3: float
    balance_status: str


class PipelineRunResponse(BaseModel):
    run_id: str
    project_id: str
    survey_file_id: str
    status: str
    survey_file_hash: str
    engineering_rules_hash: str
    code_version: str
    execution_duration_sec: float
    stages: Dict[str, StageRecord]
    summary: PipelineRunSummary
    engineer_notice: str = "PIPELINE REGENERATION COMPLETED - TO BE CONFIRMED BY A REGISTERED ENGINEER"
