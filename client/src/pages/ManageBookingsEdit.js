import React, { useState, useEffect } from 'react';
import './ManageBookingsEdit.css';
import { getAllBookings } from '../api'; 

const EditBookingForm = ({ booking, onSave, onCancel }) => {
 
  const [venueBooker, setVenueBooker] = useState(booking.venueBooker || '');
  const [venueID, setVenueID] = useState(booking.venueID || '');
  const [bookingDate, setBookingDate] = useState(booking.bookingDate || '');
  const [bookingStartTime, setBookingStartTime] = useState(booking.bookingStartTime || '');
  const [bookingEndTime, setBookingEndTime] = useState(booking.bookingEndTime || '');
  const [bookingDescription, setBookingDescription] = useState(booking.bookingDescription || '');

  const [validationError, setValidationError] = useState('');
  const [existingBookings, setExistingBookings] = useState([]);

  // Fetch all existing bookings 
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { bookings } = await getAllBookings(); // Fetch the bookings
        setExistingBookings(bookings); 
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setValidationError('Error fetching bookings.');
      }
    };

    fetchBookings(); 
  }, []); 

  // Function to check for booking conflicts
  const isBookingConflict = () => {
    if (!Array.isArray(existingBookings) || existingBookings.length === 0) {
      return false; // No bookings to check against
    }

    return existingBookings.some(existingBooking => {
      // Convert date and time to Date objects for comparison
      const existingBookingStart = new Date(`${existingBooking.bookingDate}T${existingBooking.bookingStartTime}`);
      const existingBookingEnd = new Date(`${existingBooking.bookingDate}T${existingBooking.bookingEndTime}`);
      const newBookingStart = new Date(`${bookingDate}T${bookingStartTime}`);
      const newBookingEnd = new Date(`${bookingDate}T${bookingEndTime}`);

      // Check if the venue is the same and there is an overlap in time
      return (
        existingBooking.venueID === venueID &&
        existingBooking.id !== booking.id && 
        (
          (newBookingStart >= existingBookingStart && newBookingStart < existingBookingEnd) || // Start time clashes
          (newBookingEnd > existingBookingStart && newBookingEnd <= existingBookingEnd) || // End time overlaps
          (newBookingStart <= existingBookingStart && newBookingEnd >= existingBookingEnd) // New booking fully clashes  existing booking
        )
      );
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if what you editited is not already an existing booking
    if (isBookingConflict()) {
      setValidationError('A booking with the same date, time, and venue already exists.');
      return;
    }

    const updatedBooking = {
      ...booking,
      venueBooker,
      venueID,
      bookingDate,
      bookingStartTime,
      bookingEndTime,
      bookingDescription,
    };

    onSave(updatedBooking); 
  };

  return (
    <form onSubmit={handleSubmit} className="edit-booking-form">
      <label>Booker Email</label>
      <input
        type="text"
        value={venueBooker}
        onChange={(e) => setVenueBooker(e.target.value)}
        required
      />
      <label>Venue ID</label>
      <input
        type="text"
        value={venueID}
        onChange={(e) => setVenueID(e.target.value)}
        required
      />
      <label>Date</label>
      <input
        type="date"
        value={bookingDate}
        onChange={(e) => setBookingDate(e.target.value)}
        required
      />
      <label>Start Time</label>
      <input
        type="time"
        value={bookingStartTime}
        onChange={(e) => setBookingStartTime(e.target.value)}
        required
      />
      <label>End Time</label>
      <input
        type="time"
        value={bookingEndTime}
        onChange={(e) => setBookingEndTime(e.target.value)}
        required
      />
      <label>Description</label>
      <textarea
        value={bookingDescription}
        onChange={(e) => setBookingDescription(e.target.value)}
        required
      />
      
      {/* Validation error message  */}
      {validationError && <p className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{validationError}</p>}
      
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default EditBookingForm;
