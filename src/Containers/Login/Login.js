import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';
import { AuthContext } from "../../Contexts/AuthContext";

const API_BASE_URL = "https://frontend-take-home-service.fetch.com";

function Login() {
  const { setAuthToken } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = document.cookie.split('; ').find(row => row.startsWith('fetch-access-token='));
    if (token) {
      setAuthToken(token.split('=')[1]);
      navigate('/search');
    }
  }, [navigate, setAuthToken]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email }),
      credentials: 'include', 
    });

    if (response.ok) {
      setAuthToken(true); 
      navigate('/search'); 
    } else {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="Login">
      <h1>PawPicks</h1>
      <div className="form-container">
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
