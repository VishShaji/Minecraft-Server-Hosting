import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Header() {
  const { user, error, loading, login, logout } = useAuth();

  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          {user && <li><Link to="/dashboard">Dashboard</Link></li>}
          <li><Link to="/faq">FAQ</Link></li>
        </ul>
        <div className="auth-section">
          {error && <div className="error-message">{error}</div>}
          {loading ? (
            <button className="primary" disabled>Loading...</button>
          ) : user ? (
            <div className="profile">
              <span>{user.email || user.username}</span>
              <button className="primary" onClick={logout}>Logout</button>
            </div>
          ) : (
            <button className="primary" onClick={login}>Login</button>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
