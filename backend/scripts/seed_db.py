"""
High-performance seeder for NyayaSaathiAI.
Generates 5000+ realistic cases using bulk inserts.

Usage: python -m scripts.seed_db
"""
import uuid
import random
from datetime import datetime, timedelta
from faker import Faker

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.database import SessionLocal, create_all_tables
from app.models import *
from app.core.logging_config import logger

fake = Faker('en_IN')

# Distribution config
TOTAL_CASES = 5000
STATES_DISTRIBUTION = {
    "Uttar Pradesh": 0.18, "Maharashtra": 0.12, "Bihar": 0.10,
    "Madhya Pradesh": 0.08, "Rajasthan": 0.07, "Delhi": 0.06,
    "Tamil Nadu": 0.05, "Karnataka": 0.05, "West Bengal": 0.04,
    "Gujarat": 0.04, "Telangana": 0.03, "Andhra Pradesh": 0.03,
    "Kerala": 0.03, "Jharkhand": 0.02, "Odisha": 0.02,
    "Punjab": 0.02, "Haryana": 0.02, "Chhattisgarh": 0.01,
    "Assam": 0.01, "Uttarakhand": 0.01, "Goa": 0.005,
}

STATUS_DISTRIBUTION = {
    CaseStatus.FIR_FILED: 0.10,
    CaseStatus.FIR_REGISTERED: 0.05,
    CaseStatus.UNDER_INVESTIGATION: 0.20,
    CaseStatus.ACCUSED_ARRESTED: 0.05,
    CaseStatus.EVIDENCE_COLLECTED: 0.05,
    CaseStatus.CHARGESHEET_SUBMITTED: 0.05,
    CaseStatus.CASE_ASSIGNED: 0.05,
    CaseStatus.HEARING_SCHEDULED: 0.10,
    CaseStatus.HEARING_IN_PROGRESS: 0.05,
    CaseStatus.HEARING_ADJOURNED: 0.05,
    CaseStatus.JUDGMENT_DELIVERED: 0.05,
    CaseStatus.CONVICTED: 0.05,
    CaseStatus.ACQUITTED: 0.05,
    CaseStatus.JUSTICE_SERVED: 0.05,
    CaseStatus.CASE_CLOSED: 0.05,
}

BNS_SECTIONS = [
    ("BNS", "103", "Murder"), ("BNS", "105", "Culpable Homicide"),
    ("BNS", "115", "Voluntarily causing hurt"), ("BNS", "118", "Grievous hurt"),
    ("BNS", "303", "Theft"), ("BNS", "309", "Robbery"),
    ("BNS", "316", "Criminal breach of trust"), ("BNS", "318", "Cheating"),
    ("BNS", "329", "Criminal trespass"), ("BNS", "351", "Criminal intimidation"),
    ("BNS", "63", "Sexual offenses"), ("BNS", "74", "Assault on woman"),
]


def weighted_choice(distribution: dict):
    """Pick a random key based on weight distribution."""
    keys = list(distribution.keys())
    weights = list(distribution.values())
    return random.choices(keys, weights=weights, k=1)[0]


def generate_cnr(state: str, index: int) -> str:
    """Generate realistic CNR."""
    state_codes = {
        "Delhi": "DL", "Maharashtra": "MH", "Uttar Pradesh": "UP",
        "Bihar": "BR", "Karnataka": "KA", "Tamil Nadu": "TN",
        "Gujarat": "GJ", "Rajasthan": "RJ", "Madhya Pradesh": "MP",
        "West Bengal": "WB", "Telangana": "TS", "Andhra Pradesh": "AP",
        "Kerala": "KL", "Punjab": "PB", "Haryana": "HR",
    }
    code = state_codes.get(state, state[:2].upper())
    year = random.choice([2023, 2024, 2025])
    return f"{code}/{year}/{str(index).zfill(7)}"


