import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('https://d6wrnrfjri.execute-api.ap-south-1.amazonaws.com/dev/check-auth', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser({ email: data.email });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    window.location.href = 'https://ap-south-1squnbxjqf.auth.ap-south-1.amazoncognito.com/login?client_id=3h790bho4eq9je3ofgeuih854b&response_type=code&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fmaster.d22iypo0elndm1.amplifyapp.com%2Fcallback';
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = 'https://ap-south-1squnbxjqf.auth.ap-south-1.amazoncognito.com/logout?client_id=3h790bho4eq9je3ofgeuih854b&logout_uri=https%3A%2F%2Fmaster.d22iypo0elndm1.amplifyapp.com';
  };

  const handleCallback = async (code) => {
    try {
      const response = await fetch('https://d6wrnrfjri.execute-api.ap-south-1.amazonaws.com/dev/token', {
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
      {!loading && children}
    </AuthContext.Provider>
  );
}
