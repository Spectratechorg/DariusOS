from typing import Optional
from sqlalchemy.orm import Session

from app.core.audit import record_audit_event
from app.modules.design.cross_sections.generator import CrossSectionGenerator
from app.modules.terrain.interpolator import TerrainInterpolator
from app.schemas.alignment import HorizontalAlignmentPackage
from app.schemas.cross_section import CrossSectionPackage
from app.schemas.profile import LongitudinalProfilePackage


class CrossSectionService:
    """
    Coordinates cross-section generation, audit logging, and geometric slicing.
    """

    @classmethod
    def generate_cross_sections(
        cls,
        alignment: HorizontalAlignmentPackage,
        profile: LongitudinalProfilePackage,
        terrain: TerrainInterpolator,
        custom_corridor_half_width_m: Optional[float] = None,
        db: Optional[Session] = None,
        user_id: Optional[str] = None,
        project_id: Optional[str] = None
    ) -> CrossSectionPackage:
        package = CrossSectionGenerator.generate(
            alignment=alignment,
            profile=profile,
            terrain=terrain,
            custom_corridor_half_width_m=custom_corridor_half_width_m
        )

        if db and user_id and project_id:
            record_audit_event(
                db=db,
                action="CROSS_SECTIONS_GENERATED",
                user_id=user_id,
                resource_type="project",
                resource_id=project_id,
                details={
                    "total_sections": package.total_sections,
                    "interval_m": package.interval_m,
                    "total_cut_area_sum_m2": package.total_cut_area_sum_m2,
                    "total_fill_area_sum_m2": package.total_fill_area_sum_m2
                }
            )

        return package
