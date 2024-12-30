import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';  

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="paw-icon">🐾</span> PawSwipe
      </div>
      <div className="navbar-links">
          <Link to="/" style={{ margin: '0 10px' }}>Home</Link>
          <Link to="/register" style={{ margin: '0 10px' }}>Register</Link>
          <Link to="/login" style={{ margin: '0 10px' }}>Login</Link>
          <Link to="/users" style={{ margin: '0 10px' }}>Users</Link>
          <Link to="/profile" style={{ margin: '0 10px' }}>Profile</Link>
          <Link to="/logout" style={{ margin: '0 10px' }}>Logout</Link>
      </div>
    </nav>
  );
};

export default Navbar;
