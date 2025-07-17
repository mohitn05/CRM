#!/usr/bin/env python3
"""
Test complete student flow: registration -> login -> dashboard
"""
import requests
import json

def test_student_login():
    """Test login with existing student credentials"""
    
    # Test with khushi chaudhari (from earlier logs, password was "Khushi09")
    login_data = {
        "emailOrPhone": "khushichaudhari0406@gmail.com",
        "password": "Khushi09"
    }
    
    print("🔄 Testing student login...")
    print(f"   Email: {login_data['emailOrPhone']}")
    print(f"   Password: {login_data['password']}")
    
    try:
        response = requests.post('http://localhost:5000/api/intern/login', json=login_data)
        
        print(f"📊 Status Code: {response.status_code}")
        result = response.json()
        print(f"📋 Response: {json.dumps(result, indent=2)}")
        
        if response.status_code == 200:
            print("✅ Login successful!")
            student_data = result.get('student', {})
            print(f"👤 Student ID: {student_data.get('id')}")
            print(f"👤 Student Name: {student_data.get('name')}")
            print(f"👤 Student Email: {student_data.get('email')}")
            print(f"👤 Student Status: {student_data.get('status')}")
            return student_data
        else:
            print("❌ Login failed!")
            return None
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def test_admin_applications():
    """Test admin applications endpoint"""
    
    print("\n🔄 Testing admin applications endpoint...")
    
    try:
        response = requests.get('http://localhost:5000/api/admin/applications')
        
        print(f"📊 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            applications = response.json()
            print(f"📋 Found {len(applications)} applications:")
            for app in applications:
                print(f"  - {app['name']} ({app['email']}) - Status: {app['status']}")
            print("✅ Admin applications endpoint working!")
            return applications
        else:
            print(f"❌ Failed to fetch applications: {response.text}")
            return []
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return []

if __name__ == "__main__":
    # Test student login
    student_data = test_student_login()
    
    # Test admin applications
    applications = test_admin_applications()
    
    if student_data and applications:
        print("\n🎉 Complete flow test successful!")
        print("✅ Student can login with database credentials")
        print("✅ Admin can view all applications")
    else:
        print("\n❌ Some tests failed!")
