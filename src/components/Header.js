import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Header() {
  const { user, login, logout } = useAuth();

  return (
    <header className="bg-gray-800 text-white">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              Minecraft Server Host
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/faq" className="hover:text-gray-300">
              FAQ
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" className="hover:text-gray-300">
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Logout
                </button>
                <span className="ml-4">{user.email}</span>
              </>
            ) : (
              <button
                onClick={login}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
