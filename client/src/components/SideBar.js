// src/Components/Sidebar.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importing useNavigate
import '../styles/SideBar.css'; // Importing the sidebar styles
import { auth } from '../firebase'; // Import the authentication module

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    if (user === null) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (user === null) {
    // Optionally, return null or a loading indicator to avoid rendering content before navigation
    return null;
  }

  const handleNavigation = (path) => {
    navigate(path); // Redirect to the specified route
    toggleSidebar(); // Close the sidebar after navigating
  };

  return (
    <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="close-btn" onClick={toggleSidebar}>Close</button>
      <button className="dashboard-btn" onClick={() => handleNavigation('/home')}>Dashboard</button>
      <button className="venues-btn" onClick={() => handleNavigation('/venues')}>Venues</button>
      <button className="reports-btn" onClick={() => handleNavigation('/reports')}>Reports</button>
      <button className="logout-btn" onClick={() => handleNavigation('/login')}>Logout</button>
    </nav>
  );
};

export default Sidebar;
