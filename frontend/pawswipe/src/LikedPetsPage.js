import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import './LikedPetsPage.css';

function LikedPetsPage() {
  const [likedPets, setLikedPets] = useState([]);
  const { isLoggedIn } = useAuth();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchLikedPets();
  });

  const fetchLikedPets = async () => {
    if (!isLoggedIn || !token) {
      console.error('User is not logged in. Cannot fetch liked pets.');
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/api/users/likes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLikedPets(response.data);
    } catch (error) {
      console.error('Error fetching liked pets:', error.response?.data?.error || error.message);
    }
  };

  return (
    <div className="liked-pets-page">
      <h1>Your Liked Pets</h1>
      {likedPets.length > 0 ? (
        <div className="liked-pets-container">
          {likedPets.map((pet) => (
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
        <p>No pets liked yet. Start swiping to like some pets!</p>
      )}
    </div>
  );
}

export default LikedPetsPage;
