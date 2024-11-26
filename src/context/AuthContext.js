import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const COGNITO_LOGIN_URL = 'https://ap-south-1squnbxjqf.auth.ap-south-1.amazoncognito.com/login?client_id=3h790bho4eq9je3ofgeuih854b&response_type=code&scope=email+openid+phone&redirect_uri=https://staging.d3bsnga2fhi5b6.amplifyapp.com/callback';

  const login = () => {
    window.location.href = COGNITO_LOGIN_URL;
  };

  const logout = async () => {
    try {
      const response = await fetch('/logout', { method: 'GET' });
      if (response.ok) {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (err) {
      setError('Logout failed. Please try again.');
    }
  };

  const checkAuth = async () => {
    try {
      const response = await fetch('/check-auth');
      const data = await response.json();
      setIsAuthenticated(data.isAuthenticated);
      
      if (data.isAuthenticated) {
        const dashboardResponse = await fetch('/dashboard');
        const dashboardData = await dashboardResponse.json();
        return dashboardData;
      }
    } catch (err) {
      setError('Authentication check failed');
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      error, 
      setError, 
      login, 
      logout, 
      checkAuth 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);