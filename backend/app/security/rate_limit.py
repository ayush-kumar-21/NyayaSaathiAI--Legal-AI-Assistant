"""
Rate limiting configuration using SlowAPI
Prevents brute force attacks and abuse
"""
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Request, FastAPI
from starlette.responses import JSONResponse

# Create limiter instance
# Uses client IP address as the rate limiting key
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["100/minute"]  # Global default: 100 requests per minute
)


def setup_rate_limiting(app: FastAPI):
    """
    Configure rate limiting for the FastAPI application
    
    Args:
        app: FastAPI application instance
    """
    # Add limiter to app state
    app.state.limiter = limiter
    
    # Add exception handler for rate limit exceeded
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
    
    # Custom handler for better error messages
    @app.exception_handler(RateLimitExceeded)
    async def custom_rate_limit_handler(request: Request, exc: RateLimitExceeded):
        return JSONResponse(
            status_code=429,
            content={
                "error": "Rate limit exceeded",
                "message": "Too many requests. Please try again later.",
                "retry_after": 60
            }
        )


# Predefined rate limits for different endpoints
class RateLimits:
    """
    Rate limit presets for common endpoint types
    """
    # Authentication endpoints - strict limits
    LOGIN = ["5/minute"]  # Prevent brute force
    SIGNUP = ["3/minute"]  # Prevent spam accounts
    PASSWORD_RESET = ["3/hour"]  # Prevent abuse
    TOKEN_REFRESH = ["10/minute"]
    
    # General API usage
    READ = ["100/minute"]
    WRITE = ["30/minute"]
    DELETE = ["10/minute"]
    
    # Sensitive operations
    ADMIN = ["50/minute"]
    EXPORT = ["5/minute"]  # Data export limits
