import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const ServerStatus = () => {
  const { isAuthenticated, login } = useAuth();
  const [serverStatus, setServerStatus] = useState({
    status: 'not_assigned',
    instanceId: null,
    serverIp: null
  });
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
        // Handle copy error
      }
    }
  };

  const handleStartServer = async () => {
    setIsStarting(true);
    try {
      const response = await fetch('/start-server', { method: 'POST' });
      const data = await response.json();
      setServerStatus(prev => ({
        ...prev,
        status: 'starting',
        instanceId: data.instance_id
      }));
    } catch (err) {
      // Handle server start error
    } finally {
      setIsStarting(false);
    }
  };

  const handleStopServer = async () => {
    setIsStopping(true);
    try {
      const response = await fetch('/stop-server', { method: 'POST' });
      const data = await response.json();
      setServerStatus(prev => ({
        ...prev,
        status: 'stopping'
      }));
    } catch (err) {
      // Handle server stop error
    } finally {
      setIsStopping(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="welcome-section">
        <h2>Welcome to Minecraft Server Hosting</h2>
        <p>Login to create and manage your Minecraft server</p>
        <button 
          onClick={login}
          className="login-button"
        >
          Login with Cognito
        </button>
      </div>
    );
  }

  return (
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
  );
};

export default ServerStatus;