import React, { useState, useEffect } from 'react';
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
  
  const [isStarting, setIsStarting] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

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
    window.location.href = '/login';
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/logout', { method: 'GET' });
      if (response.ok) {
        setIsAuthenticated(false);
        setUser(null);
        setServerStatus({ status: 'not_assigned', instanceId: null, serverIp: null });
      }
    } catch (err) {
      setError('Logout failed. Please try again.');
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/check-auth');
        const data = await response.json();
        setIsAuthenticated(data.isAuthenticated);
        
        if (data.isAuthenticated) {
          const dashboardResponse = await fetch('/dashboard');
          const dashboardData = await dashboardResponse.json();
          setServerStatus(prev => ({
            ...prev, 
            status: dashboardData.server_status
          }));
        }
      } catch (err) {
        setError('Authentication check failed');
      }
    };

    checkAuth();
  }, []);

  const handleStartServer = async () => {
    setIsStarting(true);
    setError(null);
    try {
      const response = await fetch('/start-server', { method: 'POST' });
      const data = await response.json();
      setServerStatus(prev => ({
        ...prev,
        status: 'starting',
        instanceId: data.instance_id
      }));
    } catch (err) {
      setError('Failed to start server. Please try again.');
    } finally {
      setIsStarting(false);
    }
  };

  const handleStopServer = async () => {
    setIsStopping(true);
    setError(null);
    try {
      const response = await fetch('/stop-server', { method: 'POST' });
      const data = await response.json();
      setServerStatus(prev => ({
        ...prev,
        status: 'stopping'
      }));
    } catch (err) {
      setError('Failed to stop server. Please try again.');
    } finally {
      setIsStopping(false);
    }
  };

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

        {isAuthenticated && (
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
        )}

        {!isAuthenticated && (
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