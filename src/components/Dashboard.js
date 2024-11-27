import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

function Dashboard() {
  const { user } = useAuth();
  const [serverStatus, setServerStatus] = useState('loading');
  const [serverIp, setServerIp] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchServerStatus = async () => {
    try {
      const response = await fetch('https://d6wrnrfjri.execute-api.ap-south-1.amazonaws.com/dev/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch server status');
      
      const data = await response.json();
      setServerStatus(data.server_status);
      setServerIp(data.server_ip);
      setError(null);
    } catch (err) {
      console.error('Error fetching server status:', err);
      setError('Failed to fetch server status');
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
      const response = await fetch('https://d6wrnrfjri.execute-api.ap-south-1.amazonaws.com/dev/start-server', {
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
      const response = await fetch('https://d6wrnrfjri.execute-api.ap-south-1.amazonaws.com/dev/stop-server', {
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
            <div className="flex items-center space-x-4">
              <div className={`h-3 w-3 rounded-full ${
                serverStatus === 'RUNNING' ? 'bg-green-500' :
                serverStatus === 'TERMINATED' ? 'bg-red-500' :
                'bg-yellow-500'
              }`}></div>
              <span className="text-lg capitalize">{serverStatus.toLowerCase()}</span>
            </div>
            
            {serverIp && (
              <div className="mt-4">
                <p className="text-gray-600">Server IP:</p>
                <code className="bg-gray-100 px-2 py-1 rounded">{serverIp}</code>
              </div>
            )}
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
