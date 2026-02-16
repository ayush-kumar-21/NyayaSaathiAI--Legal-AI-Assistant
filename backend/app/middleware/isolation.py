"""
Data Isolation Middleware
Implements row-level security for multi-tenant justice system
Ensures users only access data they're authorized to see
"""
from fastapi import Request, HTTPException, Depends
from sqlalchemy.orm import Session, Query
from sqlalchemy import and_
from typing import Optional, Type, Any
from functools import wraps

from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import UserRole
from app.dependencies import get_current_user


class DataIsolationError(Exception):
    """Raised when data access is denied"""
    pass


class QueryFilter:
    """
    Applies role-based filters to database queries
    Implements row-level security
    """
    
    def __init__(self, user: User):
        self.user = user
    
    def filter_firs(self, query: Query) -> Query:
        """
        Filter FIR (First Information Report) queries by user role
        
        - Citizens: Only see FIRs they filed
        - Police: See FIRs assigned to them or their station
        - Judges: See FIRs linked to their cases
        - Admins: See all FIRs (with audit logging)
        """
        if self.user.role == UserRole.CITIZEN:
            # Citizens only see their own FIRs
            return query.filter_by(complainant_id=self.user.id)
        
        elif self.user.role == UserRole.POLICE:
            # Police see FIRs assigned to them
            # TODO: Add station-based filtering when station_id is available
            return query.filter_by(assigned_officer_id=self.user.id)
        
        elif self.user.role == UserRole.JUDGE:
            # Judges see FIRs linked to cases in their court
            # This requires joining with cases table
            return query.filter(
                # FIRs linked to active cases in judge's court
                # Placeholder - actual implementation depends on case model
                True  # Allow all, filtered further in endpoint
            )
        
        elif self.user.role == UserRole.ADMIN:
            # Admins see all, but we should log this access
            return query
        
        # Default: deny all
        return query.filter(False)
    
    def filter_judgments(self, query: Query) -> Query:
        """
        Filter Judgment queries by user role
        
        - Citizens: See judgments on their cases
        - Police: See judgments on cases they investigated
        - Judges: See judgments they authored
        - Admins: See all
        """
        if self.user.role == UserRole.CITIZEN:
            # Citizens see judgments on their cases
            return query.join("case").filter_by(petitioner_id=self.user.id)
        
        elif self.user.role == UserRole.POLICE:
            return query.join("case").filter_by(investigating_officer_id=self.user.id)
        
        elif self.user.role == UserRole.JUDGE:
            return query.filter_by(presiding_judge_id=self.user.id)
        
        elif self.user.role == UserRole.ADMIN:
            return query
        
        return query.filter(False)
    
    def filter_evidence(self, query: Query) -> Query:
        """
        Filter Evidence queries by user role
        
        - Citizens: See evidence on their cases
        - Police: Manage evidence for their cases
        - Judges: View evidence for cases before them
        """
        if self.user.role == UserRole.CITIZEN:
            return query.join("case").filter_by(petitioner_id=self.user.id)
        
        elif self.user.role == UserRole.POLICE:
            return query.join("case").filter_by(investigating_officer_id=self.user.id)
        
        elif self.user.role == UserRole.JUDGE:
            return query.join("case").filter_by(presiding_judge_id=self.user.id)
        
        elif self.user.role == UserRole.ADMIN:
            return query
        
        return query.filter(False)
    
    def filter_witnesses(self, query: Query) -> Query:
        """Filter witness data access"""
        if self.user.role == UserRole.CITIZEN:
            # Citizens shouldn't see witness details
            raise DataIsolationError("Citizens cannot access witness information")
        
        elif self.user.role == UserRole.POLICE:
            return query.join("case").filter_by(investigating_officer_id=self.user.id)
        
        elif self.user.role == UserRole.JUDGE:
            return query.join("case").filter_by(presiding_judge_id=self.user.id)
        
        elif self.user.role == UserRole.ADMIN:
            return query
        
        return query.filter(False)
    
    def filter_cases(self, query: Query) -> Query:
        """
        Filter Case queries by user role
        Central table for most operations
        """
        if self.user.role == UserRole.CITIZEN:
            # Citizens see cases where they're petitioner or respondent
            return query.filter(
                (query.complainant_id == self.user.id) |
                (query.respondent_id == self.user.id)
            )
        
        elif self.user.role == UserRole.POLICE:
            return query.filter_by(investigating_officer_id=self.user.id)
        
        elif self.user.role == UserRole.JUDGE:
            return query.filter_by(presiding_judge_id=self.user.id)
        
        elif self.user.role == UserRole.ADMIN:
            return query
        
        return query.filter(False)
    
    def filter_audit_logs(self, query: Query) -> Query:
        """
        Audit logs have special restrictions:
        - Users can only see their own audit trail
        - Admins can see all audit logs
        """
        if self.user.role == UserRole.ADMIN:
            return query
        
        # Regular users only see their own actions
        return query.filter_by(user_id=self.user.id)
    
    def can_access_resource(self, resource_owner_id: int) -> bool:
        """
        Check if current user can access a specific resource
        
        Args:
            resource_owner_id: The user_id that owns the resource
            
        Returns:
            True if access is allowed
        """
        # Owner always has access
        if self.user.id == resource_owner_id:
            return True
        
        # Admins have access to everything (but are audited)
        if self.user.role == UserRole.ADMIN:
            return True
        
        # Police can access resources related to their investigations
        if self.user.role == UserRole.POLICE:
            # Additional checks based on investigation assignment
            return True  # Simplified - actual check depends on case linkage
        
        # Judges can access resources for cases before them
        if self.user.role == UserRole.JUDGE:
            return True  # Simplified - actual check depends on case assignment
        
        return False


