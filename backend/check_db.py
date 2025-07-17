import sqlite3
import os

# Connect to the database
db_path = 'backend/instance/crm.db'
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check students
    cursor.execute("SELECT id, name, email, resume FROM applications")
    students = cursor.fetchall()
    
    print("=== STUDENTS IN DATABASE ===")
    for student in students:
        print(f"ID: {student[0]}, Name: {student[1]}, Email: {student[2]}, Resume: {student[3]}")
    
    # Check if resume files exist
    print("\n=== CHECKING RESUME FILES ===")
    for student in students:
        resume_file = student[3]
        if resume_file:
            file_path = f"backend/uploads/{resume_file}"
            exists = os.path.exists(file_path)
            print(f"Student {student[0]} ({student[1]}): {resume_file} - {'EXISTS' if exists else 'NOT FOUND'}")
    
    conn.close()
else:
    print(f"Database not found at {db_path}")
