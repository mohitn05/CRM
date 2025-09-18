import requests
import json

def test_all_logins():
    # Test login for user 2 (New Test User) with email
    print("Testing login for New Test User with email...")
    response = requests.post('http://localhost:5000/api/intern/login', 
                             json={
                                 "emailOrPhone": "newuser@example.com",
                                 "password": "test123"
                             })
    
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print("✅ Login SUCCESS")
    else:
        print("❌ Login FAILED")
    print(f"Response: {response.json()}")
    
    # Test login for user 2 (New Test User) with phone
    print("\nTesting login for New Test User with phone...")
    response = requests.post('http://localhost:5000/api/intern/login', 
                             json={
                                 "emailOrPhone": "9876543210",
                                 "password": "test123"
                             })
    
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print("✅ Login SUCCESS")
    else:
        print("❌ Login FAILED")
    print(f"Response: {response.json()}")
    
    # Test login for user 3 (Frontend Test User) - we need to use the password we sent
    print("\nTesting login for Frontend Test User with email...")
    response = requests.post('http://localhost:5000/api/intern/login', 
                             json={
                                 "emailOrPhone": "frontend@example.com",
                                 "password": "frontend123"
                             })
    
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print("✅ Login SUCCESS")
    else:
        print("❌ Login FAILED")
    print(f"Response: {response.json()}")

if __name__ == "__main__":
    test_all_logins()