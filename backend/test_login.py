#!/usr/bin/env python3
"""
Test login functionality
"""
import requests

def test_login():
    """Test login with existing users"""
    
    # Test with the user we know exists
    test_cases = [
        {
            "emailOrPhone": "khushichaudhari0406@gmail.com",
            "password": "Khushi09",
            "description": "Real user with correct password"
        },
        {
            "emailOrPhone": "test@example.com", 
            "password": "testpass123",
            "description": "Test user with correct password"
        }
    ]
    
    for test_case in test_cases:
        print(f"\n🔄 Testing: {test_case['description']}")
        print(f"   Email: {test_case['emailOrPhone']}")
        print(f"   Password: {test_case['password']}")
        
        try:
            response = requests.post('http://localhost:5000/api/intern/login', 
                                   json=test_case)
            
            print(f"📊 Status Code: {response.status_code}")
            result = response.json()
            print(f"📋 Response: {result}")
            
            if response.status_code == 200:
                print("✅ Login successful!")
            else:
                print("❌ Login failed!")
                
        except Exception as e:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_login()
