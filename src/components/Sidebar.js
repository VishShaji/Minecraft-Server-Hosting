import React from 'react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { isAuthenticated, user, logout, login } = useAuth();

  return (
    <div className="sidebar">
      <h1 className="app-title">Minecraft Hosting</h1>
      
      {isAuthenticated ? (
        <div className="user-section">
          <div className="user-info">
            <span className="user-icon">👤</span>
            <span>{user?.email || 'User'}</span>
          </div>
          <button 
            onClick={logout}
            className="logout-button"
          >
            Logout
          </button>
        </div>
      ) : (
        <button 
          onClick={login}
          className="login-button"
        >
          Login
        </button>
      )}
    </div>
  );
};

export default Sidebar;