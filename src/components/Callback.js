import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Callback() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [user, loading, navigate]);

  return (
    <div className="callback-container">
      <p>Completing login...</p>
    </div>
  );
}

export default Callback;
