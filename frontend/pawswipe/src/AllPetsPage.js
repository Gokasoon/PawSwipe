import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import './LikedPetsPage.css';

function AllPetsPage() {
  const [pets, setPets] = useState([]);
  const { isLoggedIn } = useAuth();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAllPets();
  });

  const fetchAllPets = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/pets');
      setPets(response.data);
    } catch (error) {
      console.error('Error fetching liked pets:', error.response?.data?.error || error.message);
    }
  };

  return (
    <div className="liked-pets-page">
      <h1>All Pets</h1>
      {pets.length > 0 ? (
        <div className="liked-pets-container">
          {pets.map((pet) => (
            <div key={pet.animal_id} className="liked-pet-card">
              <img src={pet.image_url} alt={pet.name} className="liked-pet-image" />
              <div className="liked-pet-details">
                <h2 className="liked-pet-name">{pet.name}</h2>
                <p className="liked-pet-info">{pet.species} • {pet.breed}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No pets found</p>
      )}
    </div>
  );
}

export default AllPetsPage;
