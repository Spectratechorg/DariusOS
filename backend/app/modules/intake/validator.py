from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Dict, List, Set, Tuple
import numpy as np
from scipy.spatial import cKDTree

from app.schemas.survey import BoundingBox3D, QualityVerdict


@dataclass
class ValidationResult:
    verdict: QualityVerdict
    total_raw_points: int
    valid_points_count: int
    duplicate_indices: Set[int] = field(default_factory=set)
    spike_indices: Set[int] = field(default_factory=set)
    hole_indices: Set[int] = field(default_factory=set)
    nan_or_inf_indices: Set[int] = field(default_factory=set)
    bounds: BoundingBox3D = field(default_factory=lambda: BoundingBox3D(min_x=0, max_x=0, min_y=0, max_y=0, min_z=0, max_z=0))
    density_pts_m2: float = 0.0
    warnings: List[str] = field(default_factory=list)
    errors: List[str] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)


class SurveyValidator:
    """
    Validates point cloud quality, detects anomalies (spikes, holes, duplicates, blanks),
    evaluates survey density, and checks spatial bounds sanity.
    """
    MAX_SPACING_M: float = 50.0      # placeholder, engineer to confirm
    SPIKE_MIN_M: float = 2.0         # placeholder, engineer to confirm
    SPIKE_MAD_MULT: float = 6.0
    NEIGHBOURS: int = 8

    @classmethod
    def validate_raw_file(cls, file_path: Path, max_bytes: int = 104857600) -> None:
        if not file_path.is_file():
            raise FileNotFoundError(f"File '{file_path.name}' does not exist.")

        file_size = file_path.stat().st_size
        if file_size == 0:
            raise ValueError(f"Survey file '{file_path.name}' is empty (0 bytes).")

        if file_size > max_bytes:
            raise ValueError(
                f"Survey file size ({file_size / (1024*1024):.2f} MB) exceeds maximum allowed limit "
                f"({max_bytes / (1024*1024):.2f} MB)."
            )

    @classmethod
    def validate_points(cls, points: np.ndarray, file_metadata: Dict[str, Any]) -> ValidationResult:
        warnings: List[str] = []
        errors: List[str] = []

        total_raw = len(points)
        if total_raw == 0:
            return ValidationResult(
                verdict=QualityVerdict.REJECTED,
                total_raw_points=0,
                valid_points_count=0,
                errors=["Point cloud contains zero points."],
                metadata=file_metadata
            )

        # 1. Check for NaNs and Infs
        x = points["x"]
        y = points["y"]
        z = points["z"]

        finite_mask = np.isfinite(x) & np.isfinite(y) & np.isfinite(z)
        nan_indices = set(np.where(~finite_mask)[0].tolist())

        if nan_indices:
            warnings.append(f"Found {len(nan_indices)} non-finite (NaN or Inf) coordinate values.")

        valid_idx = np.where(finite_mask)[0]
        if len(valid_idx) == 0:
            return ValidationResult(
                verdict=QualityVerdict.REJECTED,
                total_raw_points=total_raw,
                valid_points_count=0,
                nan_or_inf_indices=nan_indices,
                errors=["All points contain non-finite (NaN/Inf) coordinates."],
                metadata=file_metadata
            )

        x_clean = x[valid_idx]
        y_clean = y[valid_idx]
        z_clean = z[valid_idx]

        # 2. Coordinate range / CRS sanity check
        min_x, max_x = float(np.min(x_clean)), float(np.max(x_clean))
        min_y, max_y = float(np.min(y_clean)), float(np.max(y_clean))
        min_z, max_z = float(np.min(z_clean)), float(np.max(z_clean))

        span_x = max(1e-6, max_x - min_x)
        span_y = max(1e-6, max_y - min_y)

        # Check if coordinates look like unprojected degrees (lat/lon):
        # Degrees WGS84 have coordinates within [-180, 180] and [-90, 90],
        # non-zero base origin, and fractional degree span (< 0.2 deg ~ 22 km)
        is_degree_range = (-180.0 <= min_x <= 180.0) and (-90.0 <= min_y <= 90.0)
        is_degree_span = span_x < 0.2 and span_y < 0.2
        is_nonzero_base = (abs(min_x) > 2.0 or abs(min_y) > 2.0)
        if is_degree_range and is_degree_span and is_nonzero_base:
            errors.append(
                "Coordinates appear to be geographic (degrees WGS84) instead of projected metric coordinates (UTM). "
                "Road design requires metric coordinates."
            )

        # 3. Duplicate point detection (within 1mm in 2D plan)
        # Round x and y to 3 decimal places (1 millimeter precision)
        # 3. Duplicates: same X, Y and Z within 1 mm
        coords_rounded = np.column_stack(
            [np.round(x_clean, 3), np.round(y_clean, 3), np.round(z_clean, 3)]
        )
        _, unique_indices = np.unique(coords_rounded, axis=0, return_index=True)
        unique_indices = np.sort(unique_indices)
        duplicate_indices = set(valid_idx.tolist()) - set(valid_idx[unique_indices].tolist())
        if duplicate_indices:
            warnings.append(f"Detected {len(duplicate_indices)} duplicate points (same X, Y, Z within 1mm).")

        # 4. Spacing and local elevation outliers (compare each point to its neighbours)
        uniq_idx = valid_idx[unique_indices]
        ux, uy, uz = x[uniq_idx], y[uniq_idx], z[uniq_idx]
        spike_indices: Set[int] = set()
        hole_indices: Set[int] = set()
        spacing = 0.0
        n_u = len(uniq_idx)
        if n_u >= 2:
            pts_xy = np.column_stack([ux, uy])
            k = min(cls.NEIGHBOURS + 1, n_u)
            dists, nbrs = cKDTree(pts_xy).query(pts_xy, k=k, workers=-1)
            spacing = float(np.median(dists[:, 1]))
            if k == cls.NEIGHBOURS + 1:
                resid = uz - np.median(uz[nbrs[:, 1:]], axis=1)
                mad = float(np.median(np.abs(resid - np.median(resid))))
                limit = max(cls.SPIKE_MIN_M, cls.SPIKE_MAD_MULT * 1.4826 * mad)
                spike_indices = set(uniq_idx[resid > limit].tolist())
                hole_indices = set(uniq_idx[resid < -limit].tolist())
                if spike_indices:
                    warnings.append(
                        f"Detected {len(spike_indices)} elevation outliers above their neighbours "
                        f"(> {limit:.1f} m). Kept in the dataset for engineer review."
                    )
                if hole_indices:
                    warnings.append(
                        f"Detected {len(hole_indices)} elevation outliers below their neighbours "
                        f"(> {limit:.1f} m). Kept in the dataset for engineer review."
                    )

        # 5. Density over occupied area (works for corridors) and spacing
        if spacing > 0:
            cell = max(1.0, 3.0 * spacing)
            cx = np.floor((ux - min_x) / cell).astype(np.int64)
            cy = np.floor((uy - min_y) / cell).astype(np.int64)
            occupied = np.unique(cx * (int(cy.max()) + 1) + cy).size
            approx_area_m2 = occupied * cell * cell
        else:
            approx_area_m2 = max(1.0, (max_x - min_x) * (max_y - min_y))
        density = len(valid_idx) / approx_area_m2

        if spacing > cls.MAX_SPACING_M:
            warnings.append(
                f"Survey is sparse: median point spacing {spacing:.1f} m "
                f"(density {density:.4f} pts/m² over occupied area; recommended spacing <= {cls.MAX_SPACING_M:.0f} m)."
            )

        # Compute final valid count (outliers are flagged, not removed)
        all_bad_indices = nan_indices | duplicate_indices
        valid_points_count = total_raw - len(all_bad_indices)

        # 6. Spatial gap check (grid occupancy)
        grid_bins = 5
        if len(valid_idx) > 50 and span_x > 10.0 and span_y > 10.0:
            hist, _, _ = np.histogram2d(x_clean, y_clean, bins=grid_bins)
            empty_cells = int(np.sum(hist == 0))
            if empty_cells > (grid_bins * grid_bins * 0.5):
                warnings.append(f"Spatial coverage gap detected: {empty_cells} of {grid_bins*grid_bins} sector cells have no survey points.")

        # Compute final valid count (excluding NaNs, duplicates, spikes, holes)
        all_bad_indices = nan_indices | duplicate_indices | spike_indices | hole_indices
        valid_points_count = total_raw - len(all_bad_indices)

        bounds = BoundingBox3D(
            min_x=min_x,
            max_x=max_x,
            min_y=min_y,
            max_y=max_y,
            min_z=min_z,
            max_z=max_z
        )

        verdict = QualityVerdict.PASSED
        if errors or valid_points_count < 3:
            if valid_points_count < 3:
                errors.append(f"Only {valid_points_count} valid points remain after cleaning; at least 3 are required.")
            verdict = QualityVerdict.REJECTED
        elif warnings:
            verdict = QualityVerdict.PASSED_WITH_WARNINGS

        return ValidationResult(
            verdict=verdict,
            total_raw_points=total_raw,
            valid_points_count=valid_points_count,
            duplicate_indices=duplicate_indices,
            spike_indices=spike_indices,
            hole_indices=hole_indices,
            nan_or_inf_indices=nan_indices,
            bounds=bounds,
            density_pts_m2=density,
            warnings=warnings,
            errors=errors,
            metadata=file_metadata
        )
