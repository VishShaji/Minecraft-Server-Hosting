import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createRoot } from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

Amplify.configure({
          Auth: {
            Cognito: {
              userPoolId: 'ap-south-1_sQunBxjQf',
              userPoolClientId: '3h790bho4eq9je3ofgeuih854b',
              loginWith: {
                oauth: {
                  domain: 'ap-south-1squnbxjqf.auth.ap-south-1.amazoncognito.com',
                  scopes: ['email', 'openid', 'phone'],
                  responseType: 'code',
                  redirectSignIn: 'https://master.d22iypo0elndm1.amplifyapp.com/callback',
                  redirectSignOut: 'https://master.d22iypo0elndm1.amplifyapp.com'
                }
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
