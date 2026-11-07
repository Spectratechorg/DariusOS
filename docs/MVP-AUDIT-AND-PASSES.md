# MVP audit & build passes — LIFIDI–PIAPUNG pilot

Status: working document for team review. Scope is fixed by the Services Agreement
(Schedule A, Part 1, M1–M8). Anything in Part 2 (drone, point-cloud pipeline,
multi-route scoring, monitoring, satellite, dashboards) is **out of scope** and must
not be built here.

Source material reviewed (client-provided, kept out of the repo):

| File | What it gives us |
| --- | --- |
| `Spectra_Mastodon_Agreement_*.docx` | Acceptance criteria M1–M8, deliverables, fees, timelines, engineering disclaimer |
| `BEME for LIFIDI - PIAPUNG ROAD.xlsx` | Required BEME shape: 5 bills (preliminaries, earthworks, culverts/drains, pavement, bridge), item codes, units, quantities, rates, 5% contingency, 7.5% VAT, 1% stamp duty |
| `LDF DATA_110713.csv` | The real Pilot Survey Data: 2,658 valid points in 3 route blocks → **corridor** survey, not an area cloud |
| `PilotReport_cd2cd427.pdf` | Expected pilot report layout: input audit with SHA-256s, geometry/earthwork summary, benchmark accuracy table, engineer sign-off |

## 1. What the Pilot Survey Data actually is

`LDF DATA_110713.csv` (2,675 rows) is a surveyed corridor export:

- header `POINT, North, East, Height` with a 5th column carrying the survey code
- three route blocks: `MAIN` (1,529 pts), `ALTERNATY ROAD DATA` (211), `NWOOP ROAD DATA` (918)
- codes: `C` centreline (737), `L` left (729), `R` right (~797) → staggered cross-sections
  roughly every 25 m, half-width ≈ 4–5 m
- feature codes that matter to the BEME: `EXISTING CV` (164+), `EXISTING CV RING`,
  `EXISTING BOXCV 1BY1L`, `PROPOSED CV`, `BLD` (54), `RIVER`, `RIVERSIDE C/R`,
  `BEND`, `EPOLE`, `FENCE`, `GRAVEYARD`, `SEPTIC TANK`, `TBM*`
- a trailing `KEY` legend block (C/L/R/BLD/CV/TBM/…) that must not be parsed as points
- centreline lengths measured from the file: MAIN ≈ 11.5 km, NWOOP ≈ 6.35 km,
  ALTERNATE ≈ 1.46 km → ≈ 19.3 km total, matching the client's 19.50 km corridor

## 2. Audit of the current pipeline against M1–M8

Evidence: code review + `pytest` (55 pass / 19 fail only because the local sandbox
blocks writes outside the workspace) + running the client CSV through the intake modules.

| # | Acceptance criterion | Current state | Verdict |
| --- | --- | --- | --- |
| M1 | Survey data intake | `CsvReader` finds the header (North/East/Height) and keeps all 2,658 points, but the code column is not in its alias list, so **every point arrives as `classification = 0`**. Route blocks and feature codes are lost. Validator flags "15 of 25 sector cells have no survey points" — it is measuring area coverage. | **Blocked** |
| M2 | Horizontal alignment | `HorizontalAlignmentGenerator` runs start→end with optional intermediate PIs, sampling a DEM. It cannot follow a surveyed centreline and offers no route selection. | **Blocked** (needs route-driven mode) |
| M3 | Longitudinal profile | Samples the DEM along the centreline. With a corridor survey the DEM is meaningless far from the centreline; the C-point levels are the real ground data. | **Blocked** |
| M4 | Cross-sections | DEM sampling at ±25 m plus template/daylight. The survey already contains L/C/R sections at 25 m — they are the authoritative ground and the basis of the client's BEME. | **Blocked** (needs surveyed-section mode) |
| M5 | Earthwork quantities | Average End Area + prismoidal, area sharing with the drawn sections (ADR 005) — sound and reusable. Needs real section areas fed in. | **Reusable** |
| M6 | Regeneration | Hash-keyed stage cache exists. But the terrain stage on this file would build a **10,368 × 7,360 = 76.3 M cell / 610 MB** 1 m grid over the whole bbox before anything else runs. | **Blocked** by terrain step |
| M7 | BEME | `beme.py` writes Excel with formulas, but from **7 generic placeholder items**. Client BEME has 5 bills, ~60 items, contingency/VAT/stamp duty. | **Partial** |
| M8 | Pilot report | `pilot_report.py` already matches the supplied PDF layout (audit, summary, benchmarks, sign-off). Needs the corridor-mode numbers. | **Reusable** |

Conclusion: the pipeline is a solid area-survey (drone/DEM) engine, but the Pilot
Project data is a corridor survey. The MVP must gain a **corridor mode** rather than
force the client data through a DEM it cannot support.

## 3. Decision

Add a corridor-survey mode to the pipeline (ADR 006): parse blocks/codes, derive each
route's centreline and surveyed sections, and feed alignment → profile → sections →
quantities from that corridor model. The DEM/area path stays for the Full System's
drone data. Both modes emit the same contracts (04–07), so quantities, BEME and the
report stay single-source-of-truth (ADR 005).

