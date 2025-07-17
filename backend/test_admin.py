#!/usr/bin/env python3
"""
Test admin endpoints
"""
import requests

def test_admin_endpoints():
    """Test admin endpoints"""
    try:
        response = requests.get('http://localhost:5000/api/admin/applications')
        print(f'Status: {response.status_code}')
        if response.status_code == 200:
            applications = response.json()
            print(f'Found {len(applications)} applications:')
            for app in applications:
                print(f'  - {app["name"]} ({app["email"]}) - Status: {app["status"]}')
        else:
            print(f'Error: {response.text[:200]}')
    except Exception as e:
        print(f'Error: {e}')

if __name__ == "__main__":
    test_admin_endpoints()
