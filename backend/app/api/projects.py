from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db, require_roles
from app.core.audit import record_audit_event
from app.models.pipeline_run import PipelineRun
from app.models.project import Project
from app.models.survey_file import SurveyFile
from app.models.user import User
from app.schemas.project import ProjectCreateRequest, ProjectDetailResponse, ProjectResponse, PipelineRunSummaryResponse, SurveySummaryResponse

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    request: ProjectCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "engineer"]))
):
    """Creates a new road engineering project container."""
    project = Project(
        name=request.name.strip(),
        description=request.description.strip() if request.description else None,
        created_by_user_id=current_user.id
    )
    db.add(project)
    db.commit()
    db.refresh(project)

    record_audit_event(
        db=db,
        action="PROJECT_CREATED",
        user_id=current_user.id,
        resource_type="project",
        resource_id=project.id,
        details={"name": project.name}
    )

    return project


@router.get("", response_model=List[ProjectResponse])
def list_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Lists all active road engineering projects."""
    projects = db.query(Project).order_by(Project.created_at.desc()).all()
    return projects


@router.get("/{project_id}", response_model=ProjectDetailResponse)
def get_project_detail(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieves full details for a project including attached surveys and runs."""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project '{project_id}' not found"
        )

    surveys = db.query(SurveyFile).filter(SurveyFile.project_id == project_id).order_by(SurveyFile.uploaded_at.desc()).all()
    runs = db.query(PipelineRun).filter(PipelineRun.project_id == project_id).order_by(PipelineRun.created_at.desc()).all()

    survey_summaries = [
        SurveySummaryResponse(
            id=s.id,
            original_filename=s.original_filename,
            file_format=s.file_format,
            sha256_hash=s.sha256_hash,
            file_size_bytes=s.file_size_bytes,
            point_count=s.point_count,
            density_pts_m2=s.density_pts_m2,
            status=s.status,
            uploaded_at=s.uploaded_at
        )
        for s in surveys
    ]

    run_summaries = [
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

    return ProjectDetailResponse(
        id=project.id,
        name=project.name,
        description=project.description,
        created_by_user_id=project.created_by_user_id,
        created_at=project.created_at,
        updated_at=project.updated_at,
        surveys=survey_summaries,
        runs=run_summaries
    )
