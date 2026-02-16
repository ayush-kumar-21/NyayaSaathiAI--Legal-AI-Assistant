"""
Database engine and session configuration.
Supports both PostgreSQL (production) and SQLite (development).
"""
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings
from app.core.logging_config import logger


def _get_engine_args():
    """Get engine arguments based on database type."""
    if settings.is_sqlite:
        return {
            "connect_args": {"check_same_thread": False},
            "echo": settings.ENVIRONMENT == "development",
        }
    return {
        "pool_size": 10,
        "max_overflow": 20,
        "pool_pre_ping": True,  # Verify connections before use
        "echo": False,
    }


engine = create_engine(
    settings.DATABASE_URL,
    **_get_engine_args()
)

# Enable WAL mode for SQLite (better concurrency)
if settings.is_sqlite:
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_conn, connection_record):
        cursor = dbapi_conn.cursor()
        cursor.execute("PRAGMA journal_mode=WAL")
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

logger.info(f"Database engine created: {settings.DATABASE_URL.split('@')[-1] if '@' in settings.DATABASE_URL else 'sqlite'}")


def create_all_tables():
    """Create all tables. Use for development/hackathon.
    In production, use Alembic migrations instead."""
    from app.models import Base  # Import here to avoid circular
    Base.metadata.create_all(bind=engine)
    logger.info("All database tables created successfully")


def drop_all_tables():
    """Drop all tables. DANGEROUS - development only."""
    from app.models import Base
    Base.metadata.drop_all(bind=engine)
    logger.info("All database tables dropped")
