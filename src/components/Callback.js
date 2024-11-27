import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '@aws-amplify/auth';

function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    async function handleCallback() {
      try {
        await Auth.currentAuthenticatedUser();
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

