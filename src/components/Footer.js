import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/faq">FAQ</Link></li>
          <li><a href="mailto:support@minecrafthosting.com">Support</a></li>
        </ul>
      </nav>
      <p>&copy; 2023 Minecraft Server Hosting. All rights reserved.</p>
    </footer>
  );
}

export default Footer;

