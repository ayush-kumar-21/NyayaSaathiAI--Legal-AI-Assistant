"""
Audit logging service and API endpoints
Provides comprehensive audit trail for justice system compliance
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional
from datetime import datetime, timedelta

from app.db.session import get_db
from app.models.audit import AuditLog, DataAccessLog, AuditAction, ResourceType
from app.models.user import User
from app.schemas.auth import AuditLogResponse
from app.dependencies import get_current_user, require_admin
from app.middleware.isolation import QueryFilter

router = APIRouter()


def log_action(
    db: Session,
    action: AuditAction,
    user: Optional[User],
    resource_type: ResourceType,
    resource_id: Optional[str],
    description: Optional[str] = None,
    old_values: Optional[dict] = None,
    new_values: Optional[dict] = None,
    success: bool = True,
    error_message: Optional[str] = None,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None,
    request_path: Optional[str] = None,
    request_method: Optional[str] = None
) -> AuditLog:
    """
    Log an action to the audit trail
    
    This is the primary function for creating audit log entries
    """
    audit_entry = AuditLog(
        user_id=user.id if user else None,
        user_email=user.email if user else None,
        user_role=user.role.value if user else None,
        action=action.value,
        resource_type=resource_type.value,
        resource_id=resource_id,
        description=description,
        old_values=old_values,
        new_values=new_values,
        success=success,
        error_message=error_message,
        ip_address=ip_address,
        user_agent=user_agent,
        request_path=request_path,
        request_method=request_method
    )
    db.add(audit_entry)
    db.commit()
    return audit_entry


def log_data_access(
    db: Session,
    user: User,
    resource_type: ResourceType,
    resource_id: str,
    access_granted: bool,
    access_type: str = "read",
    denial_reason: Optional[str] = None,
    records_accessed: int = 1,
    ip_address: Optional[str] = None
) -> DataAccessLog:
    """
    Log data access attempts for row-level security monitoring
    """
    access_log = DataAccessLog(
        user_id=user.id,
        resource_type=resource_type.value,
        resource_id=resource_id,
        access_type=access_type,
        access_granted=access_granted,
        denial_reason=denial_reason,
        records_accessed=records_accessed,
        ip_address=ip_address
    )
    db.add(access_log)
    db.commit()
    return access_log


# ==================== API ENDPOINTS ====================

@router.get("/logs", response_model=List[AuditLogResponse])
async def get_audit_logs(
    action: Optional[str] = Query(None, description="Filter by action type"),
    resource_type: Optional[str] = Query(None, description="Filter by resource type"),
    user_id: Optional[int] = Query(None, description="Filter by user ID"),
    start_date: Optional[datetime] = Query(None, description="Start date filter"),
    end_date: Optional[datetime] = Query(None, description="End date filter"),
    success: Optional[bool] = Query(None, description="Filter by success status"),
    limit: int = Query(50, ge=1, le=1000, description="Number of results"),
    offset: int = Query(0, ge=0, description="Pagination offset"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """
    Get audit logs with filtering
    
    **Admin only** - Requires admin role
    
    Returns comprehensive audit trail with filtering options
    """
    query = db.query(AuditLog)
    
    # Apply filters
    if action:
        query = query.filter(AuditLog.action == action)
    if resource_type:
        query = query.filter(AuditLog.resource_type == resource_type)
    if user_id:
        query = query.filter(AuditLog.user_id == user_id)
    if start_date:
        query = query.filter(AuditLog.created_at >= start_date)
    if end_date:
        query = query.filter(AuditLog.created_at <= end_date)
    if success is not None:
        query = query.filter(AuditLog.success == success)
    
    # Order by newest first
    query = query.order_by(desc(AuditLog.created_at))
    
    # Pagination
    total = query.count()
    logs = query.offset(offset).limit(limit).all()
    
    # Log this access
    log_action(
        db=db,
        action=AuditAction.VIEW,
        user=current_user,
        resource_type=ResourceType.AUDIT_LOG,
        resource_id=None,
        description=f"Viewed audit logs with filters: action={action}, resource={resource_type}",
        ip_address=None  # Will be filled by middleware
    )
    
    return logs


@router.get("/my-logs", response_model=List[AuditLogResponse])
async def get_my_audit_logs(
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get current user's audit trail
    
    Users can only view their own audit logs
    """
    isolation = QueryFilter(current_user)
    query = isolation.filter_audit_logs(db.query(AuditLog))
    
    query = query.order_by(desc(AuditLog.created_at))
    logs = query.offset(offset).limit(limit).all()
    
    return logs


