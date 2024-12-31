import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TinderCard from 'react-tinder-card';
import { useAuth } from './AuthContext';
import './SwipePage.css';

function SwipePage() {
  const [pets, setPets] = useState([]);
  const [lastDirection, setLastDirection] = useState('');
  const [currentPet, setCurrentPet] = useState(null);
  const [likedPets, setLikedPets] = useState([]);
  const [dismissedPets, setDismissedPets] = useState([]);

  const { isLoggedIn } = useAuth(); 
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchRandomPet();
  }, []);

  const fetchRandomPet = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/pets/random');
      setPets([response.data]);
      setCurrentPet(response.data);
    } catch (error) {
      console.error('Error fetching pet data:', error);
    }
  };

  const likePet = async (petId) => {
    if (!isLoggedIn || !token) {
      console.error('User is not logged in. Cannot like a pet.');
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/users/likes`,
        { petId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(`Pet ${petId} liked successfully.`);
    } catch (error) {
      console.error('Error liking pet:', error.response?.data?.error || error.message);
    }
  };

  const handleSwipe = (direction) => {
    if (!currentPet) return;

    setLastDirection(direction);

    if (direction === 'right') {
      setLikedPets((prevLiked) => [...prevLiked, currentPet]);
      likePet(currentPet.animal_id); // Save liked pet to backend
    } else if (direction === 'left') {
      setDismissedPets((prevDismissed) => [...prevDismissed, currentPet]);
    }

    fetchRandomPet();
  };

  const handleLike = () => {
    handleSwipe('right');
  };

  const handleDismiss = () => {
    handleSwipe('left');
  };

  return (
    <div className="app">
      {pets.length > 0 && (
        <div className="card-container">
          {pets.map((pet) => (
            <TinderCard
              key={pet.animal_id}
              onSwipe={handleSwipe}
              preventSwipe={['up', 'down']}
              className="swipe"
            >
              <div className="card">
                <img src={pet.image_url} alt={pet.name} draggable="false" />
                <div className="card-content">
                  <h2 className="pet-name">{pet.name}</h2>
                  <p className="pet-info">{pet.species} • {pet.breed}</p>
                  <p className="pet-info">{pet.shelter}</p>
                </div>
                <div className="button-container">
                  <button onClick={handleDismiss} className="button dismiss-button">✕</button>
                  <button onClick={handleLike} className="button like-button">♥</button>
                </div>
              </div>
            </TinderCard>
          ))}
        </div>
      )}
      {lastDirection && (
        <div className="swipe-info">
          Last swipe: {lastDirection === 'right' ? '❤️' : '✕'}
        </div>
      )}
    </div>
  );
}

export default SwipePage;
