import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '@aws-amplify/auth';

function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    async function handleCallback() {
      try {
        await getCurrentUser();
        navigate('/dashboard');
      } catch (error) {
        console.error('Error during authentication:', error);
        navigate('/');
      }
    }

    handleCallback();
  }, [navigate]);

  return <div>Authenticating...</div>;
}

export default Callback;
