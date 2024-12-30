import psycopg2
import csv
from psycopg2.extras import DictCursor

# Database connection parameters
db_params = {
    'dbname': 'PawSwipe',
    'user': 'postgres',
    'password': 'toto',
    'host': 'localhost',
    'port': '5432'
}

csv_file = "spa_pets.csv"
try:
    conn = psycopg2.connect(**db_params)
    cursor = conn.cursor()

    # Drop the existing table if it exists
    cursor.execute("DROP TABLE IF EXISTS pets")

    # Create the table with BOOLEAN instead of INTEGER for sos
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS pets (
        animal_id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        breed VARCHAR(255),
        species VARCHAR(100),
        age VARCHAR(50),
        gender VARCHAR(50),
        sos BOOLEAN,  -- Changed from INTEGER to BOOLEAN
        image_url TEXT,
        shelter VARCHAR(255)
    )
    """)

    # Open and read the CSV file
    with open(csv_file, "r", encoding="utf-8") as file:
        reader = csv.DictReader(file, delimiter=";")
        for row in reader:
            # Convert 'false'/'true' strings to boolean
            row['sos'] = row['sos'].lower() == 'true'
            
            cursor.execute("""
            INSERT INTO pets (animal_id, name, breed, species, age, gender, sos, image_url, shelter)
            VALUES (%(animal_id)s, %(name)s, %(breed)s, %(species)s, %(age)s, %(gender)s, %(sos)s, %(image_url)s, %(shelter)s)
            """, row)

    conn.commit()
    print("CSV data imported successfully!")

except psycopg2.Error as e:
    print(f"An error occurred: {e}")
finally:
    if conn:
        cursor.close()
        conn.close()
        print("Database connection closed.")

# ------ SQLITE ------
# import sqlite3
# import csv

# csv_file = "spa_pets.csv"  
# db_file = "spa_pets.db"    

# conn = sqlite3.connect(db_file)
# cursor = conn.cursor()

# cursor.execute("""
# CREATE TABLE IF NOT EXISTS pets (
#     animal_id INTEGER PRIMARY KEY,
#     name TEXT,
#     breed TEXT,
#     species TEXT,
#     age TEXT, 
#     gender TEXT,
#     sos INTEGER,
#     image_url TEXT, 
#     shelter TEXT
# )
# """)

# with open(csv_file, "r", encoding="utf-8") as file:
#     reader = csv.DictReader(file, delimiter=";")  
#     for row in reader:
#         cursor.execute("""
#         INSERT INTO pets (animal_id, name, breed, species, age, gender, sos, image_url, shelter)
#         VALUES (:animal_id, :name, :breed, :species, :age, :gender, :sos, :image_url, :shelter)
#         """, row)

# conn.commit()
# conn.close()

# print("CSV data imported successfully!")

