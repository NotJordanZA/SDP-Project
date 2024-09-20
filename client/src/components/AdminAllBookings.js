import React, { useState, useEffect } from 'react';
import '../styles/AdminAllBookings.css';
import EditBooking from '../pages/ManageBookingsEdit.js';

const getAllBookings = async () => {
  const response = await fetch(`/api/bookings`);
  return await response.json();
};

const updateBooking = async (id, bookingData) => {
  const response = await fetch(`/api/bookings/${id}`, {
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
  try {
    // Fetch the booking details before deletion
    const bookingResponse = await fetch(`/api/bookings/${id}`);
    if (!bookingResponse.ok) {
      throw new Error('Failed to fetch booking details');
    }
    const bookingDetails = await bookingResponse.json();

    // Log booking details to debug missing fields
    console.log('Booking details:', bookingDetails);

    // Ensure all required fields are present
    if (!bookingDetails.venueID || !bookingDetails.bookingDate || !bookingDetails.bookingStartTime || !bookingDetails.bookingEndTime || !bookingDetails.bookingDescription || !bookingDetails.venueBooker) {
      throw new Error('Missing required booking details');
    }

    // Delete the booking
    const response = await fetch(`/api/bookings/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error('Failed to delete booking');
    }

    // Create the notification
    const notification = {
      dateCreated: new Date().toLocaleString(),
      notificationMessage: `This is to inform you that your booking has been cancelled by the admin. These are the booking details: venueID: ${bookingDetails.venueID}, bookingDate: ${bookingDetails.bookingDate}, bookingStartTime: ${bookingDetails.bookingStartTime}, bookingEndTime: ${bookingDetails.bookingEndTime}, bookingDescription: ${bookingDetails.bookingDescription}. Please make another booking or send a request to the admin.`,
      notificationType: "Booking Cancelled",
      read: false,
      recipientEmail: bookingDetails.venueBooker, // Assuming the booking details contain the venueBookerEmail
    };

    console.log('Notification to be sent:', notification); // Log the notification data

    const notificationResponse = await fetch('/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notification),
    });

    if (!notificationResponse.ok) {
      const errorData = await notificationResponse.json();
      console.error('Error creating notification:', errorData);
      throw new Error('Failed to create notification');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to delete booking:', error);
    throw error;
  }
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
      // Fetch the previous booking details
      const previousBookingResponse = await fetch(`/api/bookings/${updatedBooking.id}`);
      if (!previousBookingResponse.ok) {
        throw new Error('Failed to fetch previous booking details');
      }
      const previousBookingDetails = await previousBookingResponse.json();
  
      await updateBooking(updatedBooking.id, updatedBooking);
      setBookings(bookings.map(b => (b.id === updatedBooking.id ? updatedBooking : b)));
      setEditingBooking(null);
  
      // Identify the fields that have changed
      const changes = [];
    if (previousBookingDetails.bookingStartTime !== updatedBooking.bookingStartTime) {
      changes.push(`bookingStartTime: ${previousBookingDetails.bookingStartTime} -> ${updatedBooking.bookingStartTime}`);
    }
    if (previousBookingDetails.bookingEndTime !== updatedBooking.bookingEndTime) {
      changes.push(`bookingEndTime: ${previousBookingDetails.bookingEndTime} -> ${updatedBooking.bookingEndTime}`);
    }
    if (previousBookingDetails.bookingDescription !== updatedBooking.bookingDescription) {
      changes.push(`bookingDescription: ${previousBookingDetails.bookingDescription} -> ${updatedBooking.bookingDescription}`);
    }
    if (previousBookingDetails.bookingDate !== updatedBooking.bookingDate) {
      changes.push(`bookingDate: ${previousBookingDetails.bookingDate} -> ${updatedBooking.bookingDate}`);
    }
    if (previousBookingDetails.venueID !== updatedBooking.venueID) {
      changes.push(`venueID: ${previousBookingDetails.venueID} -> ${updatedBooking.venueID}`);
    }
    
      // Create the notification
      const notification = {
        dateCreated: new Date().toLocaleString(),
        notificationMessage: `This is to inform you that your booking details have been updated by the admin.
      These are the updated booking details: ${changes.join(', ')}.
      New details: venueID: ${updatedBooking.venueID}, bookingDate: ${updatedBooking.bookingDate}, bookingStartTime: ${updatedBooking.bookingStartTime}, bookingEndTime: ${updatedBooking.bookingEndTime}, bookingDescription: ${updatedBooking.bookingDescription}.`,
        notificationType: "Booking Details Updated",
        read: false,
        recipientEmail: updatedBooking.venueBooker, // Assuming the booking details contain the venueBookerEmail
      };
  
      console.log('Notification to be sent:', notification); // Log the notification data
  
      const notificationResponse = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notification),
      });
  
      if (!notificationResponse.ok) {
        const errorText = await notificationResponse.text();
        console.error('Error creating notification:', errorText);
        throw new Error('Failed to create notification');
      }
  
      console.log('Notification sent successfully');
  
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
            className="filter-select"
            type="date"
            id="filter-date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
        <div className="email-filter">
          <label htmlFor="filter-bookerEmail">Filter by Booker Email (Lecturer/Student):</label>
          <select
            className="filter-select"
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
            className="filter-select"
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
                <p>{booking.bookingDescription}</p>
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
