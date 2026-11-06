---
name: road-design-viz
description: Visual rules for civil/road engineering drawings and dashboards. Use when building or styling any chart, profile, plan view, cross-section, terrain/contour/TIN view, drawing sheet, BEME table, or dashboard in this app.
---

# Road Design Visualization Rules

These rules govern all engineering visuals. For general app chrome (layout,
typography, cards) follow frontend-design. For motion follow Emil Kowalski's skills.
Where rules conflict, THESE rules win for drawings and charts.

## 1. Color tokens (define as CSS variables, with light, dark and print variants)
- ground-existing:     #8B6F47   (existing ground line, thinner, muted)
- grade-finished:      #0F172A light / #F8FAFC dark   (finished road grade, boldest line)
- cut-fill:            cut #D9534F at 30% opacity, fill #2F80ED at 30% opacity
- pavement-wearing:    #1F2937
- pavement-base:       #6B7280
- pavement-subbase:    #A8A29E
- subgrade:            #8B6F47
- contour-minor:       #94A3B8
- contour-index:       #475569   (every 5th contour, heavier)
- right-of-way:        #64748B dashed
- flag-warning:        #F59E0B
- flag-critical:       #DC2626
- ok:                  #16A34A
Never use purple-to-blue gradients. Never use pure black (#000).
Print variant: must stay legible in grayscale. Do not rely on color alone; pair
cut/fill with hatch patterns (cut = diagonal lines, fill = dots).

## 2. Line weight hierarchy (most to least important)
1. Finished grade and centerline: 2.5px
2. Existing ground, curve boundaries: 1.5px
3. Index contours, right-of-way: 1.25px
4. Minor contours, gridlines: 0.75px at low opacity
Gridlines are always subtle. Data lines are never thinner than gridlines.

## 3. Typography for drawings
- Use a monospace font with tabular numerals for stations, chainage, elevations,
  and grades (IBM Plex Mono or JetBrains Mono).
- Chainage format: 0+000, 0+020 (km+m). Elevations to 2 decimals in meters.
- Minimum label size 11px on screen. Labels must never overlap; thin out or rotate
  them instead.

## 4. Per-visual rules
Longitudinal profile (LP-01)
- Finished grade in bold over a lighter existing-ground line.
- Shade areas between them: cut and fill in their two colors with hatching.
- Chainage ticks along the bottom, with a data strip beneath showing grade %,
  cut/fill depth and curve data.
- Flag any grade over the limit with an amber/red marker and a callout
  (e.g. "9.2% > 8.0% limit, review required").
- State the vertical exaggeration visibly (e.g. "V 10x : H 1x").

Plan sheet (PL-01)
- Centerline is the strongest element, with chainage ticks at consistent intervals.
- Curves labeled with R, Δ, and tangent length in a compact table.
- Right-of-way as a dashed boundary. Contours muted so the road reads first.
- Include north arrow, scale bar, and sheet title block.

Cross-sections (XS-01)
- Pavement layers drawn with their token colors and true relative thickness.
- Cut slopes and fill slopes shaded; ditches drawn to scale; dimensions in a clean,
  non-overlapping layout.
- Consistent scale across all sections on one sheet. Show chainage above each.

Terrain / TIN
- Elevation-based color ramp (hypsometric) with hillshade; wireframe only as an
  optional overlay.
- Orbit, zoom and pan. Draped alignment line on top.
- Use Canvas/WebGL for large point sets (5000+ points); SVG only for small sets.

## 5. Interaction
- Hover tooltip on all drawings: chainage, existing elevation, finished elevation,
  grade %, cut/fill depth.
- A shared cursor: hovering a chainage in the profile highlights the same position
  on the plan and cross-section.
- Layer toggles (Alignment, Contours, Drainage) animate opacity, 150-200ms.
- Respect prefers-reduced-motion.

## 6. Sheet and export rules
- Every drawing sheet has: title block (project, client, sheet ID, scale, date,
  revision), border, north arrow, scale bar.
- PDF/DXF export must keep the same layer names, use the print color variant, and
  produce legible output at A3.

## 7. Dashboard and BEME
- Stat cards: one accent color, large tabular numerals, label above, small sparkline
  or delta where relevant.
- Pipeline tracker: a clear 6-step stepper with distinct completed, in-progress,
  and waiting states.
- BEME tables: right-aligned numbers, tabular numerals, currency symbol in header
  only (not repeated on every row), bold subtotal rows. Sticky headers for long bills.
