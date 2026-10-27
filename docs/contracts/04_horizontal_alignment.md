# Contract 04: Horizontal Alignment

## Purpose
Road centreline generated between designated start and end coordinates, respecting configurable maximum grade over the terrain surface and minimum curve radius.

## Format
JSON / Pydantic Model: `HorizontalAlignment`

```json
{
  "project_id": "uuid-v4",
  "start_point": {"x": 500000.0, "y": 4500000.0},
  "end_point": {"x": 501000.0, "y": 4500500.0},
  "total_length_m": 1118.03,
  "design_speed_kph": 60.0,
  "min_radius_m": 150.0,
  "max_allowed_grade_percent": 12.0,
  "max_detected_grade_percent": 6.8,
  "alignment_elements": [
    {
      "element_type": "TANGENT",
      "start_station_m": 0.0,
      "end_station_m": 450.0,
      "bearing_deg": 63.43
    },
    {
      "element_type": "CIRCULAR_CURVE",
      "start_station_m": 450.0,
      "end_station_m": 620.0,
      "radius_m": 250.0,
      "deflection_deg": 38.9
    }
  ],
  "stations": [
    {
      "station_m": 0.0,
      "x": 500000.0,
      "y": 4500000.0,
      "bearing_deg": 63.43
    }
  ]
}
```
