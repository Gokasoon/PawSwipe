import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const ProfilePage = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { role } = useAuth();

  // Helper function to get role text
  const getRoleText = () => {
    switch (role) {
      case 2:
        return 'Administrator';
      case 1:
        return 'Staff Member';
      case 0:
        return 'Client';
      default:
        return 'Unknown Role';
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found, please log in.');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:5000/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch user');
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p>Loading user profile...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>User Profile</h1>
      <p style={{
        marginBottom: '20px',
        padding: '10px',
        backgroundColor: role === 2 ? '#ff6b6b' : role === 1 ? '#4ecdc4' : '#6c757d',
        color: 'white',
        borderRadius: '5px',
        display: 'inline-block'
      }}>
        Role: {getRoleText()}
      </p>
      <ul>
        <li><strong>Username:</strong> {user.username}</li>
        <li><strong>Email:</strong> {user.email}</li>
      </ul>
    </div>
  );
};

export default ProfilePage;