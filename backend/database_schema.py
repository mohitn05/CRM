import sqlite3
import os

def check_database_schema():
    # Get the absolute path to the database
    db_path = os.path.join(os.path.dirname(__file__), 'instance', 'crm.db')
    print(f"Database path: {db_path}")
    
    # Connect to database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Get schema for all tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = cursor.fetchall()
    
    print("Database Schema:")
    print("=" * 50)
    
    for table in tables:
        table_name = table[0]
        print(f"\nTable: {table_name}")
        print("-" * 30)
        
        # Get table info
        cursor.execute(f"PRAGMA table_info({table_name})")
        columns = cursor.fetchall()
        
        for col in columns:
            cid, name, data_type, notnull, default_value, pk = col
            pk_indicator = " (PK)" if pk else ""
            print(f"  {name} ({data_type}){pk_indicator}")
    
    # Close connection
    conn.close()

if __name__ == "__main__":
    check_database_schema()