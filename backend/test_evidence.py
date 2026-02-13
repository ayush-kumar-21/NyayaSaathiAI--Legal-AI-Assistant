import asyncio
import requests
import json

BASE_URL = "http://localhost:8000/api/v1/police/evidence"

def test_evidence_lifecycle():
    print("🚀 Testing Evidence Locker API...")
    
    # 1. Upload Evidence
    print("\n1. Uploading Evidence...")
    payload = {
        "case_id": "FIR-2025-TEST",
        "title": "Test CCTV Footage",
        "description": "Footage from Scene A",
        "evidence_type": "video",
        "collection_location": "Sector 4",
        "tags": ["cctv", "test"]
    }
    
    try:
        response = requests.post(f"{BASE_URL}/upload", json=payload)
        response.raise_for_status()
        evidence = response.json()
        print(f"✅ Upload Successful: {evidence['id']}")
        evidence_id = evidence['id']
    except Exception as e:
        print(f"❌ Upload Failed: {e}")
        return

    # 2. Get Details & Chain
    print(f"\n2. Fetching Details for {evidence_id}...")
    try:
        response = requests.get(f"{BASE_URL}/{evidence_id}")
        response.raise_for_status()
        details = response.json()
        print(f"✅ Fetch Successful. Integrity: {details['integrity_status']}")
        print(f"   Chain Events: {len(details['chain_of_custody'])}")
    except Exception as e:
        print(f"❌ Fetch Failed: {e}")

    # 3. Transfer Custody
    print(f"\n3. Transferring Custody...")
    transfer_payload = {
        "evidence_id": evidence_id,
        "to_user_id": "OFFICER-002",
        "to_user_name": "Reviewer",
        "location": "Forensic Lab",
        "comments": "Sent for analysis",
        "action": "transferred"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/transfer", json=transfer_payload)
        response.raise_for_status()
        updated = response.json()
        print(f"✅ Transfer Successful. New Chain Events: {len(updated['chain_of_custody'])}")
        print(f"   Latest Action: {updated['chain_of_custody'][-1]['action']}")
    except Exception as e:
        print(f"❌ Transfer Failed: {e}")

if __name__ == "__main__":
    test_evidence_lifecycle()
