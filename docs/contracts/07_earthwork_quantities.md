# Contract 07: Earthwork Quantities

## Purpose
Station-by-station cut and fill volume schedule and cumulative mass haul, calculated using the standard Average End Area method with Prismoidal correction.

## Format
JSON / Pydantic Model: `EarthworkQuantities`

```json
{
  "project_id": "uuid-v4",
  "calculation_method": "Average End Area with Prismoidal Correction",
  "soil_bulking_factor": 1.15,
  "compaction_shrinkage_factor": 0.90,
  "topsoil_strip_volume_m3": 1500.0,
  "total_cut_volume_m3": 2400.0,
  "total_fill_volume_m3": 1950.0,
  "net_volume_m3": 450.0,
  "balance_status": "EXCESS_CUT",
  "schedule": [
    {
      "from_station_m": 0.0,
      "to_station_m": 20.0,
      "distance_m": 20.0,
      "start_cut_area_m2": 24.0,
      "end_cut_area_m2": 24.0,
      "incremental_cut_volume_m3": 480.0,
      "start_fill_area_m2": 0.0,
      "end_fill_area_m2": 0.0,
      "incremental_fill_volume_m3": 0.0,
      "cumulative_cut_volume_m3": 480.0,
      "cumulative_fill_volume_m3": 0.0,
      "net_cumulative_volume_m3": 480.0
    }
  ]
}
```
