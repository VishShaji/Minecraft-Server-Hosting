import React, { createContext, useState, useEffect, useContext } from 'react';
import { signInWithRedirect, signOut, getCurrentUser, fetchAuthSession } from '@aws-amplify/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const userData = await getCurrentUser();
      const session = await fetchAuthSession();
      const { accessToken, idToken } = session.tokens ?? {};
      
      setUser({
        ...userData,
        username: userData.username,
        email: userData.signInDetails?.loginId,
        accessToken: accessToken?.toString(),
        idToken: idToken?.toString()
      });
      setError(null);
    } catch (error) {
      setUser(null);
      if (error.message !== 'No current user') {
        setError('Session expired. Please login again.');
        console.error('Auth error:', error);
      }
    }
    setLoading(false);
  }

  async function login() {
    try {
      setError(null);
      await signInWithRedirect();
    } catch (error) {
      setError('Failed to login. Please try again.');
      console.error('Login error:', error);
    }
  }

  async function logout() {
    try {
      setError(null);
      await signOut();
      setUser(null);
    } catch (error) {
      setError('Failed to logout. Please try again.');
      console.error('Logout error:', error);
    }
  }

  const value = {
    user,
    error,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
