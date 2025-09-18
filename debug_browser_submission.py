import requests
import json
import time

def debug_browser_submission():
    """
    This script simulates what should happen when the browser form is submitted
    to help identify where the issue might be occurring.
    """
    
    print("=== Browser Form Submission Debug ===")
    print("1. Testing direct API call (this is what should happen)")
    
    # Test direct API call
    url = "http://localhost:5000/api/apply"
    
    # Form data that matches what the browser should send
    form_data = {
        "name": "Browser Debug User",
        "email": f"debug.browser.{int(time.time())}@example.com",  # Unique email
        "phone": "1234567890",
        "domain": "Frontend Developer",
        "password": "testpassword"
    }
    
    # Simple text file as resume
    files = {
        "resume": ("debug_resume.txt", "This is a debug resume file.", "text/plain")
    }
    
    print(f"Sending to: {url}")
    print(f"Form data: {form_data}")
    
    try:
        response = requests.post(url, data=form_data, files=files)
        print(f"Response status: {response.status_code}")
        print(f"Response content: {response.text}")
        
        if response.status_code == 200:
            print("✅ Direct API call successful!")
        else:
            print("❌ Direct API call failed!")
            
    except Exception as e:
        print(f"❌ Error in direct API call: {e}")
        return
    
    print("\n2. Checking if data was saved to database")
    
    # Check database
    try:
        import sqlite3
        import os
        
        db_path = os.path.join("backend", "instance", "crm.db")
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        cursor.execute("SELECT COUNT(*) FROM applications")
        total_apps = cursor.fetchone()[0]
        
        cursor.execute("SELECT * FROM applications WHERE email = ?", (form_data["email"],))
        app_record = cursor.fetchone()
        
        conn.close()
        
        print(f"Total applications in database: {total_apps}")
        if app_record:
            print("✅ Application found in database!")
            print(f"Application data: {app_record}")
        else:
            print("❌ Application NOT found in database!")
            
    except Exception as e:
        print(f"❌ Error checking database: {e}")

if __name__ == "__main__":
    debug_browser_submission()