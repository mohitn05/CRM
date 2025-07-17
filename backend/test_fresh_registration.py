#!/usr/bin/env python3
"""
Test fresh registration and immediate login
"""
import requests
import json
import time

def test_fresh_registration_and_login():
    """Register a new student and immediately test login"""
    
    # Create unique test data
    timestamp = str(int(time.time()))
    test_data = {
        'name': f'Test User {timestamp}',
        'email': f'testuser{timestamp}@example.com',
        'phone': f'123456{timestamp[-4:]}',
        'domain': 'Computer Science',
        'password': 'TestPass123'
    }
    
    print("🔄 Step 1: Registering new student...")
    print(f"   Name: {test_data['name']}")
    print(f"   Email: {test_data['email']}")
    print(f"   Phone: {test_data['phone']}")
    print(f"   Password: {test_data['password']}")
    
    # Create test resume file
    files = {'resume': ('test_resume.txt', 'Test Resume Content', 'text/plain')}
    
    try:
        # Step 1: Register student
        response = requests.post('http://localhost:5000/api/apply', 
                               data=test_data, files=files)
        
        print(f"📊 Registration Status: {response.status_code}")
        if response.status_code == 200:
            print("✅ Registration successful!")
            
            # Step 2: Try to login immediately
            print("\n🔄 Step 2: Testing login with registered credentials...")
            login_data = {
                "emailOrPhone": test_data['email'],
                "password": test_data['password']
            }
            
            login_response = requests.post('http://localhost:5000/api/intern/login', 
                                         json=login_data)
            
            print(f"📊 Login Status: {login_response.status_code}")
            login_result = login_response.json()
            print(f"📋 Login Response: {json.dumps(login_result, indent=2)}")
            
            if login_response.status_code == 200:
                print("✅ Login successful!")
                student_data = login_result.get('student', {})
                print(f"👤 Logged in as: {student_data.get('name')}")
                return True
            else:
                print("❌ Login failed!")
                return False
        else:
            print(f"❌ Registration failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    success = test_fresh_registration_and_login()
    if success:
        print("\n🎉 Complete flow test successful!")
    else:
        print("\n❌ Flow test failed!")
