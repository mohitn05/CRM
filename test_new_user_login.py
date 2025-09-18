import requests
import json

def test_new_user_login():
    # Test login for the new integration test user
    print("Testing login for Integration Test User...")
    response = requests.post('http://localhost:5000/api/intern/login', 
                             json={
                                 "emailOrPhone": "integration@test.com",
                                 "password": "integration123"
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
    test_new_user_login()