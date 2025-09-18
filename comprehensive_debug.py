import requests
import json
import time

def comprehensive_debug():
    print("=== COMPREHENSIVE DEBUGGING ===")
    
    # Test 1: Check if backend is running
    print("\n1. Checking if backend is accessible...")
    try:
        response = requests.get('http://localhost:5000/api/test')
        if response.status_code == 200:
            print("   ✅ Backend is running and accessible")
            print(f"   Response: {response.json()}")
        else:
            print("   ❌ Backend returned error")
            print(f"   Status: {response.status_code}")
            return
    except Exception as e:
        print(f"   ❌ Backend is not accessible: {e}")
        return
    
    # Test 2: Check database state before form submission
    print("\n2. Checking database state before form submission...")
    try:
        response = requests.get('http://localhost:5000/api/test')
        # We'll check the actual database after submission
        print("   ✅ Backend is responsive")
    except Exception as e:
        print(f"   ❌ Error checking backend: {e}")
    
    # Test 3: Simulate exact form submission process
    print("\n3. Simulating exact form submission process...")
    
    # Create test resume file
    with open("debug_resume.txt", "w") as f:
        f.write("This is a debug resume file for comprehensive testing.")
    
    # Test data that exactly matches what the form would send
    form_data = {
        'name': 'Debug Test User',
        'email': 'debug.test@test.com',
        'phone': '3334445555',  # 10 digits
        'domain': 'Debug Testing',
        'password': 'debugpassword123'
    }
    
    files = {
        'resume': ('debug_resume.txt', open('debug_resume.txt', 'rb'), 'text/plain')
    }
    
    print(f"   Form data: {form_data}")
    
    try:
        # This is exactly what the frontend form should be doing
        response = requests.post(
            'http://localhost:5000/api/apply',
            data=form_data,
            files=files
        )
        
        print(f"   Submission Status: {response.status_code}")
        
        try:
            response_data = response.json()
            print(f"   Submission Response: {response_data}")
        except:
            print(f"   Submission Response Text: {response.text}")
        
        if response.status_code == 200:
            print("   ✅ Form submission SUCCESS")
        else:
            print("   ❌ Form submission FAILED")
            return
            
        # Wait for database to update
        time.sleep(1)
        
        # Test 4: Verify user was added to database
        print("\n4. Verifying user was added to database...")
        try:
            # Check if we can login with the new user
            login_response = requests.post('http://localhost:5000/api/intern/login', 
                                     json={
                                         "emailOrPhone": "debug.test@test.com",
                                         "password": "debugpassword123"
                                     })
            
            print(f"   Login Status: {login_response.status_code}")
            
            if login_response.status_code == 200:
                login_data = login_response.json()
                print("   ✅ User successfully added to database")
                print(f"   User ID: {login_data['student']['id']}")
                print(f"   User Name: {login_data['student']['name']}")
            else:
                print("   ❌ User not found in database")
                try:
                    error_data = login_response.json()
                    print(f"   Login Error: {error_data}")
                except:
                    print(f"   Login Error Text: {login_response.text}")
                    
        except Exception as e:
            print(f"   ❌ Error verifying database: {e}")
            
    except Exception as e:
        print(f"   ❌ Error during form submission: {e}")
    finally:
        # Clean up
        files['resume'][1].close()

if __name__ == "__main__":
    comprehensive_debug()