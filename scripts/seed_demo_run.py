import os
import sys
from pathlib import Path

# Add backend directory to sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR / "backend"))

from app.core.database import Base, engine, SessionLocal
from app.core.security import get_password_hash
from app.models.project import Project
from app.models.survey_file import SurveyFile
from app.models.pipeline_run import PipelineRun
from app.models.user import User
from app.modules.intake.service import IntakeService
from app.modules.pipeline.service import PipelineService
from app.schemas.manifest import PipelineRunRequest


def seed_demo_run():
    print("=" * 70)
    print("DariusOS Demo Project & Pipeline Seeder")
    print("=" * 70)

    # 1. Initialize tables
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 2. Get or create engineer user
        user_email = "lead.engineer@spectra.ng"
        user = db.query(User).filter(User.email == user_email).first()
        if not user:
            user = User(
                id="dev-engineer-001",
                email=user_email,
                full_name="Lead Civil Engineer (Spectra Tech)",
                hashed_password=get_password_hash("DevPassword123!"),
                role="engineer",
                is_active=True
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            print(f"[+] Created user: {user.full_name} ({user.email})")
        else:
            print(f"[i] Using existing user: {user.full_name} ({user.email})")

        # 3. Create or find demo project
        proj_name = "Lifidi - Piapung Road Corridor (19.50km)"
        project = db.query(Project).filter(Project.name == proj_name).first()
        if not project:
            project = Project(
                id="proj-lifidi-001",
                name=proj_name,
                description="Pilot rural access and arterial corridor design under Mastodon Engineering Services agreement.",
                created_by_user_id=user.id
            )
            db.add(project)
            db.commit()
            db.refresh(project)
            print(f"[+] Created project: {project.name} (ID: {project.id})")
        else:
            print(f"[i] Using existing project: {project.name} (ID: {project.id})")

        # 4. Ingest fake_data/slope.csv
        fake_csv_path = BASE_DIR / "fake_data" / "slope.csv"
        if not fake_csv_path.is_file():
            raise FileNotFoundError(f"Missing synthetic survey file at {fake_csv_path}")

        raw_bytes = fake_csv_path.read_bytes()
        print(f"[+] Read {len(raw_bytes)} bytes from {fake_csv_path.name}")

        # Check existing survey files; clean up if 0 points
        bad_surveys = db.query(SurveyFile).filter(
            SurveyFile.project_id == project.id,
            SurveyFile.point_count == 0
        ).all()
        for b_surv in bad_surveys:
            db.delete(b_surv)
        db.commit()

        survey_record = db.query(SurveyFile).filter(
            SurveyFile.project_id == project.id,
            SurveyFile.original_filename == "slope.csv",
            SurveyFile.point_count > 0
        ).first()

        if not survey_record:
            survey_record, _ = IntakeService.process_file_upload(
                db=db,
                project_id=project.id,
                user_id=user.id,
                filename="slope.csv",
                raw_bytes=raw_bytes,
                crs_epsg=32632
            )
            print(f"[+] Processed survey upload: {survey_record.original_filename} (Points: {survey_record.point_count}, Hash: {survey_record.sha256_hash[:16]}...)")
        else:
            print(f"[i] Valid survey file already registered: {survey_record.id} (Points: {survey_record.point_count})")

        # 5. Check if pipeline run already executed
        existing_run = db.query(PipelineRun).filter(
            PipelineRun.project_id == project.id,
            PipelineRun.survey_file_id == survey_record.id,
            PipelineRun.status == "COMPLETED"
        ).first()

        if not existing_run:
            print("[*] Executing road engineering pipeline DAG (M1-M5)...")
            run_request = PipelineRunRequest(
                project_id=project.id,
                survey_file_id=survey_record.id,
                start_point=(100000.0, 200000.0),
                end_point=(100200.0, 200000.0),
                target_elevation_offset_m=0.0,
                station_interval_m=20.0,
                force_recompute=True
            )
            (
                run_response,
                alignment_pkg,
                profile_pkg,
                sections_pkg,
                quantities_pkg
            ) = PipelineService.execute_run(
                db=db,
                request=run_request,
                user_id=user.id
            )
            print(f"[+] Pipeline executed successfully! Run ID: {run_response.run_id}")
            print(f"    Total length: {run_response.summary.total_length_m} m")
            print(f"    Total cut:    {run_response.summary.total_cut_volume_m3} m3")
            print(f"    Total fill:   {run_response.summary.total_fill_volume_m3} m3")
            print(f"    Net balance:  {run_response.summary.net_volume_m3} m3 ({run_response.summary.balance_status})")
            run_id = run_response.run_id
        else:
            print(f"[i] Completed pipeline run already exists: {existing_run.id}")
            run_id = existing_run.id

        print("\n" + "=" * 70)
        print("SEEDING COMPLETED SUCCESSFULLY!")
        print(f"Project ID: {project.id}")
        print(f"Run ID:     {run_id}")
        print("=" * 70)

    finally:
        db.close()


if __name__ == "__main__":
    seed_demo_run()
