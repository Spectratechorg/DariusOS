# DariusOS — Brand Identity Guidelines

**Document Version:** 1.0.0  
**Domain:** Automated Civil Highway & Corridor Engineering System  
**Last Revised:** November 2026  

---

## 1. Brand Concept & Engineering Rationale

DariusOS is an automated corridor and highway design platform that transforms raw survey coordinates into complete engineering designs: 3D terrain models, horizontal and vertical alignments, standard drawing sheets (PL-01, LP-01, XS-01), and priced Bills of Engineering Measurement and Evaluation (BEME).

The brand identity bridges computational rigor and civil engineering precision. The mark is a monolithic geometric monogram **"D"** constructed from two core highway design elements:

1. **The Vertical Elevation Datum (Stem):**  
   The upright anchor represents the survey benchmark and stationing elevation rod (`BM-01`), calibrated with white elevation notches (`10m`, `20m`, `30m`). It embodies structural stability, ground truth coordinates, and geodetic reference.

2. **The Banked Road Alignment Corridor (Bowl):**  
   The sweeping curved loop embodies a continuous highway horizontal alignment transition curve (Euler spiral to circular curve to tangent), equipped with a negative-space dashed road centerline. It symbolizes dynamic forward flow, automated design velocity, and corridor connectivity.

---

## 2. Color Palette & Engineering Tokens

The brand uses a focused two-color system derived directly from the application's CAD and UI design tokens.

| Role | Color Name | Hex | RGB | CMYK (Print) | Token Reference | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Primary** | Centerline Cobalt | `#2563EB` | `37, 99, 235` | `84, 58, 0, 8` | `tokens.primary` | Road alignment curve, action elements, title block accents |
| **Secondary** | Engineering Slate | `#0F172A` | `15, 23, 42` | `64, 45, 0, 84` | `tokens.slate900` | Datum rod, primary typography, dark canvas container |
| **Terrain (Accent)** | Earth Bed | `#8B6F47` | `139, 111, 71` | `0, 20, 49, 45` | `tokens.ground` | Existing ground contour lines, terrain surfaces |
| **Dark UI Accent** | Cyan Sky | `#38BDF8` | `56, 189, 248` | `77, 24, 0, 3` | `tokens.cyan400` | High-contrast curve on dark CAD themes & favicons |
| **Paper / Light** | Clean Ground | `#FFFFFF` | `255, 255, 255` | `0, 0, 0, 0` | `tokens.white` | Centerline negative space, datum ticks, paper background |

---

## 3. Brand Assets & File Hierarchy

All vector deliverables and multi-resolution bitmaps are located in `assets/logo/`:

```
assets/logo/
├── mark.svg             # Standalone 2-color vector mark (100x100)
├── logo-white.svg        # Reverse mark for dark backgrounds and CAD night mode
├── logo-black.svg        # 1-color pure black mark for A3 title blocks & plotters
├── logo-full.svg         # Horizontal combination mark (Mark + Outlined Wordmark)
├── logo-icon.svg         # 512x512 app icon in rounded slate squircle
├── favicon.svg           # High-contrast 32x32 SVG optimized for browser tabs
├── favicon.ico           # Multi-resolution ICO (16x16, 32x32, 48x48)
├── wordmark.svg          # Outlined vector text ("DARIUS OS — ROAD DESIGN SYSTEM")
├── showcase.html         # Interactive preview & CAD title block inspection
├── BRAND.md              # This standard guideline document
└── png/
    ├── mark-16.png to mark-1024.png   # Transparent mark exports
    └── logo-16.png to logo-1024.png   # Transparent square app icon exports
```

---

## 4. Clear-Space & Minimum Size Rules

### 4.1 Clear Space
To preserve optical authority, the mark must always be surrounded by an exclusion zone equal to **0.5X**, where **X** is the width of the vertical datum stem (`14 units` in a `100x100` coordinate space). No text, CAD borders, dimension leaders, or graphic elements may enter this exclusion perimeter.

```
       +-------------------------------+
       |         [ 0.5X margin ]       |
       |     +-------------------+     |
       |     |   |▓|   (====)    |     |
       | 0.5X|   |▓|     )  )    | 0.5X|
       |     |   |▓|   (====)    |     |
       |     +-------------------+     |
       |         [ 0.5X margin ]       |
       +-------------------------------+
```

### 4.2 Minimum Sizes
* **Favicon / Browser Tab:** `16 × 16 px` (use `favicon.svg` or `favicon.ico`).
* **UI App Header / Sidebar:** `24 × 24 px` (use `mark.svg` or `logo-white.svg`).
* **Combination Mark (Full Logo):** Minimum width `140 px` digital / `35 mm` print.
* **Engineering Title Block (A3 / A1 / A0 Plot):** Minimum height `12 mm` (use `logo-black.svg` or `mark.svg`).

---

## 5. Typography Standards

The DariusOS wordmark uses pure vector outlines without relying on external webfont loaders. When typing adjacent headings and body copy in applications or engineering specifications:

* **Primary Interface Font:** `Inter` (Weights: `400 Regular`, `500 Medium`, `600 SemiBold`)
* **Engineering Numbers & Stationing:** `JetBrains Mono` or `IBM Plex Mono` (e.g. `Ch 1+840`, `RL 184.250`, `9.2% > 8.0%`)
* **Wordmark Outlines:** Converted into fixed Bézier `<path>` curves in `wordmark.svg` and `logo-full.svg` for 100% font-independent CAD plotting and PDF generation.

---

## 6. Approved Usages & Forbidden Practices

### Approved Usages
1. **Full Color on Light Canvas:** `mark.svg` with `#0F172A` stem and `#2563EB` alignment loop.
2. **Reverse Color on Dark UI:** `logo-white.svg` with white stem and `#38BDF8` cyan alignment loop.
3. **Engineering Drawing Title Blocks:** `logo-black.svg` rendered in pure `#000000` inside the project identification box on sheets `PL-01`, `LP-01`, and `XS-01`.
4. **Official PDF Reports:** `logo-full.svg` or `mark.svg` placed in the header of BEME summary reports.

### Forbidden Practices
* **DO NOT** skew, stretch, or alter the aspect ratio of the monogram.
* **DO NOT** apply drop shadows, blurs, glow filters, or raster textures (these corrupt vector DXF/PDF exports).
* **DO NOT** swap the colors of the stem and the bowl (the datum must remain the stable darker anchor).
* **DO NOT** place the full colored mark on busy multi-colored terrain contours without a solid backing plate.
* **DO NOT** substitute the custom vector wordmark with plain unkerned system fonts.
