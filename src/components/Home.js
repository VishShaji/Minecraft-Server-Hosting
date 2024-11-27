import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Home() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      login();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-6 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-8">
            Host Your Minecraft Server
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Start your own Minecraft server in minutes. Easy setup, instant deployment,
            and full control over your gaming experience.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300"
          >
            Get Started
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Instant Setup</h3>
            <p className="text-gray-600">
              Launch your server with just a few clicks. No technical knowledge required.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Full Control</h3>
            <p className="text-gray-600">
              Start, stop, and manage your server whenever you want.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">High Performance</h3>
            <p className="text-gray-600">
              Powered by cloud infrastructure for optimal gaming experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
