import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [serverStatus, setServerStatus] = useState('loading');

  // Base API URL from API Gateway
  const apiBaseUrl = "https://d6wrnrfjri.execute-api.ap-south-1.amazonaws.com/dev";

  useEffect(() => {
    // Fetch the server status from the backend
    fetch(`${apiBaseUrl}/dashboard`, {
      method: 'GET',
      credentials: 'include', // Include cookies for session handling
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch server status');
        }
        return response.json();
      })
      .then((data) => {
        setServerStatus(data.server_status);
      })
      .catch((error) => {
        console.error('Error fetching server status:', error);
        setServerStatus('error');
      });
  }, []);

  const startServer = () => {
    // Call backend API to start the server
    fetch(`${apiBaseUrl}/start-server`, {
      method: 'POST',
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to start server');
        }
        return response.json();
      })
      .then((data) => {
        alert(data.message);
        setServerStatus('starting');
      })
      .catch((error) => {
        console.error('Error starting server:', error);
        alert('Failed to start server');
      });
  };

  const stopServer = () => {
    // Call backend API to stop the server
    fetch(`${apiBaseUrl}/stop-server`, {
      method: 'POST',
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to stop server');
        }
        return response.json();
      })
      .then((data) => {
        alert(data.message);
        setServerStatus('stopped');
      })
      .catch((error) => {
        console.error('Error stopping server:', error);
        alert('Failed to stop server');
      });
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Dashboard</h2>
      <p>Server Status: {serverStatus}</p>
      {serverStatus === 'loading' && <p>Loading...</p>}
      {serverStatus === 'error' && <p>Failed to fetch server status. Try refreshing.</p>}
      {serverStatus !== 'not_assigned' && serverStatus !== 'error' && (
        <>
          {serverStatus === 'starting' ? (
            <p>Your server is starting...</p>
          ) : (
            <>
              <button
                onClick={startServer}
                disabled={serverStatus === 'starting' || serverStatus === 'running'}
                style={{ marginRight: '10px' }}
              >
                Start Server
              </button>
              <button
                onClick={stopServer}
                disabled={serverStatus === 'stopped'}
              >
                Stop Server
              </button>
            </>
          )}
        </>
      )}
      {serverStatus === 'not_assigned' && (
        <p>No server assigned. Please start a new server.</p>
      )}
    </div>
  );
};

export default Dashboard;
