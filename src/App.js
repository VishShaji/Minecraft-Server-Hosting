import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user is logged in by verifying the session (or tokens)
    fetch("https://d6wrnrfjri.execute-api.ap-south-1.amazonaws.com/dev/check-auth", {
      method: "GET",
      credentials: "include", // Include cookies for session handling
    })
      .then((response) => response.json())
      .then((data) => {
        setIsAuthenticated(data.isAuthenticated);
      })
      .catch((error) => {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
      });
  }, []);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Login />
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? <Dashboard /> : <Navigate to="/" />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
