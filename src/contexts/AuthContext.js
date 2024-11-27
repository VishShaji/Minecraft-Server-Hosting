import React, { createContext, useState, useEffect, useContext } from 'react';
import { Auth } from '@aws-amplify/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const userData = await Auth.currentAuthenticatedUser();
      setUser(userData);
    } catch (error) {
      setUser(null);
    }
    setLoading(false);
  }

  async function login() {
    try {
      await Auth.federatedSignIn();
    } catch (error) {
      console.error('Error during login:', error);
    }
  }

  async function logout() {
    try {
      await Auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  const value = {
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

