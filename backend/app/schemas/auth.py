"""
Pydantic schemas for authentication and user management
"""
from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime
from enum import Enum


class UserRole(str, Enum):
    """User roles matching the database enum"""
    CITIZEN = "citizen"
    POLICE = "police"
    JUDGE = "judge"
    ADMIN = "admin"


class UserStatus(str, Enum):
    """User status matching the database enum"""
    ACTIVE = "active"
    INACTIVE = "inactive"
    LOCKED = "locked"
    SUSPENDED = "suspended"


# ==================== REQUEST SCHEMAS ====================

class UserSignupRequest(BaseModel):
    """
    Schema for user registration
    """
    email: str = Field(..., description="User email address")
    password: str = Field(..., min_length=8, max_length=100, description="Password (min 8 chars)")
    full_name: str = Field(..., min_length=2, max_length=255, description="Full name")
    phone_number: Optional[str] = Field(None, max_length=20, description="Phone number")
    role: UserRole = Field(default=UserRole.CITIZEN, description="User role")
    
    # Role-specific fields (optional, validated server-side)
    badge_number: Optional[str] = Field(None, description="Police badge number")
    station_id: Optional[str] = Field(None, description="Police station ID")
    court_id: Optional[str] = Field(None, description="Court ID for judges")
    verification_code: Optional[str] = Field(None, description="Code for police/judge verification")
    
    @validator('password')
    def validate_password_strength(cls, v):
        """Ensure password meets complexity requirements"""
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        return v
    
    @validator('role')
    def validate_official_role(cls, v, values):
        """Police and Judge roles require verification"""
        if v in [UserRole.POLICE, UserRole.JUDGE]:
            if not values.get('verification_code'):
                raise ValueError(f'{v.value} role requires a verification code')
        return v


class UserLoginRequest(BaseModel):
    """
    Schema for user login
    """
    email: str = Field(..., description="User email")
    password: str = Field(..., description="User password")


class GoogleLoginRequest(BaseModel):
    """
    Schema for Google OAuth login
    """
    token: str = Field(..., description="Google ID token from frontend")
    role: Optional[UserRole] = Field(default=UserRole.CITIZEN, description="Requested role (default: citizen)")


class TokenRefreshRequest(BaseModel):
    """
    Schema for refreshing access token
    """
    refresh_token: str = Field(..., description="Valid refresh token")


class PasswordResetRequest(BaseModel):
    """
    Schema for requesting password reset
    """
    email: str = Field(..., description="Account email")


class PasswordResetConfirm(BaseModel):
    """
    Schema for confirming password reset
    """
    token: str = Field(..., description="Reset token from email")
    new_password: str = Field(..., min_length=8, max_length=100, description="New password")


class ChangePasswordRequest(BaseModel):
    """
    Schema for changing password (authenticated user)
    """
    current_password: str = Field(..., description="Current password")
    new_password: str = Field(..., min_length=8, max_length=100, description="New password")


# ==================== RESPONSE SCHEMAS ====================

class TokenResponse(BaseModel):
    """
    Token response after successful authentication
    """
    access_token: str = Field(..., description="JWT access token")
    refresh_token: str = Field(..., description="JWT refresh token")
    token_type: str = Field(default="bearer", description="Token type")
    expires_in: int = Field(..., description="Access token expiry in seconds")
    
    class Config:
        from_attributes = True


class UserProfileResponse(BaseModel):
    """
    User profile data (safe to return to client)
    """
    id: int
    email: str
    full_name: str
    phone_number: Optional[str]
    role: UserRole
    status: UserStatus
    email_verified: bool
    google_profile_picture: Optional[str]
    last_login_at: Optional[datetime]
    created_at: datetime
    
    class Config:
        from_attributes = True


class AuthResponse(BaseModel):
    """
    Complete authentication response with tokens and user data
    """
    tokens: TokenResponse
    user: UserProfileResponse
    
    class Config:
        from_attributes = True


# ==================== ROLE-SPECIFIC SCHEMAS ====================

class PoliceProfileSchema(BaseModel):
    """Police officer profile data"""
    badge_number: str
    station_id: str
    rank: str
    department: str
    jurisdiction: str
    is_verified: bool
    
    class Config:
        from_attributes = True


class JudgeProfileSchema(BaseModel):
    """Judge profile data"""
    court_id: str
    court_name: str
    designation: str
    jurisdiction_level: str
    is_verified: bool
    
    class Config:
        from_attributes = True


class AdminProfileSchema(BaseModel):
    """Admin profile data"""
    admin_level: str
    department: Optional[str]
    can_verify_officials: bool
    
    class Config:
        from_attributes = True


class FullUserResponse(UserProfileResponse):
    """
    Extended user response with role-specific profiles
    """
    police_profile: Optional[PoliceProfileSchema] = None
    judge_profile: Optional[JudgeProfileSchema] = None
    admin_profile: Optional[AdminProfileSchema] = None


# ==================== AUDIT SCHEMAS ====================

class AuditLogResponse(BaseModel):
    """Audit log entry response"""
    id: int
    user_id: Optional[int]
    user_email: Optional[str]
    action: str
    resource_type: str
    resource_id: Optional[str]
    description: Optional[str]
    success: bool
    created_at: datetime
    ip_address: Optional[str]
    
    class Config:
        from_attributes = True


# ==================== ADMIN SCHEMAS ====================

class CreateVerificationCodeRequest(BaseModel):
    """Admin request to create verification code for officials"""
    email: str
    role: UserRole = Field(..., description="Must be police or judge")
    badge_number: Optional[str] = None
    station_id: Optional[str] = None
    court_id: Optional[str] = None
    expires_hours: int = Field(default=48, ge=1, le=168)
    
    @validator('role')
    def must_be_official_role(cls, v):
        if v not in [UserRole.POLICE, UserRole.JUDGE]:
            raise ValueError('Verification codes are only for police and judge roles')
        return v


class VerificationCodeResponse(BaseModel):
    """Response after creating verification code"""
    code: str
    email: str
    role: UserRole
    expires_at: datetime
    
    class Config:
        from_attributes = True


class UserListResponse(BaseModel):
    """Paginated user list response"""
    items: List[UserProfileResponse]
    total: int
    page: int
    page_size: int
    
    class Config:
        from_attributes = True
