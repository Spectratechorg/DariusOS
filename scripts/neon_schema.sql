-- DariusOS Neon PostgreSQL Database Schema
-- Compatible with Neon Serverless Postgres (PostgreSQL 15+)
-- Run directly in Neon Console SQL Editor or via scripts/migrate_to_neon.py

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'engineer',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_by_user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_projects_user ON projects(created_by_user_id);

-- 3. Survey Files Table
CREATE TABLE IF NOT EXISTS survey_files (
    id VARCHAR(36) PRIMARY KEY,
    project_id VARCHAR(36) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    original_filename VARCHAR(255) NOT NULL,
    file_format VARCHAR(20) NOT NULL,
    sha256_hash VARCHAR(64) NOT NULL,
    file_size_bytes INTEGER NOT NULL,
    storage_path VARCHAR(500) NOT NULL,
    point_count INTEGER,
    bounds_min_x DOUBLE PRECISION,
    bounds_max_x DOUBLE PRECISION,
    bounds_min_y DOUBLE PRECISION,
    bounds_max_y DOUBLE PRECISION,
    bounds_min_z DOUBLE PRECISION,
    bounds_max_z DOUBLE PRECISION,
    density_pts_m2 DOUBLE PRECISION,
    crs_epsg INTEGER,
    quality_report JSONB,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    rejection_reason VARCHAR(500),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    uploaded_by_user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_survey_files_project_id ON survey_files(project_id);
CREATE INDEX IF NOT EXISTS idx_survey_files_sha256 ON survey_files(sha256_hash);

-- 4. Pipeline Runs Table
CREATE TABLE IF NOT EXISTS pipeline_runs (
    id VARCHAR(36) PRIMARY KEY,
    project_id VARCHAR(36) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    survey_file_id VARCHAR(36) NOT NULL REFERENCES survey_files(id) ON DELETE CASCADE,
    survey_file_hash VARCHAR(64) NOT NULL,
    engineering_rules_hash VARCHAR(64) NOT NULL,
    code_version VARCHAR(50) NOT NULL,
    route_parameters JSONB NOT NULL,
    rules_snapshot JSONB NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    error_message TEXT,
    execution_duration_sec DOUBLE PRECISION,
    stage_manifest JSONB,
    total_road_length_m DOUBLE PRECISION,
    total_cut_volume_m3 DOUBLE PRECISION,
    total_fill_volume_m3 DOUBLE PRECISION,
    net_volume_m3 DOUBLE PRECISION,
    total_estimated_cost DOUBLE PRECISION,
    beme_excel_path VARCHAR(500),
    pilot_pdf_path VARCHAR(500),
    results_payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    triggered_by_user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_pipeline_runs_project_id ON pipeline_runs(project_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_runs_hash ON pipeline_runs(survey_file_hash);

-- 5. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(36) NOT NULL,
    action VARCHAR(50) NOT NULL,
    performed_by_user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    details JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
