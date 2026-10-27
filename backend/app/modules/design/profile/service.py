from typing import List, Optional, Tuple
from sqlalchemy.orm import Session

from app.core.audit import record_audit_event
from app.modules.design.profile.generator import LongitudinalProfileGenerator
from app.schemas.alignment import HorizontalAlignmentPackage
from app.schemas.profile import LongitudinalProfilePackage


class ProfileService:
    """
    Coordinates vertical longitudinal profile generation, audit logging, and design rule validation.
    """

    @classmethod
    def generate_profile(
        cls,
        alignment: HorizontalAlignmentPackage,
        target_offset_m: Optional[float] = None,
        explicit_pvis: Optional[List[Tuple[float, float]]] = None,
        db: Optional[Session] = None,
        user_id: Optional[str] = None,
        project_id: Optional[str] = None
    ) -> LongitudinalProfilePackage:
        package = LongitudinalProfileGenerator.generate(
            alignment=alignment,
            target_offset_m=target_offset_m,
            explicit_pvis=explicit_pvis
        )

        if db and user_id and project_id:
            record_audit_event(
                db=db,
                action="LONGITUDINAL_PROFILE_GENERATED",
                user_id=user_id,
                resource_type="project",
                resource_id=project_id,
                details={
                    "total_length_m": package.total_length_m,
                    "pvis_count": len(package.pvis),
                    "max_cut_depth_m": package.max_cut_depth_m,
                    "max_fill_depth_m": package.max_fill_depth_m,
                    "is_grade_compliant": package.is_grade_compliant
                }
            )

        return package
