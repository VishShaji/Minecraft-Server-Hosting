import React, { useState } from 'react';
import { startServer, stopServer } from '../api';

function ServerStatus({ serverStatus, setServerStatus, setError }) {
  const [isStarting, setIsStarting] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

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
}

export default ServerStatus;

