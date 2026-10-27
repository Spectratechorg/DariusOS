from typing import List, Optional, Tuple
from sqlalchemy.orm import Session

from app.core.audit import record_audit_event
from app.modules.design.alignment.generator import HorizontalAlignmentGenerator
from app.modules.terrain.interpolator import TerrainInterpolator
from app.schemas.alignment import HorizontalAlignmentPackage


class AlignmentService:
    """
    Coordinates horizontal alignment generation, audit logging, and design rule validation.
    """

    @classmethod
    def generate_alignment(
        cls,
        start_xy: Tuple[float, float],
        end_xy: Tuple[float, float],
        terrain: TerrainInterpolator,
        intermediate_pis: Optional[List[Tuple[float, float]]] = None,
        station_interval_m: Optional[float] = None,
        db: Optional[Session] = None,
        user_id: Optional[str] = None,
        project_id: Optional[str] = None
    ) -> HorizontalAlignmentPackage:
        package = HorizontalAlignmentGenerator.generate(
            start_xy=start_xy,
            end_xy=end_xy,
            terrain=terrain,
            intermediate_pis=intermediate_pis,
            station_interval_m=station_interval_m
        )

        if db and user_id and project_id:
            record_audit_event(
                db=db,
                action="HORIZONTAL_ALIGNMENT_GENERATED",
                user_id=user_id,
                resource_type="project",
                resource_id=project_id,
                details={
                    "total_length_m": package.total_length_m,
                    "stations_count": len(package.stations),
                    "curves_count": len(package.curves),
                    "max_detected_grade": package.max_detected_ground_grade_percent,
                    "is_grade_compliant": package.is_grade_compliant
                }
            )

        return package
