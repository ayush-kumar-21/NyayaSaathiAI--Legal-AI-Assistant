"""
Expert Implementation: Listing Optimizer
Optimization: Priority Queue (Heap) for O(n log n) scheduling.
"""
import heapq
from typing import List, Dict, Optional
from datetime import datetime, timedelta, time
from pydantic import BaseModel, Field
from dataclasses import dataclass, field

from app.core.architecture import BaseService, InMemoryRepository, IRepository

# --- Domain Models ---

class CaseListing(BaseModel):
    id: str
    case_number: str
    stage: str
    urgency: str # Urgent, High, Normal
    est_minutes: int
    
class ScheduleSlot(BaseModel):
    case_id: str
    start_time: str
    end_time: str
    duration: int

class DailySchedule(BaseModel):
    id: str
    date: str
    court_id: str
    slots: List[ScheduleSlot]
    utilization: float

# --- Service Implementation ---

@dataclass(order=True)
class PriorityCase:
    priority: int # Lower is higher priority
    case_id: str = field(compare=False)
    duration: int = field(compare=False)

class ListingService(BaseService[DailySchedule, str]):
    
    PRIORITY_MAP = {
        "Urgent": 1,
        "High": 2,
        "Normal": 3,
        "Low": 4
    }

    async def optimize_schedule(self, cases: List[Dict], court_id: str, date: str) -> DailySchedule:
        # 1. Heapify (O(n))
        queue = []
        for c in cases:
            # Urgent=1, High=2 (Min-heap sorts 1 first)
            prio = self.PRIORITY_MAP.get(c.get('urgency', 'Normal'), 3)
            # Add age weight (older cases get slightly higher priority)
            # This is a simplified version, real one would parse dates
            
            heapq.heappush(queue, PriorityCase(prio, c['id'], c['est_minutes']))
            
        # 2. Schedule (O(n log n))
        slots = []
        # Start at 10:30 AM (630 mins)
        current_time_mins = 630 
        lunch_start = 780 # 1:00 PM
        lunch_end = 840   # 2:00 PM
        day_end = 990     # 4:30 PM
        
        while queue:
            if current_time_mins >= day_end:
                break
                
            # Check lunch break
            if current_time_mins >= lunch_start and current_time_mins < lunch_end:
                current_time_mins = lunch_end
                
            pc = heapq.heappop(queue)
            
            # If case fits before lunch or end of day
            if (current_time_mins + pc.duration <= lunch_start) or \
               (current_time_mins >= lunch_end and current_time_mins + pc.duration <= day_end):
                   
                start_str = self._mins_to_time(current_time_mins)
                end_str = self._mins_to_time(current_time_mins + pc.duration)
                
                slots.append(ScheduleSlot(
                    case_id=pc.case_id,
                    start_time=start_str,
                    end_time=end_str,
                    duration=pc.duration
                ))
                current_time_mins += pc.duration
            else:
                # Case doesn't fit in current block, push back or skip
                # Simple logic: skip for now, in real/complex algo we might try to fit smaller cases
                continue
            
        # 3. Create Schedule Object
        import uuid
        total_time = sum(s.duration for s in slots)
        available_time = (day_end - 630) - (lunch_end - lunch_start) # Total work minutes
        
        schedule = DailySchedule(
            id=str(uuid.uuid4()),
            date=date,
            court_id=court_id,
            slots=slots,
            utilization=round((total_time / available_time) * 100, 2)
        )
        
        return await self.create(schedule)

    def _mins_to_time(self, mins: int) -> str:
        h = mins // 60
        m = mins % 60
        return f"{h:02d}:{m:02d}"

# Factory
def get_listing_service() -> ListingService:
    repo = InMemoryRepository[DailySchedule, str]()
    return ListingService(repo)
