import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Header() {
  const { user, login, logout } = useAuth();

  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          {user && <li><Link to="/dashboard">Dashboard</Link></li>}
          <li><Link to="/faq">FAQ</Link></li>
        </ul>
      </nav>
      {user ? (
        <div className="profile">
          <span>{user.username}</span>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={login}>Login</button>
      )}
    </header>
  );
}

export default Header;

