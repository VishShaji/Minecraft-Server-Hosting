import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

function Dashboard() {
  const { user } = useAuth();
  const [serverStatus, setServerStatus] = useState('loading');
  const [serverIp, setServerIp] = useState(null);
  const [isServerRunning, setIsServerRunning] = useState(false);
  const [serverMessage, setServerMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchServerStatus = async () => {
    try {
      const [instanceResponse, serverStatusResponse] = await Promise.all([
        fetch(`${API_ENDPOINT}/dashboard`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }),
        fetch(`${API_ENDPOINT}/server-status`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
      ]);
      
      if (!instanceResponse.ok) throw new Error('Failed to fetch instance status');
      if (!serverStatusResponse.ok) throw new Error('Failed to fetch server status');
      
      const instanceData = await instanceResponse.json();
      const serverData = await serverStatusResponse.json();
      
      setServerStatus(instanceData.server_status);
      setServerIp(instanceData.server_ip);
      setIsServerRunning(serverData.server_running);
      setServerMessage(serverData.message);
      setError(null);
    } catch (err) {
      console.error('Error fetching status:', err);
      setError('Failed to fetch status');
    }
  };

  useEffect(() => {
    if (user) {
      fetchServerStatus();
      const interval = setInterval(fetchServerStatus, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleStartServer = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINT}/start-server`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to start server');
      
      setServerStatus('starting');
      setError(null);
    } catch (err) {
      console.error('Error starting server:', err);
      setError('Failed to start server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopServer = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINT}/stop-server`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to stop server');
      
      setServerStatus('stopping');
      setError(null);
    } catch (err) {
      console.error('Error stopping server:', err);
      setError('Failed to stop server');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Server Dashboard</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-4">Server Status</h2>
            <div className="space-y-4">
              <div>
                <span className="font-medium">Instance Status: </span>
                <span className={`capitalize ${serverStatus === 'running' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {serverStatus}
                </span>
              </div>
              
              <div>
                <span className="font-medium">Minecraft Server: </span>
                <span className={`${isServerRunning ? 'text-green-600' : 'text-yellow-600'}`}>
                  {serverMessage}
                </span>
              </div>

              {serverIp && (
                <div>
                  <span className="font-medium">Server IP: </span>
                  <span className="font-mono">{serverIp}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleStartServer}
              disabled={isLoading || serverStatus === 'RUNNING' || serverStatus === 'starting'}
              className={`px-6 py-2 rounded-lg font-semibold text-white ${
                isLoading || serverStatus === 'RUNNING' || serverStatus === 'starting'
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              Start Server
            </button>
            
            <button
              onClick={handleStopServer}
              disabled={isLoading || serverStatus === 'TERMINATED' || serverStatus === 'stopping'}
              className={`px-6 py-2 rounded-lg font-semibold text-white ${
                isLoading || serverStatus === 'TERMINATED' || serverStatus === 'stopping'
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              Stop Server
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