@router.get("/stats")
async def get_audit_stats(
    days: int = Query(7, ge=1, le=365, description="Number of days to analyze"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """
    Get audit statistics
    
    **Admin only** - Provides security analytics
    """
    start_date = datetime.utcnow() - timedelta(days=days)
    
    # Total actions
    total_actions = db.query(AuditLog).filter(AuditLog.created_at >= start_date).count()
    
    # Failed logins
    failed_logins = db.query(AuditLog).filter(
        AuditLog.action == AuditAction.LOGIN_FAILED.value,
        AuditLog.created_at >= start_date
    ).count()
    
    # Successful logins
    successful_logins = db.query(AuditLog).filter(
        AuditLog.action == AuditAction.LOGIN.value,
        AuditLog.created_at >= start_date
    ).count()
    
    # Account locks
    account_locks = db.query(AuditLog).filter(
        AuditLog.action == AuditAction.ACCOUNT_LOCKED.value,
        AuditLog.created_at >= start_date
    ).count()
    
    # Actions by type
    actions_by_type = db.query(
        AuditLog.action,
        db.func.count(AuditLog.id).label('count')
    ).filter(
        AuditLog.created_at >= start_date
    ).group_by(AuditLog.action).all()
    
    # Top users by activity
    top_users = db.query(
        AuditLog.user_email,
        db.func.count(AuditLog.id).label('activity_count')
    ).filter(
        AuditLog.created_at >= start_date,
        AuditLog.user_email.isnot(None)
    ).group_by(AuditLog.user_email).order_by(desc('activity_count')).limit(10).all()
    
    return {
        "period_days": days,
        "total_actions": total_actions,
        "failed_logins": failed_logins,
        "successful_logins": successful_logins,
        "account_locks": account_locks,
        "actions_by_type": [{"action": a, "count": c} for a, c in actions_by_type],
        "top_users": [{"email": e, "activity": c} for e, c in top_users]
    }


@router.get("/security-alerts")
async def get_security_alerts(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """
    Get current security alerts
    
    **Admin only** - Identifies potential security issues
    """
    alerts = []
    
    # Check for multiple failed logins from same IP
    recent_failures = db.query(
        AuditLog.ip_address,
        db.func.count(AuditLog.id).label('failure_count')
    ).filter(
        AuditLog.action == AuditAction.LOGIN_FAILED.value,
        AuditLog.created_at >= datetime.utcnow() - timedelta(hours=1)
    ).group_by(AuditLog.ip_address).having(db.func.count(AuditLog.id) >= 5).all()
    
    for ip, count in recent_failures:
        alerts.append({
            "severity": "high",
            "type": "brute_force_attempt",
            "message": f"Multiple failed logins from IP: {ip}",
            "count": count,
            "ip_address": ip,
            "timestamp": datetime.utcnow().isoformat()
        })
    
    # Check for locked accounts in last 24 hours
    recent_locks = db.query(AuditLog).filter(
        AuditLog.action == AuditAction.ACCOUNT_LOCKED.value,
        AuditLog.created_at >= datetime.utcnow() - timedelta(hours=24)
    ).all()
    
    for lock in recent_locks:
        alerts.append({
            "severity": "medium",
            "type": "account_locked",
            "message": f"Account locked: {lock.user_email}",
            "user_email": lock.user_email,
            "timestamp": lock.created_at.isoformat()
        })
    
    # Check for admin access to sensitive data
    admin_access = db.query(AuditLog).filter(
        AuditLog.user_role == "admin",
        AuditLog.resource_type.in_(["user", "audit_log"]),
        AuditLog.created_at >= datetime.utcnow() - timedelta(hours=1)
    ).count()
    
    if admin_access > 10:
        alerts.append({
            "severity": "low",
            "type": "elevated_admin_activity",
            "message": f"High admin activity detected ({admin_access} actions in last hour)",
            "count": admin_access,
            "timestamp": datetime.utcnow().isoformat()
        })
    
    return {
        "alert_count": len(alerts),
        "alerts": sorted(alerts, key=lambda x: x["severity"], reverse=True)
    }
