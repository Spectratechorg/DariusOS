import csv
import io
import re
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple
import numpy as np

from app.modules.intake.readers.base import BaseReader, POINT_DTYPE


class CsvReader(BaseReader):
    """
    Reader for comma-, semicolon-, or tab-delimited survey point files.
    """

    @property
    def format_name(self) -> str:
        return "CSV"

    def can_read(self, filename: str, sample_bytes: bytes) -> bool:
        lower = filename.lower()
        if lower.endswith((".csv", ".txt")):
            # Check if text is decodable
            try:
                sample_text = sample_bytes[:1024].decode("utf-8", errors="strict")
                return True
            except UnicodeDecodeError:
                return False
        return False

    def read(self, file_path: Path) -> Tuple[np.ndarray, Dict[str, Any]]:
        raw_text = file_path.read_text(encoding="utf-8", errors="replace")
        lines = [line.strip() for line in raw_text.splitlines() if line.strip() and not line.strip().startswith("#")]

        if not lines:
            return np.empty(0, dtype=POINT_DTYPE), {"total_lines": 0, "blank_or_invalid": 0, "format": "CSV"}

        # Detect delimiter from first 5 lines
        sample_chunk = "\n".join(lines[:min(5, len(lines))])
        delimiter = ","
        for candidate in [",", ";", "\t", " "]:
            if candidate in sample_chunk:
                delimiter = candidate
                break

        # Check for header
        first_line = lines[0]
        tokens = [t.strip().strip('"').strip("'").lower() for t in re.split(f"[{delimiter}]", first_line) if t.strip()]

        x_col, y_col, z_col, class_col = -1, -1, -1, -1
        has_header = False

        header_aliases_x = ["x", "east", "easting", "e"]
        header_aliases_y = ["y", "north", "northing", "n"]
        header_aliases_z = ["z", "elev", "elevation", "height", "altitude", "h"]
        header_aliases_c = ["classification", "class", "code", "id"]

        for idx, token in enumerate(tokens):
            if token in header_aliases_x and x_col == -1:
                x_col = idx
                has_header = True
            elif token in header_aliases_y and y_col == -1:
                y_col = idx
                has_header = True
            elif token in header_aliases_z and z_col == -1:
                z_col = idx
                has_header = True
            elif token in header_aliases_c and class_col == -1:
                class_col = idx

        start_row = 1 if has_header else 0
        if not has_header or x_col == -1 or y_col == -1 or z_col == -1:
            # Fall back to positional: col 0 = x, col 1 = y, col 2 = z
            x_col, y_col, z_col = 0, 1, 2
            start_row = 0

        parsed_points: List[Tuple[float, float, float, int]] = []
        invalid_rows_count = 0

        for line_no, line in enumerate(lines[start_row:], start=start_row + 1):
            parts = [p.strip() for p in re.split(f"[{delimiter}]+", line) if p.strip()]
            if len(parts) <= max(x_col, y_col, z_col):
                invalid_rows_count += 1
                continue

            try:
                x_val = float(parts[x_col])
                y_val = float(parts[y_col])
                z_val = float(parts[z_col])
                c_val = int(float(parts[class_col])) if class_col != -1 and len(parts) > class_col else 0

                if np.isnan(x_val) or np.isnan(y_val) or np.isnan(z_val):
                    invalid_rows_count += 1
                    continue

                parsed_points.append((x_val, y_val, z_val, c_val))
            except (ValueError, IndexError):
                invalid_rows_count += 1

        points_arr = np.array(parsed_points, dtype=POINT_DTYPE)
        metadata = {
            "format": "CSV",
            "total_lines": len(lines),
            "valid_points_parsed": len(parsed_points),
            "blank_or_invalid_rows": invalid_rows_count,
            "has_header": has_header,
            "delimiter": delimiter
        }
        return points_arr, metadata
