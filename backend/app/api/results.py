from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.pipeline_run import PipelineRun
from app.models.user import User
from app.schemas.alignment import HorizontalAlignmentPackage
from app.schemas.cross_section import CrossSectionPackage
from app.schemas.profile import LongitudinalProfilePackage
from app.schemas.quantities import EarthworkQuantitiesPackage

router = APIRouter(prefix="/runs/{run_id}", tags=["Engineering Results"])


def _get_run_or_404(run_id: str, db: Session) -> PipelineRun:
    run = db.query(PipelineRun).filter(PipelineRun.id == run_id).first()
    if not run:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pipeline run '{run_id}' not found"
        )
    if not run.results_payload:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No results payload stored for run '{run_id}'"
        )
    return run


@router.get("/alignment", response_model=HorizontalAlignmentPackage)
def get_alignment_results(
    run_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieves horizontal alignment geometry, curves, stations, and grade compliance."""
    run = _get_run_or_404(run_id, db)
    alignment_data = run.results_payload.get("alignment")
    if not alignment_data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Alignment data missing")
    return alignment_data


@router.get("/profile", response_model=LongitudinalProfilePackage)
def get_profile_results(
    run_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieves longitudinal profile, existing ground elevation, design grade line, and vertical curves."""
    run = _get_run_or_404(run_id, db)
    profile_data = run.results_payload.get("profile")
    if not profile_data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile data missing")
    return profile_data


@router.get("/sections", response_model=CrossSectionPackage)
def get_cross_sections_results(
    run_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieves perpendicular cross-section slices, cut/fill daylight points, and trapezoidal areas."""
    run = _get_run_or_404(run_id, db)
    sections_data = run.results_payload.get("cross_sections")
    if not sections_data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cross section data missing")
    return sections_data


@router.get("/quantities", response_model=EarthworkQuantitiesPackage)
def get_quantities_results(
    run_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieves interval earthwork volumes, topsoil stripping, mass-haul balance, and totals."""
    run = _get_run_or_404(run_id, db)
    quantities_data = run.results_payload.get("quantities")
    if not quantities_data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quantities data missing")
    return quantities_data
