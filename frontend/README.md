# DariusOS frontend

React 18 + TypeScript + Vite + Material UI, with `react-router-dom` for routing and `swr` for data fetching.

## Run it

Requires Node.js 20 or newer. From the repository root:

```bash
npm --prefix frontend start
```

The backend is optional for viewing the scaffold. Start it separately to use API-backed screens; the Vite dev server proxies `/api` to `http://localhost:8000`.

## Routes

| Path | Page | Status |
|---|---|---|
| `/` | redirect | Redirects to `/login` |
| `/login` | `src/pages/LoginPage.tsx` | Empty scaffold |
| `/upload` | `src/pages/UploadPage.tsx` | Empty scaffold |
| `/project` | `src/pages/ProjectPage.tsx` | Empty scaffold |
| `/workspace` | existing nine-stage workspace | Existing design |
| anything else | `src/pages/NotFoundPage.tsx` | Page not found |

Paths live in `src/routes.ts`. Keep secrets out of `VITE_` variables.