def get_isolated_query(user: User = Depends(get_current_user)) -> QueryFilter:
    """
    Dependency to get query filter for data isolation
    
    Usage:
        @app.get("/firs")
        async def list_firs(
            db: Session = Depends(get_db),
            isolated: QueryFilter = Depends(get_isolated_query)
        ):
            query = db.query(FIR)
            filtered = isolated.filter_firs(query)
            return filtered.all()
    """
    return QueryFilter(user)


def require_ownership(resource_owner_field: str = "user_id"):
    """
    Decorator factory to require resource ownership
    
    Usage:
        @app.get("/firs/{fir_id}")
        @require_ownership("complainant_id")
        async def get_fir(fir_id: int, ...):
            pass
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Extract current user from kwargs
            current_user = kwargs.get('current_user')
            if not current_user:
                raise HTTPException(
                    status_code=403,
                    detail="Authentication required"
                )
            
            # Get resource from database
            db = kwargs.get('db')
            resource_id = kwargs.get('fir_id') or kwargs.get('resource_id')
            
            # This is a placeholder - actual implementation
            # would look up the resource and check ownership
            
            return await func(*args, **kwargs)
        return wrapper
    return decorator


class DataIsolationMiddleware:
    """
    FastAPI middleware to enforce data isolation
    Can be applied globally or to specific routes
    """
    
    def __init__(self, app):
        self.app = app
    
    async def __call__(self, scope, receive, send):
        # Process request through data isolation checks
        # This is a simplified version - full implementation
        # would inspect the path and apply appropriate filters
        await self.app(scope, receive, send)


def apply_isolation(
    model_class: Type,
    user: User,
    db: Session
) -> Query:
    """
    Apply appropriate isolation filter based on model type
    
    Args:
        model_class: The SQLAlchemy model class
        user: Current user
        db: Database session
        
    Returns:
        Filtered query
    """
    from app.models.audit import AuditLog
    # Import other models as needed
    
    query = db.query(model_class)
    isolation = QueryFilter(user)
    
    # Map models to their filter methods
    model_filters = {
        # 'FIR': isolation.filter_firs,
        # 'Judgment': isolation.filter_judgments,
        # 'Evidence': isolation.filter_evidence,
        # 'Witness': isolation.filter_witnesses,
        # 'Case': isolation.filter_cases,
        AuditLog: isolation.filter_audit_logs,
    }
    
    filter_method = model_filters.get(model_class)
    if filter_method:
        return filter_method(query)
    
    # No specific filter - apply default (deny all for safety)
    return query.filter(False)
