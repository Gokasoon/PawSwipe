import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TinderCard from 'react-tinder-card';
import './App.css';

function App() {
  const [pets, setPets] = useState([]);
  const [lastDirection, setLastDirection] = useState('');
  const [currentPet, setCurrentPet] = useState(null);

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

  const handleSwipe = (direction) => {
    setLastDirection(direction);
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
      <h1 className="title">🐾 PawSwipe</h1>
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

export default App;