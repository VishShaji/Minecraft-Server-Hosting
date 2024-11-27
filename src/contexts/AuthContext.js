import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID || '3h790bho4eq9je3ofgeuih854b';
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI || 'https://master.d22iypo0elndm1.amplifyapp.com/callback';

// Cognito configuration
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
      const response = await fetch(`${API_ENDPOINT}/login`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
        } else {
          localStorage.removeItem('token');
          setUser(null);
        }
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
      if (!CLIENT_ID || !REDIRECT_URI) {
        throw new Error('Missing configuration');
      }

      const params = new URLSearchParams({
        client_id: CLIENT_ID,
        response_type: 'code',
        scope: 'email openid phone',
        redirect_uri: REDIRECT_URI
      });

      const loginUrl = `${COGNITO_DOMAIN}/oauth2/authorize?${params.toString()}`;
      window.location.href = loginUrl;
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Call logout endpoint
        await fetch(`${API_ENDPOINT}/logout`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      // Clear local state regardless of server response
      localStorage.removeItem('token');
      setUser(null);
      
      // Redirect to Cognito logout
      const params = new URLSearchParams({
        client_id: CLIENT_ID,
        logout_uri: REDIRECT_URI.split('/callback')[0]
      });
      window.location.href = `${COGNITO_DOMAIN}/oauth2/logout?${params.toString()}`;
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
