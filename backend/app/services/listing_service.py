"""
Listing Optimizer Service - Bin Packing Algorithm
"""
import uuid
from datetime import datetime, timedelta
from typing import List, Dict, Optional
from app.schemas.listing import (
    CaseListing, CaseType, CaseStage, CasePriority,
    ScheduledSlot, OptimizedSchedule, TimeSlot,
    OptimizationRequest, ListingCreate, ListingUpdate
)

class ListingService:
    def __init__(self):
        self._cases: Dict[str, CaseListing] = {}
        self._listings: Dict[str, dict] = {}  # For basic CRUD
    
    # ============ Basic CRUD Operations ============
    
    def get_listings(self) -> List[dict]:
        """Get all listings"""
        return list(self._listings.values())
    
    def get_listing(self, listing_id: str) -> Optional[dict]:
        """Get a specific listing"""
        return self._listings.get(listing_id)
    
    def create_listing(self, data: ListingCreate) -> dict:
        """Create a new listing"""
        listing_id = str(uuid.uuid4())
        listing = {
            "id": listing_id,
            **data.dict(),
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }
        self._listings[listing_id] = listing
        return listing
    
    def update_listing(self, listing_id: str, data: ListingUpdate) -> Optional[dict]:
        """Update an existing listing"""
        if listing_id not in self._listings:
            return None
        
        listing = self._listings[listing_id]
        update_data = data.dict(exclude_unset=True)
        
        for field, value in update_data.items():
            if value is not None:
                listing[field] = value
        
        listing["updated_at"] = datetime.now().isoformat()
        return listing
    
    def delete_listing(self, listing_id: str) -> bool:
        """Delete a listing"""
        if listing_id in self._listings:
            del self._listings[listing_id]
            return True
        return False
    
    # ============ Optimization Logic ============
    
    def estimate_duration(self, case_type, stage) -> int:
        """Estimate hearing duration in minutes"""
        estimates = {
            "civil": {
                "admission": 10,
                "final_arguments": 45,
                "evidence": 30
            },
            "criminal": {
                "admission": 10,
                "final_arguments": 40,
                "evidence": 25
            },
            "writ": {
                "admission": 15,
                "final_arguments": 60,
                "evidence": 30
            },
            "appeal": {
                "admission": 15,
                "final_arguments": 50
            },
            "bail_application": {
                "interlocutory_arguments": 15,
                "final_arguments": 20
            }
        }
        ct = str(case_type).lower()
        st = str(stage).lower().replace(" ", "_")
        return estimates.get(ct, {}).get(st, 30)
    
    def calculate_priority_score(self, case: CaseListing) -> int:
        """Calculate priority score for scheduling"""
        weights = {
            CasePriority.URGENT: 100,
            CasePriority.HIGH: 75,
            CasePriority.NORMAL: 50,
            CasePriority.LOW: 25
        }
        
        # Handle both enum and string
        if hasattr(case, 'priority') and hasattr(case.priority, 'value'):
             priority_val = case.priority.value
        elif hasattr(case, 'priority'):
             priority_val = str(case.priority).lower()
        else:
             priority_val = "normal"
        
        base = weights.get(priority_val, 50)
        adj_boost = min(case.adjournment_count * 10, 50)
        urgency_boost = 50 if case.urgency == "Urgent" else 25 if case.urgency == "High" else 0
        
        return base + adj_boost + urgency_boost
    
    def optimize_schedule(self, request: OptimizationRequest) -> OptimizedSchedule:
        """
        Optimize daily cause list using Bin Packing algorithm
        """
        # Prepare cases with metadata
        cases_with_meta = []
        for case in request.cases:
            duration = case.estimated_duration
            if duration is None:
                duration = self.estimate_duration(case.case_type, case.stage)
            
            score = self.calculate_priority_score(case)
            cases_with_meta.append({
                "case": case,
                "duration": duration,
                "score": score
            })
        
        # Sort by priority score (descending)
        cases_with_meta.sort(key=lambda x: -x["score"])
        
        # Schedule cases
        scheduled = []
        unlisted = []
        current_time = datetime.strptime("10:30", "%H:%M")
        end_time = datetime.strptime("16:00", "%H:%M")
        lunch_start = datetime.strptime("13:00", "%H:%M")
        lunch_end = datetime.strptime("14:00", "%H:%M")
        
        slot_id = 1
        total_minutes = 0
        
        for item in cases_with_meta:
            case = item["case"]
            duration = item["duration"]
            case_end = current_time + timedelta(minutes=duration)
            
            # Skip lunch break
            if current_time < lunch_start and case_end > lunch_start:
                current_time = lunch_end
                case_end = current_time + timedelta(minutes=duration)
            
            # Check if fits in working hours
            if case_end <= end_time and total_minutes + duration <= request.max_daily_minutes:
                scheduled.append(ScheduledSlot(
                    slot_id=slot_id,
                    start_time=current_time.strftime("%H:%M"),
                    end_time=case_end.strftime("%H:%M"),
                    duration_minutes=duration,
                    case=case
                ))
                current_time = case_end
                total_minutes += duration
                slot_id += 1
            else:
                unlisted.append(case)
        
        # Calculate utilization
        utilization = (total_minutes / request.max_daily_minutes * 100) if request.max_daily_minutes > 0 else 0
        
        return OptimizedSchedule(
            date=request.date,
            court_id=request.court_id,
            judge_id=request.judge_id,
            judge_name="Hon'ble Judge",
            total_cases=len(scheduled),
            total_minutes_scheduled=total_minutes,
            utilization_percentage=round(utilization, 2),
            schedule=scheduled,
            unlisted_cases=unlisted,
            breaks=[TimeSlot(
                start_time="13:00",
                end_time="14:00",
                duration_minutes=60
            )]
        )
    
    def create_case(self, data: dict) -> CaseListing:
        """Create a new case listing"""
        case_id = str(uuid.uuid4())
        if not data.get("cino"):
            data["cino"] = f"CINO{datetime.now().year}{len(self._cases)+1:05d}"
            
        # Ensure we have required fields from BaseModel
        if "id" not in data:
            data["id"] = case_id
            
        case = CaseListing(**data)
        self._cases[case_id] = case
        return case
    
    def get_pending_cases(self, court_id: str, limit: int = 100) -> List[CaseListing]:
        """Get pending cases for a court"""
        cases = [c for c in self._cases.values() if c.court_id == court_id]
        cases.sort(key=lambda x: -self.calculate_priority_score(x))
        return cases[:limit]

# Singleton instance
listing_service = ListingService()
