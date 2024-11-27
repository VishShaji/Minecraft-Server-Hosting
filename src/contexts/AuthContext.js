import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;

// Ensure proper format for Cognito domain
const REGION = 'ap-south-1';
const USER_POOL_DOMAIN = 'ap-south-1squnbxjqf';
const COGNITO_DOMAIN = `https://${USER_POOL_DOMAIN}.auth.${REGION}.amazoncognito.com`;

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
    try {
      // Ensure all parameters are defined
      if (!COGNITO_DOMAIN || !CLIENT_ID || !REDIRECT_URI) {
        console.error('Missing configuration:', { COGNITO_DOMAIN, CLIENT_ID, REDIRECT_URI });
        return;
      }

      const params = new URLSearchParams({
        client_id: CLIENT_ID,
        response_type: 'code',
        scope: 'email openid phone',
        redirect_uri: REDIRECT_URI
      });

      const loginUrl = `${COGNITO_DOMAIN}/oauth2/authorize?${params.toString()}`;
      console.log('Redirecting to:', loginUrl);
      window.location.href = loginUrl;
    } catch (error) {
      console.error('Login redirect failed:', error);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('token');
      setUser(null);
      const params = new URLSearchParams({
        client_id: CLIENT_ID,
        logout_uri: REDIRECT_URI.split('/callback')[0]
      });
      window.location.href = `${COGNITO_DOMAIN}/oauth2/logout?${params.toString()}`;
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear local state even if redirect fails
      localStorage.removeItem('token');
      setUser(null);
    }
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
