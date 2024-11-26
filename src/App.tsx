import React, { useState, useEffect } from 'react';
import { checkAuth, getDashboard, startServer, stopServer, logout } from './api';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [serverStatus, setServerStatus] = useState({
    status: 'not_assigned',
    instanceId: null,
    serverIp: null
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        const authData = await checkAuth();
        setIsAuthenticated(authData.isAuthenticated);
        
        if (authData.isAuthenticated) {
          const dashboardData = await getDashboard();
          setUser(dashboardData.user);
          setServerStatus({
            status: dashboardData.server_status,
            instanceId: dashboardData.instance_id,
            serverIp: dashboardData.server_ip
          });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  const handleCopyIP = async () => {
    if (serverStatus.serverIp) {
      try {
        await navigator.clipboard.writeText(serverStatus.serverIp);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        setError('Failed to copy IP address');
      }
    }
  };

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
      setError(err.message);
    }
  };

  const handleStartServer = async () => {
    setIsStarting(true);
    setError(null);
    try {
      const data = await startServer();
      setServerStatus(prev => ({
        ...prev,
        status: 'starting',
        instanceId: data.instance_id
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsStarting(false);
    }
  };

  const handleStopServer = async () => {
    setIsStopping(true);
    setError(null);
    try {
      await stopServer();
      setServerStatus(prev => ({
        ...prev,
        status: 'stopping'
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsStopping(false);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app-container">
      <div className="sidebar">
        <h1 className="app-title">Minecraft Hosting</h1>
        
        {isAuthenticated ? (
          <div className="user-section">
            <div className="user-info">
              <span className="user-icon">👤</span>
              <span>{user?.email || 'User'}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="logout-button"
            >
              Logout
            </button>
          </div>
        ) : (
          <button 
            onClick={handleLogin}
            className="login-button"
          >
            Login
          </button>
        )}
      </div>

      <div className="main-content">
        {error && (
          <div className="error-banner">
            {error}
            <button 
              onClick={() => setError(null)} 
              className="close-error"
            >
              ✕
            </button>
          </div>
        )}

        {isAuthenticated ? (
          <div className="server-status-container">
            <h2 className="server-status-title">Server Status</h2>

            <div className="server-status-details">
              <div className="server-status-header">
                <span className="status-text">
                  {serverStatus.status || 'Not Assigned'}
                </span>
                
                <div className="server-actions">
                  {serverStatus.status === 'not_assigned' && (
                    <button 
                      onClick={handleStartServer}
                      disabled={isStarting}
                      className="start-server-button"
                    >
                      {isStarting ? 'Starting...' : 'Create Server'}
                    </button>
                  )}
                  
                  {serverStatus.status === 'RUNNING' && (
                    <button 
                      onClick={handleStopServer}
                      disabled={isStopping}
                      className="stop-server-button"
                    >
                      {isStopping ? 'Stopping...' : 'Stop Server'}
                    </button>
                  )}
                </div>
              </div>

              {serverStatus.status === 'RUNNING' && (
                <div className="server-connection-details">
                  <span>Server IP: {serverStatus.serverIp || 'Generating...'}</span>
                  <button 
                    onClick={handleCopyIP}
                    className="copy-ip-button"
                  >
                    {isCopied ? 'Copied!' : 'Copy IP'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="welcome-section">
            <h2>Welcome to Minecraft Server Hosting</h2>
            <p>Login to create and manage your Minecraft server</p>
            <button 
              onClick={handleLogin}
              className="login-button"
            >
              Login with Cognito
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

