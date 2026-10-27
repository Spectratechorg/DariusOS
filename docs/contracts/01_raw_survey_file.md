# Contract 01: Raw Survey File Intake

## Purpose
Specifies the input metadata contract when an untouched raw survey file is uploaded to the platform.

## Format
JSON / Pydantic Model: `RawSurveyFileMetadata`

```json
{
  "id": "uuid-v4",
  "project_id": "uuid-v4",
  "original_filename": "survey_site_alpha.las",
  "file_format": "LAS",
  "sha256_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "file_size_bytes": 1048576,
  "storage_path": "storage/raw/e3b0c44298fc...las",
  "uploaded_at": "2026-10-27T08:00:00Z",
  "uploaded_by_user_id": "uuid-v4"
}
```

## Invariants
1. Raw file is never modified or overwritten once written to storage.
2. `sha256_hash` is computed on the exact byte stream.
3. Duplicate uploads within the same project are detected and rejected or linked.
