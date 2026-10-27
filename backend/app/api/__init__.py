from fastapi import APIRouter

from app.api.auth import router as auth_router
from app.api.projects import router as projects_router
from app.api.intake import router as intake_router
from app.api.pipeline import router as pipeline_router
from app.api.results import router as results_router
from app.api.exports import router as exports_router

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth_router)
api_router.include_router(projects_router)
api_router.include_router(intake_router)
api_router.include_router(pipeline_router)
api_router.include_router(results_router)
api_router.include_router(exports_router)

__all__ = ["api_router"]
