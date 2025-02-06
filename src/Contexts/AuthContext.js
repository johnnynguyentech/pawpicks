import React, { createContext, useState, useEffect } from 'react';

// Create a context for authentication
const AuthContext = createContext();

// AuthProvider component to provide auth state to the app
function AuthProvider({ children }) {
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const token = document.cookie.split('; ').find(row => row.startsWith('fetch-access-token='));
    if (token) {
      setAuthToken(token.split('=')[1]);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authToken, setAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
}

// Export AuthContext as named export and AuthProvider as named export
export { AuthContext, AuthProvider };

