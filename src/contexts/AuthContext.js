import React, { createContext, useState, useEffect, useContext } from 'react';
import { signInWithRedirect, signOut, getCurrentUser, fetchAuthSession, AuthError } from '@aws-amplify/auth';
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
    
    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      console.log('Auth event:', payload.event);
      switch (payload.event) {
        case 'signedIn':
          checkUser();
          break;
        case 'signedOut':
          setUser(null);
          break;
        case 'customOAuthState':
          console.log('Custom OAuth State:', payload.data);
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
      
      setUser({
        ...userData,
        accessToken: session.tokens?.accessToken?.toString(),
        idToken: session.tokens?.idToken?.toString()
      });
      setError(null);
    } catch (error) {
      if (!(error instanceof AuthError && error.name === 'UserUnauthorizedException')) {
        console.error('Auth error:', error);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login() {
    try {
      setError(null);
      console.log('Starting login redirect...');
      await signInWithRedirect();
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
