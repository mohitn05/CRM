import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

from app.__init__ import create_app
from app.models.student import StudentApplication
from werkzeug.security import check_password_hash

def test_login_functionality():
    app = create_app()
    with app.app_context():
        # Check all applications
        applications = StudentApplication.query.all()
        print(f"Total applications in database: {len(applications)}")
        
        if applications:
            print("\nTesting login functionality:")
            print("-" * 80)
            for app in applications:
                print(f"ID: {app.id}")
                print(f"Name: {app.name}")
                print(f"Email: {app.email}")
                print(f"Phone: {app.phone}")
                print(f"Status: {app.status}")
                print(f"Password hash: {app.password[:50]}...")
                
                # Test login with email and a test password
                test_password = "test123"
                is_valid = check_password_hash(app.password, test_password)
                print(f"Login with '{test_password}': {'SUCCESS' if is_valid else 'FAILED'}")
                
                # Test login with phone and a test password
                print(f"Login with phone '{app.phone}' and '{test_password}': {'SUCCESS' if is_valid else 'FAILED'}")
                
                print("-" * 80)
        else:
            print("No applications found in the database.")

if __name__ == "__main__":
    test_login_functionality()