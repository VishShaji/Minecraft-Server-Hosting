import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Header() {
  const { user, loading, login, logout } = useAuth();

  return (
    <header>
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-white">
              Minecraft Server Host
            </Link>
            <div className="ml-8 space-x-4">
              <Link to="/faq" className="nav-link">
                FAQ
              </Link>
              {user && (
                <Link to="/dashboard" className="nav-link">
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="w-8 h-8 border-t-2 border-white rounded-full animate-spin"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <span className="text-white">{user.email}</span>
                <button
                  onClick={logout}
                  className="btn bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={login}
                className="btn bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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
