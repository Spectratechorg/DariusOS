import time
from typing import Any, Dict, Optional, Tuple
import numpy as np

from app import __version__
from app.core.engineering import get_engineering_rules
from app.modules.design.alignment.generator import HorizontalAlignmentGenerator
from app.modules.design.cross_sections.generator import CrossSectionGenerator
from app.modules.design.profile.generator import LongitudinalProfileGenerator
from app.modules.pipeline.hasher import compute_cache_key
from app.modules.quantities.calculator import EarthworkCalculator
from app.modules.terrain.service import TerrainService
from app.schemas.alignment import HorizontalAlignmentPackage
from app.schemas.cross_section import CrossSectionPackage
from app.schemas.manifest import PipelineRunRequest, StageRecord, StageRunStatus
from app.schemas.profile import LongitudinalProfilePackage
from app.schemas.quantities import EarthworkQuantitiesPackage

# Global in-memory artifact cache across pipeline runs
_PIPELINE_CACHE: Dict[str, Any] = {}


def clear_pipeline_cache() -> None:
    """Utility to reset pipeline cache during testing."""
    _PIPELINE_CACHE.clear()


class PipelineOrchestrator:
    """
    Executes the road design DAG with selective stage invalidation.
    Computes deterministic SHA-256 cache keys for every stage; if inputs, rules,
    or upstream geometries have not changed, intermediate stages are reused instantly.
    """

    @classmethod
    def run_pipeline(
        cls,
        survey_file_id: str,
        survey_sha256: str,
        cleaned_points: np.ndarray,
        request: PipelineRunRequest,
        force_recompute: bool = False
    ) -> Tuple[
        Dict[str, StageRecord],
        HorizontalAlignmentPackage,
        LongitudinalProfilePackage,
        CrossSectionPackage,
        EarthworkQuantitiesPackage,
        float
    ]:
        overall_start_time = time.perf_counter()
        rules = get_engineering_rules()
        stage_records: Dict[str, StageRecord] = {}

        # =========================================================================
        # 1. TERRAIN MODEL STAGE
        # =========================================================================
        t_start = time.perf_counter()
        terrain_cache_key = compute_cache_key(
            stage_name="terrain",
            payload={"survey_hash": survey_sha256, "code_version": __version__}
        )

        if not force_recompute and terrain_cache_key in _PIPELINE_CACHE:
            surface_data, interpolator = _PIPELINE_CACHE[terrain_cache_key]
            t_status = StageRunStatus.CACHED
            t_duration = 0.0
        else:
            surface_data, interpolator = TerrainService.build_terrain_model(
                survey_file_id=survey_file_id,
                survey_sha256=survey_sha256,
                cleaned_points=cleaned_points,
                force_recompute=force_recompute
            )
            _PIPELINE_CACHE[terrain_cache_key] = (surface_data, interpolator)
            t_status = StageRunStatus.EXECUTED
            t_duration = round(time.perf_counter() - t_start, 4)

        stage_records["terrain"] = StageRecord(
            stage_name="terrain",
            status=t_status,
            duration_sec=t_duration,
            cache_key=terrain_cache_key
        )

        # =========================================================================
        # 2. HORIZONTAL ALIGNMENT STAGE (M2)
        # =========================================================================
        a_start = time.perf_counter()
        alignment_cache_key = compute_cache_key(
            stage_name="alignment",
            payload={
                "terrain_key": terrain_cache_key,
                "start_point": request.start_point,
                "end_point": request.end_point,
                "intermediate_pis": request.intermediate_pis,
                "station_interval": request.station_interval_m,
                "rules": rules.horizontal_alignment,
                "code_version": __version__
            }
        )

        if not force_recompute and alignment_cache_key in _PIPELINE_CACHE:
            alignment_pkg = _PIPELINE_CACHE[alignment_cache_key]
            a_status = StageRunStatus.CACHED
            a_duration = 0.0
        else:
            alignment_pkg = HorizontalAlignmentGenerator.generate(
                start_xy=request.start_point,
                end_xy=request.end_point,
                terrain=interpolator,
                intermediate_pis=request.intermediate_pis,
                station_interval_m=request.station_interval_m
            )
            _PIPELINE_CACHE[alignment_cache_key] = alignment_pkg
            a_status = StageRunStatus.EXECUTED
            a_duration = round(time.perf_counter() - a_start, 4)

        stage_records["alignment"] = StageRecord(
            stage_name="alignment",
            status=a_status,
            duration_sec=a_duration,
            cache_key=alignment_cache_key
        )

        # =========================================================================
        # 3. LONGITUDINAL PROFILE STAGE (M3)
        # =========================================================================
        p_start = time.perf_counter()
        profile_cache_key = compute_cache_key(
            stage_name="profile",
            payload={
                "alignment_key": alignment_cache_key,
                "target_offset": request.target_elevation_offset_m,
                "rules": rules.vertical_alignment,
                "code_version": __version__
            }
        )

        if not force_recompute and profile_cache_key in _PIPELINE_CACHE:
            profile_pkg = _PIPELINE_CACHE[profile_cache_key]
            p_status = StageRunStatus.CACHED
            p_duration = 0.0
        else:
            profile_pkg = LongitudinalProfileGenerator.generate(
                alignment=alignment_pkg,
                target_offset_m=request.target_elevation_offset_m
            )
            _PIPELINE_CACHE[profile_cache_key] = profile_pkg
            p_status = StageRunStatus.EXECUTED
            p_duration = round(time.perf_counter() - p_start, 4)

        stage_records["profile"] = StageRecord(
            stage_name="profile",
            status=p_status,
            duration_sec=p_duration,
            cache_key=profile_cache_key
        )

        # =========================================================================
        # 4. CROSS-SECTIONS STAGE (M4)
        # =========================================================================
        cs_start = time.perf_counter()
        sections_cache_key = compute_cache_key(
            stage_name="cross_sections",
            payload={
                "alignment_key": alignment_cache_key,
                "profile_key": profile_cache_key,
                "rules": rules.cross_section,
                "code_version": __version__
            }
        )

        if not force_recompute and sections_cache_key in _PIPELINE_CACHE:
            sections_pkg = _PIPELINE_CACHE[sections_cache_key]
            cs_status = StageRunStatus.CACHED
            cs_duration = 0.0
        else:
            sections_pkg = CrossSectionGenerator.generate(
                alignment=alignment_pkg,
                profile=profile_pkg,
                terrain=interpolator
            )
            _PIPELINE_CACHE[sections_cache_key] = sections_pkg
            cs_status = StageRunStatus.EXECUTED
            cs_duration = round(time.perf_counter() - cs_start, 4)

        stage_records["cross_sections"] = StageRecord(
            stage_name="cross_sections",
            status=cs_status,
            duration_sec=cs_duration,
            cache_key=sections_cache_key
        )

        # =========================================================================
        # 5. EARTHWORK QUANTITIES STAGE (M5)
        # =========================================================================
        q_start = time.perf_counter()
        quantities_cache_key = compute_cache_key(
            stage_name="quantities",
            payload={
                "sections_key": sections_cache_key,
                "rules": rules.earthwork_factors,
                "code_version": __version__
            }
        )

        if not force_recompute and quantities_cache_key in _PIPELINE_CACHE:
            quantities_pkg = _PIPELINE_CACHE[quantities_cache_key]
            q_status = StageRunStatus.CACHED
            q_duration = 0.0
        else:
            quantities_pkg = EarthworkCalculator.calculate_volumes(
                cross_sections=sections_pkg
            )
            _PIPELINE_CACHE[quantities_cache_key] = quantities_pkg
            q_status = StageRunStatus.EXECUTED
            q_duration = round(time.perf_counter() - q_start, 4)

        stage_records["quantities"] = StageRecord(
            stage_name="quantities",
            status=q_status,
            duration_sec=q_duration,
            cache_key=quantities_cache_key
        )

        total_pipeline_duration = round(time.perf_counter() - overall_start_time, 4)
        return (
            stage_records,
            alignment_pkg,
            profile_pkg,
            sections_pkg,
            quantities_pkg,
            total_pipeline_duration
        )
