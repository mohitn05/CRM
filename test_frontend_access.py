import requests
import time

def test_frontend_access():
    print("=== Testing Frontend Access ===")
    
    # Test if we can access the frontend
    try:
        response = requests.get('http://localhost:3001/apply')
        if response.status_code == 200:
            print("✅ Frontend is accessible")
            print(f"   Content length: {len(response.text)} characters")
            # Check if it contains expected elements
            if 'application' in response.text.lower():
                print("   Contains 'application' text")
            if 'form' in response.text.lower():
                print("   Contains 'form' element")
        else:
            print(f"❌ Frontend returned error: {response.status_code}")
    except Exception as e:
        print(f"❌ Cannot access frontend: {e}")
    
    # Test if backend is accessible from frontend context
    print("\n=== Testing Backend Accessibility from Frontend Context ===")
    try:
        response = requests.options('http://localhost:5000/api/apply')
        if response.status_code == 200:
            print("✅ Backend API is accessible from frontend context")
            print(f"   Allow header: {response.headers.get('Allow', 'Not found')}")
        else:
            print(f"❌ Backend API returned error: {response.status_code}")
    except Exception as e:
        print(f"❌ Cannot access backend API: {e}")

if __name__ == "__main__":
    test_frontend_access()