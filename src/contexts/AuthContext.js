import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;
const COGNITO_DOMAIN = process.env.REACT_APP_COGNITO_DOMAIN;
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_ENDPOINT}/check-auth`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser({ email: data.email });
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = () => {
    const loginUrl = `${COGNITO_DOMAIN}/login?` + new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: 'code',
      scope: 'email openid phone',
      redirect_uri: REDIRECT_URI
    });
    window.location.href = loginUrl;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    const logoutUrl = `${COGNITO_DOMAIN}/logout?` + new URLSearchParams({
      client_id: CLIENT_ID,
      logout_uri: REDIRECT_URI.split('/callback')[0]
    });
    window.location.href = logoutUrl;
  };

  const handleCallback = async (code) => {
    try {
      const response = await fetch(`${API_ENDPOINT}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        await checkAuth();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token exchange failed:', error);
      return false;
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    handleCallback,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
