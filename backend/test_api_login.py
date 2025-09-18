import sys
import os
import json
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

from app.__init__ import create_app

def test_api_login():
    app = create_app()
    with app.test_client() as client:
        # Test login with email
        print("Testing API login with email...")
        response = client.post('/api/intern/login', 
                               data=json.dumps({
                                   "emailOrPhone": "newuser@example.com",
                                   "password": "test123"
                               }),
                               content_type='application/json')
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.get_json()}")
        
        # Test login with phone
        print("\nTesting API login with phone...")
        response = client.post('/api/intern/login', 
                               data=json.dumps({
                                   "emailOrPhone": "9876543210",
                                   "password": "test123"
                               }),
                               content_type='application/json')
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.get_json()}")

if __name__ == "__main__":
    test_api_login()