import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home">
      <h1>Welcome to Minecraft Server Hosting</h1>
      <p>Host your own Minecraft server with ease!</p>
      <Link to="/dashboard" className="cta-button">Get Started</Link>
    </div>
  );
}

export default Home;

