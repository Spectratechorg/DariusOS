from typing import List, Optional
import numpy as np

from app.core.engineering import get_engineering_rules
from app.schemas.cross_section import CrossSectionPackage
from app.schemas.quantities import (
    EarthworkInterval,
    EarthworkQuantitiesPackage,
    MassHaulBalanceStatus
)


class EarthworkCalculator:
    """
    Computes cut and fill earthwork volumes from cross-section slices using the
    standard Average End Area method with transition wedging and soil compaction factors.
    Guarantees drawings and bill of quantities share the exact same source of truth.
    """

    @classmethod
    def calculate_volumes(
        cls,
        cross_sections: CrossSectionPackage,
        custom_bulking_factor: Optional[float] = None,
        custom_shrinkage_factor: Optional[float] = None,
        custom_topsoil_depth_m: Optional[float] = None
    ) -> EarthworkQuantitiesPackage:
        rules = get_engineering_rules()
        ef_rules = rules.earthwork_factors

        bulking = float(custom_bulking_factor or ef_rules.get("soil_bulking_factor", 1.15))
        shrinkage = float(custom_shrinkage_factor or ef_rules.get("compaction_shrinkage_factor", 0.90))
        topsoil_depth = float(custom_topsoil_depth_m or ef_rules.get("topsoil_strip_depth_m", 0.15))

        slices = cross_sections.sections
        if len(slices) < 2:
            raise ValueError("At least 2 cross-sections are required to calculate volumetric earthworks.")

        intervals: List[EarthworkInterval] = []
        cum_cut = 0.0
        cum_fill = 0.0
        total_topsoil = 0.0

        for i in range(len(slices) - 1):
            s1 = slices[i]
            s2 = slices[i + 1]

            length = s2.station_m - s1.station_m
            if length <= 1e-6:
                continue

            ac1, ac2 = s1.cut_area_m2, s2.cut_area_m2
            af1, af2 = s1.fill_area_m2, s2.fill_area_m2
            w1, w2 = s1.topsoil_strip_width_m, s2.topsoil_strip_width_m

            # Average End Area volumetric integration
            # Check for pure transition (one station pure cut, next station pure fill)
            if ac1 > 0 and af1 == 0 and ac2 == 0 and af2 > 0:
                # Pyramid/wedge transition
                l_cut = length * (ac1 / (ac1 + af2))
                l_fill = length - l_cut
                inc_cut = 0.5 * ac1 * l_cut
                inc_fill = 0.5 * af2 * l_fill
            elif af1 > 0 and ac1 == 0 and af2 == 0 and ac2 > 0:
                # Fill to cut transition
                l_fill = length * (af1 / (af1 + ac2))
                l_cut = length - l_fill
                inc_fill = 0.5 * af1 * l_fill
                inc_cut = 0.5 * ac2 * l_cut
            else:
                # Standard Average End Area
                inc_cut = 0.5 * (ac1 + ac2) * length
                inc_fill = 0.5 * (af1 + af2) * length

            # Topsoil strip volume = average width * depth * length
            inc_topsoil = 0.5 * (w1 + w2) * topsoil_depth * length

            cum_cut += inc_cut
            cum_fill += inc_fill
            total_topsoil += inc_topsoil

            net_cum = cum_cut - cum_fill

            intervals.append(
                EarthworkInterval(
                    interval_id=i + 1,
                    from_station_m=round(float(s1.station_m), 3),
                    to_station_m=round(float(s2.station_m), 3),
                    distance_m=round(float(length), 3),
                    start_cut_area_m2=round(float(ac1), 3),
                    end_cut_area_m2=round(float(ac2), 3),
                    incremental_cut_m3=round(float(inc_cut), 3),
                    start_fill_area_m2=round(float(af1), 3),
                    end_fill_area_m2=round(float(af2), 3),
                    incremental_fill_m3=round(float(inc_fill), 3),
                    topsoil_strip_m3=round(float(inc_topsoil), 3),
                    cumulative_cut_m3=round(float(cum_cut), 3),
                    cumulative_fill_m3=round(float(cum_fill), 3),
                    net_cumulative_m3=round(float(net_cum), 3)
                )
            )

        # Factored fill volume accounts for soil compaction shrinkage
        factored_fill = cum_fill / shrinkage if shrinkage > 1e-4 else cum_fill
        net_total = cum_cut - cum_fill

        if net_total > 50.0:
            status = MassHaulBalanceStatus.EXCESS_CUT
        elif net_total < -50.0:
            status = MassHaulBalanceStatus.EXCESS_FILL
        else:
            status = MassHaulBalanceStatus.BALANCED

        summary = (
            f"Earthwork Quantities: Total Cut = {cum_cut:,.2f} m³, Total Fill = {cum_fill:,.2f} m³ "
            f"(Factored Fill for Compaction = {factored_fill:,.2f} m³). Net Earthwork = {net_total:+,.2f} m³ "
            f"({status.value.replace('_', ' ')}). Topsoil Stripping = {total_topsoil:,.2f} m³."
        )

        return EarthworkQuantitiesPackage(
            soil_bulking_factor=bulking,
            compaction_shrinkage_factor=shrinkage,
            topsoil_strip_depth_m=topsoil_depth,
            total_cut_volume_m3=round(float(cum_cut), 2),
            total_fill_volume_m3=round(float(cum_fill), 2),
            factored_fill_volume_m3=round(float(factored_fill), 2),
            total_topsoil_strip_volume_m3=round(float(total_topsoil), 2),
            net_volume_m3=round(float(net_total), 2),
            balance_status=status,
            intervals=intervals,
            summary_text=summary
        )
