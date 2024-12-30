import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TinderCard from 'react-tinder-card';
import './App.css';

function App() {
  const [pets, setPets] = useState([]);
  const [lastDirection, setLastDirection] = useState('');
  const [currentPet, setCurrentPet] = useState(null);  // Track the current pet for manual actions

  useEffect(() => {
    fetchRandomPet();
  }, []);

  const fetchRandomPet = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/pets/random');
      setPets([response.data]);
      setCurrentPet(response.data);  // Set the current pet after fetching
    } catch (error) {
      console.error('Error fetching pet data:', error);
    }
  };

  const handleSwipe = (direction) => {
    setLastDirection(direction);
    fetchRandomPet();
    if (direction === 'right') {
      console.log('You liked the pet!');
    } else if (direction === 'left') {
      console.log('You disliked the pet!');
    }
  };

  const handleLike = () => {
    setLastDirection('right');
    console.log('You liked the pet!');
    fetchRandomPet(); // Fetch the next pet after liking
  };

  const handleDismiss = () => {
    setLastDirection('left');
    console.log('You dismissed the pet!');
    fetchRandomPet(); // Fetch the next pet after dismissing
  };

  return (
    <div className="App">
      <h1>PawSwipe</h1>
      {pets.length > 0 && (
        <div className="card-container">
          {pets.map((pet) => (
            <TinderCard
              className="swipe"
              key={pet.animal_id}
              onSwipe={(direction) => handleSwipe(direction)}
              preventSwipe={['up', 'down']}
            >
              <div className="card">
                <img src={pet.image_url} alt={pet.name} draggable="false" />
                <h2>{pet.name}</h2>
                <p>{pet.species} - {pet.breed}</p>

                {/* Buttons on the card with symbols */}
                <div className="buttons-on-card">
                  <button onClick={handleDismiss} className="dismiss-btn">❌</button>
                  <button onClick={handleLike} className="like-btn">❤️</button>
                </div>
              </div>
            </TinderCard>
          ))}
        </div>
      )}

      <div className="swipe-direction">
        <p>Last swipe: {lastDirection}</p>
      </div>
    </div>
  );
}

export default App;
