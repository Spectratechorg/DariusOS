# Contract 05: Longitudinal Profile

## Purpose
Continuous longitudinal profile combining existing natural ground elevation with designed roadbed profile along the centreline.

## Format
JSON / Pydantic Model: `LongitudinalProfile`

```json
{
  "total_length_m": 1118.03,
  "station_interval_m": 20.0,
  "max_allowable_grade_percent": 8.0,
  "min_allowable_grade_percent": 0.5,
  "vertical_pvis": [
    {"station_m": 0.0, "elevation_m": 100.0, "grade_in_percent": null, "grade_out_percent": 2.5},
    {"station_m": 500.0, "elevation_m": 112.5, "curve_length_m": 120.0, "k_value": 30.0}
  ],
  "profile_points": [
    {
      "station_m": 0.0,
      "ground_elevation_m": 100.0,
      "design_elevation_m": 99.85,
      "difference_m": -0.15,
      "cut_or_fill": "CUT",
      "grade_percent": 2.5
    }
  ]
}
```
