# Contract 02: Standard Point Cloud

## Purpose
Standardized internal representation of survey points parsed and cleaned by M1. Decouples terrain gridding from the underlying file format (CSV, XYZ, LAS, LAZ).

## Format
JSON / Pydantic Model: `StandardPointCloud`

```json
{
  "file_id": "uuid-v4",
  "crs_epsg": 32632,
  "unit": "meters",
  "point_count": 50000,
  "bounds": {
    "min_x": 500000.0,
    "max_x": 501000.0,
    "min_y": 4500000.0,
    "max_y": 4500500.0,
    "min_z": 95.2,
    "max_z": 124.8
  },
  "density_pts_per_m2": 1.0,
  "quality_report": {
    "total_raw_points": 50120,
    "valid_points": 50000,
    "duplicate_points_removed": 80,
    "spikes_removed": 25,
    "holes_removed": 15,
    "status": "PASSED_WITH_WARNINGS",
    "summary": "120 anomalies filtered; survey density meets engineering minimum."
  },
  "points": [
    {"x": 500000.0, "y": 4500000.0, "z": 100.0},
    {"x": 500001.0, "y": 4500001.0, "z": 100.2}
  ]
}
```
