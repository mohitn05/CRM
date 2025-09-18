import requests
import io

# Test form submission to the backend API
def test_form_submission():
    url = "http://localhost:5000/api/apply"
    
    # Form data
    form_data = {
        "name": "Browser Test User",
        "email": "browser.test@example.com",
        "phone": "1234567890",
        "domain": "Frontend Developer",
        "password": "testpassword"
    }
    
    # Create a simple text file as resume
    resume_content = "This is a test resume file for browser testing."
    resume_file = io.BytesIO(resume_content.encode('utf-8'))
    
    files = {
        "resume": ("test_resume.txt", resume_file, "text/plain")
    }
    
    print("Sending form data to backend...")
    print("URL:", url)
    print("Form data:", form_data)
    
    try:
        response = requests.post(url, data=form_data, files=files)
        print("Response status code:", response.status_code)
        print("Response headers:", response.headers)
        print("Response content:", response.json())
    except Exception as e:
        print("Error occurred:", str(e))

if __name__ == "__main__":
    test_form_submission()