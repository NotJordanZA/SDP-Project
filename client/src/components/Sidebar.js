import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ isOpen, toggleMenu }) {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="close-btn" onClick={toggleMenu}>
        &times;
      </button>
      <ul>
        <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
        <li><Link to="/manage-bookings" onClick={toggleMenu}>Manage Bookings</Link></li>
        <li><Link to="/manage-reports" onClick={toggleMenu}> Manage Reports</Link></li>
        <li><Link to="/manage-requests" onClick={toggleMenu}>Manage Requests</Link></li>
        <li><Link to="/manage-venues" onClick={toggleMenu}>Manage Venues</Link></li>
      </ul>
    </aside>
  );
}

export default Sidebar;
