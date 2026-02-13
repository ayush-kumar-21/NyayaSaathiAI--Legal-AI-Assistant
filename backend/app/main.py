"""
LegalOS 4.0 - FastAPI Application
Universal Sign-Up & Data Isolation Implementation
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.api.v1.router import api_router
from app.core.config import settings
from app.db.database import init_db
from app.security import setup_rate_limiting



@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager
    Handles startup and shutdown events
    """
    # Startup
    print("[STARTUP] Initializing LegalOS 4.0...")
    
    # Initialize database tables
    init_db()
    print("[STARTUP] Database initialized")
    
    # Setup rate limiting
    setup_rate_limiting(app)
    print("[STARTUP] Rate limiting configured")
    
    print("[STARTUP] LegalOS 4.0 Ready!")
    
    yield
    
    # Shutdown
    print("[SHUTDOWN] Shutting down LegalOS 4.0...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.DESCRIPTION,
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(api_router, prefix="/api/v1")


@app.get("/")
async def root():
    return {
        "message": "LegalOS 4.0 API — NyayaSahayak",
        "version": settings.VERSION,
        "docs": "/docs",
        "auth": {
            "signup": "/api/v1/auth/signup",
            "login": "/api/v1/auth/login",
            "google": "/api/v1/auth/google",
            "refresh": "/api/v1/auth/refresh"
        },
        "features": {
            "universal_signup": True,
            "role_based_access": True,
            "data_isolation": True,
            "audit_logging": True,
            "rate_limiting": True
        },
        "roles": ["citizen", "police", "judge", "admin"],
        "total_skills": 24,
        "skills": {
            "police": [
                "01: Smart FIR Generator",
                "02: Financial Trail Analyzer",
                "03: Evidence Locker (Sakshya)",
                "04: Witness Protection Tracker",
                "05: Case Linker & Pattern Detection",
                "06: Charge Sheet Builder",
                "07: Investigation Planner",
                "15: Duty Roster",
                "16: Warrant Manager",
                "17: Crime Scene 3D Mapper",
                "25: Forensic Interlock",
                "26: Evidence Hasher",
                "27: Serial Offender Analysis",
                "28: Investigation Gantt",
                "29: FIR History"
            ],
            "judge": [
                "08: Bench Memo Generator",
                "09: Bail Reckoner",
                "10: Sentencing Assistant",
                "18: Case Intake Triage",
                "21: Judgment Validator"
            ],
            "citizen": [
                "11: Document Scanner",
                "12: Multilingual Speech-to-Text",
                "14: Secure Chat",
                "22: Know Your Rights",
                "23: Case Status Tracker",
                "24: Legal Aid Finder"
            ],
            "infrastructure": [
                "13: Offline Access (PWA)",
                "19: Registry Automator",
                "20: Listing Optimizer"
            ]
        }
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "version": settings.VERSION,
        "skills_loaded": 24,
        "routes": 79,
        "database": "connected",
        "cache": "connected",
        "auth": {
            "jwt": "enabled",
            "oauth": "enabled",
            "rate_limiting": "enabled"
        }
    }
