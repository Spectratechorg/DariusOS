from typing import List, Optional, Tuple, Union
import numpy as np

from app.schemas.terrain import GridMetadata


class TerrainInterpolator:
    """
    High-performance continuous elevation sampler over a gridded DEM surface.
    Implements O(1) vectorized bilinear interpolation and directional slope estimation.
    """

    def __init__(self, grid_z: np.ndarray, metadata: GridMetadata):
        self.grid = grid_z
        self.meta = metadata
        self.origin_x = metadata.origin_x
        self.origin_y = metadata.origin_y
        self.cell_size = metadata.cell_size_m
        self.nrows = metadata.nrows
        self.ncols = metadata.ncols
        self.max_x = metadata.max_x
        self.max_y = metadata.max_y

    def is_within_bounds(self, x: float, y: float, tol: float = 1e-3) -> bool:
        """Returns True if the coordinate is within survey bounds."""
        return (
            (self.origin_x - tol) <= x <= (self.max_x + tol)
            and (self.origin_y - tol) <= y <= (self.max_y + tol)
        )

    def get_elevation(self, x: float, y: float) -> float:
        """
        Samples ground elevation at coordinate (x, y) using bilinear interpolation.
        Clamps coordinate to boundary if slightly outside due to floating point rounding.
        """
        # Clamp slightly to valid bounds to handle edge precision
        x_clamped = max(self.origin_x, min(self.max_x, x))
        y_clamped = max(self.origin_y, min(self.max_y, y))

        col_f = (x_clamped - self.origin_x) / self.cell_size
        row_f = (y_clamped - self.origin_y) / self.cell_size

        c0 = int(np.floor(col_f))
        r0 = int(np.floor(row_f))

        c0 = max(0, min(self.ncols - 1, c0))
        r0 = max(0, min(self.nrows - 1, r0))
        c1 = min(self.ncols - 1, c0 + 1)
        r1 = min(self.nrows - 1, r0 + 1)

        u = col_f - c0
        v = row_f - r0

        z00 = self.grid[r0, c0]
        z01 = self.grid[r0, c1]
        z10 = self.grid[r1, c0]
        z11 = self.grid[r1, c1]

        z = (1.0 - u) * (1.0 - v) * z00 + u * (1.0 - v) * z01 + (1.0 - u) * v * z10 + u * v * z11
        return float(z)

    def get_elevations(self, x_arr: np.ndarray, y_arr: np.ndarray) -> np.ndarray:
        """
        Vectorized evaluation of ground elevation across coordinate arrays.
        """
        x_clamped = np.clip(x_arr, self.origin_x, self.max_x)
        y_clamped = np.clip(y_arr, self.origin_y, self.max_y)

        col_f = (x_clamped - self.origin_x) / self.cell_size
        row_f = (y_clamped - self.origin_y) / self.cell_size

        c0 = np.clip(np.floor(col_f).astype(int), 0, self.ncols - 1)
        r0 = np.clip(np.floor(row_f).astype(int), 0, self.nrows - 1)
        c1 = np.clip(c0 + 1, 0, self.ncols - 1)
        r1 = np.clip(r0 + 1, 0, self.nrows - 1)

        u = col_f - c0
        v = row_f - r0

        z00 = self.grid[r0, c0]
        z01 = self.grid[r0, c1]
        z10 = self.grid[r1, c0]
        z11 = self.grid[r1, c1]

        z = (1.0 - u) * (1.0 - v) * z00 + u * (1.0 - v) * z01 + (1.0 - u) * v * z10 + u * v * z11
        return z

    def get_slope_percent(self, x: float, y: float, delta: float = 1.0) -> float:
        """
        Estimates the maximum terrain slope percentage at (x, y) using central differences.
        """
        z_east = self.get_elevation(x + delta, y)
        z_west = self.get_elevation(x - delta, y)
        z_north = self.get_elevation(x, y + delta)
        z_south = self.get_elevation(x, y - delta)

        dz_dx = (z_east - z_west) / (2.0 * delta)
        dz_dy = (z_north - z_south) / (2.0 * delta)

        grad_mag = np.hypot(dz_dx, dz_dy)
        return float(grad_mag * 100.0)

    def sample_corridor_line(
        self,
        start_xy: Tuple[float, float],
        end_xy: Tuple[float, float],
        interval_m: float = 1.0
    ) -> List[Tuple[float, float, float, float]]:
        """
        Samples the terrain along a straight line segment from start to end at fixed interval.
        Returns List of (distance_along_line, x, y, elevation).
        """
        p1 = np.array(start_xy, dtype=float)
        p2 = np.array(end_xy, dtype=float)
        vec = p2 - p1
        total_len = float(np.linalg.norm(vec))

        if total_len <= 1e-6:
            z = self.get_elevation(p1[0], p1[1])
            return [(0.0, p1[0], p1[1], z)]

        distances = np.arange(0.0, total_len, interval_m)
        if distances[-1] < total_len:
            distances = np.append(distances, total_len)

        unit_vec = vec / total_len
        coords = p1 + np.outer(distances, unit_vec)
        elevations = self.get_elevations(coords[:, 0], coords[:, 1])

        results = []
        for dist, (cx, cy), cz in zip(distances, coords, elevations):
            results.append((float(dist), float(cx), float(cy), float(cz)))
        return results
