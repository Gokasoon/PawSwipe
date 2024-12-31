import psycopg2
from psycopg2.extras import DictCursor
import re

# Database connection parameters
db_params = {
    'dbname': 'PawSwipe',
    'user': 'postgres',
    'password': 'toto',
    'host': 'localhost',
    'port': '5432'
}

def connect_to_db():
    """
    Connect to the PostgreSQL database and return the connection and cursor.
    """
    try:
        conn = psycopg2.connect(**db_params)
        cursor = conn.cursor()
        return conn, cursor
    except Exception as e:
        print(f"Database connection error: {e}")
        return None, None

def remove_word_with_numbers(pet_name):
    """
    Removes words containing numbers from the pet's name.
    """
    if pet_name:
        # Regular expression to remove words with numbers
        cleaned_name = re.sub(r'\b\w*\d\w*\b', '', pet_name)
        # Remove any extra spaces
        cleaned_name = ' '.join(cleaned_name.split())
        return cleaned_name
    return pet_name

def delete_reserved_pets(cursor, conn):
    """
    Deletes pets from the database whose names contain variations of 'réservé'.
    """
    try:
        # SQL query to delete pets whose names contain variations of 'réservé'
        cursor.execute("""
            DELETE FROM pets
            WHERE LOWER(name) LIKE '%réservé%' OR
                  LOWER(name) LIKE '%reserve%' OR
                  LOWER(name) LIKE '%reservée%' OR
                  LOWER(name) LIKE '%reservé%'
        """)
        
        # Commit the transaction
        conn.commit()
        print("Pets with reserved in their name have been deleted.")
    except Exception as e:
        print(f"An error occurred while deleting pets: {e}")

def update_pet_names(cursor, conn):
    """
    Updates pet names in the database by removing words with numbers.
    """
    try:
        # Select all pet names from the database
        cursor.execute("SELECT animal_id, name FROM pets")
        pets = cursor.fetchall()

        # Loop through each pet and clean the name
        for pet in pets:
            animal_id, pet_name = pet
            cleaned_name = remove_word_with_numbers(pet_name)

            # Update the pet name in the database
            cursor.execute("""
                UPDATE pets
                SET name = %s
                WHERE animal_id = %s
            """, (cleaned_name, animal_id))

        # Commit the changes to the database
        conn.commit()
        print(f"Updated {len(pets)} pet names in the database.")
    except Exception as e:
        print(f"An error occurred while updating pet names: {e}")


if __name__ == '__main__':
    # Connect to the database
    conn, cursor = connect_to_db()
    if not conn or not cursor:
        exit()

    # Delete pets with reserved in their name
    delete_reserved_pets(cursor, conn)

    # Update pet names to remove words with numbers
    update_pet_names(cursor, conn)

    # Close the database connection
    cursor.close()
    conn.close()
