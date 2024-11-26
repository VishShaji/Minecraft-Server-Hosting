import React from 'react';
import Sidebar from './Sidebar';
import ServerStatus from './ServerStatus';
import ErrorBanner from './ErrorBanner';

const Layout = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <ErrorBanner />
        <ServerStatus />
      </div>
    </div>
  );
};

export default Layout;