import React, { useState } from 'react';
import './Tabs.css';  // Optional: For tab styling

function Tabs({ onTabChange }) {
  const [activeTab, setActiveTab] = useState('seeBookings');

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    onTabChange(tabName);
  };

  return (
    <div className="tabs">
      <button 
        className={`tab-button ${activeTab === 'seeBookings' ? 'active' : ''}`} 
        onClick={() => handleTabClick('seeBookings')}
      >
        Manage (Cancel/Edit) a booking
      </button>
      <button 
        className={`tab-button ${activeTab === 'bookVenue' ? 'active' : ''}`} 
        onClick={() => handleTabClick('bookVenue')}
      >
        Book a Venue
      </button>
    </div>
  );
}

export default Tabs;
