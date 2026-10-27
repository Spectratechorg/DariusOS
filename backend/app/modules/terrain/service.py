import json
import logging
from pathlib import Path
from typing import Optional, Tuple
import numpy as np

from app.core.config import settings
from app.modules.terrain.gridder import TerrainGridder
from app.modules.terrain.interpolator import TerrainInterpolator
from app.schemas.survey import BoundingBox3D
from app.schemas.terrain import GridMetadata, TerrainSurfaceData

logger = logging.getLogger("dariusos.terrain")


class TerrainService:
    """
    Manages generation, storage, and caching of digital elevation models.
    Provides fast interpolator access to subsequent design pipeline stages.
    """

    @classmethod
    def get_storage_paths(cls, sha256_hash: str) -> Tuple[Path, Path]:
        processed_dir = Path(settings.PROCESSED_DIR)
        processed_dir.mkdir(parents=True, exist_ok=True)
        grid_file = processed_dir / f"{sha256_hash}_dem.npy"
        meta_file = processed_dir / f"{sha256_hash}_dem_meta.json"
        return grid_file, meta_file

    @classmethod
    def build_terrain_model(
        cls,
        survey_file_id: str,
        survey_sha256: str,
        cleaned_points: np.ndarray,
        cell_size_m: float = 1.0,
        force_recompute: bool = False
    ) -> Tuple[TerrainSurfaceData, TerrainInterpolator]:
        grid_path, meta_path = cls.get_storage_paths(survey_sha256)

        # Check cache unless force_recompute is True
        if not force_recompute and grid_path.is_file() and meta_path.is_file():
            try:
                grid_z = np.load(grid_path)
                meta_dict = json.loads(meta_path.read_text(encoding="utf-8"))
                metadata = GridMetadata(**meta_dict)
                interpolator = TerrainInterpolator(grid_z, metadata)

                bounds = BoundingBox3D(
                    min_x=metadata.origin_x,
                    max_x=metadata.max_x,
                    min_y=metadata.origin_y,
                    max_y=metadata.max_y,
                    min_z=metadata.min_z,
                    max_z=metadata.max_z
                )

                surface_data = TerrainSurfaceData(
                    survey_file_id=survey_file_id,
                    survey_sha256=survey_sha256,
                    grid_metadata=metadata,
                    bounds=bounds,
                    grid_storage_path=str(grid_path),
                    point_count_used=len(cleaned_points)
                )
                logger.info("Loaded cached DEM grid for hash %s", survey_sha256[:12])
                return surface_data, interpolator
            except Exception as e:
                logger.warning("Cache load failed for DEM (%s). Recomputing...", e)

        # Compute DEM grid
        logger.info("Computing DEM grid from %d points (cell size: %.1fm)", len(cleaned_points), cell_size_m)
        grid_z, metadata = TerrainGridder.create_dem_grid(cleaned_points, cell_size_m=cell_size_m)

        # Save to disk
        np.save(grid_path, grid_z)
        meta_path.write_text(json.dumps(metadata.model_dump(), indent=2), encoding="utf-8")

        interpolator = TerrainInterpolator(grid_z, metadata)
        bounds = BoundingBox3D(
            min_x=metadata.origin_x,
            max_x=metadata.max_x,
            min_y=metadata.origin_y,
            max_y=metadata.max_y,
            min_z=metadata.min_z,
            max_z=metadata.max_z
        )

        surface_data = TerrainSurfaceData(
            survey_file_id=survey_file_id,
            survey_sha256=survey_sha256,
            grid_metadata=metadata,
            bounds=bounds,
            grid_storage_path=str(grid_path),
            point_count_used=len(cleaned_points)
        )
        return surface_data, interpolator

    @classmethod
    def load_interpolator(cls, survey_sha256: str) -> Optional[TerrainInterpolator]:
        grid_path, meta_path = cls.get_storage_paths(survey_sha256)
        if not grid_path.is_file() or not meta_path.is_file():
            return None
        grid_z = np.load(grid_path)
        meta_dict = json.loads(meta_path.read_text(encoding="utf-8"))
        metadata = GridMetadata(**meta_dict)
        return TerrainInterpolator(grid_z, metadata)
