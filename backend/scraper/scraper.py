import requests
import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.by import By
import time
import os


class SPAPetScraper:
    def __init__(self, url):
        self.url = url
        self.driver = webdriver.Chrome()


    def scrape_pets(self):
        self.driver.get(self.url)
        time.sleep(2)
        
        # List to store pet data
        pets_data = []

        pet_items = self.driver.find_elements(By.CLASS_NAME, 'f-miniAnimals_item')

        # Extract data from each pet item
        for pet in pet_items:
            # Find the link with data attributes
            pet_link = pet.find_element(By.CSS_SELECTOR, 'a[data-animal-id]')                   
            if pet_link:
                # Extract all data attributes
                pet_info = {
                    'animal_id': pet_link.get_attribute('data-animal-id'),
                    'name': pet_link.get_attribute('data-animal-nom'),
                    'breed': pet_link.get_attribute('data-animal-race'),
                    'species': pet_link.get_attribute('data-animal-espece'),
                    'age': pet_link.get_attribute('data-animal-age'),
                    'gender': pet_link.get_attribute('data-animal-gender'),
                    'sos': pet_link.get_attribute('data-animal-sos')
                }

                # Find image source
                img = pet_link.find_element(By.TAG_NAME, 'img')
                if img:
                    pet_info['image_url'] = img.get_attribute('src')

                try:
                    shelter_link = pet.find_element(By.CLASS_NAME, 'f-miniAnimals_establishment')
                    pet_info['shelter'] = shelter_link.text.strip()
                except Exception:
                    pet_info['shelter'] = 'Unknown shelter'

                pets_data.append(pet_info)

        return pd.DataFrame(pets_data)


    def save_to_csv(self, df, filename='spa_pets.csv'):
        """Save scraped data to CSV"""
        if not os.path.isfile(filename):
            df.to_csv(filename, index=False, sep=';')
        else:
            df.to_csv(filename, mode='a', header=False, index=False, sep=';')
        print(f"Data saved to {filename}")



if __name__ == '__main__':

    i = 1
    while True :
        url = f'https://www.la-spa.fr/adoption/?search=1&species=chat&page={i}&seed=453958649249204' # change species if needed
        scraper = SPAPetScraper(url)
        pets_df = scraper.scrape_pets()
        print(pets_df)
        scraper.save_to_csv(pets_df)

        page_links = scraper.driver.find_elements(By.CLASS_NAME, 'c-see-more_link') # will found previous and next page links
        
        if len(page_links) == 2:
            i += 1

        elif len(page_links) == 1 :    
            href = page_links[0].get_attribute('href')
            if f"page={i-1}" in href:   # only previous page link 
                break
            else:                       # only next page link
                i += 1
        

    print(f"{i} pages scraped")

    