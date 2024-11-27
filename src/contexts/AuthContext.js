import React, { createContext, useState, useEffect, useContext } from 'react';
import { signInWithRedirect, signOut, getCurrentUser, fetchAuthSession } from '@aws-amplify/auth';
import { Hub } from '@aws-amplify/core';

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

    // Listen for auth events
    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      switch (payload.event) {
        case 'signedIn':
          checkUser();
          break;
        case 'signedOut':
          setUser(null);
          break;
        case 'tokenRefresh':
          checkUser();
          break;
        case 'tokenRefresh_failure':
          setError('Session expired. Please login again.');
          setUser(null);
          break;
        default:
          break;
      }
    });

    return () => unsubscribe();
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
      if (error.message !== 'No current user') {
        console.error('Auth error:', error);
      }
      setUser(null);
    }
    setLoading(false);
  }

  async function login() {
    try {
      setError(null);
      await signInWithRedirect({
        provider: 'Cognito',
        options: {
          redirectSignIn: window.location.origin + '/callback',
          redirectSignOut: window.location.origin
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to login. Please try again.');
    }
  }

  async function logout() {
    try {
      setError(null);
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      setError('Failed to logout. Please try again.');
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
