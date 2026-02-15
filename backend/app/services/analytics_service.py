from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func, case as sql_case
from collections import defaultdict

from app.models import Case, CaseStatus, PoliceStation


INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
    "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal", "Jammu & Kashmir", "Ladakh",
    "Chandigarh", "Puducherry", "Andaman & Nicobar",
    "Dadra & Nagar Haveli", "Lakshadweep"
]

DISPOSED_STATUSES = [
    CaseStatus.CONVICTED, CaseStatus.ACQUITTED,
    CaseStatus.JUSTICE_SERVED, CaseStatus.CASE_CLOSED,
    CaseStatus.CASE_REJECTED, CaseStatus.CASE_CLOSED_UNTRACED,
]

INVESTIGATION_STATUSES = [
    CaseStatus.UNDER_INVESTIGATION, CaseStatus.ACCUSED_IDENTIFIED,
    CaseStatus.ACCUSED_ARRESTED, CaseStatus.EVIDENCE_COLLECTED,
    CaseStatus.INVESTIGATION_COMPLETE,
]


class AnalyticsService:
    def __init__(self, db: Session):
        self.db = db

    def get_national_stats(self) -> dict:
        """Aggregate national statistics."""
        total = self.db.query(func.count(Case.id)).scalar() or 0

        disposed = self.db.query(func.count(Case.id)).filter(
            Case.status.in_(DISPOSED_STATUSES)
        ).scalar() or 0

        pending = total - disposed

        # Average disposal time (for disposed cases with both dates)
        avg_days_query = self.db.query(
            func.avg(
                func.julianday(Case.judgment_date) - func.julianday(Case.fir_filed_date)
            )
        ).filter(
            Case.judgment_date.isnot(None),
            Case.fir_filed_date.isnot(None),
        ).scalar()
        avg_disposal_days = round(avg_days_query or 0, 1)

        # SLA breaches (investigation > deadline days)
        deadline_threshold = datetime.utcnow() - timedelta(days=60)
        sla_breaches = self.db.query(func.count(Case.id)).filter(
            Case.status.in_(INVESTIGATION_STATUSES),
            Case.fir_registered_date < deadline_threshold,
        ).scalar() or 0

        sla_total = self.db.query(func.count(Case.id)).filter(
            Case.status.in_(INVESTIGATION_STATUSES),
        ).scalar() or 1

        sla_compliance_rate = round(
            (1 - sla_breaches / sla_total) * 100, 1
        ) if sla_total > 0 else 100.0

        # Conviction rate
        convicted = self.db.query(func.count(Case.id)).filter(
            Case.status == CaseStatus.CONVICTED
        ).scalar() or 0
        acquitted = self.db.query(func.count(Case.id)).filter(
            Case.status == CaseStatus.ACQUITTED
        ).scalar() or 0
        conviction_rate = round(
            convicted / max(convicted + acquitted, 1) * 100, 1
        )

        states = self.get_heatmap_data()

        critical_districts = sum(1 for s in states if s["sla_breach_rate"] > 20)

        return {
            "total_cases": total,
            "pending_cases": pending,
            "disposed_cases": disposed,
            "avg_disposal_days": avg_disposal_days,
            "sla_compliance_rate": sla_compliance_rate,
            "critical_districts": critical_districts,
            "conviction_rate": conviction_rate,
            "states": states,
        }

    def get_heatmap_data(self) -> list[dict]:
        """Get state-wise case distribution for heatmap."""
        # Join through police station to get state
        results = self.db.query(
            PoliceStation.state,
            func.count(Case.id).label("total"),
        ).join(
            Case, Case.police_station_id == PoliceStation.id
        ).group_by(
            PoliceStation.state
        ).all()

        state_data = {}
        for state, total in results:
            if state:
                state_data[state] = {"total": total}

        # Get disposed counts per state
        disposed_results = self.db.query(
            PoliceStation.state,
            func.count(Case.id).label("disposed"),
        ).join(
            Case, Case.police_station_id == PoliceStation.id
        ).filter(
            Case.status.in_(DISPOSED_STATUSES)
        ).group_by(
            PoliceStation.state
        ).all()

        for state, disposed in disposed_results:
            if state and state in state_data:
                state_data[state]["disposed"] = disposed

        # Get SLA breach counts
        deadline_threshold = datetime.utcnow() - timedelta(days=60)
        sla_results = self.db.query(
            PoliceStation.state,
            func.count(Case.id).label("breaches"),
        ).join(
            Case, Case.police_station_id == PoliceStation.id
        ).filter(
            Case.status.in_(INVESTIGATION_STATUSES),
            Case.fir_registered_date < deadline_threshold,
        ).group_by(
            PoliceStation.state
        ).all()

        for state, breaches in sla_results:
            if state and state in state_data:
                state_data[state]["sla_breaches"] = breaches

        # Build response
        heatmap = []
        max_cases = max((d["total"] for d in state_data.values()), default=1)

        for state in INDIAN_STATES:
            data = state_data.get(state, {"total": 0})
            total = data.get("total", 0)
            disposed = data.get("disposed", 0)
            sla_breaches = data.get("sla_breaches", 0)
            pending = total - disposed

            heatmap.append({
                "state": state,
                "total_cases": total,
                "pending_cases": pending,
                "disposed_cases": disposed,
                "sla_breaches": sla_breaches,
                "sla_breach_rate": round(sla_breaches / max(total, 1) * 100, 1),
                "intensity": round(total / max(max_cases, 1), 2),
            })

        return sorted(heatmap, key=lambda x: x["total_cases"], reverse=True)

    def get_bnss_deadlines(self) -> list[dict]:
        """Get cases approaching BNSS 193 deadlines."""
        cases = self.db.query(Case).join(
            PoliceStation, Case.police_station_id == PoliceStation.id, isouter=True
        ).filter(
            Case.status.in_(INVESTIGATION_STATUSES),
            Case.fir_registered_date.isnot(None),
        ).all()

        deadlines = []
        for case in cases:
            remaining = case.bnss_days_remaining
            if remaining is not None:
                deadlines.append({
                    "cnr": case.cnr,
                    "case_id": str(case.id),
                    "days_remaining": remaining,
                    "deadline_days": case.bnss_deadline_days,
                    "status": case.status.value,
                    "priority": case.priority.value,
                    "fir_registered_date": case.fir_registered_date.isoformat() if case.fir_registered_date else None,
                    "state": case.police_station.state if case.police_station else None,
                    "district": case.police_station.district if case.police_station else None,
                })

        return sorted(deadlines, key=lambda x: x["days_remaining"])
