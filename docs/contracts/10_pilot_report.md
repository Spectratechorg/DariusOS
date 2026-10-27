# Contract 10: Pilot Report

## Purpose
Comprehensive project audit, design summary, computation timing, and benchmark accuracy checks compiled into an executive PDF pilot report.

## Format
JSON / Pydantic Model: `PilotReportData`

```json
{
  "project_title": "Site Access Road Alpha",
  "project_id": "uuid-v4",
  "generated_at": "2026-10-27T08:35:00Z",
  "code_version": "1.0.0-mvp",
  "engineer_disclaimer": "ALL VALUES MUST BE CONFIRMED AND STAMPED BY A REGISTERED ENGINEER",
  "input_audit": {
    "survey_filename": "survey.las",
    "survey_sha256": "e3b0c442...",
    "rules_sha256": "8f434346...",
    "total_survey_points": 50000,
    "survey_bounds": [500000, 4500000, 501000, 4500500],
    "crs_epsg": 32632
  },
  "geometry_summary": {
    "total_length_m": 1118.03,
    "max_horizontal_grade_percent": 6.8,
    "min_curve_radius_m": 150.0,
    "total_cross_sections": 56
  },
  "quantities_summary": {
    "total_cut_volume_m3": 2400.0,
    "total_fill_volume_m3": 1950.0,
    "net_earthwork_m3": 450.0,
    "estimated_cost_usd": 47970.45
  },
  "performance_metrics": {
    "total_pipeline_time_seconds": 2.95,
    "memory_peak_mb": 84.5
  },
  "accuracy_verification": [
    {
      "test_case": "Golden Case 1 (Flat Plane Trench Cut)",
      "analytical_volume_m3": 2400.0,
      "computed_volume_m3": 2400.0,
      "discrepancy_percent": 0.00,
      "pass": true
    }
  ]
}
```
