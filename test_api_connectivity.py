import requests

def test_api_connectivity():
    try:
        # Test if the backend API is accessible
        response = requests.get('http://localhost:5000/api/test')
        print(f"API Test Endpoint Status: {response.status_code}")
        print(f"API Test Response: {response.json()}")
    except Exception as e:
        print(f"Error connecting to API test endpoint: {e}")
    
    try:
        # Test the apply endpoint
        response = requests.options('http://localhost:5000/api/apply')
        print(f"Apply Endpoint OPTIONS Status: {response.status_code}")
        print(f"Allow Header: {response.headers.get('Allow', 'Not found')}")
    except Exception as e:
        print(f"Error connecting to apply endpoint: {e}")

if __name__ == "__main__":
    test_api_connectivity()