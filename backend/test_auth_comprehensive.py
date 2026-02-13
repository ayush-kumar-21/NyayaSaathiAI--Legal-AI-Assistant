"""
Comprehensive Authentication & Data Isolation Test Suite
Tests all flows: Citizen, Police, Judge signup/login with verification
"""
import requests
import sys
import json
from datetime import datetime

BASE_URL = "http://localhost:8000/api/v1"
AUTH_URL = f"{BASE_URL}/auth"

# Test Results Tracker
results = {
    "passed": 0,
    "failed": 0,
    "tests": []
}

def test(name, condition, details=""):
    """Record test result"""
    status = "PASS" if condition else "FAIL"
    results["tests"].append({
        "name": name,
        "status": status,
        "details": details
    })
    if condition:
        results["passed"] += 1
    else:
        results["failed"] += 1
    print(f"[{status}] {name}")
    if details and not condition:
        print(f"   Details: {details}")
    return condition

def run_tests():
    """Run all authentication tests"""
    print("=" * 60)
    print("NYAYASAHAYAK AUTHENTICATION TEST SUITE")
    print("=" * 60)
    print(f"Base URL: {BASE_URL}")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    
    # ========== TEST 1: Citizen Signup ==========
    print("\n[TEST 1] Citizen Self-Registration")
    print("-" * 40)
    
    citizen_email = f"citizen_test_{datetime.now().timestamp()}@example.com"
    citizen_data = {
        "email": citizen_email,
        "password": "Citizen123!",
        "full_name": "Test Citizen",
        "role": "citizen"
    }
    
    try:
        response = requests.post(f"{AUTH_URL}/signup", json=citizen_data, timeout=5)
        citizen_token = response.json().get("access_token") if response.status_code == 200 else None
        test(
            "Citizen signup succeeds",
            response.status_code == 200,
            f"Status: {response.status_code}, Response: {response.text[:100]}"
        )
        
        if citizen_token:
            test(
                "Citizen receives JWT token",
                len(citizen_token) > 20,
                f"Token length: {len(citizen_token) if citizen_token else 0}"
            )
    except Exception as e:
        test("Citizen signup succeeds", False, str(e))
        citizen_token = None
    
    # ========== TEST 2: Citizen Login ==========
    print("\n[TEST 2] Citizen Login")
    print("-" * 40)
    
    try:
        response = requests.post(f"{AUTH_URL}/login", json={
            "email": citizen_email,
            "password": "Citizen123!"
        }, timeout=5)
        test(
            "Citizen login succeeds",
            response.status_code == 200,
            f"Status: {response.status_code}"
        )
        
        if response.status_code == 200:
            data = response.json()
            test(
                "Login returns user profile",
                "user_name" in data and "user_role" in data,
                f"Keys: {list(data.keys())}"
            )
            test(
                "User role is citizen",
                data.get("user_role") == "citizen",
                f"Role: {data.get('user_role')}"
            )
    except Exception as e:
        test("Citizen login succeeds", False, str(e))
    
    # ========== TEST 3: Police Registration ==========
    print("\n[TEST 3] Police Officer Registration")
    print("-" * 40)
    
    police_email = f"police_test_{datetime.now().timestamp()}@police.gov.in"
    police_data = {
        "email": police_email,
        "password": "Police123!",
        "full_name": "SI Test Officer",
        "role": "police",
        "badge_number": "DL-PS-TEST-001",
        "station_id": "TEST-STATION-01"
    }
    
    try:
        response = requests.post(f"{AUTH_URL}/signup", json=police_data, timeout=5)
        police_token = response.json().get("access_token") if response.status_code == 200 else None
        test(
            "Police signup succeeds",
            response.status_code == 200,
            f"Status: {response.status_code}, Response: {response.text[:100]}"
        )
        
        if response.status_code == 200:
            data = response.json()
            test(
                "Police user has correct role",
                data.get("user_role") == "police",
                f"Role: {data.get('user_role')}"
            )
    except Exception as e:
        test("Police signup succeeds", False, str(e))
        police_token = None
    
    # ========== TEST 4: Judge Registration ==========
    print("\n[TEST 4] Judge Registration")
    print("-" * 40)
    
    judge_email = f"judge_test_{datetime.now().timestamp()}@highcourt.gov.in"
    judge_data = {
        "email": judge_email,
        "password": "Judge123!",
        "full_name": "Hon. Test Judge",
        "role": "judge",
        "court_id": "TEST-COURT-01"
    }
    
    try:
        response = requests.post(f"{AUTH_URL}/signup", json=judge_data, timeout=5)
        judge_token = response.json().get("access_token") if response.status_code == 200 else None
        test(
            "Judge signup succeeds",
            response.status_code == 200,
            f"Status: {response.status_code}"
        )
        
        if response.status_code == 200:
            data = response.json()
            test(
                "Judge user has correct role",
                data.get("user_role") == "judge",
                f"Role: {data.get('user_role')}"
            )
    except Exception as e:
        test("Judge signup succeeds", False, str(e))
        judge_token = None
    
    # ========== TEST 5: Duplicate Email Prevention ==========
    print("\n[TEST 5] Duplicate Email Prevention")
    print("-" * 40)
    
    try:
        response = requests.post(f"{AUTH_URL}/signup", json=citizen_data, timeout=5)
        test(
            "Duplicate email rejected",
            response.status_code == 400,
            f"Status: {response.status_code}"
        )
    except Exception as e:
        test("Duplicate email prevention works", False, str(e))
    
    # ========== TEST 6: Wrong Password Rejection ==========
    print("\n[TEST 6] Wrong Password Rejection")
    print("-" * 40)
    
    try:
        response = requests.post(f"{AUTH_URL}/login", json={
            "email": citizen_email,
            "password": "WrongPassword123!"
        }, timeout=5)
        test(
            "Wrong password rejected",
            response.status_code == 400,
            f"Status: {response.status_code}"
        )
    except Exception as e:
        test("Wrong password rejection works", False, str(e))
    
    # ========== TEST 7: Google OAuth Simulation ==========
    print("\n[TEST 7] Google OAuth Flow")
    print("-" * 40)
    
    try:
        response = requests.post(f"{AUTH_URL}/google", json={
            "token": "mock_google_token_for_testing"
        }, timeout=5)
        test(
            "Google OAuth succeeds",
            response.status_code == 200,
            f"Status: {response.status_code}"
        )
        
        if response.status_code == 200:
            data = response.json()
            test(
                "Google user gets citizen role by default",
                data.get("user_role") == "citizen",
                f"Role: {data.get('user_role')}"
            )
    except Exception as e:
        test("Google OAuth works", False, str(e))
    
    # ========== TEST 8: Token Verification ==========
    print("\n[TEST 8] JWT Token Verification")
    print("-" * 40)
    
    if citizen_token:
        try:
            # Test accessing a protected endpoint (if available)
            # For now, just verify token structure
            parts = citizen_token.split('.')
            test(
                "Token has valid JWT structure (3 parts)",
                len(parts) == 3,
                f"Parts: {len(parts)}"
            )
            
            # Decode payload (middle part)
            import base64
            payload = parts[1]
            # Add padding if needed
            padding = '=' * (4 - len(payload) % 4)
            decoded = base64.urlsafe_b64decode(payload + padding)
            token_data = json.loads(decoded)
            
            test(
                "Token contains user email",
                "sub" in token_data and citizen_email in str(token_data.get("sub")),
                f"Token data: {token_data}"
            )
            test(
                "Token contains role",
                "role" in token_data,
                f"Keys: {list(token_data.keys())}"
            )
            test(
                "Token has expiration",
                "exp" in token_data,
                f"Keys: {list(token_data.keys())}"
            )
        except Exception as e:
            test("Token verification works", False, str(e))
    else:
        test("Token verification skipped (no token)", False, "Citizen signup failed")
    
    # ========== TEST 9: Data Isolation Check ==========
    print("\n[TEST 9] Data Isolation Verification")
    print("-" * 40)
    
    # Verify different users have different tokens
    if citizen_token and police_token:
        test(
            "Citizen and Police have different tokens",
            citizen_token != police_token,
            "Tokens are unique per user"
        )
    
    # Check role-specific data is stored
    if police_token:
        try:
            # Decode police token
            parts = police_token.split('.')
            payload = parts[1]
            padding = '=' * (4 - len(payload) % 4)
            decoded = base64.urlsafe_b64decode(payload + padding)
            token_data = json.loads(decoded)
            
            test(
                "Police token contains role",
                token_data.get("role") == "police",
                f"Role in token: {token_data.get('role')}"
            )
        except Exception as e:
            test("Police token verification", False, str(e))
    
    # ========== PRINT SUMMARY ==========
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    print(f"Passed: {results['passed']}")
    print(f"Failed: {results['failed']}")
    total = results['passed'] + results['failed']
    if total > 0:
        print(f"Success Rate: {results['passed']/total*100:.1f}%")
    print("=" * 60)
    
    # Print failed tests
    if results['failed'] > 0:
        print("\nFAILED TESTS:")
        for test_item in results['tests']:
            if test_item['status'] == "FAIL":
                print(f"  - {test_item['name']}")
                if test_item['details']:
                    print(f"    {test_item['details']}")
    
    return results['failed'] == 0

if __name__ == "__main__":
    try:
        success = run_tests()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\nTests interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\nCritical error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
