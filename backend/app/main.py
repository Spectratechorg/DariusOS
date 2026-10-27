import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app import __version__
from app.api import api_router
from app.core.config import settings
from app.core.database import init_db
from app.core.engineering import EngineeringRulesLoader
from app.schemas.common import HealthCheck

logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("dariusos.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure tables exist and engineering configuration is loaded and validated
    logger.info("Starting Dariusos Road Design Platform backend...")
    init_db()
    rules = EngineeringRulesLoader.load()
    logger.info("Engineering status: %s", rules.ENGINEERING_STATUS)
    yield
    # Shutdown
    logger.info("Shutting down Dariusos backend...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=__version__,
    description="Automated Road Design Package & Earthwork Quantities Platform (MVP)",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routers
app.include_router(api_router)


@app.get("/api/v1/health", response_model=HealthCheck, tags=["System"])
def health_check():
    rules_hash = EngineeringRulesLoader.get_sha256()
    return HealthCheck(
        status="healthy",
        version=__version__,
        environment=settings.APP_ENV,
        engineer_disclaimer="ALL GEOMETRY & RATES TO BE CONFIRMED BY A REGISTERED ENGINEER",
        rules_sha256=rules_hash
    )
