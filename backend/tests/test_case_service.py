import pytest
from app.services.case_service import CaseService
from app.models import CaseStatus, CasePriority, User, UserRole, UserStatus
from app.core.exceptions import InvalidStatusTransition


def _create_citizen(db):
    import uuid
    user = User(
        id=str(uuid.uuid4()), email="test@test.com",
        full_name="Test Citizen", role=UserRole.CITIZEN,
        status=UserStatus.ACTIVE,
    )
    db.add(user)
    db.commit()
    return user


def test_create_case_generates_cnr(db):
    user = _create_citizen(db)
    service = CaseService(db)
    case = service.create_case(
        citizen_id=str(user.id),
        narrative="Test complaint narrative for testing purposes",
    )
    assert case.cnr.startswith("DL/")
    assert case.status == CaseStatus.FIR_FILED


def test_valid_status_transition(db):
    user = _create_citizen(db)
    service = CaseService(db)
    case = service.create_case(citizen_id=str(user.id), narrative="Test")

    updated = service.update_status(str(case.id), CaseStatus.FIR_REGISTERED)
    assert updated.status == CaseStatus.FIR_REGISTERED


def test_invalid_status_transition_raises(db):
    user = _create_citizen(db)
    service = CaseService(db)
    case = service.create_case(citizen_id=str(user.id), narrative="Test")

    with pytest.raises(InvalidStatusTransition):
        service.update_status(str(case.id), CaseStatus.JUDGMENT_DELIVERED)
