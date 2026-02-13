from app.db.database import SessionLocal
from app.db.database import SessionLocal, Base, engine
# Import all models to ensure mappers are initialized
from app.models.user import User
from app.models.audit import AuditLog
# Add other models if needed, or just ensure Base is fully loaded

db = SessionLocal()
try:
    users = db.query(User).all()
    print(f"Total Users: {len(users)}")
    for user in users:
        print(f"ID: {user.id} | Email: {user.email} | Role: {user.role} | Active: {user.is_active}")
except Exception as e:
    print(f"Error: {e}")
finally:
    db.close()
