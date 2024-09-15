import React, { useState, useEffect } from 'react';

import EditBooking from '../pages/ManageBookingsEdit.js';

const API_URL = process.env.NODE_ENV === 'production' ? 'https://your-production-site.com' : 'http://localhost:3002';

const getAllBookings = async () => {
  const response = await fetch(`${API_URL}/bookings`);
  return await response.json();
};

const updateBooking = async (id, bookingData) => {
  const response = await fetch(`${API_URL}/bookings/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingData),
  });

  if (!response.ok) {
    throw new Error('Failed to update booking');
  }
  return response.json();
};

const deleteBooking = async (id) => {
  const response = await fetch(`${API_URL}/bookings/${id}`, {
    method: "DELETE",
  });
  return await response.json();
};

const AdminAllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);
  const [filterDate, setFilterDate] = useState('');
  const [filterBookerEmail, setFilterBookerEmail] = useState('');
  const [filterVenue, setFilterVenue] = useState('');

  useEffect(() => {
    getAllBookings().then(data => setBookings(data.bookings));
  }, []);

  const handleEdit = (booking) => {
    setEditingBooking(booking);
  };

  const handleSave = async (updatedBooking) => {
    try {
      await updateBooking(updatedBooking.id, updatedBooking);
      setBookings(bookings.map(b => (b.id === updatedBooking.id ? updatedBooking : b)));
      setEditingBooking(null);
    } catch (error) {
      console.error("Failed to update booking:", error);
    }
  };

  const handleCancel = () => {
    setEditingBooking(null);
  };

  const handleDelete = async (bookingId) => {
    try {
      await deleteBooking(bookingId);
      setBookings(bookings.filter(booking => booking.id !== bookingId));
    } catch (error) {
      console.error("Failed to delete booking:", error);
    }
  };

  //display each venue once
  const uniqueVenues = [...new Set(bookings.map(booking => booking.venueID))];

  const filteredBookings = bookings.filter(booking => {
    return (
      (filterDate ? booking.bookingDate === filterDate : true) &&
      (filterBookerEmail ? booking.venueBooker.includes(filterBookerEmail) : true) &&
      (filterVenue ? booking.venueID === filterVenue : true)
    );
  });

  return (
    <div className="adminallbookings-tabs-container">
   
      <div className="filters">
        <div className="date-filter">
          <label htmlFor="filter-date">Filter by Date:</label>
          <input
            type="date"
            id="filter-date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
        <div className="email-filter">
          <label htmlFor="filter-bookerEmail">Filter by Booker Email (Lecturer/Student):</label>
          <select
            id="filter-bookerEmail"
            value={filterBookerEmail}
            onChange={(e) => setFilterBookerEmail(e.target.value)}
          >
            <option value="">All</option>
            <option value="@students.wits.ac.za">Students</option>
            <option value="@wits.ac.za">Lecturers</option>
          </select>
        </div>
        <div className="venue-filter">
          <label htmlFor="filter-venue">Filter by Venue:</label>
          <select
            id="filter-venue"
            value={filterVenue}
            onChange={(e) => setFilterVenue(e.target.value)}
          >
            <option value="">All Venues</option>
            {uniqueVenues.map((venue, index) => (
              <option key={index} value={venue}>
                {venue}
              </option>
            ))}
          </select>
        </div>
      </div>

      {editingBooking === null && (
        <div className="all-bookings-tab-content">
          {filteredBookings.length > 0 ? (
            filteredBookings.map(booking => (
              <div key={booking.id} className="booking-card">
                <h3>{booking.bookingDate}</h3>
                <p>Booked by: {booking.venueBooker}</p>
                <p>Date & Time: {booking.bookingDate} - Time: {booking.bookingStartTime} - {booking.bookingEndTime}</p>
                <p>Venue Name: {booking.venueID}</p>
                <button onClick={() => handleEdit(booking)}>Edit</button>
                <button onClick={() => handleDelete(booking.id)}>Delete</button>
              </div>
            ))
          ) : (
            <p>No bookings found</p>
          )}
        </div>
      )}

      {/*edit a booking*/}
      {editingBooking && (
        <EditBooking
          booking={editingBooking}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default AdminAllBookings;
