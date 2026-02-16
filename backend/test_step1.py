"""Run this to verify Step 1 is complete."""
import sys

# Test 1: Config loads
try:
    from app.core.config import settings
    assert settings.DATABASE_URL, "DATABASE_URL is empty"
    assert settings.JWT_SECRET, "JWT_SECRET is empty"
    print(f"✅ Config loaded: DB={settings.DATABASE_URL.split('@')[-1] if '@' in settings.DATABASE_URL else settings.DATABASE_URL}")
except Exception as e:
    print(f"❌ Config failed: {e}")
    sys.exit(1)

# Test 2: Logger works
try:
    from app.core.logging_config import logger
    logger.info("Test log message")
    print("✅ Logger works")
except Exception as e:
    print(f"❌ Logger failed: {e}")
    sys.exit(1)

# Test 3: Database connects
try:
    from app.db.database import engine
    with engine.connect() as conn:
        conn.execute(
            __import__('sqlalchemy').text("SELECT 1")
        )
    print("✅ Database connection successful")
except Exception as e:
    print(f"❌ Database connection failed: {e}")
    print("   → Make sure PostgreSQL is running or switch to SQLite in .env")
    sys.exit(1)

# Test 4: Session dependency works
try:
    from app.db.session import get_db
    gen = get_db()
    db = next(gen)
    assert db is not None
    gen.close()
    print("✅ Session dependency works")
except Exception as e:
    print(f"❌ Session failed: {e}")
    sys.exit(1)

print("\n🎉 STEP 1 COMPLETE — All configuration verified")
