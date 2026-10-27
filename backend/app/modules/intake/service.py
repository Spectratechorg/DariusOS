import hashlib
import logging
import os
import shutil
from pathlib import Path
from typing import Optional, Tuple
import numpy as np
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.audit import record_audit_event
from app.models.survey_file import SurveyFile
from app.modules.intake.cleaner import SurveyCleaner
from app.modules.intake.readers.registry import get_reader_for_file
from app.modules.intake.report import IntakeReportGenerator
from app.modules.intake.validator import SurveyValidator
from app.schemas.survey import StandardPointCloudData, SurveyFileStatus, SurveyUploadResponse

logger = logging.getLogger("dariusos.intake")


class IntakeService:
    """
    Coordinates file intake: SHA-256 hashing, storage, swappable reader parsing,
    quality validation, normalization, and database record persistence.
    """

    @classmethod
    def process_file_upload(
        cls,
        db: Session,
        project_id: str,
        user_id: str,
        filename: str,
        raw_bytes: bytes,
        crs_epsg: int = 32632
    ) -> Tuple[SurveyFile, StandardPointCloudData]:
        # 1. Enforce size and non-empty checks
        file_size = len(raw_bytes)
        if file_size == 0:
            raise ValueError(f"Uploaded file '{filename}' is empty (0 bytes).")

        if file_size > settings.MAX_UPLOAD_SIZE_BYTES:
            raise ValueError(
                f"Uploaded file size ({file_size / (1024*1024):.2f} MB) exceeds maximum allowed limit "
                f"({settings.MAX_UPLOAD_SIZE_BYTES / (1024*1024):.2f} MB)."
            )

        # 2. Compute SHA-256 hash
        sha256_hash = hashlib.sha256(raw_bytes).hexdigest()

        # 3. Duplicate check: reject or link duplicate uploads
        existing_file = db.query(SurveyFile).filter_by(
            project_id=project_id,
            sha256_hash=sha256_hash
        ).first()

        if existing_file:
            raise ValueError(
                f"Duplicate survey file detected: A file with identical SHA-256 hash ({sha256_hash[:12]}...) "
                f"was already uploaded as '{existing_file.original_filename}'."
            )

        # 4. Save raw file UNTOUCHED to storage
        raw_storage_dir = Path(settings.RAW_UPLOAD_DIR)
        raw_storage_dir.mkdir(parents=True, exist_ok=True)
        raw_file_path = raw_storage_dir / f"{sha256_hash}_{Path(filename).name}"
        raw_file_path.write_bytes(raw_bytes)

        # 5. Select format reader from registry
        reader = get_reader_for_file(filename, raw_bytes[:1024])
        logger.info("Using reader '%s' for '%s'", reader.format_name, filename)

        # 6. Parse raw points
        raw_points, file_metadata = reader.read(raw_file_path)

        # 7. Validate points quality
        validation = SurveyValidator.validate_points(raw_points, file_metadata)

        # 8. Clean and normalize
        cleaned_points = SurveyCleaner.clean_points(raw_points, validation)

        # 9. Save cleaned points array for fast downstream stage access
        processed_dir = Path(settings.PROCESSED_DIR)
        processed_dir.mkdir(parents=True, exist_ok=True)
        cleaned_npy_path = processed_dir / f"{sha256_hash}_cleaned.npy"
        np.save(cleaned_npy_path, cleaned_points)

        # 10. Generate plain-language report
        report = IntakeReportGenerator.generate(
            filename=filename,
            sha256_hash=sha256_hash,
            file_size_bytes=file_size,
            validation=validation,
            crs_epsg=crs_epsg
        )

        status = SurveyFileStatus.VALIDATED if validation.errors == [] else SurveyFileStatus.REJECTED

        # 11. Create immutable database record
        b = validation.bounds
        survey_record = SurveyFile(
            project_id=project_id,
            original_filename=filename,
            file_format=reader.format_name,
            sha256_hash=sha256_hash,
            file_size_bytes=file_size,
            storage_path=str(raw_file_path),
            point_count=len(cleaned_points),
            bounds_min_x=b.min_x,
            bounds_max_x=b.max_x,
            bounds_min_y=b.min_y,
            bounds_max_y=b.max_y,
            bounds_min_z=b.min_z,
            bounds_max_z=b.max_z,
            density_pts_m2=validation.density_pts_m2,
            crs_epsg=crs_epsg,
            quality_report=report.model_dump(),
            status=status.value,
            rejection_reason="; ".join(validation.errors) if validation.errors else None,
            uploaded_by_user_id=user_id
        )
        db.add(survey_record)
        db.commit()
        db.refresh(survey_record)

        # 12. Record audit event
        record_audit_event(
            db=db,
            action="SURVEY_UPLOAD_INTAKE",
            user_id=user_id,
            resource_type="survey_file",
            resource_id=survey_record.id,
            details={
                "filename": filename,
                "sha256": sha256_hash,
                "raw_points": validation.total_raw_points,
                "cleaned_points": len(cleaned_points),
                "verdict": report.verdict.value
            }
        )

        standard_cloud = StandardPointCloudData(
            file_id=survey_record.id,
            original_filename=filename,
            sha256_hash=sha256_hash,
            file_size_bytes=file_size,
            crs_epsg=crs_epsg,
            unit="meters",
            point_count=len(cleaned_points),
            bounds=b,
            density_pts_m2=validation.density_pts_m2,
            quality_report=report
        )

        return survey_record, standard_cloud
