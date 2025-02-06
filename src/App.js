import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './Contexts/AuthContext';
import Login from './Containers/Login/Login';
import Logout from './Components/Logout/Logout';
import SearchPage from './Containers/SearchPage/SearchPage';

function PrivateRoute({ children }) {
  const { authToken } = useContext(AuthContext);

  if (!authToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Routes>
            {/* Public Route - Login */}
            <Route path="/login" element={<Login />} />

            {/* Private Route - SearchPage (only accessible when logged in) */}
            <Route
              path="/search"
              element={
                <PrivateRoute>
                  <SearchPage />
                </PrivateRoute>
              }
            />

            {/* Logout Route */}
            <Route path="/logout" element={<Logout />} />

            {/* Redirect to login if an unknown route is accessed */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

