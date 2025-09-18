import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

from app.__init__ import create_app
from app.models.student import StudentApplication
from werkzeug.security import generate_password_hash
from datetime import datetime

def register_application():
    app = create_app()
    with app.app_context():
        # Check if user already exists
        existing_user = StudentApplication.query.filter_by(email="newuser@example.com").first()
        if existing_user:
            print("User already exists")
            return
            
        # Create new user with a known password
        password = "test123"
        hashed_password = generate_password_hash(password)
        
        new_app = StudentApplication()
        new_app.name = "New Test User"
        new_app.email = "newuser@example.com"
        new_app.phone = "9876543210"
        new_app.domain = "Backend Developer"
        new_app.password = hashed_password
        new_app.resume = "test_resume.pdf"
        new_app.status = "Applied"
        new_app.date_applied = datetime.now()
        
        try:
            from app.db import db
            db.session.add(new_app)
            db.session.commit()
            print("New application registered successfully!")
            print(f"Email: newuser@example.com")
            print(f"Password: {password}")
            print("You can now use these credentials to login.")
        except Exception as e:
            from app.db import db
            db.session.rollback()
            print(f"Error registering application: {e}")

if __name__ == "__main__":
    register_application()