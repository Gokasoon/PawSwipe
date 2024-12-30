import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SwipePage from './SwipePage';
import UsersPage from './UsersPage';
import RegisterPage from './RegisterPage';
import LoginPage from './LoginPage';
import ProfilePage from './ProfilePage';

const App = () => {
  return (
    <Router>
      <div>
        {/* Navigation Links */}
        <nav style={{ padding: '10px', background: '#f0f0f0', marginBottom: '20px' }}>
          <Link to="/" style={{ margin: '0 10px' }}>Home</Link>
          <Link to="/register" style={{ margin: '0 10px' }}>Register</Link>
          <Link to="/login" style={{ margin: '0 10px' }}>Login</Link>
          <Link to="/users" style={{ margin: '0 10px' }}>Users</Link>
          <Link to="/profile" style={{ margin: '0 10px' }}>Profile</Link>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<SwipePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
