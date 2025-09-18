import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

from app.__init__ import create_app
from app.models.student import StudentApplication

def test_applications():
    app = create_app()
    with app.app_context():
        # Check all applications
        applications = StudentApplication.query.all()
        print(f"Total applications in database: {len(applications)}")
        
        if applications:
            print("\nApplications in database:")
            print("-" * 80)
            for app in applications:
                print(f"ID: {app.id}")
                print(f"Name: {app.name}")
                print(f"Email: {app.email}")
                print(f"Phone: {app.phone}")
                print(f"Domain: {app.domain}")
                print(f"Status: {app.status}")
                print(f"Date Applied: {app.date_applied}")
                print("-" * 80)
        else:
            print("No applications found in the database.")

if __name__ == "__main__":
    test_applications()