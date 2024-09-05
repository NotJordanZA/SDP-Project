import React from 'react';
import '../styles/homePage.css';
import MainIcon from '../components/mainIcon'; // Ensure the correct import path

const HomePage = () => {
  return (
    <article className="home-page">
        <MainIcon iconClass="fa-solid fa-house icon-img" text="BOOK A VENUE" />
        <MainIcon iconClass="fa-solid fa-calendar icon-img" text="VIEW CALENDAR" />
        <MainIcon iconClass="fa-solid fa-clipboard-check icon-img" text="MY BOOKINGS" />
        <MainIcon iconClass="fa-solid fa-file-alt icon-img" text="FILE A REPORT" /> 
    </article>
  );
};

export default HomePage;
