# Product Context: DariusOS

<!-- impeccable:product-schema 1 -->

## Platform
web

## Stack
React 18, Vite 6, TypeScript, Material-UI v6, SWR, Python FastAPI backend, Neon PostgreSQL / SQLite.

## Users
Civil engineers, highway design consultants, quantity surveyors, and project directors in West Africa and international infrastructure corridors who need fast, rigorous, standards-compliant geometric road corridor design, CAD drawings, and priced Bills of Engineering Measurement and Evaluation (BEME).

## Product Purpose
Transform raw survey coordinates (Eastings, Northings, Elevations) into a fully validated road corridor design: terrain surface model (TIN/contours), horizontal and vertical alignment, longitudinal profiles, cross-sections, CAD drawings (PL-01, LP-01, XS-01), and priced BEME within minutes instead of weeks.

## The 6 Stages & Scope
1. **Project Setup**: Road classification (Federal Highway, State Arterial, Rural Access), geometric standards (AASHTO, FMWH Nigeria), carriageway/shoulder widths, pavement layer structure.
2. **Survey and Validation**: Coordinate CSV intake, bounding box validation, duplicate/anomaly detection, SHA-256 integrity hash.
3. **Terrain Engine**: Delaunay TIN mesh, elevation contours (minor/index), slope classification, ground profile extraction.
4. **Design Engine**: Horizontal alignment (tangents, circular curves, spirals), longitudinal profile (VPIs, vertical curves, grade checks against max limits), cross-sections with cut/fill daylighting.
5. **Engineering Drawings**: Professional CAD-grade sheets (PL-01 Plan, LP-01 Longitudinal Profile, XS-01 Cross Sections) with title blocks, north arrow, graphic scale bar, and layer toggles. DXF/PDF export.
6. **BEME & Reports**: Standard 6-bill highway measurement (General, Site Clearance, Earthworks, Culverts & Drains, Pavement & Surfacing, Ancillary), live editable rate analysis, Excel/PDF export.

## Durability & Safety Constraints
- Deterministic civil engineering formulas are sacred: alignment math, mass-haul balances, cut/fill volumes, and rate multiplications must not be broken or approximated by UI presentation.
- Human-in-the-loop: Every out-of-spec gradient or radius requires explicit registered engineer sign-off.
