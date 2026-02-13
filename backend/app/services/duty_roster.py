"""
Duty Roster Service - Skill 15
"""
import uuid
from datetime import date, timedelta
from typing import List, Optional, Dict
from app.schemas.duty import DutyShift, RosterGenerateRequest, ShiftType, OfficerStatus


class DutyRosterService:
    """
    Service for managing duty rosters
    """
    
    def __init__(self):
        self.shifts: List[DutyShift] = []
        
        # Seed mock data
        self._seed_data()
        
    def _seed_data(self):
        """Seed some initial shifts"""
        officers = [
            ("POLICE-001", "Insp. Vijay Khanna"),
            ("POLICE-002", "Sub-Insp. Aditi Rao"),
            ("POLICE-003", "Constable Rajesh Kumar")
        ]
        
        today = date.today()
        
        for i in range(7): # Next 7 days
            day = today + timedelta(days=i)
            # Simple rotation
            shift1 = DutyShift(
                id=str(uuid.uuid4()),
                officer_id=officers[0][0],
                officer_name=officers[0][1],
                shift_type=ShiftType.MORNING,
                date=day,
                location="Connaught Place Station",
                status=OfficerStatus.ON_DUTY
            )
            shift2 = DutyShift(
                id=str(uuid.uuid4()),
                officer_id=officers[1][0],
                officer_name=officers[1][1],
                shift_type=ShiftType.EVENING,
                date=day,
                location="Patrol Unit 4",
                status=OfficerStatus.ON_DUTY
            )
            
            self.shifts.append(shift1)
            self.shifts.append(shift2)

    async def generate_roster(self, request: RosterGenerateRequest) -> List[DutyShift]:
        """Generate a roster for a date range (Mock)"""
        # In a real app, this would use an algorithm to assign shifts fairly
        # Here we just return existing shifts for simplicity of the mock
        return self.get_roster(request.start_date, request.end_date)

    async def get_roster(self, start_date: date, end_date: date) -> List[DutyShift]:
        """Get shifts between dates"""
        return [
            s for s in self.shifts 
            if start_date <= s.date <= end_date
        ]


# Singleton
duty_service = DutyRosterService()
