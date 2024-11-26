import React from 'react';
import { useAuth } from '../context/AuthContext';

const ErrorBanner = () => {
  const { error, setError } = useAuth();

  if (!error) return null;

  return (
    <div className="error-banner">
      {error}
      <button 
        onClick={() => setError(null)} 
        className="close-error"
      >
        ✕
      </button>
    </div>
  );
};

export default ErrorBanner;