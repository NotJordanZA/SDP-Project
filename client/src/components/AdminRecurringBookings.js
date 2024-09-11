import React, { useState, useEffect } from 'react';
import '../styles/ManageBookings.css';
const API_URL = process.env.NODE_ENV === 'production' ? 'https://your-production-site.com' : 'http://localhost:3002';

const RecurringBooking = () => {
  const [venueCapacity, setVenueCapacity] = useState('');
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [bookingStartTime, setBookingStartTime] = useState('');
  const [bookingEndTime, setBookingEndTime] = useState('');
  const [venueBooker, setVenueBooker] = useState('');
  const [bookingDescription, setBookingDescription] = useState('');
  const [bookingDay, setBookingDay] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Fetch venues from API
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch(`${API_URL}/venues`);
        const data = await response.json();
        setVenues(data);
      } catch (error) {
        console.error('Error fetching venues:', error);
        setVenues([]);
      }
    };
    fetchVenues();
  }, []);

  // Filter venues by capacity
  const handleVenueCapacityChange = (e) => {
    const selectedCapacity = parseInt(e.target.value);
    setVenueCapacity(selectedCapacity);
    const filtered = venues.filter((venue) => venue.venueCapacity >= selectedCapacity);
    setFilteredVenues(filtered);
  };

  // Handle selecting a time slot
  const handleTimeSlotClick = (venueID, timeSlot) => {
    const [hours, minutes] = timeSlot.split(":");
    const startTime = new Date();
    startTime.setHours(parseInt(hours), parseInt(minutes), 0);
    const endTime = new Date(startTime);
    endTime.setMinutes(startTime.getMinutes() + 45);
    const formattedEndTime = endTime.toTimeString().substring(0, 5);

    setSelectedTimeSlot({ venueID, timeSlot });
    setBookingStartTime(timeSlot);
    setBookingEndTime(formattedEndTime);
  };

  // Handle submitting the booking form
  const handleBookClick = async (venueID) => {
    if (!venueBooker || !bookingDescription || !bookingDay) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    const bookingData = {
      venueID,
      venueBooker,
      bookingStartTime,
      bookingEndTime,
      bookingDescription,
      bookingDay,
    };

    try {
      const response = await fetch(`${API_URL}/bookings/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error('Failed to create booking');
      }

      alert('Recurring booking has been created successfully!');
      clearForm();
    } catch (error) {
      console.error('Error creating recurring booking:', error);
      setErrorMessage('There was an error processing the booking.');
    }
  };

  // Clear the form after booking
  const clearForm = () => {
    setVenueBooker('');
    setBookingDescription('');
    setBookingDay('');
    setSelectedTimeSlot(null);
    setBookingStartTime('');
    setBookingEndTime('');
    setErrorMessage('');
  };

  return (
    <div className="recurring-booking-container">
      <h2>Create Recurring Booking</h2>

      {/* Venue Capacity Dropdown */}
      <div className="form-group">
        <label htmlFor="venueCapacity">Select Capacity:</label>
        <select
          id="venueCapacity"
          value={venueCapacity}
          onChange={handleVenueCapacityChange}
        >
          <option value="">Select Capacity</option>
          <option value="50">50+</option>
          <option value="100">100+</option>
          <option value="200">200+</option>
          <option value="300">300+</option>
          <option value="400">400+</option>
          <option value="500">500+</option>
        </select>
      </div>

      {/* Filtered Venues */}
      {filteredVenues.length > 0 ? (
        filteredVenues.map((venue) => (
          <div key={venue.venueID} className="venue-card">
            <h3>{venue.venueID}</h3>
            <p><strong>Campus:</strong> {venue.campus}</p>
            <p><strong>Venue Type:</strong> {venue.venueType}</p>
            <p><strong>Capacity:</strong> {venue.venueCapacity}</p>

            {/* Time Slot Buttons */}
            <div className="timeslots">
              {venue.timeSlots.map((timeSlot, index) => (
                <button
                  key={index}
                  className={`timeslot-btn ${selectedTimeSlot?.timeSlot === timeSlot ? 'selected' : ''}`}
                  onClick={() => handleTimeSlotClick(venue.venueID, timeSlot)}
                >
                  {timeSlot}
                </button>
              ))}
            </div>

            {/* Display booking form when time slot is selected */}
            {selectedTimeSlot?.venueID === venue.venueID && (
              <div className="booking-form">
                <div className="form-group">
                  <label htmlFor="venueBooker">Booker Email:</label>
                  <input
                    type="email"
                    id="venueBooker"
                    value={venueBooker}
                    onChange={(e) => setVenueBooker(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="bookingDescription">Booking Description:</label>
                  <input
                    type="text"
                    id="bookingDescription"
                    value={bookingDescription}
                    onChange={(e) => setBookingDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="bookingDay">Select Day:</label>
                  <select
                    id="bookingDay"
                    value={bookingDay}
                    onChange={(e) => setBookingDay(e.target.value)}
                    required
                  >
                    <option value="">Select a Day</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                  </select>
                </div>

                <button type="button" className="book-btn" onClick={() => handleBookClick(venue.venueID)}>
                  Book Recurring Slot
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No venues available with the selected capacity.</p>
      )}

      {/* Error message */}
      {errorMessage && <p className="error-message" style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default RecurringBooking;
