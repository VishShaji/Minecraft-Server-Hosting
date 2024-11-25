import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{ padding: '10px 20px', backgroundColor: '#007bff' }}>
      <ul style={{ listStyle: 'none', display: 'flex', justifyContent: 'space-around' }}>
        <li><Link to="/" style={linkStyle}>Login</Link></li>
        <li><Link to="/dashboard" style={linkStyle}>Dashboard</Link></li>
      </ul>
    </nav>
  );
};

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  padding: '10px',
  fontSize: '18px',
};

export default Navbar;
