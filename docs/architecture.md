# Dariusos Architecture & Component Guide

## Overview for Junior Engineers
Dariusos is designed as a **Modular Monolith**. Every pipeline stage is an isolated folder inside `backend/app/modules/`. Stages do not touch each other's internal variables; they exchange data strictly through typed Pydantic contracts located in `backend/app/schemas/` and documented in `docs/contracts/`.

---

## Component Explanations

### 1. Data Intake (`backend/app/modules/intake`)
- **What it does**: Ingests survey point files (CSV, XYZ, LAS, LAZ), saves an untouched copy with a SHA-256 hash, validates file integrity, strips duplicate and outlier points, and generates a plain-English quality report.
- **Why it was written this way**: Survey files arrive in many formats. The swappable `BaseReader` interface allows new point cloud formats to be added without rewriting the pipeline.

### 2. Terrain Model (`backend/app/modules/terrain`)
- **What it does**: Takes the cleaned $(x, y, z)$ point table and builds a 2D regular digital elevation grid (DEM) and continuous spatial interpolator.
- **Why it was written this way**: Evaluating terrain elevation at arbitrary $(x, y)$ coordinates along a road corridor is hundreds of times faster on a structured DEM than querying raw millions of unindexed points.

### 3. Horizontal Alignment (`backend/app/modules/design/alignment`)
- **What it does**: Calculates the 2D road centreline polyline between designated start and end points, checking that natural terrain slopes do not exceed configurable maximum grades.
- **Why it was written this way**: The centreline defines the 1D stationing (chainage $s$) used by all subsequent longitudinal and cross-sectional calculations.

### 4. Longitudinal Profile (`backend/app/modules/design/profile`)
- **What it does**: Samples natural ground elevation along the centreline and designs vertical grades and vertical curves (PVI/K-values).
- **Why it was written this way**: Separating horizontal (2D plan) from vertical (profile) is standard civil engineering practice (Plan & Profile).

### 5. Cross-Sections (`backend/app/modules/design/cross_sections`)
- **What it does**: Cuts transverse slices across the road corridor at every station interval (e.g. 20m), projects the roadbed template (lanes, shoulders, side ditches), and calculates intersection daylighting with existing ground.
- **Why it was written this way**: This is the geometric core of road construction. It establishes the exact cut area and fill area for every station.

### 6. Earthwork Quantities (`backend/app/modules/quantities`)
- **What it does**: Integrates station cut and fill areas into volumetric cubic meters using the Average End Area method with Prismoidal correction.
- **Why it was written this way**: By calculating volumes directly from the cross-sections, quantities in the bill of quantities (BEME) match the engineering drawings with zero discrepancy.

### 7. Regeneration Engine (`backend/app/modules/pipeline`)
- **What it does**: Tracks input file hashes, engineering rules hashes, and code versions. If an engineer changes only the road width or unit rates, it skips re-gridding the terrain and re-runs only the affected stages.
- **Why it was written this way**: Survey files and gridding can be large and slow. Caching intermediate stages makes iterations and what-if design changes instantaneous.

### 8. Exports (`backend/app/modules/exports`)
- **What it does**: Generates Excel BEME workbooks using `openpyxl` with native formulas (`SUM`, `PRODUCT`) and compiles an executive Pilot Report PDF using `reportlab`.
- **Why it was written this way**: Excel and PDF are the universal deliverables required by civil engineering contractors, government authorities, and registered engineers.
