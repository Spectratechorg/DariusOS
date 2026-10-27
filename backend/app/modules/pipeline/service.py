from datetime import datetime, timezone
from pathlib import Path
from typing import Optional, Tuple
import numpy as np
from sqlalchemy.orm import Session

from app import __version__
from app.core.audit import record_audit_event
from app.core.config import settings
from app.core.engineering import EngineeringRulesLoader
from app.models.pipeline_run import PipelineRun
from app.models.survey_file import SurveyFile
from app.modules.pipeline.orchestrator import PipelineOrchestrator
from app.schemas.alignment import HorizontalAlignmentPackage
from app.schemas.cross_section import CrossSectionPackage
from app.schemas.manifest import (
    PipelineRunRequest,
    PipelineRunResponse,
    PipelineRunSummary
)
from app.schemas.profile import LongitudinalProfilePackage
from app.schemas.quantities import EarthworkQuantitiesPackage


class PipelineService:
    """
    Executes the reproducible pipeline, logs manifest records to PostgreSQL,
    and returns complete engineering results.
    """

    @classmethod
    def execute_run(
        cls,
        db: Session,
        request: PipelineRunRequest,
        user_id: str
    ) -> Tuple[
        PipelineRunResponse,
        HorizontalAlignmentPackage,
        LongitudinalProfilePackage,
        CrossSectionPackage,
        EarthworkQuantitiesPackage
    ]:
        survey_record = db.query(SurveyFile).filter_by(id=request.survey_file_id).first()
        if not survey_record:
            raise ValueError(f"Survey file with ID '{request.survey_file_id}' not found.")

        # Load cleaned points from processed storage
        processed_dir = Path(settings.PROCESSED_DIR)
        cleaned_npy_path = processed_dir / f"{survey_record.sha256_hash}_cleaned.npy"
        if not cleaned_npy_path.is_file():
            raise FileNotFoundError(
                f"Cleaned point cloud cache not found for survey hash '{survey_record.sha256_hash}'."
            )

        cleaned_points = np.load(cleaned_npy_path)
        rules_sha256 = EngineeringRulesLoader.get_sha256()

        (
            stages,
            alignment_pkg,
            profile_pkg,
            sections_pkg,
            quantities_pkg,
            duration
        ) = PipelineOrchestrator.run_pipeline(
            survey_file_id=survey_record.id,
            survey_sha256=survey_record.sha256_hash,
            cleaned_points=cleaned_points,
            request=request,
            force_recompute=request.force_recompute
        )

        summary = PipelineRunSummary(
            total_length_m=alignment_pkg.total_length_m,
            total_stations=len(alignment_pkg.stations),
            total_cut_volume_m3=quantities_pkg.total_cut_volume_m3,
            total_fill_volume_m3=quantities_pkg.total_fill_volume_m3,
            net_volume_m3=quantities_pkg.net_volume_m3,
            balance_status=quantities_pkg.balance_status.value
        )

        # Create persistent PipelineRun DB record for reproducibility
        run_record = PipelineRun(
            project_id=request.project_id,
            survey_file_id=survey_record.id,
            survey_file_hash=survey_record.sha256_hash,
            engineering_rules_hash=rules_sha256,
            code_version=__version__,
            route_parameters=request.model_dump(),
            rules_snapshot=EngineeringRulesLoader.get_raw_dict(),
            status="COMPLETED",
            execution_duration_sec=duration,
            stage_manifest={k: v.model_dump() for k, v in stages.items()},
            total_road_length_m=alignment_pkg.total_length_m,
            total_cut_volume_m3=quantities_pkg.total_cut_volume_m3,
            total_fill_volume_m3=quantities_pkg.total_fill_volume_m3,
            net_volume_m3=quantities_pkg.net_volume_m3,
            results_payload={
                "alignment": alignment_pkg.model_dump(),
                "profile": profile_pkg.model_dump(),
                "cross_sections": sections_pkg.model_dump(),
                "quantities": quantities_pkg.model_dump()
            },
            completed_at=datetime.now(timezone.utc),
            triggered_by_user_id=user_id
        )
        db.add(run_record)
        db.commit()
        db.refresh(run_record)

        # Audit log entry
        record_audit_event(
            db=db,
            action="PIPELINE_RUN_COMPLETED",
            user_id=user_id,
            resource_type="pipeline_run",
            resource_id=run_record.id,
            details={
                "survey_hash": survey_record.sha256_hash,
                "rules_hash": rules_sha256,
                "stages": {k: v.status.value for k, v in stages.items()},
                "duration_sec": duration,
                "net_volume_m3": quantities_pkg.net_volume_m3
            }
        )

        response = PipelineRunResponse(
            run_id=run_record.id,
            project_id=request.project_id,
            survey_file_id=survey_record.id,
            status="COMPLETED",
            survey_file_hash=survey_record.sha256_hash,
            engineering_rules_hash=rules_sha256,
            code_version=__version__,
            execution_duration_sec=duration,
            stages=stages,
            summary=summary
        )

        return response, alignment_pkg, profile_pkg, sections_pkg, quantities_pkg
