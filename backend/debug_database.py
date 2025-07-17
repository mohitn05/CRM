#!/usr/bin/env python3
"""
Debug database contents
"""
from app import create_app
from app.models.student import StudentApplication
from werkzeug.security import check_password_hash

def debug_database():
    """Debug database contents"""
    app = create_app()
    
    with app.app_context():
        print("🔍 Database Debug Information")
        print("=" * 50)
        
        # Get all students
        students = StudentApplication.query.all()
        print(f"📊 Total students in database: {len(students)}")
        
        for i, student in enumerate(students, 1):
            print(f"\n👤 Student {i}:")
            print(f"   ID: {student.id}")
            print(f"   Name: {student.name}")
            print(f"   Email: {student.email}")
            print(f"   Phone: {student.phone}")
            print(f"   Domain: {student.domain}")
            print(f"   Status: {student.status}")
            print(f"   Password Hash: {student.password[:50]}...")
            print(f"   Date Applied: {student.date_applied}")
            
            # Test some common passwords
            test_passwords = ["TestPass123", "Khushi09", "testpass123"]
            for pwd in test_passwords:
                if check_password_hash(student.password, pwd):
                    print(f"   ✅ Password '{pwd}' matches!")
                    break
            else:
                print(f"   ❌ None of the test passwords match")

if __name__ == "__main__":
    debug_database()
