import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app import create_app
from app.models.student import StudentApplication

def check_applications():
    app = create_app()
    with app.app_context():
        applications = StudentApplication.query.all()
        print(f"Total applications in database: {len(applications)}")
        
        if applications:
            print("\nApplications:")
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
    check_applications()