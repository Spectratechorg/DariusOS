---
name: DariusOS Civil Engineering System
description: Visual system for civil infrastructure and highway design CAD drawings and engineering dashboards
colors:
  ground-existing: "#8B6F47"
  grade-finished-light: "#0F172A"
  grade-finished-dark: "#F8FAFC"
  cut-fill-cut: "rgba(217, 83, 79, 0.3)"
  cut-fill-fill: "rgba(47, 128, 237, 0.3)"
  pavement-wearing: "#1F2937"
  pavement-base: "#6B7280"
  pavement-subbase: "#A8A29E"
  subgrade: "#8B6F47"
  contour-minor: "#94A3B8"
  contour-index: "#475569"
  right-of-way: "#64748B"
  flag-warning: "#F59E0B"
  flag-critical: "#DC2626"
  ok: "#16A34A"
typography:
  drawings:
    fontFamily: "JetBrains Mono, IBM Plex Mono, monospace"
    fontVariantNumeric: "tabular-nums"
  body:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
---

# Design System: DariusOS Civil Engineering

## Overview
DariusOS delivers high-precision, production-grade CAD engineering sheets and highway infrastructure dashboards. The interface balances high-density technical clarity with modern, tactile software design.

## Colors
- **Existing Ground (`ground-existing`)**: `#8B6F47` — natural earthen brown, 1.5px weight.
- **Finished Grade (`grade-finished`)**: `#0F172A` (light mode) / `#F8FAFC` (dark mode) — dominant 2.5px solid centerline/grade line.
- **Earthworks Cut**: `#D9534F` at 30% opacity with diagonal hatching pattern for print clarity.
- **Earthworks Fill**: `#2F80ED` at 30% opacity with dotted stipple pattern for print clarity.
- **Pavement Layers**: 
  - Wearing Course: `#1F2937`
  - Base Course: `#6B7280`
  - Subbase: `#A8A29E`
  - Subgrade / Foundation: `#8B6F47`
- **Contours**: Minor `#94A3B8` (0.75px), Index `#475569` (1.25px, every 5th).
- **Engineering Flags**: Warning `#F59E0B`, Critical `#DC2626`, Pass/Approved `#16A34A`.

## Typography
- All drawing text, chainages, elevations, grades, curve tables, and BEME figures use Monospace fonts (`JetBrains Mono`, `IBM Plex Mono`) with `tabular-nums` alignment.
- Stations/Chainage format: `0+000`, `0+020`. Elevations: 2 decimal places in meters (`214.50 m`).
- Minimum drawing label size: `11px`.

## Drawings & Sheets
- **LP-01 Profile**: Bold finished grade over existing ground. Cut/fill shaded with distinct hatching patterns. Bottom data band displays Grade %, Cut/Fill Depth, and Curve geometry. Vertical exaggeration note (`V 10x : H 1x`). Out-of-limit grades callout pill.
- **PL-01 Plan**: Strong 2.5px centerline, regular chainage ticks, curve table (R, Δ, T), dashed Right-of-Way, muted contours, north arrow, graphic scale bar, and standard sheet title block.
- **XS-01 Cross-Sections**: True-to-scale pavement layers, daylight slopes, ditches, clear dimensions.
- **TIN Terrain**: Hypsometric elevation gradient (earthen lowlands to highlands) with subtle hillshade.

## BEME Tables
- Right-aligned tabular numerals.
- ₦ symbol in header only (e.g. `Rate (₦)`, `Amount (₦)`), not repeated on every row.
- Bold subtotal rows, sticky headers for long bills, subtle zebra striping.
