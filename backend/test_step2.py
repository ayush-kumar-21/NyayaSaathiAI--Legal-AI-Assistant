"""Run this to verify Step 2 is complete."""
import sys

# Test 1: All models import without circular dependency errors
try:
    from app.models import (
        Base, User, Case, CaseDetail, CaseParty, CaseSection, CaseTimeline,
        Evidence, ChainOfCustody, BlockchainRecord,
        ArrestRecord, CustodyRecord, ChargeSheet,
        HearingSchedule, HearingRecord, Adjournment, CauseList,
        CourtOrder, Judgment, BailApplication,
        Court, PoliceStation, Notification, AuditLog,
        CaseStatus, UserRole, VALID_TRANSITIONS
    )
    print(f"✅ All {len(Base.metadata.tables)} models imported successfully")
    print(f"   Tables: {', '.join(Base.metadata.tables.keys())}")
except ImportError as e:
    print(f"❌ Import error (likely circular): {e}")
    sys.exit(1)

# Test 2: Tables can be created
try:
    from app.db.database import create_all_tables, engine
    create_all_tables()

    from sqlalchemy import inspect
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print(f"✅ {len(tables)} tables created in database")

    expected = [
        "users", "cases", "case_details", "case_parties", "case_sections",
        "case_timeline", "evidence", "chain_of_custody", "blockchain_records",
        "arrest_records", "custody_records", "chargesheets",
        "hearing_schedules", "hearing_records", "adjournments", "cause_lists",
        "court_orders", "judgments", "bail_applications",
        "courts", "police_stations", "notifications", "audit_logs"
    ]
    missing = [t for t in expected if t not in tables]
    if missing:
        print(f"⚠️ Missing tables: {missing}")
    else:
        print("✅ All expected tables present")
except Exception as e:
    print(f"❌ Table creation failed: {e}")
    sys.exit(1)

# Test 3: Status transitions are valid
try:
    from app.models.enums import CaseStatus, VALID_TRANSITIONS

    # Every status should be a key in VALID_TRANSITIONS
    for status in CaseStatus:
        assert status in VALID_TRANSITIONS, f"Missing transitions for {status}"

    # FIR_FILED should transition to FIR_REGISTERED
    assert CaseStatus.FIR_REGISTERED in VALID_TRANSITIONS[CaseStatus.FIR_FILED]

    # CASE_CLOSED should have no transitions
    assert len(VALID_TRANSITIONS[CaseStatus.CASE_CLOSED]) == 0

    print(f"✅ Status transitions validated ({len(VALID_TRANSITIONS)} states)")
except AssertionError as e:
    print(f"❌ Transition validation failed: {e}")
    sys.exit(1)

# Test 4: BNSS deadline property works
try:
    from datetime import datetime, timedelta
    case = Case()
    case.fir_registered_date = datetime.utcnow() - timedelta(days=50)
    case.bnss_deadline_days = 90
    case.status = CaseStatus.UNDER_INVESTIGATION
    remaining = case.bnss_days_remaining
    assert remaining == 40, f"Expected 40, got {remaining}"
    print(f"✅ BNSS deadline calculation works (40 days remaining for 50-day-old case)")
except Exception as e:
    print(f"❌ BNSS calculation failed: {e}")
    sys.exit(1)

print("\n🎉 STEP 2 COMPLETE — All models verified")
