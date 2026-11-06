# Conventions

Rules that apply to every stage. Version 0.1, draft for review.

## Pipeline

Intake, terrain, alignment, profile, cross-sections, quantities, then BEME and report. The run record tracks the whole chain. The app talks to the engine through the calls in contract 10.

## Units and axes

- Metres, square metres, cubic metres, degrees. Grades are in percent.
- x is east, y is north, z is up.
- Heights are metres above the project datum.

## Coordinates

One project coordinate system for everything. The real code is still to be confirmed with Mastodon's surveyor. The samples use `LOCAL-TEST`.

## IDs and times

- IDs are text UUIDs.
- Times are ISO 8601 in UTC. The app shows Lagos time.

## File formats (decision D-001)

| Data | Format | Notes |
| --- | --- | --- |
| Cleaned points | Parquet, `points.parquet` | Columns `x`, `y`, `z`, optional `classification` |
| Terrain surface | NumPy, `surface.npy` | 2D array of heights, see layout below |
| Small results | JSON | Everything in contracts 3 to 7, 9 and 10 |
| BEME | Excel, `.xlsx` | Columns in contract 8 |
| Pilot report | PDF | Sections in contract 9 |

**Surface layout:** shape is (`rows`, `cols`). Row 0 is the southern edge (`y_min`) and column 0 is the western edge (`x_min`). Each value is the height at the cell centre. An empty cell is `NaN`.

## Every output carries

`ok`, `run_id`, `stage`, `code_version`, `schema_version`.

## Every failure looks the same

```json
{"ok": false, "stage": "terrain", "code": "TOO_MANY_EMPTY_CELLS", "message": "18.4% of cells are empty. The limit is 10%."}
```

`code` is in capitals and stable. `message` is plain English for a person.

## Rules and config

Rule values live in config, never in code. Placeholders are marked "to be confirmed" until a registered engineer signs them off.

## Samples

One fake sample per stage in `samples/`. Keys that start with `_` are notes, not part of the contract.

## Changing a contract

After approval, a change needs a line in `docs/decisions.md` and a message to Gold and Edidiong.
