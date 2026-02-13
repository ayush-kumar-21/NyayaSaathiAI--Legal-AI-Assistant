"""
Listing Optimizer API Endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import List
from datetime import datetime
from app.schemas.listing import (
    CaseListing, OptimizedSchedule, OptimizationRequest,
    ListingCreate, ListingUpdate
)
from app.services.listing_service import listing_service

router = APIRouter(prefix="/listing", tags=["Listing Optimizer"])

# ============ Basic CRUD ============

@router.get("/listings/", response_model=List[dict])
async def get_listings():
    """Get all listings"""
    return listing_service.get_listings()

@router.get("/listings/{listing_id}", response_model=dict)
async def get_listing(listing_id: str):
    """Get a specific listing"""
    listing = listing_service.get_listing(listing_id)
    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found"
        )
    return listing

@router.post("/listings/", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_listing(data: ListingCreate):
    """Create a new listing"""
    return listing_service.create_listing(data)

@router.put("/listings/{listing_id}", response_model=dict)
async def update_listing(listing_id: str, data: ListingUpdate):
    """Update an existing listing"""
    listing = listing_service.update_listing(listing_id, data)
    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found"
        )
    return listing

@router.delete("/listings/{listing_id}")
async def delete_listing(listing_id: str):
    """Delete a listing"""
    success = listing_service.delete_listing(listing_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found"
        )
    return {"message": "Listing deleted successfully"}

# ============ Optimization Endpoints ============

@router.post("/optimize", response_model=OptimizedSchedule)
async def optimize_schedule(request: OptimizationRequest):
    """
    Optimize daily cause list schedule
    
    Uses bin packing algorithm to schedule cases within 5.5-hour judicial day
    """
    try:
        result = listing_service.optimize_schedule(request)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Optimization failed: {str(e)}"
        )

@router.get("/court/{court_id}/pending-cases", response_model=List[CaseListing])
async def get_pending_cases(
    court_id: str,
    limit: int = Query(100, ge=1, le=500)
):
    """
    Get pending cases for a court
    
    Returns cases sorted by priority (Urgent first)
    """
    cases = listing_service.get_pending_cases(court_id, limit)
    
    # Create mock data if none exists
    if not cases:
        mock_cases = [
            {
                "case_number": "CS/2025/001",
                "cino": "CINO202500001",
                "title": "ABC Corp vs XYZ Ltd",
                "case_type": "civil",
                "stage": "final_arguments",
                "priority": "normal",
                "urgency": "Normal",
                "court_id": court_id,
                "adjournment_count": 0
            },
            {
                "case_number": "BA/2025/045",
                "cino": "CINO202500045",
                "title": "State vs John Doe - Bail Application",
                "case_type": "bail_application",
                "stage": "interlocutory_arguments",
                "priority": "urgent",
                "urgency": "Urgent",
                "court_id": court_id,
                "adjournment_count": 2
            },
            {
                "case_number": "WP/2025/012",
                "cino": "CINO202500012",
                "title": "Public Interest Litigation",
                "case_type": "writ",
                "stage": "admission",
                "priority": "high",
                "urgency": "High",
                "court_id": court_id,
                "adjournment_count": 0
            },
            {
                "case_number": "CR/2025/089",
                "cino": "CINO202500089",
                "title": "State vs Jane Smith",
                "case_type": "criminal",
                "stage": "evidence",
                "priority": "normal",
                "urgency": "Normal",
                "court_id": court_id,
                "adjournment_count": 1
            },
        ]
        
        for data in mock_cases:
            listing_service.create_case(data)
        
        cases = listing_service.get_pending_cases(court_id, limit)
    
    return cases

@router.post("/test-optimize")
async def test_optimize(court_id: str = Query(default="COURT-01")):
    """Test optimization with mock data"""
    cases = listing_service.get_pending_cases(court_id, 100)
    
    request = OptimizationRequest(
        court_id=court_id,
        judge_id="JUDGE-01",
        date=datetime.now().strftime("%Y-%m-%d"),
        cases=cases[:8],
        max_daily_minutes=330
    )
    
    return listing_service.optimize_schedule(request)
