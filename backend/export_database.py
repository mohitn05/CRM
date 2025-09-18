import sqlite3
import os
import csv

def export_database():
    # Get the absolute path to the database
    db_path = os.path.join(os.path.dirname(__file__), 'instance', 'crm.db')
    print(f"Database path: {db_path}")
    
    # Connect to database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Export applications table
    try:
        cursor.execute("SELECT * FROM applications")
        applications = cursor.fetchall()
        
        # Get column names
        cursor.execute("PRAGMA table_info(applications)")
        columns = cursor.fetchall()
        column_names = [col[1] for col in columns]
        
        # Write to CSV
        csv_path = os.path.join(os.path.dirname(__file__), 'applications_export.csv')
        with open(csv_path, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(column_names)
            writer.writerows(applications)
        
        print(f"Exported {len(applications)} applications to {csv_path}")
        print("\nColumn names:")
        for i, col in enumerate(column_names):
            print(f"  {i+1}. {col}")
        
        print("\nFirst few records:")
        for i, app in enumerate(applications[:3]):
            print(f"  Record {i+1}:")
            for j, col in enumerate(column_names):
                print(f"    {col}: {app[j]}")
                
    except sqlite3.Error as e:
        print(f"Error exporting applications table: {e}")
    
    # Close connection
    conn.close()

if __name__ == "__main__":
    export_database()