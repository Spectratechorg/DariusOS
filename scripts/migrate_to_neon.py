#!/usr/bin/env python3
"""
DariusOS Neon PostgreSQL Migration & Connection Tool
Usage:
    python scripts/migrate_to_neon.py --url "postgresql://[user]:[pwd]@[host].neon.tech/[db]?sslmode=require"
    OR set NEON_DATABASE_URL or DATABASE_URL in .env and run:
    python scripts/migrate_to_neon.py
"""

import os
import sys
import time
import argparse
from pathlib import Path

# Add backend directory to sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR / "backend"))

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.core.database import Base
from app.models.user import User
from app.models.project import Project
from app.models.survey_file import SurveyFile
from app.models.pipeline_run import PipelineRun
from app.models.audit_log import AuditLog
from app.core.security import get_password_hash


def normalize_neon_url(raw_url: str) -> str:
    url = raw_url.strip()
    if url.startswith("postgres://"):
        url = "postgresql+psycopg2://" + url[len("postgres://"):]
    elif url.startswith("postgresql://") and not url.startswith("postgresql+psycopg2://"):
        url = "postgresql+psycopg2://" + url[len("postgresql://"):]

    if "neon.tech" in url and "sslmode" not in url:
        sep = "&" if "?" in url else "?"
        url = f"{url}{sep}sslmode=require"
    return url


def run_migration(neon_url: str, update_env_file: bool = True):
    print("=" * 70)
    print("DariusOS Neon PostgreSQL Migration Engine")
    print("=" * 70)

    clean_url = normalize_neon_url(neon_url)
    masked_url = clean_url
    if "@" in clean_url:
        creds, host = clean_url.split("@", 1)
        prefix = creds.split("//", 1)[0]
        masked_url = f"{prefix}//***:***@{host}"

    print(f"[*] Target Endpoint: {masked_url}")
    print("[*] Verifying SSL & connection parameters...")

    # Create engine for Neon
    start_t = time.time()
    try:
        engine = create_engine(
            clean_url,
            connect_args={"sslmode": "require"},
            pool_pre_ping=True,
            pool_recycle=300
        )
        with engine.connect() as conn:
            res = conn.execute(text("SELECT version(), current_database()")).fetchone()
            latency = round((time.time() - start_t) * 1000, 2)
            print(f"[✓] Connected successfully! ({latency}ms latency)")
            print(f"    Database: {res[1]}")
            print(f"    Version:  {res[0][:50]}...")
    except Exception as e:
        print(f"[!] Connection failed: {e}")
        return False

    # Run DDL migrations
    print("\n[*] Applying database schema (tables, indexes, foreign keys)...")
    try:
        Base.metadata.create_all(bind=engine)
        print("[✓] Schema creation verified for models:")
        for t in Base.metadata.sorted_tables:
            print(f"    - Table '{t.name}' (columns: {len(t.columns)})")
    except Exception as e:
        print(f"[!] Schema creation failed: {e}")
        return False

    # Seed Default Registered Civil Engineer & Verification Project
    print("\n[*] Verifying data seed & permissions...")
    Session = sessionmaker(bind=engine)
    session = Session()
    try:
        engineer_email = "lead.engineer@spectra.ng"
        user = session.query(User).filter(User.email == engineer_email).first()
        if not user:
            user = User(
                id="dev-engineer-001",
                email=engineer_email,
                full_name="Lead Civil Engineer (Spectra Tech)",
                hashed_password=get_password_hash("NeonEngineer2026!"),
                role="engineer",
                is_active=True
            )
            session.add(user)
            session.commit()
            session.refresh(user)
            print(f"[✓] Created default civil engineer user: {user.email}")
        else:
            print(f"[i] Registered engineer user exists: {user.email}")

        # Check projects
        proj_count = session.query(Project).count()
        print(f"[i] Active projects in Neon database: {proj_count}")
    except Exception as e:
        session.rollback()
        print(f"[!] Data verification failed: {e}")
        return False
    finally:
        session.close()

    # Update .env if requested
    if update_env_file:
        env_path = BASE_DIR / ".env"
        print(f"\n[*] Updating local configuration at {env_path}...")
        lines = []
        if env_path.is_file():
            lines = env_path.read_text(encoding="utf-8").splitlines()

        updated_keys = set()
        new_lines = []
        for line in lines:
            if line.startswith("DATABASE_URL=") or line.startswith("NEON_DATABASE_URL="):
                continue
            new_lines.append(line)

        new_lines.append(f'DATABASE_URL="{clean_url}"')
        new_lines.append(f'NEON_DATABASE_URL="{clean_url}"')
        env_path.write_text("\n".join(new_lines) + "\n", encoding="utf-8")
        print("[✓] Updated .env with NEON_DATABASE_URL and DATABASE_URL")

    print("\n" + "=" * 70)
    print("MIGRATION COMPLETE: DariusOS Backend is fully configured for Neon!")
    print("=" * 70)
    return True


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Migrate DariusOS to Neon PostgreSQL")
    parser.add_argument("--url", help="Neon PostgreSQL connection string (postgresql://...)")
    parser.add_argument("--no-env", action="store_true", help="Do not write to .env file")
    args = parser.parse_args()

    neon_url = args.url or os.environ.get("NEON_DATABASE_URL") or os.environ.get("DATABASE_URL")
    if not neon_url:
        env_path = BASE_DIR / ".env"
        if env_path.is_file():
            for line in env_path.read_text(encoding="utf-8").splitlines():
                if line.startswith("NEON_DATABASE_URL=") or line.startswith("DATABASE_URL="):
                    val = line.split("=", 1)[1].strip().strip('"').strip("'")
                    if "neon.tech" in val or "postgres" in val:
                        neon_url = val
                        break

    if not neon_url:
        print("[!] No Neon connection URL provided.")
        print("    Pass via CLI: python scripts/migrate_to_neon.py --url \"postgresql://...\"")
        print("    Or set NEON_DATABASE_URL in .env")
        sys.exit(1)

    success = run_migration(neon_url, update_env_file=not args.no_env)
    sys.exit(0 if success else 1)
