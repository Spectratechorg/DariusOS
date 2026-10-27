import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class SurveyFile(Base):
    __tablename__ = "survey_files"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False)
    original_filename = Column(String(255), nullable=False)
    file_format = Column(String(20), nullable=False)  # CSV, XYZ, LAS, LAZ
    sha256_hash = Column(String(64), nullable=False, index=True)
    file_size_bytes = Column(Integer, nullable=False)
    storage_path = Column(String(500), nullable=False)
    
    # Metadata extracted by Intake (M1)
    point_count = Column(Integer, nullable=True)
    bounds_min_x = Column(Float, nullable=True)
    bounds_max_x = Column(Float, nullable=True)
    bounds_min_y = Column(Float, nullable=True)
    bounds_max_y = Column(Float, nullable=True)
    bounds_min_z = Column(Float, nullable=True)
    bounds_max_z = Column(Float, nullable=True)
    density_pts_m2 = Column(Float, nullable=True)
    crs_epsg = Column(Integer, nullable=True)
    
    # Validation & Quality Report
    quality_report = Column(JSON, nullable=True)
    status = Column(String(50), nullable=False, default="PENDING")  # PENDING, VALIDATED, REJECTED
    rejection_reason = Column(String(500), nullable=True)
    
    uploaded_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    uploaded_by_user_id = Column(String(36), ForeignKey("users.id"), nullable=False)

    project = relationship("Project", back_populates="survey_files")
