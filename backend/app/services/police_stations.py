"""
Police Stations Mock Data — Delhi NCR
Realistic station names, locations, and Haversine-based nearest finder.
"""
import math
from typing import List, Optional, Tuple


# ── Haversine Distance ────────────────────────────────────

def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance in km between two lat/lng points."""
    R = 6371.0  # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


# ── Station Data ──────────────────────────────────────────

POLICE_STATIONS = [
    {
        "id": "PS-DEL-001",
        "name": "Saket Police Station",
        "district": "South Delhi",
        "address": "Press Enclave Rd, Saket, New Delhi",
        "latitude": 28.5244,
        "longitude": 77.2066,
        "phone": "011-26530800",
    },
    {
        "id": "PS-DEL-002",
        "name": "Hauz Khas Police Station",
        "district": "South Delhi",
        "address": "Hauz Khas Village, New Delhi",
        "latitude": 28.5494,
        "longitude": 77.2001,
        "phone": "011-26960763",
    },
    {
        "id": "PS-DEL-003",
        "name": "Vasant Vihar Police Station",
        "district": "South West Delhi",
        "address": "Vasant Vihar, New Delhi",
        "latitude": 28.5579,
        "longitude": 77.1590,
        "phone": "011-26140883",
    },
    {
        "id": "PS-DEL-004",
        "name": "Connaught Place Police Station",
        "district": "Central Delhi",
        "address": "Barakhamba Rd, Connaught Place, New Delhi",
        "latitude": 28.6315,
        "longitude": 77.2167,
        "phone": "011-23341500",
    },
    {
        "id": "PS-DEL-005",
        "name": "Chandni Chowk Police Station",
        "district": "Central Delhi",
        "address": "Chandni Chowk, Old Delhi",
        "latitude": 28.6506,
        "longitude": 77.2310,
        "phone": "011-23271400",
    },
    {
        "id": "PS-DEL-006",
        "name": "Dwarka Police Station",
        "district": "South West Delhi",
        "address": "Sector 6, Dwarka, New Delhi",
        "latitude": 28.5823,
        "longitude": 77.0500,
        "phone": "011-25083900",
    },
    {
        "id": "PS-DEL-007",
        "name": "Rohini Police Station",
        "district": "North West Delhi",
        "address": "Sector 3, Rohini, New Delhi",
        "latitude": 28.7326,
        "longitude": 77.1188,
        "phone": "011-27556600",
    },
    {
        "id": "PS-DEL-008",
        "name": "Janakpuri Police Station",
        "district": "West Delhi",
        "address": "Block C, Janakpuri, New Delhi",
        "latitude": 28.6219,
        "longitude": 77.0817,
        "phone": "011-25505600",
    },
    {
        "id": "PS-DEL-009",
        "name": "Lajpat Nagar Police Station",
        "district": "South East Delhi",
        "address": "Lajpat Nagar, New Delhi",
        "latitude": 28.5700,
        "longitude": 77.2373,
        "phone": "011-26832800",
    },
    {
        "id": "PS-DEL-010",
        "name": "Shahdara Police Station",
        "district": "East Delhi",
        "address": "Shahdara, Delhi",
        "latitude": 28.6735,
        "longitude": 77.2893,
        "phone": "011-22325200",
    },
    {
        "id": "PS-DEL-011",
        "name": "Model Town Police Station",
        "district": "North Delhi",
        "address": "Model Town, Delhi",
        "latitude": 28.7152,
        "longitude": 77.1930,
        "phone": "011-27112600",
    },
    {
        "id": "PS-DEL-012",
        "name": "Mehrauli Police Station",
        "district": "South Delhi",
        "address": "Mehrauli, New Delhi",
        "latitude": 28.5178,
        "longitude": 77.1780,
        "phone": "011-26643600",
    },
    {
        "id": "PS-DEL-013",
        "name": "Patel Nagar Police Station",
        "district": "Central Delhi",
        "address": "Patel Nagar, New Delhi",
        "latitude": 28.6510,
        "longitude": 77.1715,
        "phone": "011-25882600",
    },
    {
        "id": "PS-DEL-014",
        "name": "Mayur Vihar Police Station",
        "district": "East Delhi",
        "address": "Mayur Vihar Phase 1, Delhi",
        "latitude": 28.5937,
        "longitude": 77.2975,
        "phone": "011-22710400",
    },
    {
        "id": "PS-DEL-015",
        "name": "Defence Colony Police Station",
        "district": "South Delhi",
        "address": "Defence Colony, New Delhi",
        "latitude": 28.5723,
        "longitude": 77.2316,
        "phone": "011-24338500",
    },
]


# ── Lookup Functions ──────────────────────────────────────

def find_nearest_station(lat: float, lng: float) -> dict:
    """Find the single nearest police station to the given coordinates."""
    best = None
    best_dist = float("inf")
    for s in POLICE_STATIONS:
        d = haversine_km(lat, lng, s["latitude"], s["longitude"])
        if d < best_dist:
            best_dist = d
            best = {**s, "distance_km": round(d, 2)}
    return best


def find_nearby_stations(
    lat: float, lng: float, exclude_id: str, limit: int = 3
) -> List[dict]:
    """
    Find nearby police stations, excluding the one already assigned.
    Returns up to `limit` stations sorted by distance.
    """
    results = []
    for s in POLICE_STATIONS:
        if s["id"] == exclude_id:
            continue
        d = haversine_km(lat, lng, s["latitude"], s["longitude"])
        results.append({**s, "distance_km": round(d, 2)})
    results.sort(key=lambda x: x["distance_km"])
    return results[:limit]


def get_station_by_id(station_id: str) -> Optional[dict]:
    """Get a single station by its ID."""
    for s in POLICE_STATIONS:
        if s["id"] == station_id:
            return s
    return None
