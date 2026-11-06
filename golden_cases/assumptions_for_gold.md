# Strider K3: Golden Case Assumptions for Engine Review

**Date:** 2026-11-03  
**Author:** Kabiru Nuhu Shuaibu (Lead / Design Logic)  
**Reviewer:** Gold Okereke (Engine & Terrain Lead)  
**Status:** Ready for Arithmetic & Assumptions Sign-off  

---

## 1. Purpose

This document records the exact geometric, mathematical, and algorithmic assumptions used in the hand-calculated golden cases (`flat_case.json`, `slope_case.json`, and `hill_case.json`) for Task K3. These analytical solutions establish the ground-truth benchmark against which the earthwork engine (K14) will be verified (K16).

---

## 2. Geometric Cross-Section Assumptions

1. **Roadbed Template**:
   - Total carriageway width $W = 7.0\,\text{m}$ (symmetric about centreline).
   - Pavement camber (cross-fall) and roadside ditches are set to zero in these baseline analytical cases to allow exact closed-form trapezoidal verification without unconfirmed drainage shapes.
2. **Side Slopes (Daylight Slopes)**:
   - Convention: $1:s$ denotes $1\,\text{Vertical} : s\,\text{Horizontal}$ (V:H) as agreed in `ADS-01.md` / `00_conventions.md`.
   - Side slope run $s = 1.5$ (i.e. $1.5\,\text{m}$ horizontal run per $1.0\,\text{m}$ vertical elevation change) for both cut and fill.
3. **Trapezoidal Area Formula**:
   - For fill depth $d$ (where $H_{\text{design}} > H_{\text{ground}}$):
     $$\text{Formation Top Width} = W$$
     $$\text{Daylight Base Width} = W + 2 \cdot (s \cdot d)$$
     $$\text{Fill Area} = \frac{W + (W + 2sd)}{2} \cdot d = (W + s \cdot d) \cdot d = (7.0 + 1.5d)d$$
   - For cut depth $d$ (where $H_{\text{ground}} > H_{\text{design}}$):
     $$\text{Cut Base Width} = W$$
     $$\text{Daylight Top Width} = W + 2 \cdot (s \cdot d)$$
     $$\text{Cut Area} = (W + s \cdot d) \cdot d = (7.0 + 1.5d)d$$

---

## 3. Volume Integration Method (Average End Area)

1. **Volume Formula**:
   - For an interval between Station $i$ and Station $i+1$ of spacing $L = 25.0\,\text{m}$:
     $$V_{\text{cut}} = \frac{A_{\text{cut}, i} + A_{\text{cut}, i+1}}{2} \cdot L$$
     $$V_{\text{fill}} = \frac{A_{\text{fill}, i} + A_{\text{fill}, i+1}}{2} \cdot L$$
2. **Grade Transition Points**:
   - In `slope` and `hill`, the road profile passes through grade ($d=0.0\,\text{m}$) at exact $25\,\text{m}$ station intervals (Station 100 for slope, Stations 50 and 150 for hill). Thus, end-area transitions to zero daylight area land cleanly on station boundaries without requiring intra-station splitting in these test cases.
3. **Mass Haul & Net Volume Convention**:
   - $\text{Reusable Cut Volume} = 1.0 \times \text{Cut Volume}$ (soil expansion/shrinkage factor = 1.0 for golden cases).
   - $\text{Net Earthwork Volume} = \text{Cumulative Cut} - \text{Cumulative Fill}$.
   - Negative net indicates a borrow requirement (deficit of cut material).
   - Positive net indicates a spoil surplus (excess cut material).
   - Zero net indicates exact volumetric mass balance.

---

## 4. Terrain & Grid Alignment

1. **Coordinate System & Orientation**:
   - Synthetic origin: Easting $E = 100,000.0\,\text{m}$, Northing $N = 200,000.0\,\text{m}$.
   - Road alignment runs due East along $N = 200,000.0\,\text{m}$ for $200.0\,\text{m}$ ($E = 100,000.0$ to $100,200.0$).
   - Offsets: Transverse offsets from centreline are $[-15, -10, -5, 0, 5, 10, 15]\,\text{m}$.
   - Positive offset = North = Left of the vehicle heading East.
2. **Grid Coincidence**:
   - The synthetic terrain point spacing along the road is $5.0\,\text{m}$.
   - The earthwork cross-section station spacing is $25.0\,\text{m}$ ($0, 25, 50, \dots, 200$).
   - Because $25\,\text{m}$ is an integer multiple of $5\,\text{m}$, every cross-section station coincides exactly with survey grid lines, avoiding interpolation discrepancies between DEM generation and analytical sampling.

---

## 5. Verification Checklist for Gold

- [ ] Confirm cross-section trapezoid formula: $\text{Area} = (W + s \cdot d) \cdot d$.
- [ ] Confirm Average End Area calculation: $V = \frac{A_1 + A_2}{2} \times L$.
- [ ] Confirm orientation convention: Left = North = positive transverse offset.
- [ ] Confirm station interval of $25.0\,\text{m}$ and net volume sign convention ($\text{Cut} - \text{Fill}$).
