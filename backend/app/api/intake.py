from typing import List, Optional
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db, require_roles
from app.models.project import Project
from app.models.survey_file import SurveyFile
from app.models.user import User
from app.modules.intake.service import IntakeService
from app.schemas.project import SurveySummaryResponse
from app.schemas.survey import SurveyUploadResponse

router = APIRouter(tags=["Survey Intake"])


@router.post("/projects/{project_id}/surveys", response_model=SurveyUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_survey_file(
    project_id: str,
    file: UploadFile = File(...),
    crs_epsg: int = Form(32632),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "engineer"]))
):
    """
    Accepts an uploaded raw survey point file (CSV, XYZ, LAS, LAZ), verifies SHA-256 hash,
    validates geometric quality, removes outliers, and generates plain-language intake report.
    """
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project '{project_id}' not found"
        )

    try:
        raw_bytes = await file.read()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to read uploaded file payload: {str(e)}"
        )

    try:
        survey_record, point_cloud_data = IntakeService.process_file_upload(
            db=db,
            project_id=project_id,
            user_id=current_user.id,
            filename=file.filename or "unknown.csv",
            raw_bytes=raw_bytes,
            crs_epsg=crs_epsg
        )
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err)
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Survey processing failed: {str(exc)}"
        )

    return SurveyUploadResponse(
        file_id=survey_record.id,
        project_id=project_id,
        original_filename=survey_record.original_filename,
        file_format=survey_record.file_format,
        sha256_hash=survey_record.sha256_hash,
        file_size_bytes=survey_record.file_size_bytes,
        status=survey_record.status,
        quality_report=point_cloud_data.quality_report,
        plain_language_summary=point_cloud_data.quality_report.summary_text
    )


@router.get("/projects/{project_id}/surveys", response_model=List[SurveySummaryResponse])
def list_project_surveys(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Lists all survey files uploaded for a given project."""
    surveys = db.query(SurveyFile).filter(SurveyFile.project_id == project_id).order_by(SurveyFile.uploaded_at.desc()).all()
    return [
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


@router.get("/surveys/{survey_id}/report")
def get_survey_report(
    survey_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieves quality report and geometric metrics for a survey file."""
    survey = db.query(SurveyFile).filter(SurveyFile.id == survey_id).first()
    if not survey:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Survey file '{survey_id}' not found"
        )
    return {
        "survey_id": survey.id,
        "filename": survey.original_filename,
        "file_format": survey.file_format,
        "sha256_hash": survey.sha256_hash,
        "point_count": survey.point_count,
        "density_pts_m2": survey.density_pts_m2,
        "bounds": {
            "min_x": survey.bounds_min_x,
            "max_x": survey.bounds_max_x,
            "min_y": survey.bounds_min_y,
            "max_y": survey.bounds_max_y,
            "min_z": survey.bounds_min_z,
            "max_z": survey.bounds_max_z,
        },
        "quality_report": survey.quality_report,
        "status": survey.status
    }
