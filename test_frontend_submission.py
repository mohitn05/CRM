import requests

def test_frontend_submission():
    # Create a test resume file
    with open("test_resume.txt", "w") as f:
        f.write("This is a test resume for frontend submission testing.")
    
    # Prepare form data
    files = {
        'resume': ('test_resume.txt', open('test_resume.txt', 'rb'), 'text/plain')
    }
    
    data = {
        'name': 'Frontend Test User',
        'email': 'frontend@example.com',
        'phone': '1111111111',
        'domain': 'Full Stack Developer',
        'password': 'frontend123'
    }
    
    try:
        # Submit the application
        response = requests.post(
            'http://localhost:5000/api/apply',
            data=data,
            files=files
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            print("✅ Frontend form submission test PASSED")
            return True
        else:
            print("❌ Frontend form submission test FAILED")
            return False
            
    except Exception as e:
        print(f"❌ Error testing frontend submission: {e}")
        return False
    finally:
        # Clean up
        files['resume'][1].close()

if __name__ == "__main__":
    test_frontend_submission()