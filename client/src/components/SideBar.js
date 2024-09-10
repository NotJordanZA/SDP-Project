// src/Components/Sidebar.js
import React from 'react';
import '../styles/SideBar.css'; // Importing the sidebar styles

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="close-btn" onClick={toggleSidebar}>Close</button>
      <button className="dashboard-btn">Dashboard</button>
      <button className="notifications-btn">Notifications</button>
      <button className="search-btn">Search</button>
      <button className="logout-btn">Logout</button>
    </div>
  );
};

export default Sidebar;
