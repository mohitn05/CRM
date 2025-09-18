#!/usr/bin/env python3
"""
Script to add a test user to the database
"""
from app import create_app
from app.models.student import StudentApplication
from werkzeug.security import generate_password_hash
from datetime import datetime, timezone


def add_test_user():
    """Add a test user to the database"""
    app = create_app()

    with app.app_context():
        from app import db
        
        # Check if user already exists
        existing_user = StudentApplication.query.filter_by(email="test@example.com").first()
        if existing_user:
            print("⚠️ Test user already exists!")
            return

        # Create test user
        test_user = StudentApplication(
            name="Test User",
            email="test@example.com",
            phone="1234567890",
            domain="Frontend Developer",
            password=generate_password_hash("password123"),
            resume="test_resume.pdf",
            status="Applied",
            date_applied=datetime.now(timezone.utc),
        )

        db.session.add(test_user)
        db.session.commit()
        print("✅ Test user added successfully!")
        print(f"User ID: {test_user.id}")
        print(f"User Email: {test_user.email}")


if __name__ == "__main__":
    add_test_user()