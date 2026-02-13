"""
JWT token management
Access tokens and refresh tokens with secure configuration
"""
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import JWTError, jwt
from app.core.config import settings
import hashlib


def create_access_token(
    data: Dict[str, Any],
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Create a JWT access token
    
    Args:
        data: Payload data to encode (must include 'sub' for user identifier)
        expires_delta: Custom expiration time (default: settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        
    Returns:
        Encoded JWT token string
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({
        "exp": expire,
        "iat": datetime.utcnow(),
        "type": "access"
    })
    
    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
    return encoded_jwt


def create_refresh_token(
    user_id: int,
    device_info: Optional[str] = None
) -> tuple[str, str]:
    """
    Create a JWT refresh token and its hash for storage
    
    Args:
        user_id: User ID to encode
        device_info: Optional device/user agent info
        
    Returns:
        Tuple of (refresh_token, token_hash)
    """
    expires = datetime.utcnow() + timedelta(days=7)  # 7 days for refresh
    
    to_encode = {
        "sub": str(user_id),
        "exp": expires,
        "iat": datetime.utcnow(),
        "type": "refresh",
        "device_info": device_info
    }
    
    token = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
    
    # Create hash for database storage (never store full tokens)
    token_hash = hashlib.sha256(token.encode()).hexdigest()
    
    return token, token_hash


def verify_token(token: str, token_type: str = "access") -> Optional[Dict[str, Any]]:
    """
    Verify and decode a JWT token
    
    Args:
        token: JWT token string
        token_type: Expected token type ("access" or "refresh")
        
    Returns:
        Decoded token payload or None if invalid
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        
        # Check token type
        if payload.get("type") != token_type:
            return None
            
        return payload
        
    except JWTError:
        return None


def get_token_hash(token: str) -> str:
    """
    Generate SHA-256 hash of a token for storage
    
    Args:
        token: Token string to hash
        
    Returns:
        SHA-256 hash
    """
    return hashlib.sha256(token.encode()).hexdigest()


def decode_token_without_verification(token: str) -> Optional[Dict[str, Any]]:
    """
    Decode token without signature verification
    USE WITH CAUTION - Only for extracting user info from expired tokens
    
    Args:
        token: JWT token string
        
    Returns:
        Decoded payload (without verification)
    """
    try:
        return jwt.get_unverified_claims(token)
    except JWTError:
        return None
