

import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminHome.css';
import CalendarAdmin from '../assets/CalendarAdmin.svg';
import AdminReport from '../assets/AdminReport.svg';
import question from '../assets/Question.svg';
import venue from '../assets/Venue.svg';
function AdminHome() {
  const navigate = useNavigate();

  return (
    <div className="home-admin">
      <div className="card" onClick={() => navigate('/manage-bookings')}>
        <img src={CalendarAdmin} alt="Manage Bookings" className="card-logo" />
        <h2>Manage Bookings</h2>
      </div>
      <div className="card" onClick={() => navigate('/manage-reports')}>
        <img src={AdminReport} alt="My Reports" className="card-logo" />
        <h2>Manage Reports</h2>
      </div>
      <div className="card" onClick={() => navigate('/manage-requests')}>
        <img src={question} alt="Manage Requests" className="card-logo" />
        <h2>Manage Requests</h2>
      </div>
      <div className="card" onClick={() => navigate('/manage-venues')}>
        <img src={venue} alt="Manage Venues" className="card-logo" />
        <h2>Manage Venues</h2>
      </div>
    </div>
  );
}

export default AdminHome;
