# Dariusos Road Design & Earthworks Platform

> **Notice**: All engineering values, design rules, curve limits, and unit rates are placeholders **TO BE CONFIRMED BY A REGISTERED ENGINEER**. Dariusos is a computational decision support system.

Dariusos is a modular web platform that takes terrain survey data (LAS, LAZ, XYZ, CSV) for a road project and automatically produces:
1. Gridded digital elevation terrain models.
2. Horizontal centrelines and longitudinal profiles respecting maximum grade limits.
3. Transverse cross-sections with customizable road templates and cut/fill daylight slopes.
4. Guaranteed matching cut/fill earthwork volumes (Average End Area + Prismoidal).
5. Excel Bill of Engineering Measurement and Evaluation (BEME) with active formulas.
6. A certified Pilot Engineering Report PDF with audit trails and benchmark accuracy checks.

---

## Quickstart

### Prerequisites
- Docker & Docker Compose OR Python 3.11+ and Node.js 20+

### Option A: Run with Docker Compose (Recommended)
```bash
# 1. Copy environment template
cp .env.example .env

# 2. Launch all services (Postgres, Redis, Backend, Worker, Frontend)
docker compose up -d

# 3. Access the platform:
# Web Frontend:  http://localhost:3000
# API Docs:      http://localhost:8000/docs
```

### Option B: Run Locally for Development
```bash
# 1. Copy environment template
cp .env.example .env

# 2. Backend setup
cd backend
python -m venv .venv
# Activate venv (.venv\Scripts\activate on Windows or source .venv/bin/activate on Linux/Mac)
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# 3. Frontend setup (in a separate terminal)
cd frontend
npm install
npm run dev
```

---

## Running the Automated Test Suite

```bash
cd backend
pytest -v
```

To run with coverage:
```bash
pytest --cov=app tests/
```

To run the golden hand-calculated volume checks:
```bash
pytest tests/test_quantities.py -k "golden"
```

---

## Documentation
- [Architecture & Guide for Junior Engineers](docs/architecture.md)
- [Data Contracts Between Stages](docs/contracts/)
- [Architecture Decision Log](docs/decisions.md)
- [Testing & Golden Case Verification Proofs](docs/testing.md)
