import requests
import json
import time

def debug_form_submission():
    print("=== DEBUGGING FORM SUBMISSION ===")
    
    # Simulate what happens when a user fills out the form
    print("\n1. Creating test data similar to form submission...")
    
    # Create a test resume file
    with open("user_test_resume.txt", "w") as f:
        f.write("This is a test resume from a real user form submission simulation.")
    
    # Test data that mimics what a user would enter
    test_user_data = {
        'name': 'Real User Test',
        'email': 'realuser@test.com',
        'phone': '9876543210',  # 10 digits
        'domain': 'Frontend Developer',
        'password': 'userpassword123'
    }
    
    print(f"   User data: {test_user_data}")
    
    # Test the actual form submission process
    print("\n2. Testing form submission with real user data...")
    
    files = {
        'resume': ('user_test_resume.txt', open('user_test_resume.txt', 'rb'), 'text/plain')
    }
    
    try:
        # This is what the frontend form should be sending
        response = requests.post(
            'http://localhost:5000/api/apply',
            data=test_user_data,
            files=files
        )
        
        print(f"   Status Code: {response.status_code}")
        
        try:
            response_data = response.json()
            print(f"   Response: {response_data}")
        except:
            print(f"   Response Text: {response.text}")
        
        if response.status_code == 200:
            print("   ✅ Form submission SUCCESS")
        else:
            print("   ❌ Form submission FAILED")
            
        # Wait a moment for database to update
        time.sleep(1)
        
        # Test login with the new user
        print("\n3. Testing login with new user...")
        login_response = requests.post('http://localhost:5000/api/intern/login', 
                                 json={
                                     "emailOrPhone": "realuser@test.com",
                                     "password": "userpassword123"
                                 })
        
        print(f"   Login Status Code: {login_response.status_code}")
        
        try:
            login_data = login_response.json()
            print(f"   Login Response: {login_data}")
            
            if login_response.status_code == 200:
                print("   ✅ Login SUCCESS")
                print(f"   User ID: {login_data['student']['id']}")
                print(f"   User Name: {login_data['student']['name']}")
            else:
                print("   ❌ Login FAILED")
        except Exception as e:
            print(f"   ❌ Error parsing login response: {e}")
            
    except Exception as e:
        print(f"   ❌ Error during form submission: {e}")
    finally:
        # Clean up
        files['resume'][1].close()

if __name__ == "__main__":
    debug_form_submission()