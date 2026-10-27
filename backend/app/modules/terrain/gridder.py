from typing import Tuple
import numpy as np
from scipy.interpolate import griddata

from app.schemas.survey import BoundingBox3D
from app.schemas.terrain import GridMetadata


class TerrainGridder:
    """
    Transforms irregular 3D survey points into a regular Digital Elevation Model (DEM) grid.
    Uses linear barycentric interpolation on Delaunay triangles with nearest-neighbor
    boundary completion.
    """

    @classmethod
    def create_dem_grid(
        cls,
        points: np.ndarray,
        cell_size_m: float = 1.0,
        nodata_val: float = -9999.0
    ) -> Tuple[np.ndarray, GridMetadata]:
        if len(points) < 3:
            raise ValueError("At least 3 valid non-collinear survey points are required to generate a terrain surface.")

        x = points["x"]
        y = points["y"]
        z = points["z"]

        min_x, max_x = float(np.min(x)), float(np.max(x))
        min_y, max_y = float(np.min(y)), float(np.max(y))

        # Build coordinate axes
        xs = np.arange(min_x, max_x + cell_size_m * 0.5, cell_size_m)
        ys = np.arange(min_y, max_y + cell_size_m * 0.5, cell_size_m)

        if len(xs) == 0:
            xs = np.array([min_x])
        if len(ys) == 0:
            ys = np.array([min_y])

        ncols = len(xs)
        nrows = len(ys)

        grid_x, grid_y = np.meshgrid(xs, ys)
        xy_pts = np.column_stack([x, y])

        # Linear TIN interpolation
        grid_z_linear = griddata(xy_pts, z, (grid_x, grid_y), method="linear")

        # Fill any boundary NaNs using nearest neighbor
        nan_mask = np.isnan(grid_z_linear)
        if np.any(nan_mask):
            grid_z_nearest = griddata(xy_pts, z, (grid_x, grid_y), method="nearest")
            grid_z = np.where(nan_mask, grid_z_nearest, grid_z_linear)
        else:
            grid_z = grid_z_linear

        # If any NaNs still remain (e.g. edge case), fill with median
        if np.any(np.isnan(grid_z)):
            median_val = float(np.median(z))
            grid_z = np.nan_to_num(grid_z, nan=median_val)

        grid_z = np.asarray(grid_z, dtype=np.float64)

        min_z = float(np.min(grid_z))
        max_z = float(np.max(grid_z))
        mean_z = float(np.mean(grid_z))

        metadata = GridMetadata(
            origin_x=min_x,
            origin_y=min_y,
            cell_size_m=cell_size_m,
            ncols=ncols,
            nrows=nrows,
            min_z=min_z,
            max_z=max_z,
            mean_z=mean_z,
            nodata_value=nodata_val
        )

        return grid_z, metadata
