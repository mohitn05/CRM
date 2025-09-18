import requests
import json

def test_simulation_login():
    # Test login for the simulation test user
    print("Testing login for Simulation Test User...")
    response = requests.post('http://localhost:5000/api/intern/login', 
                             json={
                                 "emailOrPhone": "simulation@test.com",
                                 "password": "simulation123"
                             })
    
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print("✅ Login SUCCESS")
        response_data = response.json()
        print(f"Response: {response_data}")
        return True
    else:
        print("❌ Login FAILED")
        try:
            response_data = response.json()
            print(f"Response: {response_data}")
        except:
            print(f"Response Text: {response.text}")
        return False

if __name__ == "__main__":
    test_simulation_login()