import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Callback() {
  const { handleCallback } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function processCode() {
      console.log('Processing callback...');
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');
      
      console.log('URL parameters:', {
        code: code ? 'Present' : 'Not present',
        error: error || 'None'
      });
      
      if (code) {
        console.log('Exchanging code for token...');
        const success = await handleCallback(code);
        if (success) {
          console.log('Token exchange successful, redirecting to dashboard');
          navigate('/dashboard');
        } else {
          console.log('Token exchange failed, redirecting to login');
          navigate('/');
        }
      } else if (error) {
        console.error('Auth error:', error);
        navigate('/');
      } else {
        console.log('No code or error present, redirecting to login');
        navigate('/');
      }
    }

    processCode();
  }, [handleCallback, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Authenticating...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    </div>
  );
}

export default Callback;
