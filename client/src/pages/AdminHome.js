// src/pages/HomeAdmin.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminHome.css';
import MainIcon from '../components/MainIcon'; // Ensure the correct import path

function HomeAdmin() {
  const navigate = useNavigate();

  return (
    <article className="home-admin">
      <MainIcon 
        iconClass="fa-solid fa-calendar" 
        text="Manage Bookings" 
        onClickFunction={() => navigate('/manage-bookings')}
      />
      <MainIcon 
        iconClass="fa-solid fa-clipboard-list" 
        text="Manage Reports" 
        onClickFunction={() => navigate('/manage-reports')}
      />
      <MainIcon 
        iconClass="fa-solid fa-question-circle" 
        text="Manage Requests" 
        onClickFunction={() => navigate('/manage-requests')}
      />
      <MainIcon 
        iconClass="fa-solid fa-building" 
        text="Manage Venues" 
        onClickFunction={() => navigate('/manage-venues')}
      />
    </article>
  );
}

export default HomeAdmin;
