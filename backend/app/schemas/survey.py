from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional, Tuple
from pydantic import BaseModel, Field


class SurveyFileStatus(str, Enum):
    PENDING = "PENDING"
    VALIDATED = "VALIDATED"
    REJECTED = "REJECTED"


class QualityVerdict(str, Enum):
    PASSED = "PASSED"
    PASSED_WITH_WARNINGS = "PASSED_WITH_WARNINGS"
    REJECTED = "REJECTED"


class Point3D(BaseModel):
    x: float
    y: float
    z: float
    classification: Optional[int] = 0


class BoundingBox3D(BaseModel):
    min_x: float
    max_x: float
    min_y: float
    max_y: float
    min_z: float
    max_z: float

    @property
    def span_x(self) -> float:
        return self.max_x - self.min_x

    @property
    def span_y(self) -> float:
        return self.max_y - self.min_y

    @property
    def span_z(self) -> float:
        return self.max_z - self.min_z

    @property
    def approximate_area_m2(self) -> float:
        return max(1.0, self.span_x * self.span_y)


class IntakeQualityReport(BaseModel):
    verdict: QualityVerdict
    total_raw_points: int
    valid_points: int
    duplicate_count: int = 0
    blank_or_nan_count: int = 0
    spikes_count: int = 0
    holes_count: int = 0
    density_pts_m2: float
    bounds: BoundingBox3D
    unit: str = "meters"
    crs_epsg: Optional[int] = None
    warnings: List[str] = Field(default_factory=list)
    errors: List[str] = Field(default_factory=list)
    summary_text: str
    engineer_notice: str = "DATA AUDIT COMPLETED - TO BE CONFIRMED BY A REGISTERED ENGINEER"


class StandardPointCloudData(BaseModel):
    file_id: str
    original_filename: str
    sha256_hash: str
    file_size_bytes: int
    crs_epsg: Optional[int] = 32632
    unit: str = "meters"
    point_count: int
    bounds: BoundingBox3D
    density_pts_m2: float
    quality_report: IntakeQualityReport
    points: List[Point3D] = Field(default_factory=list)


class SurveyUploadResponse(BaseModel):
    file_id: str
    project_id: str
    original_filename: str
    file_format: str
    sha256_hash: str
    file_size_bytes: int
    status: SurveyFileStatus
    quality_report: Optional[IntakeQualityReport] = None
    plain_language_summary: str
