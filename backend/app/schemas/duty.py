"""
Duty Roster Schemas - Skill 15
Shift management for police
"""
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import date, datetime
from enum import Enum


class ShiftType(str, Enum):
    MORNING = "morning"  # 8 AM - 4 PM
    EVENING = "evening"  # 4 PM - 12 AM
    NIGHT = "night"      # 12 AM - 8 AM


class OfficerStatus(str, Enum):
    ON_DUTY = "on_duty"
    OFF_DUTY = "off_duty"
    LEAVE = "leave"


class DutyShift(BaseModel):
    id: str
    officer_id: str
    officer_name: str
    shift_type: ShiftType
    date: date
    location: str
    status: OfficerStatus
    metadata: Dict[str, Any] = {}


class RosterGenerateRequest(BaseModel):
    start_date: date
    end_date: date
    station_id: str
