import React, { useState, useEffect } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import { useAuth } from './AuthContext';
import axios from 'axios';
import './LikedPetsPage.css';

function LikedPetsPage() {
  const [pets, setPets] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { isLoggedIn } = useAuth();
  const token = localStorage.getItem('token');

  // Calculate number of columns based on window width
  const getColumnCount = (width) => {
    if (width <= 600) return 2;
    if (width <= 900) return 3;
    if (width <= 1200) return 4;
    return 5;
  };

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchLikedPets();
  }, [isLoggedIn, token]);

  const fetchLikedPets = async () => {
    if (!isLoggedIn || !token) {
      console.error('User is not logged in. Cannot fetch liked pets.');
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/api/users/likes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPets(response.data);
    } catch (error) {
      console.error('Error fetching liked pets:', error.response?.data?.error || error.message);
    }
  };

  const columnCount = getColumnCount(windowWidth);
  const rowCount = Math.ceil(pets.length / columnCount);
  const cellSize = 220; // Height of each card
  const rowHeight = cellSize + 20; // Add space between rows
  const containerPadding = 40;
  const gridWidth = windowWidth - (containerPadding * 2); // Account for container padding

  const handleView = (petId) => {
    console.log('View pet with id:', petId);
  };

  const handleDelete = (petId) => {
    console.log('Delete pet with id:', petId);
  };

  const Cell = ({ columnIndex, rowIndex, style }) => { 
    const index = rowIndex * columnCount + columnIndex;
    const pet = pets[index];
  
    if (!pet) return null;
  
    return (
      <div style={{ ...style, paddingTop: '20px' }}>
        <div className="liked-pet-card">
          <img src={pet.image_url} alt={pet.name} className="liked-pet-image" />
          <div className="liked-pet-details">
            <div className="button-container">
              <button className="view-btn" onClick={() => handleView(pet.animal_id)}>👁️</button>
            <h2 className="liked-pet-name">{pet.name}</h2>
              <button className="delete-btn" onClick={() => handleDelete(pet.animal_id)}>✕</button>
            </div>
            <p className="liked-pet-info">{pet.species} • {pet.breed}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="liked-pets-page">
      <h1>Your liked Pets</h1>
      {pets.length > 0 ? (
        <div style={{ padding: containerPadding }}>
          <Grid
            columnCount={columnCount}
            columnWidth={gridWidth / columnCount}
            height={Math.min(window.innerHeight - 200, rowCount * rowHeight)}
            rowCount={rowCount}
            rowHeight={rowHeight}
            width={gridWidth}
          >
            {Cell}
          </Grid>
        </div>
      ) : (
        <p>No pets found</p>
      )}
    </div>
  );
};

export default LikedPetsPage;