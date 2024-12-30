import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SwipePage from './SwipePage';
import UsersPage from './UsersPage';
import RegisterPage from './RegisterPage';
import LoginPage from './LoginPage';
import ProfilePage from './ProfilePage';
import LogoutPage from './LogoutPage';
import Navbar from './Navbar';

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<SwipePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/logout" element={<LogoutPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
