"""
Password hashing utilities using bcrypt
Secure password storage with salt rounds
"""
from passlib.context import CryptContext
import secrets
import string

# Configure bcrypt with secure settings
# rounds=12 provides good balance between security and performance
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=12
)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against a hash
    
    Args:
        plain_password: The password entered by user
        hashed_password: The stored hash from database
        
    Returns:
        True if password matches, False otherwise
    """
    if not plain_password or not hashed_password:
        return False
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """
    Hash a password using bcrypt
    
    Args:
        password: Plain text password
        
    Returns:
        Hashed password string
    """
    return pwd_context.hash(password)


def generate_secure_token(length: int = 32) -> str:
    """
    Generate a cryptographically secure random token
    
    Args:
        length: Length of the token (default 32)
        
    Returns:
        Secure random token string
    """
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))


def generate_verification_code(length: int = 8) -> str:
    """
    Generate a human-readable verification code
    Uses uppercase letters and numbers, excludes ambiguous characters
    
    Args:
        length: Length of the code (default 8)
        
    Returns:
        Verification code string
    """
    # Exclude ambiguous characters: 0, O, 1, I, L
    alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
    return ''.join(secrets.choice(alphabet) for _ in range(length))
