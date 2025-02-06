import React, { useContext } from 'react';
import "./Logout.css"
import { AuthContext } from '../../Contexts/AuthContext';

function Logout() {
  const { setAuthToken } = useContext(AuthContext);

  const handleLogout = async () => {
    const response = await fetch('https://frontend-take-home-service.fetch.com/auth/logout', {
      method: 'POST',
      credentials: 'include', // Include credentials to ensure the cookie is sent
    });

    if (response.ok) {
      document.cookie = 'fetch-access-token=; Max-Age=0'; // Clear cookie
      setAuthToken(null); // Clear state
      // Optionally, redirect the user after logout
    } else {
      console.error('Logout failed');
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
}

export default Logout;
