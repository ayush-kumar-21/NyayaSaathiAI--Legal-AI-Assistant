import requests

API = "http://localhost:8000/api/v1"

def create_demo_user():
    user = {
        "email": "demo_citizen@gmail.com",
        "password": "Password123!",
        "full_name": "Demo Citizen",
        "role": "CITIZEN"
    }
    try:
        r = requests.post(f"{API}/auth/signup", json=user)
        print(r.json())
    except Exception as e:
        print(e)

if __name__ == "__main__":
    create_demo_user()
