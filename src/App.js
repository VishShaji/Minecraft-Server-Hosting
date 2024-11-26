import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ServerStatus from './components/ServerStatus';
import WelcomeSection from './components/WelcomeSection';
import { checkAuth, getDashboard } from './api';
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

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app-container">
      <Sidebar 
        isAuthenticated={isAuthenticated} 
        user={user} 
        setIsAuthenticated={setIsAuthenticated}
        setUser={setUser}
        setServerStatus={setServerStatus}
      />
      <div className="main-content">
        {error && (
          <div className="error-banner">
            {error}
            <button onClick={() => setError(null)} className="close-error">✕</button>
          </div>
        )}
        {isAuthenticated ? (
          <ServerStatus 
            serverStatus={serverStatus} 
            setServerStatus={setServerStatus}
            setError={setError}
          />
        ) : (
          <WelcomeSection />
        )}
      </div>
    </div>
  );
}

export default App;

