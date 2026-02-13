"""
Security package initialization
"""
from app.security.hashing import (
    verify_password,
    get_password_hash,
    generate_secure_token,
    generate_verification_code
)
from app.security.tokens import (
    create_access_token,
    create_refresh_token,
    verify_token,
    get_token_hash,
    decode_token_without_verification
)

# Optional rate limiting (slowapi may not be installed)
try:
    from app.security.rate_limit import limiter, setup_rate_limiting, RateLimits
    RATE_LIMIT_AVAILABLE = True
except ImportError:
    RATE_LIMIT_AVAILABLE = False
    # Create dummy objects
    class DummyLimiter:
        def limit(self, *args, **kwargs):
            def decorator(func):
                return func
            return decorator
    
    class DummyRateLimits:
        LOGIN = ["5/minute"]
        SIGNUP = ["3/minute"]
        PASSWORD_RESET = ["3/hour"]
        TOKEN_REFRESH = ["10/minute"]
        READ = ["100/minute"]
        WRITE = ["30/minute"]
        DELETE = ["10/minute"]
        ADMIN = ["50/minute"]
        EXPORT = ["5/minute"]
    
    limiter = DummyLimiter()
    RateLimits = DummyRateLimits()
    
    def setup_rate_limiting(app):
        pass

__all__ = [
    # Hashing
    "verify_password",
    "get_password_hash",
    "generate_secure_token",
    "generate_verification_code",
    # Tokens
    "create_access_token",
    "create_refresh_token",
    "verify_token",
    "get_token_hash",
    "decode_token_without_verification",
    # Rate limiting
    "limiter",
    "setup_rate_limiting",
    "RateLimits",
]
