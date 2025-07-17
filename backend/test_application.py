#!/usr/bin/env python3
"""
Test script to verify student application submission
"""
import requests
import os

def test_student_application():
    """Test student application submission"""
    
    # Test data
    data = {
        'name': 'Test Student',
        'email': 'test@example.com',
        'phone': '1234567890',
        'domain': 'Computer Science',
        'password': 'testpass123'
    }
    
    # Test file
    test_file_path = 'test_resume.txt'
    
    try:
        with open(test_file_path, 'rb') as f:
            files = {'resume': ('test_resume.txt', f, 'text/plain')}
            
            print("🔄 Submitting student application...")
            response = requests.post('http://localhost:5000/api/apply', data=data, files=files)
            
            print(f"📊 Status Code: {response.status_code}")
            print(f"📋 Response: {response.json()}")
            
            if response.status_code == 200:
                print("✅ Application submitted successfully!")
                
                # Test fetching applications
                print("\n🔄 Fetching all applications...")
                apps_response = requests.get('http://localhost:5000/api/admin/applications')
                print(f"📊 Status Code: {apps_response.status_code}")
                
                if apps_response.status_code == 200:
                    applications = apps_response.json()
                    print(f"📋 Found {len(applications)} applications:")
                    for app in applications:
                        print(f"  - {app['name']} ({app['email']}) - Status: {app['status']}")
                    print("✅ Data retrieval successful!")
                else:
                    print(f"❌ Failed to fetch applications: {apps_response.text}")
            else:
                print(f"❌ Application submission failed: {response.text}")
                
    except FileNotFoundError:
        print(f"❌ Test file {test_file_path} not found")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_student_application()
