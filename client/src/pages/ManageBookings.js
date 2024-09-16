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
    <div className="manage-bookings-container">
      <div className="tabs">
        <button
          onClick={() => setActiveTab('all')}
          className={activeTab === 'all' ? 'active' : ''}
        >
          All Bookings
        </button>
        <button
          onClick={() => setActiveTab('createbooking')}
          className={activeTab === 'createbooking' ? 'active' : ''}
        >
          Create Booking
        </button>
        <button
          onClick={() => setActiveTab('recurringbooking')}
          className={activeTab === 'recurringbooking' ? 'active' : ''}
        >
          Recurring Booking
        </button>
      </div>

      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ManageBookings;
