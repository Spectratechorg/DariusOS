from abc import ABC, abstractmethod
from pathlib import Path
from typing import Any, Dict, Tuple
import numpy as np

# Standardized structured numpy dtype for all internal point cloud operations
POINT_DTYPE = np.dtype([
    ("x", np.float64),
    ("y", np.float64),
    ("z", np.float64),
    ("classification", np.int32)
])


class BaseReader(ABC):
    """
    Abstract interface for survey point readers.
    Any new format (e.g. e57, geojson, copc) implements this class,
    keeping the data intake module modular and swappable.
    """

    @property
    @abstractmethod
    def format_name(self) -> str:
        """Name of the format, e.g. 'CSV', 'XYZ', 'LAS', 'LAZ'."""
        pass

    @abstractmethod
    def can_read(self, filename: str, sample_bytes: bytes) -> bool:
        """Returns True if this reader can parse the provided file."""
        pass

    @abstractmethod
    def read(self, file_path: Path) -> Tuple[np.ndarray, Dict[str, Any]]:
        """
        Reads points into a structured numpy array with columns:
        x (float64), y (float64), z (float64), classification (int32).
        
        Returns:
            Tuple of (points_array, metadata_dict)
        """
        pass
