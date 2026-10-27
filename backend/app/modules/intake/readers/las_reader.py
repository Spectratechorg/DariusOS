from pathlib import Path
from typing import Any, Dict, Tuple
import numpy as np

from app.modules.intake.readers.base import BaseReader, POINT_DTYPE


class LasReader(BaseReader):
    """
    Reader for ASPRS LAS and compressed LAZ point cloud files.
    """

    @property
    def format_name(self) -> str:
        return "LAS"

    def can_read(self, filename: str, sample_bytes: bytes) -> bool:
        lower = filename.lower()
        if lower.endswith((".las", ".laz")):
            # Standard LAS signature is 'LASF' in first 4 bytes
            return sample_bytes.startswith(b"LASF") or lower.endswith(".laz")
        return False

    def read(self, file_path: Path) -> Tuple[np.ndarray, Dict[str, Any]]:
        import laspy

        try:
            las = laspy.read(file_path)
        except Exception as e:
            raise ValueError(f"Failed to parse LAS/LAZ file '{file_path.name}': {str(e)}")

        x = np.asarray(las.x, dtype=np.float64)
        y = np.asarray(las.y, dtype=np.float64)
        z = np.asarray(las.z, dtype=np.float64)

        classification = np.zeros(len(x), dtype=np.int32)
        if hasattr(las, "classification"):
            classification = np.asarray(las.classification, dtype=np.int32)

        points_arr = np.empty(len(x), dtype=POINT_DTYPE)
        points_arr["x"] = x
        points_arr["y"] = y
        points_arr["z"] = z
        points_arr["classification"] = classification

        metadata = {
            "format": "LAS" if file_path.suffix.lower() == ".las" else "LAZ",
            "point_count": len(points_arr),
            "las_version": f"{las.header.version.major}.{las.header.version.minor}",
            "point_format": las.header.point_format.id,
            "scales": list(las.header.scales),
            "offsets": list(las.header.offsets)
        }
        return points_arr, metadata
