import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { API } from '@aws-amplify/api';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const { user } = useAuth();
  const [serverStatus, setServerStatus] = useState('OFFLINE');
  const [serverIp, setServerIp] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
    } else {
      fetchServerStatus();
    }
  }, [user, navigate]);

  async function fetchServerStatus() {
    try {
      const response = await API.get('api', '/dashboard');
      setServerStatus(response.server_status);
      setServerIp(response.server_ip || '');
    } catch (error) {
      console.error('Error fetching server status:', error);
    }
    setLoading(false);
  }

  async function handleStartStop() {
    setLoading(true);
    try {
      if (serverStatus === 'RUNNING') {
        await API.post('api', '/stop-server');
        setServerStatus('STOPPING');
      } else {
        await API.post('api', '/start-server');
        setServerStatus('STARTING');
      }
    } catch (error) {
      console.error('Error starting/stopping server:', error);
    }
    setLoading(false);
  }

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard">
      <h2>Welcome, {user.username}!</h2>
      <div className="server-status">
        <h3>Server Status: {serverStatus}</h3>
        {serverIp && <p>Server IP: {serverIp}</p>}
      </div>
      <button onClick={handleStartStop} disabled={loading}>
        {serverStatus === 'RUNNING' ? 'Stop Server' : 'Start Server'}
      </button>
    </div>
  );
}

export default Dashboard;

