import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetch("https://d6wrnrfjri.execute-api.ap-south-1.amazonaws.com/dev/check-auth", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setIsAuthenticated(data.isAuthenticated);
      })
      .catch((error) => {
        console.error("Error checking authentication:", error);
      });
  }, []);

  return (
    <nav style={{ padding: '10px 20px', backgroundColor: '#007bff' }}>
      <ul style={{ listStyle: 'none', display: 'flex', justifyContent: 'space-around' }}>
        {!isAuthenticated && (
          <li>
            <Link to="/" style={linkStyle}>
              Login
            </Link>
          </li>
        )}
        {isAuthenticated && (
          <li>
            <Link to="/dashboard" style={linkStyle}>
              Dashboard
            </Link>
          </li>
        )}
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
