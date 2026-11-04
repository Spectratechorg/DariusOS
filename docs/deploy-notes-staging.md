# TASK-0053 Staging Deployment Notes

## Environment

- Repository: `Spectratechorg/DariusOS`
- Branch: `v0/wire-frontend-backend`
- Frontend: Vite static build deployed through Vercel
- Backend: FastAPI service deployed separately from the Vercel frontend
- Client data: none; demo/sample values only

## Required environment variables

Frontend:

- `VITE_API_URL` — the HTTPS base URL of the staging FastAPI API, including `/api/v1`.

Backend:

- `DATABASE_URL`
- `REDIS_URL`
- `SECRET_KEY`
- `ALLOWED_ORIGINS` — include the exact Vercel staging domain.

Secrets must be configured in the hosting providers' environment-variable settings and must not be committed.

## Verification checklist

1. Open the staging URL and confirm the frontend loads on a fresh browser session.
2. Confirm `GET /health` and `GET /api/v1/health` return HTTP 200 from the staging API.
3. Confirm the frontend API status indicator reaches the connected state.
4. Create a test project using non-client demo data.
5. Upload a sample survey file and confirm it is stored under the staging storage namespace.
6. Run the pipeline and verify the run record and generated outputs.
7. Confirm no production database, storage bucket, or credentials are referenced.

## Deployment note

The Vercel frontend is the staging/demo surface. A separate FastAPI deployment is required for complete end-to-end staging; set `VITE_API_URL` to that deployment before testing project creation, uploads, and pipeline runs.
