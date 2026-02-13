"""
Admin Listing Service
Handles case listing operations for admin dashboard
"""
from typing import List, Optional
from datetime import datetime
import uuid

class AdminListingService:
    """Service for managing case listings"""
    
    def __init__(self):
        self._listings: dict = {}
    
    def get_all_listings(self, court_id: Optional[str] = None) -> List[dict]:
        """Get all listings, optionally filtered by court"""
        listings = list(self._listings.values())
        if court_id:
            listings = [l for l in listings if l.get('court_id') == court_id]
        return listings
    
    def get_listing(self, listing_id: str) -> Optional[dict]:
        """Get a specific listing by ID"""
        return self._listings.get(listing_id)
    
    def create_listing(self, data: dict) -> dict:
        """Create a new listing"""
        listing_id = str(uuid.uuid4())
        listing = {
            'id': listing_id,
            **data,
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        }
        self._listings[listing_id] = listing
        return listing
    
    def update_listing(self, listing_id: str, data: dict) -> Optional[dict]:
        """Update an existing listing"""
        if listing_id not in self._listings:
            return None
        
        listing = self._listings[listing_id]
        listing.update(data)
        listing['updated_at'] = datetime.now().isoformat()
        return listing
    
    def delete_listing(self, listing_id: str) -> bool:
        """Delete a listing"""
        if listing_id in self._listings:
            del self._listings[listing_id]
            return True
        return False

# Singleton instance
admin_listing_service = AdminListingService()
