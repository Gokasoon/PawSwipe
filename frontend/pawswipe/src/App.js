import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import SwipePage from './SwipePage';
import UsersPage from './UsersPage';
import RegisterPage from './RegisterPage';
import LoginPage from './LoginPage';
import ProfilePage from './ProfilePage';
import LikedPetsPage from './LikedPetsPage';
import AllPetsPage from './AllPetsPage';
import Navbar from './Navbar';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<SwipePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/liked-pets" element={<LikedPetsPage />} />
            <Route path="/all-pets" element={<AllPetsPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;