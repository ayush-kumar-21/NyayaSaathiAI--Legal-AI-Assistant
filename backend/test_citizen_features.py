import requests
import sys
import uuid
import json

BASE_URL = "http://localhost:8000/api/v1"

def print_pass(message):
    print(f"✅ PASS: {message}")

def print_fail(message):
    print(f"❌ FAIL: {message}")
    sys.exit(1)

def test_citizen_flow():
    print("\n🚀 Starting Citizen Features Test...\n")

    # 1. Authentication
    print("🔹 Testing Authentication...")
    signup_data = {
        "email": f"citizen_test_{uuid.uuid4()}@gmail.com",
        "password": "password123",
        "full_name": "Test Citizen",
        "role": "CITIZEN"
    }

    # Signup
    try:
        resp = requests.post(f"{BASE_URL}/auth/signup", json=signup_data)
        if resp.status_code != 200:
            print(f"Signup failed: {resp.text}")
            # Try login if user exists
            login_data = {"username": signup_data["email"], "password": signup_data["password"]}
            resp = requests.post(f"{BASE_URL}/auth/token", data=login_data)
            if resp.status_code != 200:
                print_fail(f"Login failed: {resp.text}")

        token = resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        print_pass("Authentication successful")
    except Exception as e:
        print_fail(f"Auth Exception: {e}")

    # 2. File Complaint
    print("\n🔹 Testing File Complaint...")
    complaint_data = {
        "complaint_narrative": "This is a test complaint filed via API script. It describes a serious incident that needs investigation.",
        "incident_datetime": "2023-10-27T10:00:00",
        "incident_location": "Delhi",
        "evidence_files": []
    }

    try:
        resp = requests.post(f"{BASE_URL}/citizen/cases/file", json=complaint_data, headers=headers)
        if resp.status_code != 200:
            print_fail(f"File complaint failed: {resp.text}")

        case_data = resp.json()
        case_id = case_data["id"]
        cnr = case_data.get("cnr")
        print_pass(f"Complaint filed. Case ID: {case_id}, CNR: {cnr}")
    except Exception as e:
        print_fail(f"File Complaint Exception: {e}")

    # 3. Track Case by CNR
    print("\n🔹 Testing Track Case by CNR...")
    if not cnr:
        print_fail("Cannot test tracking without CNR")

    try:
        resp = requests.get(f"{BASE_URL}/citizen/cases/track/{cnr}", headers=headers)
        if resp.status_code != 200:
            print_fail(f"Track case failed: {resp.text}")

        tracked_case = resp.json()
        if tracked_case["cnr"] != cnr:
            print_fail("Tracked case CNR mismatch")
        print_pass(f"Tracked case successfully: {tracked_case['status']}")
    except Exception as e:
        print_fail(f"Track Case Exception: {e}")

    # 4. List User Cases
    print("\n🔹 Testing List User Cases...")
    try:
        resp = requests.get(f"{BASE_URL}/citizen/cases/my-cases", headers=headers)
        if resp.status_code != 200:
            print_fail(f"List cases failed: {resp.text}")

        cases = resp.json()
        found = any(c["id"] == case_id for c in cases)
        if not found:
            print_fail("Newly filed case not found in user list")
        print_pass(f"Retrieved {len(cases)} cases. New case found.")
    except Exception as e:
        print_fail(f"List Cases Exception: {e}")

    # 5. Trigger SOS
    print("\n🔹 Testing SOS...")
    sos_data = {
        "location": "28.6139, 77.2090",
        "description": "Emergency test"
    }
    try:
        resp = requests.post(f"{BASE_URL}/citizen/cases/sos", json=sos_data, headers=headers)
        if resp.status_code != 200:
            print_fail(f"SOS failed: {resp.text}")

        print_pass("SOS alert triggered successfully")
    except Exception as e:
        print_fail(f"SOS Exception: {e}")

    print("\n✨ All Citizen Features Verified Successfully!")

if __name__ == "__main__":
    test_citizen_flow()
