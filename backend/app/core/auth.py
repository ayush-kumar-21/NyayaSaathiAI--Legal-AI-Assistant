from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from typing import Optional

from app.core.config import settings
from app.core.exceptions import UnauthorizedAccess
from app.db.session import get_db
from app.models import User, UserRole

security = HTTPBearer(auto_error=False)


def create_access_token(user_id: str, role: str) -> str:
    """Create JWT access token."""
    expire = datetime.utcnow() + timedelta(minutes=settings.JWT_EXPIRY_MINUTES)
    payload = {
        "sub": user_id,
        "role": role,
        "exp": expire,
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db),
) -> Optional[User]:
    """Extract and validate current user from JWT token."""
    if credentials is None:
        return None

    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM]
        )
        print(f"DEBUG: Decoded payload: {payload}")
        # Try to get ID from 'id' claim, fallback to 'sub' if it looks like a UUID
        user_id: str = payload.get("id")
        if not user_id:
             user_id = payload.get("sub")

        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    return user


def require_role(*roles: UserRole):
    """Dependency factory that checks user has required role."""
    async def role_checker(
        user: Optional[User] = Depends(get_current_user),
    ) -> User:
        if user is None:
            raise HTTPException(status_code=401, detail="Authentication required")
        if user.role not in roles:
            raise UnauthorizedAccess(user.role.value)
        return user
    return role_checker


# Convenience dependencies
require_citizen = require_role(UserRole.CITIZEN)
require_police = require_role(UserRole.POLICE)
require_judge = require_role(UserRole.JUDGE)
require_admin = require_role(UserRole.ADMIN)
require_any_auth = require_role(UserRole.CITIZEN, UserRole.POLICE, UserRole.JUDGE, UserRole.ADMIN)
