import requests
import sys

BASE_URL = "http://localhost:8000/api/v1"

def test_endpoint(name, url, method="GET", json_data=None):
    try:
        if method == "GET":
            response = requests.get(url)
        else:
            response = requests.post(url, json=json_data)
        
        if response.status_code == 200:
            print(f"✅ {name}: SUCCESS")
            return True
        else:
            print(f"❌ {name}: FAILED ({response.status_code}) - {response.text[:100]}")
            return False
    except Exception as e:
        print(f"❌ {name}: ERROR - {str(e)}")
        return False

print("--- STARTING BACKEND INTEGRATION TESTS ---\n")

success = True
success &= test_endpoint("Health Check", "http://localhost:8000/health")
success &= test_endpoint("Skill 20 (Listing) Test", f"{BASE_URL}/admin/listing/test-optimize", "POST")
success &= test_endpoint("Skill 19 (Registry) Test", f"{BASE_URL}/admin/registry/test-scrutiny", "POST")

print("\n--- TEST SUMMARY ---")
if success:
    print("ALL TESTS PASSED")
    sys.exit(0)
else:
    print("SOME TESTS FAILED")
    sys.exit(1)
