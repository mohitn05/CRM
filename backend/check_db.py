import sqlite3

# Connect to the database
conn = sqlite3.connect('instance/crm.db')
cursor = conn.cursor()

# Get all tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = cursor.fetchall()

print("Tables in database:")
for table in tables:
    print(table[0])

# Close the connection
conn.close()