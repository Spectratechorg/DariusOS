from typing import Optional
from sqlalchemy.orm import Session

from app.core.audit import record_audit_event
from app.modules.quantities.calculator import EarthworkCalculator
from app.schemas.cross_section import CrossSectionPackage
from app.schemas.quantities import EarthworkQuantitiesPackage


class QuantitiesService:
    """
    Coordinates earthwork quantity calculations, mass-haul balances, and audit logging.
    """

    @classmethod
    def calculate_quantities(
        cls,
        cross_sections: CrossSectionPackage,
        custom_bulking_factor: Optional[float] = None,
        custom_shrinkage_factor: Optional[float] = None,
        custom_topsoil_depth_m: Optional[float] = None,
        db: Optional[Session] = None,
        user_id: Optional[str] = None,
        project_id: Optional[str] = None
    ) -> EarthworkQuantitiesPackage:
        package = EarthworkCalculator.calculate_volumes(
            cross_sections=cross_sections,
            custom_bulking_factor=custom_bulking_factor,
            custom_shrinkage_factor=custom_shrinkage_factor,
            custom_topsoil_depth_m=custom_topsoil_depth_m
        )

        if db and user_id and project_id:
            record_audit_event(
                db=db,
                action="EARTHWORK_QUANTITIES_CALCULATED",
                user_id=user_id,
                resource_type="project",
                resource_id=project_id,
                details={
                    "total_cut_m3": package.total_cut_volume_m3,
                    "total_fill_m3": package.total_fill_volume_m3,
                    "net_m3": package.net_volume_m3,
                    "balance_status": package.balance_status.value
                }
            )

        return package
