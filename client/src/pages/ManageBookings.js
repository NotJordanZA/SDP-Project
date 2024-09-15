import React, { useState } from 'react';
import AllBookings from '../components/AdminAllBookings.js'; 
import CreateBooking from '../components/AdminCreateBookings.js'; 
import RecurringBooking from '../components/AdminRecurringBookings.js'; 
import '../styles/ManageBookings.css';

const ManageBookings = () => {
  const [activeTab, setActiveTab] = useState('all');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'all':
        return <AllBookings handleEdit={() => {}} />;
      case 'createbooking':
        return <CreateBooking />;
      case 'recurringbooking':
        return <RecurringBooking />;
      default:
        return <AllBookings handleEdit={() => {}} />;
    }
  };

  return (
    <div className="adminmanage-bookings-container">
      <div className="adminmanage-tabs">
        <button
          onClick={() => setActiveTab('all')}
          className={`adminmanage-tab ${activeTab === 'all' ? 'adminmanage-active' : ''}`}
        >
          All Bookings
        </button>
        <button
          onClick={() => setActiveTab('createbooking')}
          className={`adminmanage-tab ${activeTab === 'createbooking' ? 'adminmanage-active' : ''}`}
        >
          Create Booking
        </button>
        <button
          onClick={() => setActiveTab('recurringbooking')}
          className={`adminmanage-tab ${activeTab === 'recurringbooking' ? 'adminmanage-active' : ''}`}
        >
          Recurring Booking
        </button>
      </div>

      <div className="adminmanage-tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ManageBookings;