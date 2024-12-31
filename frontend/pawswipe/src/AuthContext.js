import React, { createContext, useState, useContext, useEffect } from 'react';

// Define role constants
export const ROLES = {
  CLIENT: 0,
  STAFF: 1,
  ADMIN: 2,
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Safe initialization from localStorage
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    
    setIsLoggedIn(!!token);
    
    // Safely parse the role with error handling
    try {
      const parsedRole = storedRole ? JSON.parse(storedRole) : null;
      // Validate that the role is one of the expected values
      setRole(Object.values(ROLES).includes(parsedRole) ? parsedRole : null);
    } catch (error) {
      console.error('Error parsing role:', error);
      localStorage.removeItem('role'); // Clear invalid role
      setRole(null);
    }
  }, []);

  const login = (token, userRole) => {
    if (!token) throw new Error('Token is required');
    if (!Object.values(ROLES).includes(userRole)) {
      throw new Error('Invalid role provided');
    }

    localStorage.setItem('token', token);
    localStorage.setItem('role', JSON.stringify(userRole));
    setIsLoggedIn(true);
    setRole(userRole);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setRole(null);
  };

  // Role checking helper functions
  const isAdmin = () => role === ROLES.ADMIN;
  const isStaff = () => role === ROLES.STAFF;
  const isClient = () => role === ROLES.CLIENT;

  return (
    <AuthContext.Provider 
      value={{ 
        isLoggedIn, 
        role, 
        login, 
        logout,
        isAdmin,
        isStaff,
        isClient
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};