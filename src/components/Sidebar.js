import React from 'react';
import { logout } from '../api';

function Sidebar({ isAuthenticated, user, setIsAuthenticated, setUser, setServerStatus }) {
  const handleLogin = () => {
    window.location.href = 'https://ap-south-1squnbxjqf.auth.ap-south-1.amazoncognito.com/login?client_id=3h790bho4eq9je3ofgeuih854b&response_type=code&scope=email+openid+phone&redirect_uri=https://master.d22iypo0elndm1.amplifyapp.com/callback';
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsAuthenticated(false);
      setUser(null);
      setServerStatus({ status: 'not_assigned', instanceId: null, serverIp: null });
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <div className="sidebar">
      <h1 className="app-title">Minecraft Hosting</h1>
      
      {isAuthenticated ? (
        <div className="user-section">
          <div className="user-info">
            <span className="user-icon">👤</span>
            <span>{user?.email || 'User'}</span>
          </div>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      ) : (
        <button onClick={handleLogin} className="login-button">
          Login
        </button>
      )}
    </div>
  );
}

export default Sidebar;

