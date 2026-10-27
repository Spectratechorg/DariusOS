# Contract 06: Cross-Sections

## Purpose
Transverse slices perpendicular to the road centreline at configured station intervals, showing natural ground against roadbed formation and cut/fill daylight slopes.

## Format
JSON / Pydantic Model: `CrossSectionPackage`

```json
{
  "project_id": "uuid-v4",
  "carriageway_width_m": 7.0,
  "shoulder_width_m": 1.5,
  "camber_slope_percent": -2.5,
  "cut_slope_v_to_h": 0.6667,
  "fill_slope_v_to_h": 0.5000,
  "cross_sections": [
    {
      "station_m": 20.0,
      "centreline_x": 500017.89,
      "centreline_y": 4500008.94,
      "centreline_ground_z": 100.45,
      "centreline_design_z": 98.45,
      "section_type": "CUT",
      "cut_area_m2": 24.0,
      "fill_area_m2": 0.0,
      "left_daylight_offset_m": -7.0,
      "right_daylight_offset_m": 7.0,
      "ground_profile": [
        {"offset_m": -15.0, "elevation_m": 100.5},
        {"offset_m": 0.0, "elevation_m": 100.45},
        {"offset_m": 15.0, "elevation_m": 100.6}
      ],
      "design_template": [
        {"offset_m": -7.0, "elevation_m": 100.45},
        {"offset_m": -5.0, "elevation_m": 98.45},
        {"offset_m": 0.0, "elevation_m": 98.45},
        {"offset_m": 5.0, "elevation_m": 98.45},
        {"offset_m": 7.0, "elevation_m": 100.45}
      ]
    }
  ]
}
```
