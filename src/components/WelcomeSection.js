import React from 'react';

function WelcomeSection() {
  const handleLogin = () => {
    window.location.href = 'https://ap-south-1squnbxjqf.auth.ap-south-1.amazoncognito.com/login?client_id=3h790bho4eq9je3ofgeuih854b&response_type=code&scope=email+openid+phone&redirect_uri=https://master.d22iypo0elndm1.amplifyapp.com/callback';
  };

  return (
    <div className="welcome-section">
      <h2>Welcome to Minecraft Server Hosting</h2>
      <p>Login to create and manage your Minecraft server</p>
      <button onClick={handleLogin} className="login-button">
        Login with Cognito
      </button>
    </div>
  );
}

export default WelcomeSection;

