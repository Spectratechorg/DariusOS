# Contract 03: Terrain Surface Model

## Purpose
Gridded digital elevation model (DEM) and continuous interpolator generated from cleaned points.

## Format
JSON / Pydantic Model: `TerrainSurfaceModel`

```json
{
  "grid_id": "uuid-v4",
  "cell_size_m": 1.0,
  "origin_x": 500000.0,
  "origin_y": 4500000.0,
  "ncols": 1001,
  "nrows": 501,
  "min_z": 95.2,
  "max_z": 124.8,
  "mean_z": 108.4,
  "nodata_value": -9999.0,
  "grid_shape": [501, 1001],
  "elevation_grid_url": "storage/processed/dem_xxx.npy"
}
```

## Methods
- `get_elevation(x: float, y: float) -> float`: Evaluates interpolated ground elevation $z$ at any $(x, y)$ within the bounding box.
- `get_corridor_elevation_profile(linestring: List[Tuple[float, float]], step_m: float) -> List[Tuple[float, float, float]]`: Samples ground elevation along a path.
