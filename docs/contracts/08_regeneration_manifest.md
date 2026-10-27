# Contract 08: Regeneration Manifest

## Purpose
Execution snapshot storing input hashes, rules hashes, code version, and stage cache state to guarantee reproducible road designs and avoid redundant stage computation.

## Format
JSON / Pydantic Model: `PipelineManifest`

```json
{
  "run_id": "uuid-v4",
  "project_id": "uuid-v4",
  "survey_file_id": "uuid-v4",
  "survey_file_sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "rules_sha256": "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
  "route_params_hash": "a1b2c3d4e5f67890...",
  "code_version": "1.0.0-mvp",
  "triggered_by": "user-uuid",
  "started_at": "2026-10-27T08:30:00Z",
  "completed_at": "2026-10-27T08:30:04Z",
  "status": "COMPLETED",
  "stages": {
    "intake": {"status": "CACHED", "duration_sec": 0.0},
    "terrain": {"status": "CACHED", "duration_sec": 0.0},
    "alignment": {"status": "EXECUTED", "duration_sec": 0.42},
    "profile": {"status": "EXECUTED", "duration_sec": 0.35},
    "cross_sections": {"status": "EXECUTED", "duration_sec": 1.15},
    "quantities": {"status": "EXECUTED", "duration_sec": 0.18},
    "exports": {"status": "EXECUTED", "duration_sec": 0.85}
  }
}
```
