import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { get, post } from '@aws-amplify/api';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const { user } = useAuth();
  const [serverStatus, setServerStatus] = useState('not_assigned');
  const [serverIp, setServerIp] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
    } else {
      fetchServerStatus();
      const interval = setInterval(fetchServerStatus, 10000);
      return () => clearInterval(interval);
    }
  }, [user, navigate]);

  async function fetchServerStatus() {
    try {
      const response = await get({
        apiName: 'api',
        path: '/dashboard',
        options: {
          headers: {
            Authorization: `Bearer ${user.accessToken}`
          }
        }
      });
      
      setServerStatus(response.server_status.toUpperCase());
      setServerIp(response.server_ip || '');
      setError(null);
    } catch (error) {
      console.error('Error fetching server status:', error);
      setError('Failed to fetch server status. Please try again.');
    }
    setLoading(false);
  }

  async function handleStartStop() {
    setLoading(true);
    try {
      const endpoint = serverStatus === 'RUNNING' ? '/stop-server' : '/start-server';
      await post({
        apiName: 'api',
        path: endpoint,
        options: {
          headers: {
            Authorization: `Bearer ${user.accessToken}`
          }
        }
      });
      
      // Update status immediately for better UX
      setServerStatus(serverStatus === 'RUNNING' ? 'STOPPING' : 'STARTING');
      setError(null);
      
      // Fetch the actual status after a short delay
      setTimeout(fetchServerStatus, 2000);
    } catch (error) {
      console.error('Error managing server:', error);
      setError('Failed to manage server. Please try again.');
    }
    setLoading(false);
  }

  if (!user) {
    return null;
  }

  const getStatusDisplay = (status) => {
    switch (status.toLowerCase()) {
      case 'not_assigned':
        return 'NOT ASSIGNED';
      case 'not_found':
        return 'NOT FOUND';
      default:
        return status;
    }
  };

  const canStartStop = !['STARTING', 'STOPPING'].includes(serverStatus) && 
                      serverStatus !== 'not_found';

  return (
    <div className="dashboard">
      <h2>Minecraft Server Dashboard</h2>
      {error && <div className="error-message">{error}</div>}
      
      <div className="status-container">
        <h3>Server Status</h3>
        <p>Status: <span className={`status ${serverStatus.toLowerCase()}`}>
          {getStatusDisplay(serverStatus)}
        </span></p>
        {serverIp && <p>Server IP: <strong>{serverIp}</strong></p>}
      </div>

      {!loading && serverStatus !== 'not_found' && (
        <button
          className="primary"
          onClick={handleStartStop}
          disabled={!canStartStop}
        >
          {serverStatus === 'RUNNING' ? 'Stop Server' : 'Start Server'}
        </button>
      )}

      {serverStatus === 'RUNNING' && serverIp && (
        <div className="server-info">
          <h3>Connection Information</h3>
          <p>To connect to your Minecraft server:</p>
          <ol>
            <li>Open Minecraft Java Edition</li>
            <li>Click "Multiplayer"</li>
            <li>Click "Add Server"</li>
            <li>Enter the Server IP: <strong>{serverIp}</strong></li>
            <li>Click "Done" and select your server from the list</li>
          </ol>
        </div>
      )}

      {serverStatus === 'not_assigned' && (
        <div className="server-info">
          <p>Click "Start Server" to create your first Minecraft server instance.</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
