# Architectural Decisions Log

This document records key technical decisions made during the design and construction of Dariusos.

---

## ADR 001: Modular Monolith vs Microservices
- **Date**: 2026-10-27
- **Who**: Senior Software Engineer
- **Status**: Accepted
- **Context**: The requirements specify an MVP for a 3-person team with clear decoupled stages (intake, terrain, design, quantities, pipeline, exports). Microservices add significant networking, distributed transaction, and deployment overhead that is unnecessary for a single road project MVP.
- **Decision**: Adopt a Modular Monolith with strict folder separation and Pydantic data contracts (`docs/contracts/`).
- **Consequences**: Easy local debugging, single Docker Compose configuration, readable codebase for junior engineers, zero distributed latency.

---

## ADR 002: Synchronous SQLAlchemy with FastAPI Threadpool
- **Date**: 2026-10-27
- **Who**: Senior Software Engineer
- **Status**: Accepted
- **Context**: Road design algorithms (`scipy`, `numpy`, `shapely`) are CPU-bound, not I/O-bound. Running heavy computations directly in Python's async event loop blocks async web endpoints. Async SQLAlchemy also adds complex session-lifecycle rules that frequently confuse junior developers when combined with background workers (RQ).
- **Decision**: Use standard synchronous SQLAlchemy 2.0 with a session generator. FastAPI automatically executes synchronous route handlers in its worker threadpool, preserving non-blocking HTTP behavior while keeping the database interactions simple, reliable, and directly shareable with the background RQ worker.
- **Consequences**: Simpler code, zero event-loop collisions in scientific libraries, seamless worker integration.

---

## ADR 003: Redis Queue (RQ) for Asynchronous Processing
- **Date**: 2026-10-27
- **Who**: Senior Software Engineer
- **Status**: Accepted
- **Context**: Large survey files (e.g. 500,000+ points) require several seconds to parse, clean, and grid. We need job queuing to prevent HTTP timeouts. Celery is heavyweight and complex to configure; RQ is lightweight, Pythonic, and easy to monitor.
- **Decision**: Use RQ with Redis for pipeline task execution. Small/synthetic files support immediate synchronous evaluation for testing; larger files run via RQ.
- **Consequences**: Minimal configuration, transparent failure logs, simple one-container Redis dependency.

---

## ADR 004: Strict Isolation of Engineering Rules
- **Date**: 2026-10-27
- **Who**: Senior Software Engineer
- **Status**: Accepted
- **Context**: Road geometric design standards and construction unit rates must never be hardcoded or invented by software engineers.
- **Decision**: Centralize all design constants in `config/engineering_rules.json` with a mandatory `"TO BE CONFIRMED BY A REGISTERED ENGINEER"` disclaimer. Provide runtime validation that halts execution if the config is missing or unparseable.
- **Consequences**: Safety compliance, transparent audits, client trust.

---

## ADR 005: Earthwork Quantities from Cross-Sections (Single Source of Truth)
- **Date**: 2026-10-27
- **Who**: Senior Software Engineer
- **Status**: Accepted
- **Context**: A common pitfall in civil engineering software is calculating bill quantities from a 3D TIN difference while drawing 2D cross-sections separately, resulting in drawing areas that do not match the bill of quantities.
- **Decision**: Cross-section polygons and earthwork volume integration share the exact same geometric cross-section slice objects via the Average End Area method (with Prismoidal correction for tapering).
- **Consequences**: Drawings and BEME quantities are guaranteed to match 100%.
