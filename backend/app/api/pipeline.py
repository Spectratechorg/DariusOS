from typing import List, Optional, Tuple
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db, require_roles
from app.models.pipeline_run import PipelineRun
from app.models.project import Project
from app.models.survey_file import SurveyFile
from app.models.user import User
from app.modules.pipeline.service import PipelineService
from app.schemas.manifest import PipelineRunRequest, PipelineRunResponse, StageRecord
from app.schemas.project import PipelineRunSummaryResponse

router = APIRouter(tags=["Pipeline Execution"])


class PipelineTriggerRequest(BaseModel):
    survey_file_id: str
    start_point: Tuple[float, float]
    end_point: Tuple[float, float]
    intermediate_pis: Optional[List[Tuple[float, float]]] = None
    target_elevation_offset_m: Optional[float] = 0.0
    station_interval_m: Optional[float] = 20.0
    force_recompute: bool = False


@router.post("/projects/{project_id}/runs", response_model=PipelineRunResponse, status_code=status.HTTP_201_CREATED)
def trigger_pipeline_run(
    project_id: str,
    trigger_data: PipelineTriggerRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "engineer"]))
):
    """
    Executes or regenerates the road design pipeline (M1 to M5) with smart caching,
    reproducibility tracking, and volume computation.
    """
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project '{project_id}' not found"
        )

    survey = db.query(SurveyFile).filter(
        SurveyFile.id == trigger_data.survey_file_id,
        SurveyFile.project_id == project_id
    ).first()
    if not survey:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Survey file '{trigger_data.survey_file_id}' not found in project '{project_id}'"
        )

    run_request = PipelineRunRequest(
        project_id=project_id,
        survey_file_id=trigger_data.survey_file_id,
        start_point=trigger_data.start_point,
        end_point=trigger_data.end_point,
        intermediate_pis=trigger_data.intermediate_pis,
        target_elevation_offset_m=trigger_data.target_elevation_offset_m,
        station_interval_m=trigger_data.station_interval_m,
        force_recompute=trigger_data.force_recompute
    )

    try:
        response, _, _, _, _ = PipelineService.execute_run(
            db=db,
            request=run_request,
            user_id=current_user.id
        )
        return response
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Pipeline run execution failed: {str(exc)}"
        )


@router.get("/projects/{project_id}/runs", response_model=List[PipelineRunSummaryResponse])
def list_project_runs(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Lists all historical and current pipeline runs for a project."""
    runs = db.query(PipelineRun).filter(PipelineRun.project_id == project_id).order_by(PipelineRun.created_at.desc()).all()
    return [
        PipelineRunSummaryResponse(
            id=r.id,
            survey_file_id=r.survey_file_id,
            status=r.status,
            execution_duration_sec=r.execution_duration_sec,
            total_road_length_m=r.total_road_length_m,
            total_cut_volume_m3=r.total_cut_volume_m3,
            total_fill_volume_m3=r.total_fill_volume_m3,
            net_volume_m3=r.net_volume_m3,
            created_at=r.created_at,
            completed_at=r.completed_at
        )
        for r in runs
    ]


@router.get("/runs/{run_id}")
def get_run_details(
    run_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Returns detailed stage manifest, timing, parameters, and volumes for a specific run."""
    run = db.query(PipelineRun).filter(PipelineRun.id == run_id).first()
    if not run:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pipeline run '{run_id}' not found"
        )

    return {
        "run_id": run.id,
        "project_id": run.project_id,
        "survey_file_id": run.survey_file_id,
        "status": run.status,
        "survey_file_hash": run.survey_file_hash,
        "engineering_rules_hash": run.engineering_rules_hash,
        "code_version": run.code_version,
        "execution_duration_sec": run.execution_duration_sec,
        "stages": run.stage_manifest,
        "route_parameters": run.route_parameters,
        "summary": {
            "total_length_m": run.total_road_length_m,
            "total_cut_volume_m3": run.total_cut_volume_m3,
            "total_fill_volume_m3": run.total_fill_volume_m3,
            "net_volume_m3": run.net_volume_m3
        },
        "created_at": run.created_at,
        "completed_at": run.completed_at,
        "engineer_notice": "TO BE CONFIRMED BY A REGISTERED ENGINEER"
    }
