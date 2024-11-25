import React from 'react';

const Login = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Login</h2>
      <p>Please sign in to your account</p>
      <button
        onClick={() => window.location.href = 'https://ap-south-1squnbxjqf.auth.ap-south-1.amazoncognito.com/login?client_id=3h790bho4eq9je3ofgeuih854b&response_type=code&scope=email+openid+phone&redirect_uri=https://master.d22iypo0elndm1.amplifyapp.com/callback'}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Login with Cognito
      </button>
    </div>
  );
};

export default Login;
