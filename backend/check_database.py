import sqlite3
import os

def check_database():
    # Get the absolute path to the database
    db_path = os.path.join(os.path.dirname(__file__), 'instance', 'crm.db')
    print(f"Database path: {db_path}")
    
    # Check if database file exists
    if not os.path.exists(db_path):
        print("Database file does not exist!")
        return
    
    print("Database file exists")
    
    # Connect to database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Get all tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = cursor.fetchall()
    print("\nTables in database:")
    for table in tables:
        print(f"  - {table[0]}")
    
    # Check applications table
    try:
        cursor.execute("SELECT COUNT(*) FROM applications")
        count = cursor.fetchone()[0]
        print(f"\nTotal applications in database: {count}")
        
        if count > 0:
            cursor.execute("SELECT id, name, email, phone, domain, status FROM applications")
            applications = cursor.fetchall()
            print("\nApplications:")
            print("-" * 80)
            for app in applications:
                print(f"ID: {app[0]}, Name: {app[1]}, Email: {app[2]}, Phone: {app[3]}, Domain: {app[4]}, Status: {app[5]}")
        else:
            print("No applications found in database")
    except sqlite3.Error as e:
        print(f"Error accessing applications table: {e}")
    
    # Close connection
    conn.close()

if __name__ == "__main__":
    check_database()