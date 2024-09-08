

import React, { useState, useEffect } from 'react';
import '../styles/ManageBookings.css';
import EditBooking from './ManageBookingsEdit.js';


const API_URL = process.env.NODE_ENV === 'production' ? 'https://your-production-site.com' : 'http://localhost:3002';

const getAllBookings = async () => {
  const response = await fetch(`${API_URL}/bookings`);
  return await response.json();
};

const getBookingById = async (id) => {
  const response = await fetch(`${API_URL}/bookings/${id}`);
  return await response.json();
};

const createBooking = async (bookingData) => {
  const response = await fetch(`${API_URL}/bookings/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingData),
  });
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

const getAllVenues = async () => {
  try {
    const response = await fetch(`${API_URL}/venues`);
    const data = await response.json();
    return { venues: data };
  } catch (error) {
    console.error("Error fetching venues:", error);
    return { venues: [] };
  }
};

const BookingTabs = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [bookings, setBookings] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);
  const [filterDate, setFilterDate] = useState('');
  const [filterBookerEmail, setFilterBookerEmail] = useState('');
  const [filterVenue, setFilterVenue] = useState('');


  const [venueBooker, setVenueBooker] = useState('');
  const [venueID, setVenueID] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingStartTime, setBookingStartTime] = useState('');
  const [bookingEndTime, setBookingEndTime] = useState('');
  const [bookingDescription, setBookingDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

 
  const [venues, setVenues] = useState([]); 

  useEffect(() => {
    if (activeTab === 'all') {
      getAllBookings().then(data => setBookings(data.bookings));
    }
  }, [activeTab]);


  useEffect(() => {
    if (activeTab === 'createbooking') {
      const fetchVenues = async () => {
        try {
          const response = await getAllVenues(); // using the getAllVenues function
          setVenues(response.venues || []); 
        } catch (error) {
          console.error("Error fetching venues:", error);
          setVenues([]); 
        }
      };

      fetchVenues();
    }
  }, [activeTab]);

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

  //create booking 
  const handleCreateBooking = async (e) => {
    e.preventDefault();

    //validate to see if theres an overlap in the bookings 
    const conflictingBooking = bookings.find(booking =>
      booking.venueID === venueID &&
      booking.bookingDate === bookingDate &&
      (
        (bookingStartTime >= booking.bookingStartTime && bookingStartTime < booking.bookingEndTime) ||
        (bookingEndTime > booking.bookingStartTime && bookingEndTime <= booking.bookingEndTime) ||
        (bookingStartTime <= booking.bookingStartTime && bookingEndTime >= booking.bookingEndTime)
      )
    );

    if (conflictingBooking) {
      setErrorMessage("The venue is already booked at this time. Please choose another time.");
      return;
    }

    try {
      const newBooking = {
        venueBooker,
        venueID,
        bookingDate,
        bookingStartTime,
        bookingEndTime,
        bookingDescription
      };
      await createBooking(newBooking);

    
      const data = await getAllBookings();
      setBookings(data.bookings);

      //clearing the fields
      setVenueBooker('');
      setVenueID('');
      setBookingDate('');
      setBookingStartTime('');
      setBookingEndTime('');
      setBookingDescription('');
      setErrorMessage(''); //clearing the errors if they happen to appear
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  //filter by unique venues
  const uniqueVenues = [...new Set(bookings.map(booking => booking.venueID))];

  
  const filteredBookings = bookings.filter(booking => {
    return (
      (filterDate ? booking.bookingDate === filterDate : true) &&
      (filterBookerEmail ? booking.venueBooker.includes(filterBookerEmail) : true) &&
      (filterVenue ? booking.venueID === filterVenue : true)
    );
  });

  return (
    <div className="booking-tabs-container">
      <div className="tabs">
        <button onClick={() => setActiveTab('all')} className={activeTab === 'all' ? 'active' : ''}>All Bookings</button>
        <button onClick={() => setActiveTab('createbooking')} className={activeTab === 'createbooking' ? 'active' : ''}>Create Booking</button>
      </div>

      <div className="tab-content">
        {activeTab === 'all' && editingBooking === null && (
          <div className="all-bookings-tab-content">
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

        {editingBooking && (
          <EditBooking
            booking={editingBooking}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}

        {activeTab === 'createbooking' && (
          <div className="createbooking-tab-content">
            <h2>Create New Booking</h2>
            <form onSubmit={handleCreateBooking}>
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
  <label htmlFor="venueID">Venue Name:</label>
  <select
    id="venueID"
    value={venueID}
    onChange={(e) => setVenueID(e.target.value)}
    required
  >
    <option value="">Select a Venue</option>
    {venues && venues.map((venue) => (
      <option key={venue.venueName} value={venue.venueName}>
        {venue.venueName} {/*  venue name in the dropdown */}
      </option>
    ))}
  </select>
</div>

              <div className="form-group">
                <label htmlFor="bookingDate">Booking Date:</label>
                <input
                  type="date"
                  id="bookingDate"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="bookingStartTime">Start Time:</label>
                <input
                  type="time"
                  id="bookingStartTime"
                  value={bookingStartTime}
                  onChange={(e) => setBookingStartTime(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="bookingEndTime">End Time:</label>
                <input
                  type="time"
                  id="bookingEndTime"
                  value={bookingEndTime}
                  onChange={(e) => setBookingEndTime(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="bookingDescription">Description:</label>
                <textarea
                  id="bookingDescription"
                  value={bookingDescription}
                  onChange={(e) => setBookingDescription(e.target.value)}
                  required
                />
              </div>

              {/* error message */}
              {errorMessage && <p className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</p>}

              <button type="submit">Create Booking</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingTabs;

