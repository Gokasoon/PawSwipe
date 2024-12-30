import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProfilePage = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token from localStorage
        if (!token) {
          setError('No token found, please log in.');
          setLoading(false);
          return;
        }

        // Send the token in the Authorization header as Bearer
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
      <ul>
        <li><strong>Username:</strong> {user.username}</li>
        <li><strong>Email:</strong> {user.email}</li>
      </ul>
    </div>
  );
};

export default ProfilePage;
