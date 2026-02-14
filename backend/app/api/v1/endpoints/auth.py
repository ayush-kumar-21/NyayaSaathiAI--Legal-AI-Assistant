
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session
from app.db.database import get_db, engine, Base
from app.models.user import User
from app.core.security import verify_password, get_password_hash, create_access_token
from google.oauth2 import id_token
from google.auth.transport import requests
from app.core.config import settings
from email_validator import validate_email, EmailNotValidError

# Create tables if not exist (Simple migration)
Base.metadata.create_all(bind=engine)

router = APIRouter()

class UserCreate(BaseModel):
    email: str
    password: str
    role: str
    full_name: str
    # Optional fields
    station_id: Optional[str] = None
    court_id: Optional[str] = None
    department: Optional[str] = None
    badge_number: Optional[str] = None
    date_of_birth: Optional[str] = None

class LoginRequest(BaseModel):
    email: str
    password: str

class GoogleLoginRequest(BaseModel):
    token: str

class AuthResponse(BaseModel):
    access_token: str
    token_type: str
    user_name: str
    user_email: str
    user_role: str
    avatar: Optional[str] = None

@router.post("/signup", response_model=AuthResponse)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    try:
        # Validate email with DNS check
        valid = validate_email(user.email, check_deliverability=True)
        user.email = valid.email # Update with normalized form
    except EmailNotValidError as e:
        raise HTTPException(status_code=400, detail=str(e))

    print(f"DEBUG: Signup attempt for {user.email}")
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = User(
        email=user.email,
        hashed_password=hashed_password,
        role=user.role,
        full_name=user.full_name,
        station_id=user.station_id,
        court_id=user.court_id,
        department=user.department,
        badge_number=user.badge_number,
        date_of_birth=user.date_of_birth,
        avatar=f"https://api.dicebear.com/7.x/avataaars/svg?seed={user.full_name}"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token = create_access_token(data={"sub": new_user.email, "role": new_user.role, "id": new_user.id})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_name": new_user.full_name,
        "user_email": new_user.email,
        "user_role": new_user.role,
        "avatar": new_user.avatar
    }

@router.post("/login", response_model=AuthResponse)
def login(creds: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == creds.email).first()
    if not user:
        # Fallback for demo users (admin/citizen/police/judge) if not in DB
        demo_passwords = ["password", "demo", "admin", "judge", "police", "citizen"]
        if creds.password.lower() in demo_passwords:
             # Detect role from email domain
             demo_role = "CITIZEN"
             demo_name = "Demo User"
             if "@police" in creds.email:
                 demo_role = "POLICE"
                 demo_name = "Demo Police Officer"
             elif "@highcourt" in creds.email or "@judge" in creds.email:
                 demo_role = "JUDGE"
                 demo_name = "Demo Judge"
             elif "@admin" in creds.email:
                 demo_role = "ADMIN"
                 demo_name = "Demo Administrator"
             else:
                 demo_role = "CITIZEN"
                 demo_name = "Demo Citizen"

             access_token = create_access_token(data={"sub": creds.email, "role": demo_role, "id": "demo"})
             return {
                "access_token": access_token,
                "token_type": "bearer",
                "user_name": demo_name,
                "user_email": creds.email,
                "user_role": demo_role,
                "avatar": f"https://api.dicebear.com/7.x/avataaars/svg?seed={demo_name}"
            }
        raise HTTPException(status_code=400, detail="Incorrect email or password")
        
    if not verify_password(creds.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
        
    access_token = create_access_token(data={"sub": user.email, "role": user.role, "id": user.id})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_name": user.full_name,
        "user_email": user.email,
        "user_role": user.role,
        "avatar": user.avatar
    }

@router.post("/google", response_model=AuthResponse)
def google_login(payload: GoogleLoginRequest, db: Session = Depends(get_db)):
    try:
        # Determine audience for verification
        client_id = settings.GOOGLE_CLIENT_ID
        target_audience = client_id if client_id and client_id != "your-google-client-id" else None
        
        print(f"DEBUG: Google login attempt. Client ID configured: {target_audience is not None}")
        print(f"DEBUG: Received token (first 20 chars): {payload.token[:20]}...")
        
        email = None
        name = "Google User"
        picture = ""

        try:
            # Try to verify with Google servers
            idinfo = id_token.verify_oauth2_token(
                payload.token, 
                requests.Request(), 
                target_audience
            )
            email = idinfo['email']
            name = idinfo.get('name', 'Google User')
            picture = idinfo.get('picture', "")
            print(f"DEBUG: Google token verified for: {email}")
        except Exception as verify_error:
            print(f"DEBUG: Token verification failed: {verify_error}")
            
            # Fallback: decode the JWT payload without verification (for dev/demo)
            # Google ID tokens are JWTs - we can decode the payload
            import json, base64
            try:
                parts = payload.token.split('.')
                if len(parts) != 3:
                    print(f"DEBUG: Invalid token format. Parts: {len(parts)}")
                    raise HTTPException(status_code=401, detail=f"Invalid token format. Expected 3 parts, got {len(parts)}")
                
                # Decode the payload (second part)
                padded = parts[1] + '=' * (4 - len(parts[1]) % 4)
                decoded = base64.urlsafe_b64decode(padded)
                idinfo = json.loads(decoded)
                
                email = idinfo.get('email', '')
                name = idinfo.get('name', 'Google User')
                picture = idinfo.get('picture', '')
                
                if not email:
                    print("DEBUG: Email not found in token payload")
                    raise HTTPException(status_code=401, detail="Could not extract email from Google token")
                    
                print(f"DEBUG: Extracted from token payload: {email} (unverified fallback)")
            except Exception as decode_error:
                print(f"DEBUG: Token decoding failed: {decode_error}")
                raise HTTPException(status_code=400, detail=f"Token decoding failed: {str(decode_error)}")

        if not email:
             raise HTTPException(status_code=400, detail="Email extraction failed")

        # Find or create user
        user = db.query(User).filter(User.email == email).first()
        if not user:
            # Auto-signup as CITIZEN
            try:
                user = User(
                    email=email,
                    hashed_password=get_password_hash("google_auth"),
                    role="CITIZEN",
                    full_name=name,
                    avatar=picture or f"https://api.dicebear.com/7.x/avataaars/svg?seed={name}"
                )
                db.add(user)
                db.commit()
                db.refresh(user)
                print(f"DEBUG: Created new user: {email}")
            except Exception as db_error:
                print(f"DEBUG: Database error creating user: {db_error}")
                db.rollback()
                raise HTTPException(status_code=500, detail=f"Database error: {str(db_error)}")
        else:
            print(f"DEBUG: Found existing user: {email}")
        
        access_token = create_access_token(data={"sub": user.email, "role": user.role, "id": user.id})
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user_name": user.full_name,
            "user_email": user.email,
            "user_role": user.role,
            "avatar": user.avatar
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"DEBUG: Google Auth Unexpected Error: {type(e).__name__}: {e}")
        # Return specific error for debugging
        raise HTTPException(status_code=400, detail=f"Google Auth Failed: {type(e).__name__}: {str(e)}")
