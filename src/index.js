import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createRoot } from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'ap-south-1_sQunBxjQf',
      userPoolClientId: '3h790bho4eq9je3ofgeuih854b',
      signUpConfig: {
        socialProviders: ['COGNITO']
      },
      oauth: {
        domain: 'minecraft-server-hosting.auth.ap-south-1.amazoncognito.com',
        scope: ['email', 'openid', 'profile'],
        redirectSignIn: window.location.origin + '/callback',
        redirectSignOut: window.location.origin,
        responseType: 'code'
      }
    }
  },
  API: {
    REST: {
      api: {
        endpoint: 'https://d6wrnrfjri.execute-api.ap-south-1.amazonaws.com/dev',
        region: 'ap-south-1'
      }
    }
  }
});

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
