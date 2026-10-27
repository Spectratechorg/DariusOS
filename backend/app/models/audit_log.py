import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, JSON
from app.core.database import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    action = Column(String(100), nullable=False, index=True)
    user_id = Column(String(36), nullable=True, index=True)
    resource_type = Column(String(50), nullable=True)
    resource_id = Column(String(36), nullable=True)
    details = Column(JSON, nullable=False, default=dict)
    ip_address = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False, index=True)
