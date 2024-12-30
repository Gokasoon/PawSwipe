import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProfilePage = () => {
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/me');
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch user');
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>User</h1>
      <ul>
        {user.map((usr) => (
          <li key={usr.id}>
            <strong>{usr.username}</strong> - {usr.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfilePage;
