import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  Server, 
  Power, 
  User, 
  LogOut, 
  AlertTriangle, 
  CheckCircle,
  Copy,
  Loader2
} from 'lucide-react';

// Authentication Context
const AuthContext = React.createContext();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [serverStatus, setServerStatus] = useState({
    status: 'not_assigned',
    instanceId: null,
    serverIp: null
  });
  const [error, setError] = useState(null);
  
  // New state for loading actions
  const [isStarting, setIsStarting] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Clipboard Copy Handler
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

  // Login Handler
  const handleLogin = () => {
    window.location.href = '/login';
  };

  // Logout Handler
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

  // Check Authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/check-auth');
        const data = await response.json();
        setIsAuthenticated(data.isAuthenticated);
        
        if (data.isAuthenticated) {
          // Fetch dashboard data
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

  // Start Server Handler
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

  // Stop Server Handler
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
    <AuthContext.Provider value={{ isAuthenticated, user }}>
      <div className="min-h-screen bg-gray-900 text-white flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 p-4 border-r border-gray-700">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-green-500">Minecraft Hosting</h1>
          </div>
          
          {isAuthenticated ? (
            <div>
              <div className="flex items-center mb-4">
                <User className="mr-2 text-green-500" />
                <span>{user?.email || 'User'}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center text-red-500 hover:bg-gray-700 p-2 rounded"
              >
                <LogOut className="mr-2" /> Logout
              </button>
            </div>
          ) : (
            <button 
              onClick={handleLogin}
              className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded"
            >
              Login
            </button>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Error Banner */}
          {error && (
            <div className="bg-red-600 text-white p-4 rounded mb-4 flex items-center">
              <AlertTriangle className="mr-2" />
              {error}
              <button 
                onClick={() => setError(null)} 
                className="ml-auto"
              >
                ✕
              </button>
            </div>
          )}

          {/* Server Status Section */}
          {isAuthenticated && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl mb-4 flex items-center">
                <Server className="mr-2 text-green-500" /> 
                Server Status
              </h2>

              <div className="bg-gray-900 p-4 rounded">
                <div className="flex items-center justify-between">
                  <span className="font-bold capitalize">
                    {serverStatus.status || 'Not Assigned'}
                  </span>
                  
                  {/* Server Action Buttons */}
                  <div className="space-x-2">
                    {serverStatus.status === 'not_assigned' && (
                      <button 
                        onClick={handleStartServer}
                        disabled={isStarting}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center disabled:opacity-50"
                      >
                        {isStarting ? (
                          <><Loader2 className="mr-2 animate-spin" /> Starting...</>
                        ) : (
                          <><Power className="mr-2" /> Create Server</>
                        )}
                      </button>
                    )}
                    
                    {serverStatus.status === 'RUNNING' && (
                      <button 
                        onClick={handleStopServer}
                        disabled={isStopping}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center disabled:opacity-50"
                      >
                        {isStopping ? (
                          <><Loader2 className="mr-2 animate-spin" /> Stopping...</>
                        ) : (
                          <><Power className="mr-2" /> Stop Server</>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Server Connection Details */}
                {serverStatus.status === 'RUNNING' && (
                  <div className="mt-4 bg-gray-800 p-3 rounded flex items-center justify-between">
                    <span>Server IP: {serverStatus.serverIp || 'Generating...'}</span>
                    <button 
                      onClick={handleCopyIP}
                      className="text-green-500 hover:underline flex items-center"
                    >
                      {isCopied ? (
                        <><CheckCircle className="mr-1 text-green-500" /> Copied!</>
                      ) : (
                        <><Copy className="mr-1" /> Copy IP</>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Welcome/Login Prompt */}
          {!isAuthenticated && (
            <div className="text-center">
              <h2 className="text-3xl mb-4">Welcome to Minecraft Server Hosting</h2>
              <p className="mb-6">Login to create and manage your Minecraft server</p>
              <button 
                onClick={handleLogin}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
              >
                Login with Cognito
              </button>
            </div>
          )}
        </div>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
