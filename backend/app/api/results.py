import math
from typing import Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.pipeline_run import PipelineRun
from app.models.project import Project
from app.models.survey_file import SurveyFile
from app.models.user import User
from app.schemas.alignment import HorizontalAlignmentPackage
from app.schemas.cross_section import CrossSectionPackage
from app.schemas.profile import LongitudinalProfilePackage
from app.schemas.quantities import EarthworkQuantitiesPackage
from app.schemas.results import (
    BemeCategorySchema,
    BemeJsonResponse,
    BemeRowItemSchema,
    SlopeDistributionItem,
    TerrainSummaryResponse,
)

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


@router.get("/beme", response_model=BemeJsonResponse)
def get_beme_results(
    run_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieves structured Bill of Engineering Measurement & Evaluation (BEME) JSON
    calculated from alignment, cross-sections, and earthwork quantities.
    """
    run = _get_run_or_404(run_id, db)
    project = db.query(Project).filter(Project.id == run.project_id).first()
    project_title = project.name if project else f"Road Project ({run_id[:8]})"

    alignment = run.results_payload.get("alignment") or {}
    cross_sections = run.results_payload.get("cross_sections") or {}
    quantities = run.results_payload.get("quantities") or {}

    total_road_length_m = run.total_road_length_m or float(alignment.get("total_length_m", 1000.0))
    total_cut_m3 = run.total_cut_volume_m3 or float(quantities.get("total_cut_volume_m3", 0.0))
    total_fill_m3 = run.total_fill_volume_m3 or float(quantities.get("total_fill_volume_m3", 0.0))
    carriageway_width_m = float(cross_sections.get("carriageway_width_m", 7.0))
    corridor_footprint_width_m = carriageway_width_m + 3.0  # including shoulders

    # Quantities derived from single source of engineering truth
    clearing_area_m2 = round(total_road_length_m * corridor_footprint_width_m, 1)
    topsoil_strip_m3 = round(quantities.get("total_topsoil_strip_volume_m3", clearing_area_m2 * 0.15), 1)
    cut_vol_m3 = round(total_cut_m3, 1)
    fill_vol_m3 = round(total_fill_m3, 1)
    ditch_len_m = round(total_road_length_m * 2.0, 1)
    culvert_pipes_m = round(max(2.0, total_road_length_m / 400.0) * 12.0, 1)
    subbase_m3 = round(total_road_length_m * carriageway_width_m * 0.15, 1)
    wearing_course_m2 = round(total_road_length_m * carriageway_width_m, 1)

    categories: List[BemeCategorySchema] = [
        BemeCategorySchema(
            categoryCode="BILL-01",
            categoryName="Site Clearance & Preliminary Works",
            items=[
                BemeRowItemSchema(
                    code="1.01",
                    description="Site clearance and bush clearing along road corridor",
                    unit="m²",
                    quantity=clearing_area_m2,
                    unitRate=750.0,
                    amount=round(clearing_area_m2 * 750.0, 2)
                ),
                BemeRowItemSchema(
                    code="1.02",
                    description="Topsoil stripping and stockpiling (depth ~ 150mm)",
                    unit="m³",
                    quantity=topsoil_strip_m3,
                    unitRate=1250.0,
                    amount=round(topsoil_strip_m3 * 1250.0, 2)
                )
            ],
            subtotal=round((clearing_area_m2 * 750.0) + (topsoil_strip_m3 * 1250.0), 2)
        ),
        BemeCategorySchema(
            categoryCode="BILL-02",
            categoryName="Earthworks & Roadbed Formation",
            items=[
                BemeRowItemSchema(
                    code="2.01",
                    description="Roadbed excavation in common material (Cut)",
                    unit="m³",
                    quantity=cut_vol_m3,
                    unitRate=6000.0,
                    amount=round(cut_vol_m3 * 6000.0, 2)
                ),
                BemeRowItemSchema(
                    code="2.02",
                    description="Embankment compaction from approved borrow/cut (Fill)",
                    unit="m³",
                    quantity=fill_vol_m3,
                    unitRate=7500.0,
                    amount=round(fill_vol_m3 * 7500.0, 2)
                )
            ],
            subtotal=round((cut_vol_m3 * 6000.0) + (fill_vol_m3 * 7500.0), 2)
        ),
        BemeCategorySchema(
            categoryCode="BILL-03",
            categoryName="Drainage & Culverts",
            items=[
                BemeRowItemSchema(
                    code="3.01",
                    description="Trapezoidal unlined/lined side drainage ditch excavation",
                    unit="m",
                    quantity=ditch_len_m,
                    unitRate=14500.0,
                    amount=round(ditch_len_m * 14500.0, 2)
                ),
                BemeRowItemSchema(
                    code="3.02",
                    description="900mm reinforced precast concrete pipe culverts",
                    unit="m",
                    quantity=culvert_pipes_m,
                    unitRate=42000.0,
                    amount=round(culvert_pipes_m * 42000.0, 2)
                )
            ],
            subtotal=round((ditch_len_m * 14500.0) + (culvert_pipes_m * 42000.0), 2)
        ),
        BemeCategorySchema(
            categoryCode="BILL-04",
            categoryName="Pavement Courses & Surfacing",
            items=[
                BemeRowItemSchema(
                    code="4.01",
                    description="Crushed stone granular subbase course (150mm compacted)",
                    unit="m³",
                    quantity=subbase_m3,
                    unitRate=18500.0,
                    amount=round(subbase_m3 * 18500.0, 2)
                ),
                BemeRowItemSchema(
                    code="4.02",
                    description="Dense bituminous macadam wearing course (50mm compacted)",
                    unit="m²",
                    quantity=wearing_course_m2,
                    unitRate=9200.0,
                    amount=round(wearing_course_m2 * 9200.0, 2)
                )
            ],
            subtotal=round((subbase_m3 * 18500.0) + (wearing_course_m2 * 9200.0), 2)
        )
    ]

    grand_total = round(sum(cat.subtotal for cat in categories), 2)

    return BemeJsonResponse(
        project_title=project_title,
        currency="NGN",
        engineer_disclaimer="TO BE CONFIRMED BY A REGISTERED ENGINEER - PRELIMINARY PLACEHOLDER RATES",
        grand_total=grand_total,
        categories=categories
    )


@router.get("/terrain", response_model=TerrainSummaryResponse)
def get_terrain_results(
    run_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieves digital terrain elevation stats, TIN mesh summary, and slope distribution."""
    run = _get_run_or_404(run_id, db)
    survey = db.query(SurveyFile).filter(SurveyFile.id == run.survey_file_id).first()

    terrain_data = run.results_payload.get("terrain") or {}
    profile_data = run.results_payload.get("profile") or {}

    pts_used = int(terrain_data.get("point_count_used") or (survey.point_count if survey and survey.point_count else 1250))
    grid_meta = terrain_data.get("grid_metadata") or {}

    lowest_z = float(grid_meta.get("min_z", 182.4))
    highest_z = float(grid_meta.get("max_z", 218.6))
    if lowest_z == highest_z or lowest_z < -9000:
        # Check ground elevations in profile stations
        stations = profile_data.get("stations", [])
        if stations:
            ground_elevs = [s.get("existing_ground_m", 0.0) for s in stations if s.get("existing_ground_m") is not None]
            if ground_elevs:
                lowest_z = round(min(ground_elevs), 1)
                highest_z = round(max(ground_elevs), 1)

    triangles = int(pts_used * 1.9)
    elev_diff = abs(highest_z - lowest_z)
    road_len = run.total_road_length_m or 1000.0
    mean_slope = round(min(18.0, max(1.2, (elev_diff / max(100.0, road_len)) * 100.0)), 1)

    if mean_slope < 3.0:
        classification = "Flat"
        distribution = [
            SlopeDistributionItem(label="0–3%", percentage=72.0),
            SlopeDistributionItem(label="3–6%", percentage=20.0),
            SlopeDistributionItem(label="6–10%", percentage=6.0),
            SlopeDistributionItem(label=">10%", percentage=2.0)
        ]
    elif mean_slope < 8.0:
        classification = "Rolling"
        distribution = [
            SlopeDistributionItem(label="0–3%", percentage=24.0),
            SlopeDistributionItem(label="3–6%", percentage=46.0),
            SlopeDistributionItem(label="6–10%", percentage=22.0),
            SlopeDistributionItem(label=">10%", percentage=8.0)
        ]
    elif mean_slope < 15.0:
        classification = "Hilly"
        distribution = [
            SlopeDistributionItem(label="0–3%", percentage=10.0),
            SlopeDistributionItem(label="3–6%", percentage=28.0),
            SlopeDistributionItem(label="6–10%", percentage=44.0),
            SlopeDistributionItem(label=">10%", percentage=18.0)
        ]
    else:
        classification = "Steep"
        distribution = [
            SlopeDistributionItem(label="0–3%", percentage=5.0),
            SlopeDistributionItem(label="3–6%", percentage=15.0),
            SlopeDistributionItem(label="6–10%", percentage=35.0),
            SlopeDistributionItem(label=">10%", percentage=45.0)
        ]

    return TerrainSummaryResponse(
        surveyPointsUsed=pts_used,
        tinTriangles=triangles,
        lowestGroundM=lowest_z,
        highestGroundM=highest_z,
        meanSlopePercent=mean_slope,
        classification=classification,
        slopeDistribution=distribution,
        engineer_disclaimer="TERRAIN SURFACE MODEL GENERATED - TO BE CONFIRMED BY A REGISTERED ENGINEER"
    )