def seed():
    """Main seed function."""
    logger.info("🌱 Starting database seed...")

    db = SessionLocal()

    try:
        # Check if already seeded
        existing = db.query(Case).count()
        if existing > 100:
            logger.info(f"Database already has {existing} cases. Skipping seed.")
            return

        create_all_tables()

        # ===== 1. POLICE STATIONS =====
        logger.info("Creating police stations...")
        stations = []
        for state, weight in STATES_DISTRIBUTION.items():
            count = max(2, int(weight * 100))
            for i in range(count):
                stations.append(PoliceStation(
                    id=str(uuid.uuid4()),
                    station_name=f"{fake.city()} PS {i+1}",
                    station_code=f"{state[:2].upper()}-{fake.random_number(digits=4)}",
                    city=fake.city(),
                    district=fake.city(),
                    state=state,
                    is_active=True,
                ))
        db.bulk_save_objects(stations)
        db.commit()
        logger.info(f"  ✅ {len(stations)} police stations created")

        # Reload to get IDs
        stations = db.query(PoliceStation).all()
        station_by_state = {}
        for s in stations:
            station_by_state.setdefault(s.state, []).append(s)

        # ===== 2. COURTS =====
        logger.info("Creating courts...")
        courts = []
        for state in STATES_DISTRIBUTION.keys():
            courts.append(Court(
                id=str(uuid.uuid4()),
                court_name=f"{state} District Court",
                court_type="DISTRICT_COURT",
                state=state,
                district=fake.city(),
                is_active=True,
            ))
        db.bulk_save_objects(courts)
        db.commit()
        logger.info(f"  ✅ {len(courts)} courts created")

        # ===== 3. USERS =====
        logger.info("Creating users...")
        users = []

        # Admin
        admin = User(
            id=str(uuid.uuid4()), email="admin@nyaya.gov.in",
            full_name="System Administrator", role=UserRole.ADMIN,
            status=UserStatus.ACTIVE, state="Delhi"
        )
        users.append(admin)

        # Citizens
        citizen_ids = []
        for i in range(200):
            uid = str(uuid.uuid4())
            citizen_ids.append(uid)
            state = weighted_choice(STATES_DISTRIBUTION)
            users.append(User(
                id=uid, email=f"citizen{i}@example.com",
                full_name=fake.name(), role=UserRole.CITIZEN,
                status=UserStatus.ACTIVE, state=state,
            ))

        # Police Officers
        police_ids = []
        for i, station in enumerate(stations[:50]):
            uid = str(uuid.uuid4())
            police_ids.append(uid)
            users.append(User(
                id=uid, email=f"officer{i}@police.gov.in",
                full_name=fake.name(), role=UserRole.POLICE,
                status=UserStatus.ACTIVE, state=station.state,
                badge_number=f"POL-{fake.random_number(digits=6)}",
                rank=random.choice(["Inspector", "SI", "ASI", "Constable"]),
                police_station_id=station.id,
            ))

        # Judges
        judge_ids = []
        courts_list = db.query(Court).all()
        for i, court in enumerate(courts_list[:20]):
            uid = str(uuid.uuid4())
            judge_ids.append(uid)
            users.append(User(
                id=uid, email=f"judge{i}@judiciary.gov.in",
                full_name=f"Hon'ble {fake.name()}",
                role=UserRole.JUDGE, status=UserStatus.ACTIVE,
                state=court.state, court_id=court.id,
                designation=random.choice(["CJM", "MM", "ADJ", "Sessions Judge"]),
            ))

        db.bulk_save_objects(users)
        db.commit()
        logger.info(f"  ✅ {len(users)} users created")

        # ===== 4. CASES =====
        logger.info(f"Creating {TOTAL_CASES} cases...")
        cases = []
        case_details = []
        case_sections_list = []
        case_timelines = []

        for i in range(TOTAL_CASES):
            state = weighted_choice(STATES_DISTRIBUTION)
            state_stations = station_by_state.get(state, stations[:1])
            station = random.choice(state_stations)
            status = weighted_choice(STATUS_DISTRIBUTION)

            # Dates based on status
            days_ago = random.randint(1, 365)
            fir_date = datetime.utcnow() - timedelta(days=days_ago)

            # Make ~15% SLA critical (filed 55+ days ago, still investigating)
            if status in [CaseStatus.UNDER_INVESTIGATION, CaseStatus.EVIDENCE_COLLECTED] and random.random() < 0.15:
                fir_date = datetime.utcnow() - timedelta(days=random.randint(55, 100))

            case_id = str(uuid.uuid4())
            cnr = generate_cnr(state, i + 1)

            case = Case(
                id=case_id,
                cnr=cnr,
                citizen_id=random.choice(citizen_ids),
                status=status,
                priority=random.choice(list(CasePriority)),
                police_station_id=station.id,
                assigned_io_id=random.choice(police_ids) if status != CaseStatus.FIR_FILED else None,
                assigned_judge_id=random.choice(judge_ids) if status in [
                    CaseStatus.CASE_ASSIGNED, CaseStatus.HEARING_SCHEDULED,
                    CaseStatus.HEARING_IN_PROGRESS, CaseStatus.JUDGMENT_DELIVERED,
                    CaseStatus.CONVICTED, CaseStatus.ACQUITTED,
                ] else None,
                fir_filed_date=fir_date,
                fir_registered_date=fir_date + timedelta(hours=random.randint(1, 24)) if status != CaseStatus.FIR_FILED else None,
                bnss_deadline_days=random.choice([60, 90]),
                judgment_date=datetime.utcnow() - timedelta(days=random.randint(1, 30)) if status in [
                    CaseStatus.JUDGMENT_DELIVERED, CaseStatus.CONVICTED, CaseStatus.ACQUITTED
                ] else None,
            )
            cases.append(case)

            # Detail
            case_details.append(CaseDetail(
                id=str(uuid.uuid4()),
                case_id=case_id,
                complaint_narrative=fake.paragraph(nb_sentences=5),
                incident_location=f"{fake.street_address()}, {fake.city()}, {state}",
                incident_lat=float(fake.latitude()),
                incident_lng=float(fake.longitude()),
                is_women_related=random.random() < 0.15,
                is_child_related=random.random() < 0.08,
            ))

            # Sections
            section = random.choice(BNS_SECTIONS)
            case_sections_list.append(CaseSection(
                id=str(uuid.uuid4()),
                case_id=case_id,
                act=section[0],
                section_number=section[1],
                section_description=section[2],
                is_primary=True,
                ai_confidence=round(random.uniform(0.7, 0.99), 2),
            ))

            # Timeline
            case_timelines.append(CaseTimeline(
                id=str(uuid.uuid4()),
                case_id=case_id,
                status_from=None,
                status_to=CaseStatus.FIR_FILED.value,
                changed_at=fir_date,
                notes="FIR filed",
            ))

            if i % 1000 == 0 and i > 0:
                logger.info(f"  ... {i}/{TOTAL_CASES} cases prepared")

        # BULK INSERT
        db.bulk_save_objects(cases)
        db.bulk_save_objects(case_details)
        db.bulk_save_objects(case_sections_list)
        db.bulk_save_objects(case_timelines)
        db.commit()
        logger.info(f"  ✅ {TOTAL_CASES} cases created with details")

        # ===== 5. EVIDENCE (for investigation+ cases) =====
        logger.info("Creating evidence records...")
        evidence_list = []
        blockchain_list = []

        investigation_cases = db.query(Case).filter(
            Case.status.in_([
                CaseStatus.EVIDENCE_COLLECTED, CaseStatus.INVESTIGATION_COMPLETE,
                CaseStatus.CHARGESHEET_SUBMITTED, CaseStatus.HEARING_SCHEDULED,
                CaseStatus.JUDGMENT_DELIVERED, CaseStatus.CONVICTED,
            ])
        ).limit(2000).all()

        block_number = 1
        prev_hash = "0" * 64

        for case in investigation_cases:
            for _ in range(random.randint(1, 3)):
                eid = str(uuid.uuid4())
                import hashlib
                data_hash = hashlib.sha256(
                    f"{eid}{datetime.utcnow().isoformat()}".encode()
                ).hexdigest()

                block_hash = hashlib.sha256(
                    f"{data_hash}{prev_hash}{block_number}".encode()
                ).hexdigest()

                evidence_list.append(Evidence(
                    id=eid,
                    case_id=str(case.id),
                    evidence_type=random.choice(list(EvidenceType)),
                    description=fake.sentence(),
                    file_name=f"evidence_{eid[:8]}.pdf",
                    sha256_hash=data_hash,
                    blockchain_block_number=block_number,
                    verification_status=EvidenceStatus.VERIFIED,
                    collected_at=datetime.utcnow() - timedelta(days=random.randint(1, 60)),
                ))

                blockchain_list.append(BlockchainRecord(
                    id=str(uuid.uuid4()),
                    record_type="EVIDENCE",
                    reference_id=eid,
                    reference_table="evidence",
                    data_hash=data_hash,
                    previous_hash=prev_hash,
                    block_hash=block_hash,
                    block_number=block_number,
                ))

                prev_hash = block_hash
                block_number += 1

        db.bulk_save_objects(evidence_list)
        db.bulk_save_objects(blockchain_list)
        db.commit()
        logger.info(f"  ✅ {len(evidence_list)} evidence records + blockchain blocks created")

        # ===== SUMMARY =====
        logger.info("\n" + "=" * 50)
        logger.info("🎉 SEED COMPLETE!")
        logger.info(f"  Police Stations: {len(stations)}")
        logger.info(f"  Courts: {len(courts)}")
        logger.info(f"  Users: {len(users)}")
        logger.info(f"  Cases: {TOTAL_CASES}")
        logger.info(f"  Evidence: {len(evidence_list)}")
        logger.info(f"  Blockchain Blocks: {len(blockchain_list)}")
        logger.info("=" * 50)

    except Exception as e:
        db.rollback()
        logger.error(f"❌ Seed failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
