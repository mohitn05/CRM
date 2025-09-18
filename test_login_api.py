import requests
import json

def test_login():
    # Test login with email
    print("Testing login with email...")
    response = requests.post('http://localhost:5000/api/intern/login', 
                             json={
                                 "emailOrPhone": "newuser@example.com",
                                 "password": "test123"
                             })
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    # Test login with phone
    print("\nTesting login with phone...")
    response = requests.post('http://localhost:5000/api/intern/login', 
                             json={
                                 "emailOrPhone": "9876543210",
                                 "password": "test123"
                             })
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")

if __name__ == "__main__":
    test_login()