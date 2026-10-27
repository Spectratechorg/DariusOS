# Testing Strategy & Golden Cases Guide

## Overview
Dariusos enforces strict verification across unit tests, golden synthetic terrains with hand-calculated proofs, bad-input stress tests, and end-to-end integration tests.

---

## How to Run Tests

### Local Python Environment:
```bash
# Navigate to backend directory
cd backend

# Run all tests with verbose output
pytest -v

# Run with test coverage report
pytest --cov=app tests/

# Run only the golden engineering tests
pytest tests/test_quantities.py -k "golden"
```

### Docker Container:
```bash
docker compose run --rm backend pytest -v
```

---

## Golden Test Cases: What They Prove

### Golden Case 1: Perfectly Flat Terrain (Known Cut Trench)
- **Terrain**: Flat plane at elevation $z = 100.00\text{ m}$.
- **Road Corridor**: 100 meters long, straight line from $(0, 0)$ to $(100, 0)$.
- **Design Elevation**: Flat at $z = 98.00\text{ m}$ (Uniform $2.00\text{ m}$ cut).
- **Template**: $10.0\text{ m}$ bottom width, $1\text{V}:1\text{H}$ side slopes.
- **Hand Calculation**:
  - Top width at ground level: $10.0 + 2 \times (2.00 \times 1.0) = 14.0\text{ m}$.
  - Cross-section area: $\frac{10.0 + 14.0}{2} \times 2.0 = 24.00\text{ m}^2$.
  - Theoretical Cut Volume: $24.00\text{ m}^2 \times 100.0\text{ m} = 2,400.00\text{ m}^3$.
  - Theoretical Fill Volume: $0.00\text{ m}^3$.
- **What it proves**: The cross-section slicing polygon area algorithm and the Average End Area numerical integrator yield exact volumetric solutions on basic geometries without systematic bias or drift.

### Golden Case 2: Uniformly Sloped Terrain (Known Fill Embankment)
- **Terrain**: Uniform plane inclined at $+2\%$ grade ($z = 50.0 + 0.02x$).
- **Road Corridor**: 100 meters long from $(0, 0)$ to $(100, 0)$.
- **Design Roadbed**: $+2\%$ grade matching terrain, elevated exactly $1.50\text{ m}$ above ground.
- **Template**: $10.0\text{ m}$ roadbed, $1\text{V}:2\text{H}$ fill daylight slopes.
- **Hand Calculation**:
  - Base width at ground: $10.0 + 2 \times (1.50 \times 2.0) = 16.0\text{ m}$.
  - Cross-section fill area: $\frac{10.0 + 16.0}{2} \times 1.50 = 19.50\text{ m}^2$.
  - Theoretical Fill Volume: $19.50\text{ m}^2 \times 100.0\text{ m} = 1,950.00\text{ m}^3$.
  - Theoretical Cut Volume: $0.00\text{ m}^3$.
- **What it proves**: Daylighting intersection logic and fill area extraction accurately handle embankment construction and slope ratios.

### Golden Case 3: Symmetrical Ridge (Cut & Fill Balancing)
- **Terrain**: Symmetrical parabolic hill $z(x) = 100.0 + 4.0 \cdot \frac{x (100 - x)}{2500}$.
- **Road Corridor**: 100 meters through the hill with constant roadbed elevation $z = 102.0\text{ m}$.
- **What it proves**: Correctly detects transition stations between cut and fill sections, prevents cross-contamination of cut and fill areas, and confirms Mass Haul balance calculations.

---

## Bad-Input Test Scenarios
1. **Empty File**: 0-byte file rejected with `400 Bad Request`.
2. **Corrupt File**: Non-ASCII binary noise in CSV or truncated LAS header caught gracefully.
3. **Wrong File Type**: Non-point-cloud files (.exe, .pdf, images) rejected.
4. **Oversized File**: Exceeding size quota rejected with `413 Payload Too Large`.
5. **Duplicate File**: Same SHA-256 hash detected; avoids redundant storage.
6. **Blank & Null Values**: NaN, null tokens, and missing columns reported with line numbers.
7. **Planted Spike**: Single anomaly point 1000m above neighborhood detected by IQR filter.
8. **Planted Hole**: Single anomaly point -500m below neighborhood detected by outlier filter.
9. **Sparse Density**: Point density below minimum engineering threshold flagged in quality report.
