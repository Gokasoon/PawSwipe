import sqlite3
import csv

csv_file = "spa_pets.csv"  
db_file = "spa_pets.db"    

conn = sqlite3.connect(db_file)
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS pets (
    animal_id INTEGER PRIMARY KEY,
    name TEXT,
    breed TEXT,
    species TEXT,
    age TEXT, 
    gender TEXT,
    sos INTEGER,
    image_url TEXT, 
    shelter TEXT
)
""")

with open(csv_file, "r", encoding="utf-8") as file:
    reader = csv.DictReader(file, delimiter=";")  
    for row in reader:
        cursor.execute("""
        INSERT INTO pets (animal_id, name, breed, species, age, gender, sos, image_url, shelter)
        VALUES (:animal_id, :name, :breed, :species, :age, :gender, :sos, :image_url, :shelter)
        """, row)

conn.commit()
conn.close()

print("CSV data imported successfully!")