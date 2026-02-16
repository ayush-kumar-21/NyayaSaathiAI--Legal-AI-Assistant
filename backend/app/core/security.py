

from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)


from datetime import datetime, timedelta
from typing import Optional, Union, Dict, Any
import json
import hmac
import hashlib
import base64
from app.core.config import settings

def _urlsafe_b64encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode('utf-8').rstrip('=')

def _urlsafe_b64decode(data: str) -> bytes:
    padding = '=' * (4 - (len(data) % 4))
    return base64.urlsafe_b64decode(data + padding)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    
    to_encode.update({"exp": expire.timestamp()})
    
    # Header
    header = {"alg": "HS256", "typ": "JWT"}
    header_json = json.dumps(header, separators=(',', ':')).encode('utf-8')
    header_b64 = _urlsafe_b64encode(header_json)
    
    # Payload
    payload_json = json.dumps(to_encode, separators=(',', ':')).encode('utf-8')
    payload_b64 = _urlsafe_b64encode(payload_json)
    
    # Signature
    signing_input = f"{header_b64}.{payload_b64}".encode('utf-8')
    signature = hmac.new(
        settings.JWT_SECRET.encode('utf-8'),
        signing_input,
        hashlib.sha256
    ).digest()
    signature_b64 = _urlsafe_b64encode(signature)
    
    return f"{header_b64}.{payload_b64}.{signature_b64}"

def verify_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        parts = token.split('.')
        if len(parts) != 3:
            return None
            
        header_b64, payload_b64, signature_b64 = parts
        
        # Verify Signature
        signing_input = f"{header_b64}.{payload_b64}".encode('utf-8')
        expected_signature = hmac.new(
            settings.JWT_SECRET.encode('utf-8'),
            signing_input,
            hashlib.sha256
        ).digest()
        
        if not hmac.compare_digest(_urlsafe_b64encode(expected_signature), signature_b64):
            return None
            
        # Decode and check expiry
        payload_json = _urlsafe_b64decode(payload_b64).decode('utf-8')
        payload = json.loads(payload_json)
        
        if "exp" in payload:
            exp = datetime.fromtimestamp(payload["exp"])
            if exp < datetime.utcnow():
                return None
                
        return payload
    except Exception as e:
        print(f"Token verification error: {e}")
        return None


# Dependency to get current user from token
def get_current_user(token: str = None):
    """
    Get current user from JWT token.
    In production, this would validate against the database.
    """
    if token is None:
        return None
    
    payload = verify_token(token)
    if payload is None:
        return None
    
    return payload


def get_current_admin_user(token: str = None):
    """
    Get current admin user - validates token and checks admin role.
    """
    user = get_current_user(token)
    if user is None:
        return None
    
    # Check if user has admin role
    role = user.get("role", "").upper()
    if role not in ["ADMIN", "admin"]:
        return None
    
    return user
