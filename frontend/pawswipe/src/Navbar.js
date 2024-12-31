import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const { role } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="paw-icon">🐾</span> PawSwipe
      </div>
      <div className="navbar-links">
        <Link to="/" style={{ margin: '0 10px' }}>Home</Link>
        
        {!isLoggedIn && (
          <>
            <Link to="/register" style={{ margin: '0 10px' }}>Register</Link>
            <Link to="/login" style={{ margin: '0 10px' }}>Login</Link>
          </>
        )}

        {isLoggedIn && (
          <>
            <Link to="/liked-pets" style={{ margin: '0 10px' }}>Likes</Link>
            {role === 2 && <Link to="/all-pets" style={{ margin: '0 10px' }}>Pets</Link>}
            {role === 2 && <Link to="/users" style={{ margin: '0 10px' }}>Users</Link>}
            <Link to="/profile" style={{ margin: '0 10px' }}>Profile</Link>
            <Link to="/" onClick={handleLogout} style={{ margin: '0 10px' }}>Logout</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;