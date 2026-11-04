# TASK-0006 Contract Review

Reviewed all ten stage contracts on 4 November 2026.

## Comments left on every contract

1. `01_raw_survey_file.md` — Confirm the duplicate-upload behavior (`reject` versus `link`) and define the storage retention policy before production.
2. `02_point_cloud.md` — Confirm the authoritative CRS/unit conversion policy and whether the full point array is persisted or streamed from object storage.
3. `03_terrain_surface.md` — Define interpolation behavior outside the bounding box and the nodata/error response for missing grid cells.
4. `04_horizontal_alignment.md` — Confirm engineering units and whether grade constraints belong to horizontal alignment or the longitudinal profile stage.
5. `05_longitudinal_profile.md` — Confirm whether minimum grade may be negative for drainage and define the vertical-curve validation rules.
6. `06_cross_sections.md` — Confirm the road-template schema, slope convention, and whether offsets are signed left/right distances.
7. `07_earthwork_quantities.md` — Confirm the order of bulking/compaction factors and the definition of `net_volume_m3` for balance reporting.
8. `08_regeneration_manifest.md` — Define the canonical serialization used for hashes and the supported stage status values.
9. `09_beme_export.md` — Confirm currency, tax/contingency treatment, rate provenance, and rounding rules for Excel formulas.
10. `10_pilot_report.md` — Confirm the PDF approval/stamp workflow and the required accuracy tolerance for each benchmark case.

## Approval note

The contracts are approved for MVP implementation with the questions above tracked as engineering decisions. No contract is production-ready for registered-engineer sign-off until those decisions are resolved and the disclaimer remains visible in every export.

Owner: Edidiong  
Reviewer: Kabiru  
Task: TASK-0006
