#!/usr/bin/env python3
"""
Database initialization script
"""
from app import create_app


def init_database():
    """Initialize the database with all tables"""
    app = create_app()

    with app.app_context():
        # Import db and models from the app context
        from app import db
        from app.models.student import StudentApplication  # Ensure model is imported

        # Create all tables
        db.create_all()
        print("✅ Database tables created successfully!")

        # Verify tables exist
        from sqlalchemy import inspect

        inspector = inspect(db.engine)
        tables = inspector.get_table_names()
        print(f"📋 Created tables: {tables}")

        # Check applications table structure
        if "applications" in tables:
            columns = inspector.get_columns("applications")
            print("📊 Applications table columns:")
            for col in columns:
                print(f"  - {col['name']}: {col['type']}")
        else:
            print("❌ Applications table not found!")


if __name__ == "__main__":
    init_database()