## 4. Build passes

Each pass is independently reviewable, testable and demoable. Passes are worked in
order; nothing from Part 2 of Schedule A is included.

### P1 — Corridor survey intake (M1) ← this branch starts here
- New `intake/corridor.py`: block/route detection, code normalisation (C/L/R +
  feature kinds), section pairing, route lengths, quality report.
- Never lose a point silently: every skipped row is counted with a reason.
- `scripts/audit_corridor_survey.py` prints the intake audit for any export.
- **Acceptance:** the client file parses to 3 routes, 2,658 points, zero unclassified
  C/L/R; sections pair C with L/R; feature codes preserved; SHA-256 recorded; unit and
  synthetic-fixture tests pass.
- **Out of scope:** any geometry/design change.

### P2 — Route & horizontal alignment (M2, M6)
- Route selection (MAIN / ALTERNATE / NWOOP) and PI extraction from the surveyed
  centreline (Douglas–Peucker + circular curves at `min_curve_radius_m`).
- Chainage from the fitted alignment; plan drawing sheets at 1:2000 with PC/PT,
  curve data, station labels — styled after RoadCAD Sheet Studio.
- **Acceptance:** aligned centreline stays within the surveyed corridor; regenerates in
  seconds on route change; plan PDF/DXF reviewed against the LIFIDI reference sheet.

### P3 — Longitudinal profile (M3)
- Ground profile from C-point levels at chainage (linearly interpolated between
  sections); design profile (grades, PVI/K curves, min/max grade rules, cut/fill balance
  objective); profile drawing sheet.
- **Acceptance:** ground profile matches surveyed C levels within 1 mm at survey
  stations; design grades inside rules; drawing matches the reference profile band.

### P4 — Surveyed cross-sections (M4)
- Ground section per station from L/C/R offsets (interpolate L/R offsets to the station
  and between sections); formation template + daylight from rules; section drawings at
  the client's 25 m interval; area per section.
- **Acceptance:** section areas reproducible by hand on a sample; drawings show
  formation vs existing ground; cut/fill classification per section.

### P5 — Earthwork quantities (M5)
- Feed the existing calculator; mass haul; bulking/shrinkage factors; schedule per
  station; quantities match section areas by construction (ADR 005).
- **Acceptance:** golden synthetic cases still pass; totals are consistent with the
  client BEME earthworks order of magnitude (≈51,700 m³ excavation) and differences are
  explained (topsoil, unsuitable material, rock).

### P6 — Detailed BEME (M7)
- Extend `config/engineering_rules.json` to the client's 5-bill structure with item
  codes/units/rates from the supplied BEME (rates flagged provisional).
- Wire quantities: earthworks from P5, culverts counted from feature codes, pavement
  areas from route length × width, drainage lengths.
- Excel with live formulas + totals (5% contingency, 7.5% VAT, 1% stamp duty) and a PDF
  rendering; every quantity traceable to the drawing/section it came from.
- **Acceptance:** workbook opens with formulas intact; totals reconcile; item-by-item
  comparison table against the client BEME included in the pilot report appendix.

### P7 — Pilot report (M8)
- Extend the existing report: route audit (3 blocks), survey stats and SHA-256, accuracy
  section comparing computed quantities against benchmarks and the client BEME,
  turnaround timing, drawing list, engineer sign-off block.
- **Acceptance:** single PDF that answers "does this match the site, and how long did it
  take" — with the benchmark table passing (0.00% drift on golden cases).

### P8 — Product flow (create → upload → route → outputs)
- Wire the corridor mode through the API and the six MVP screens: project creation,
  survey upload, route selection, run, results, downloads (drawings PDF/DXF, BEME xlsx,
  report PDF, quantities CSV).
- Job progress and errors surfaced in plain English; no mock data on the happy path.
- **Acceptance:** a new project with only the client CSV reaches a complete downloadable
  package without touching the database by hand.

### P9 — Pilot acceptance run
- Run the full flow on LIFIDI–PIAPUNG, record turnaround and outputs, produce the
  delivery package and the engineer review checklist.
- **Acceptance:** package reviewed against M1–M8; timings recorded for the pilot report.

## 5. Risks / open questions for Mastodon

1. **Coordinate system** — the file is local/grid coordinates (≈ E 543k–553k, N 996k–1.004M).
   Confirm the project datum used on the drawings and BEME.
2. **Cross-section half-width** — survey covers ≈ ±5 m; the formation template is 7 m
   carriageway + 1.5 m shoulders, so daylight points are outside the surveyed strip.
   Confirm whether the design template/rates follow the BEME's 10.3 m formation.
3. **Route choice** — MAIN + NWOOP is assumed to be the design (matches the sheet title
   "with spur to NWOP"); ALTERNATE is an option for M6, not a comparison feature (F4).
4. **BEME unit rates** — placeholder rates are in `config/engineering_rules.json`; the
   client BEME rates are used only as provisional defaults until signed off.
