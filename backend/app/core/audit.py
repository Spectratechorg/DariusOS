import logging
from typing import Any, Dict, Optional
from sqlalchemy.orm import Session
from app.models.audit_log import AuditLog

logger = logging.getLogger("dariusos.audit")


def record_audit_event(
    db: Session,
    action: str,
    user_id: Optional[str] = None,
    resource_type: Optional[str] = None,
    resource_id: Optional[str] = None,
    details: Optional[Dict[str, Any]] = None,
    ip_address: Optional[str] = None
) -> AuditLog:
    """
    Persists an immutable audit log entry for security, tracking, and compliance.
    """
    log_entry = AuditLog(
        action=action,
        user_id=user_id,
        resource_type=resource_type,
        resource_id=resource_id,
        details=details or {},
        ip_address=ip_address
    )
    db.add(log_entry)
    db.commit()
    db.refresh(log_entry)
    logger.info("AUDIT: action=%s user=%s resource=%s/%s", action, user_id, resource_type, resource_id)
    return log_entry
