import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, DateTime, JSON, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base


class PipelineRun(Base):
    __tablename__ = "pipeline_runs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False)
    survey_file_id = Column(String(36), ForeignKey("survey_files.id"), nullable=False)
    
    # Audit & Reproducibility Hashes
    survey_file_hash = Column(String(64), nullable=False, index=True)
    engineering_rules_hash = Column(String(64), nullable=False)
    code_version = Column(String(50), nullable=False)
    
    # Run Parameters (route start/end, interval, etc.)
    route_parameters = Column(JSON, nullable=False)
    rules_snapshot = Column(JSON, nullable=False)
    
    # Status and Stage Tracking
    status = Column(String(50), nullable=False, default="PENDING")  # PENDING, RUNNING, COMPLETED, FAILED
    error_message = Column(Text, nullable=True)
    execution_duration_sec = Column(Float, nullable=True)
    stage_manifest = Column(JSON, nullable=True)
    
    # Summary Results
    total_road_length_m = Column(Float, nullable=True)
    total_cut_volume_m3 = Column(Float, nullable=True)
    total_fill_volume_m3 = Column(Float, nullable=True)
    net_volume_m3 = Column(Float, nullable=True)
    total_estimated_cost = Column(Float, nullable=True)
    
    # Output Artifact Links
    beme_excel_path = Column(String(500), nullable=True)
    pilot_pdf_path = Column(String(500), nullable=True)
    results_payload = Column(JSON, nullable=True)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    completed_at = Column(DateTime, nullable=True)
    triggered_by_user_id = Column(String(36), ForeignKey("users.id"), nullable=False)

    project = relationship("Project", back_populates="pipeline_runs")
