from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel


class ProjectCreateRequest(BaseModel):
    name: str
    description: Optional[str] = None


class ProjectResponse(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    created_by_user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SurveySummaryResponse(BaseModel):
    id: str
    original_filename: str
    file_format: str
    sha256_hash: str
    file_size_bytes: int
    point_count: Optional[int] = None
    density_pts_m2: Optional[float] = None
    status: str
    uploaded_at: datetime

    class Config:
        from_attributes = True


class PipelineRunSummaryResponse(BaseModel):
    id: str
    survey_file_id: str
    status: str
    execution_duration_sec: Optional[float] = None
    total_road_length_m: Optional[float] = None
    total_cut_volume_m3: Optional[float] = None
    total_fill_volume_m3: Optional[float] = None
    net_volume_m3: Optional[float] = None
    created_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ProjectDetailResponse(ProjectResponse):
    surveys: List[SurveySummaryResponse] = []
    runs: List[PipelineRunSummaryResponse] = []
