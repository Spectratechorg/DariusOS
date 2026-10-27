from typing import List, Optional, Tuple
from pydantic import BaseModel, Field

from app.schemas.survey import BoundingBox3D


class GridMetadata(BaseModel):
    origin_x: float
    origin_y: float
    cell_size_m: float
    ncols: int
    nrows: int
    min_z: float
    max_z: float
    mean_z: float
    nodata_value: float = -9999.0

    @property
    def max_x(self) -> float:
        return self.origin_x + (self.ncols - 1) * self.cell_size_m

    @property
    def max_y(self) -> float:
        return self.origin_y + (self.nrows - 1) * self.cell_size_m


class TerrainSurfaceData(BaseModel):
    survey_file_id: str
    survey_sha256: str
    grid_metadata: GridMetadata
    bounds: BoundingBox3D
    grid_storage_path: str
    point_count_used: int
    engineer_notice: str = "TERRAIN SURFACE MODEL GENERATED - TO BE CONFIRMED BY A REGISTERED ENGINEER"


class ElevationPointResult(BaseModel):
    x: float
    y: float
    z: float
    slope_percent: Optional[float] = None
    is_valid: bool = True
