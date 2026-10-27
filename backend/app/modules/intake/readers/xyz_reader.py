from pathlib import Path
from typing import Any, Dict, List, Tuple
import numpy as np

from app.modules.intake.readers.base import BaseReader, POINT_DTYPE


class XyzReader(BaseReader):
    """
    Reader for raw whitespace- or comma-separated XYZ coordinate files.
    """

    @property
    def format_name(self) -> str:
        return "XYZ"

    def can_read(self, filename: str, sample_bytes: bytes) -> bool:
        lower = filename.lower()
        if lower.endswith(".xyz"):
            try:
                sample_bytes[:512].decode("utf-8")
                return True
            except UnicodeDecodeError:
                return False
        return False

    def read(self, file_path: Path) -> Tuple[np.ndarray, Dict[str, Any]]:
        raw_text = file_path.read_text(encoding="utf-8", errors="replace")
        lines = [line.strip() for line in raw_text.splitlines() if line.strip() and not line.strip().startswith("#")]

        parsed_points: List[Tuple[float, float, float, int]] = []
        invalid_rows_count = 0

        for line in lines:
            # Split by whitespace or comma
            parts = line.replace(",", " ").split()
            if len(parts) < 3:
                invalid_rows_count += 1
                continue

            try:
                x = float(parts[0])
                y = float(parts[1])
                z = float(parts[2])
                c = int(float(parts[3])) if len(parts) > 3 else 0

                if np.isnan(x) or np.isnan(y) or np.isnan(z):
                    invalid_rows_count += 1
                    continue

                parsed_points.append((x, y, z, c))
            except (ValueError, IndexError):
                invalid_rows_count += 1

        points_arr = np.array(parsed_points, dtype=POINT_DTYPE)
        metadata = {
            "format": "XYZ",
            "total_lines": len(lines),
            "valid_points_parsed": len(parsed_points),
            "blank_or_invalid_rows": invalid_rows_count
        }
        return points_arr, metadata
