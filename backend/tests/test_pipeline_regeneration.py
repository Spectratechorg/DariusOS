from pathlib import Path
import pytest
import numpy as np

from app import __version__
from app.modules.intake.service import IntakeService
from app.modules.pipeline.orchestrator import clear_pipeline_cache
from app.modules.pipeline.service import PipelineService
from app.models.user import User
from app.models.project import Project
from app.models.pipeline_run import PipelineRun
from app.schemas.manifest import PipelineRunRequest, StageRunStatus

from tests.synthetic_data.terrain_generators import (
    generate_flat_plane_points,
    points_to_csv_bytes
)


@pytest.fixture
def project_setup(db_session):
    clear_pipeline_cache()

    user = User(
        email="lead@dariusos.test",
        full_name="Chief Highway Engineer",
        hashed_password="pw",
        role="engineer"
    )
    db_session.add(user)
    db_session.commit()

    project = Project(
        name="Reproducible Road 101",
        description="Testing smart regeneration and cache invalidation",
        created_by_user_id=user.id
    )
    db_session.add(project)
    db_session.commit()

    pts = generate_flat_plane_points(length_x=100.0, width_y=40.0, spacing=2.0, z_elevation=100.0)
    csv_bytes = points_to_csv_bytes(pts)

    survey_rec, _ = IntakeService.process_file_upload(
        db=db_session,
        project_id=project.id,
        user_id=user.id,
        filename="corridor_survey.csv",
        raw_bytes=csv_bytes
    )

    return project, user, survey_rec


def test_full_pipeline_initial_run(db_session, project_setup):
    """
    Verifies that on first execution, all pipeline stages run with status EXECUTED.
    """
    project, user, survey_rec = project_setup

    req = PipelineRunRequest(
        project_id=project.id,
        survey_file_id=survey_rec.id,
        start_point=(0.0, 0.0),
        end_point=(100.0, 0.0),
        station_interval_m=20.0,
        target_elevation_offset_m=-2.0
    )

    res, align, prof, cs, quant = PipelineService.execute_run(
        db=db_session,
        request=req,
        user_id=user.id
    )

    assert res.status == "COMPLETED"
    assert res.summary.total_length_m == pytest.approx(100.0, abs=0.1)
    assert res.summary.total_cut_volume_m3 > 2000.0
    assert res.summary.total_fill_volume_m3 == pytest.approx(0.0, abs=1e-2)

    # First run: every stage executed
    for stage_name, stage_rec in res.stages.items():
        assert stage_rec.status == StageRunStatus.EXECUTED, f"Stage {stage_name} should be EXECUTED"


def test_identical_rerun_all_stages_cached(db_session, project_setup):
    """
    Verifies that re-running with identical inputs reuses all stage artifacts with status CACHED.
    """
    project, user, survey_rec = project_setup

    req = PipelineRunRequest(
        project_id=project.id,
        survey_file_id=survey_rec.id,
        start_point=(0.0, 0.0),
        end_point=(100.0, 0.0),
        station_interval_m=20.0,
        target_elevation_offset_m=-2.0
    )

    # Run 1
    res1, _, _, _, _ = PipelineService.execute_run(db=db_session, request=req, user_id=user.id)
    # Run 2 (identical)
    res2, _, _, _, _ = PipelineService.execute_run(db=db_session, request=req, user_id=user.id)

    # Run 2 should be completely CACHED
    for stage_name, stage_rec in res2.stages.items():
        assert stage_rec.status == StageRunStatus.CACHED, f"Stage {stage_name} should be CACHED"
        assert stage_rec.duration_sec == 0.0


def test_selective_regeneration_on_route_change(db_session, project_setup):
    """
    Verifies that changing route coordinates reuses the terrain model from cache,
    re-running only downstream alignment, profile, cross-sections, and quantities.
    """
    project, user, survey_rec = project_setup

    req1 = PipelineRunRequest(
        project_id=project.id,
        survey_file_id=survey_rec.id,
        start_point=(0.0, 0.0),
        end_point=(100.0, 0.0),
        station_interval_m=20.0
    )
    res1, _, _, _, _ = PipelineService.execute_run(db=db_session, request=req1, user_id=user.id)

    # Change route endpoint: from (100, 0) to (90, 5)
    req2 = PipelineRunRequest(
        project_id=project.id,
        survey_file_id=survey_rec.id,
        start_point=(0.0, 0.0),
        end_point=(90.0, 5.0),
        station_interval_m=20.0
    )
    res2, _, _, _, _ = PipelineService.execute_run(db=db_session, request=req2, user_id=user.id)

    # Terrain is CACHED
    assert res2.stages["terrain"].status == StageRunStatus.CACHED
    # Downstream stages are EXECUTED
    assert res2.stages["alignment"].status == StageRunStatus.EXECUTED
    assert res2.stages["profile"].status == StageRunStatus.EXECUTED
    assert res2.stages["cross_sections"].status == StageRunStatus.EXECUTED
    assert res2.stages["quantities"].status == StageRunStatus.EXECUTED


def test_selective_regeneration_on_vertical_offset_change(db_session, project_setup):
    """
    Verifies that changing target elevation offset reuses both terrain and horizontal alignment,
    re-running only profile, cross-sections, and quantities.
    """
    project, user, survey_rec = project_setup

    req1 = PipelineRunRequest(
        project_id=project.id,
        survey_file_id=survey_rec.id,
        start_point=(0.0, 0.0),
        end_point=(100.0, 0.0),
        target_elevation_offset_m=0.0
    )
    res1, _, _, _, _ = PipelineService.execute_run(db=db_session, request=req1, user_id=user.id)

    # Change target offset to -1.5m
    req2 = PipelineRunRequest(
        project_id=project.id,
        survey_file_id=survey_rec.id,
        start_point=(0.0, 0.0),
        end_point=(100.0, 0.0),
        target_elevation_offset_m=-1.5
    )
    res2, _, _, _, _ = PipelineService.execute_run(db=db_session, request=req2, user_id=user.id)

    assert res2.stages["terrain"].status == StageRunStatus.CACHED
    assert res2.stages["alignment"].status == StageRunStatus.CACHED
    assert res2.stages["profile"].status == StageRunStatus.EXECUTED
    assert res2.stages["cross_sections"].status == StageRunStatus.EXECUTED
    assert res2.stages["quantities"].status == StageRunStatus.EXECUTED


def test_pipeline_database_persistence_and_reproducibility(db_session, project_setup):
    """
    Verifies that every pipeline execution records all input hashes, rules snapshots,
    code versions, and stage manifests in the database for reproducible auditing.
    """
    project, user, survey_rec = project_setup

    req = PipelineRunRequest(
        project_id=project.id,
        survey_file_id=survey_rec.id,
        start_point=(0.0, 0.0),
        end_point=(100.0, 0.0)
    )
    res, _, _, _, _ = PipelineService.execute_run(db=db_session, request=req, user_id=user.id)

    db_run = db_session.query(PipelineRun).filter_by(id=res.run_id).first()
    assert db_run is not None
    assert db_run.survey_file_hash == survey_rec.sha256_hash
    assert len(db_run.engineering_rules_hash) == 64
    assert db_run.code_version == __version__
    assert db_run.status == "COMPLETED"
    assert "terrain" in db_run.stage_manifest
    assert "ENGINEERING_STATUS" in db_run.rules_snapshot
    assert db_run.total_road_length_m == pytest.approx(100.0, abs=0.1)
