import requests
import sys

BASE_URL = "http://localhost:8001/api/v1/auth"

def verify_signup():
    print("Testing Signup...")
    payload = {
        "email": "test_script_user@example.com",
        "password": "Start123!",
        "full_name": "Script Test User",
        "role": "citizen"
    }
    try:
        response = requests.post(f"{BASE_URL}/signup", json=payload)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        return response.status_code == 200 or response.status_code == 400  # 400 is fine if user exists
    except Exception as e:
        print(f"Signup Failed: {e}")
        return False

def verify_login():
    print("\nTesting Login...")
    payload = {
        "email": "test_script_user@example.com",
        "password": "Start123!"
    }
    try:
        response = requests.post(f"{BASE_URL}/login", json=payload)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            return response.json()["access_token"]
        return None
    except Exception as e:
        print(f"Login Failed: {e}")
        return None

def verify_protected_route(token):
    print("\nTesting Protected Route (Know Your Rights)...")
    headers = {"Authorization": f"Bearer {token}"}
    payload = {"query": "What are my rights if arrested?", "language": "en", "category": "arrest"}
    try:
        response = requests.post(f"http://localhost:8001/api/v1/citizen/rights/query", json=payload, headers=headers)
        print(f"Status: {response.status_code}")
        # print(f"Response: {response.text}") # Output might be long/AI response
        return response.status_code == 200
    except Exception as e:
        print(f"Protected Route Failed: {e}")
        return False

if __name__ == "__main__":
    if verify_signup():
        token = verify_login()
        if token:
            if verify_protected_route(token):
                print("\n✅ Full Flow Verification SUCCESS")
                sys.exit(0)
    
    print("\n❌ Verification FAILED")
    sys.exit(1)
