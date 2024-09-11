import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import '../styles/AdminCreateBookings.css';
import "../styles/CalendarAdmin.css"; // Calendar custom styles
import Search from './Search'; // Adjust the path based on your folder structure

const API_URL = 'http://localhost:3001';

// API call to fetch venues
const fetchVenues = async () => {
  try {
    const response = await fetch(`${API_URL}/venues`);
    return response.json();
  } catch (error) {
    console.error("Error fetching venues:", error);
    return [];
  }
};

// API call to fetch bookings by date
const fetchBookingsByDate = async (selectedDate) => {
  try {
    const formattedDate = selectedDate.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
    const response = await fetch(`http://localhost:3001/bookings?bookingDate=${formattedDate}`);
    return response.json();
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
};

const fetchSchedules = async () => {
  try {
    const response = await fetch(`${API_URL}/Schedules`);
    return response.json();
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return [];
  }
};

const createBooking = async (bookingData) => {
  try {
    const response = await fetch('http://localhost:3001/bookings/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });
    return response.json();
  } catch (error) {
    console.error("Error creating booking:", error);
  }
};

const AdmincreateBooking = () => {
  const [venues, setVenues] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [schedules, setSchedules] = useState([]); // Add schedules state
  const [originalVenues, setOriginalVenues] = useState([]); // Store the original list of venues
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [expandedVenueId, setExpandedVenueId] = useState(null);
  const [selectedCapacity, setSelectedCapacity] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [venueTypes, setVenueTypes] = useState([]);

  const [email, setEmail] = useState(''); // To store the email input
  const [bookingDescription, setBookingDescription] = useState(''); // To store booking description
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null); // Tracks selected time slot
  
  useEffect(() => {
    fetchVenues().then(data => {
      setVenues(data);
      setOriginalVenues(data); // Save the original list of venues
      const types = [...new Set(data.map(venue => venue.venueType))]; // Extract unique venue types
      setVenueTypes(types);
    });
  }, []);

  // Fetch bookings whenever the selected date changes
  useEffect(() => {
    if (selectedDate) {
      fetchBookingsByDate(selectedDate).then(data => setBookings(data.bookings));
      fetchSchedules().then(data => setSchedules(data.entry));
    }
  }, [selectedDate]);

  // Handle capacity and type filter changes
  const handleCapacityChange = (e) => setSelectedCapacity(e.target.value);
  const handleTypeChange = (e) => setSelectedType(e.target.value);

  // Toggle expanded venue view
  const toggleVenue = (id) => {
    if (expandedVenueId === id) {
      setExpandedVenueId(null);
    } else {
      setExpandedVenueId(id);
    }
  };

  // Convert the selected date to a day of the week (e.g., Monday, Tuesday, etc.)
  const getDayOfWeek = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  // Check if the time slot is already booked or scheduled
  const isTimeSlotTaken = (venueName, venueID, time) => {
    // Get the day of the week from the selected date
    const bookingDayOfWeek = getDayOfWeek(selectedDate);
    console.log("Day of week ", bookingDayOfWeek);

    // Check for bookings
    const isBooked = bookings.some(
      (booking) =>
        booking.venueID === venueName &&
        booking.bookingStartTime === time &&
        booking.bookingDate === selectedDate.toLocaleDateString('en-CA')
    );

    // Check for schedules
    const isScheduled = schedules.some(
      (schedule) =>
        schedule.venueID === venueName &&
        schedule.bookingStartTime === time &&
        schedule.bookingDay === bookingDayOfWeek // Compare the day of the week
    );

    // Return true if either booked or scheduled
    return isBooked || isScheduled;
  };

  const handleTimeSlotSelect = (venueID, venueName, time) => {
    setSelectedTimeSlot({ venueID, venueName, time });
    console.log(`Selected Date: ${selectedDate.toDateString()}, Selected Venue: ${venueName} (ID: ${venueID}), Selected Time Slot: ${time}`);
  };

  // Handle booking creation
  const handleCreateBooking = () => {
    if (!email || !bookingDescription) {
      alert('Please enter your email and enter booking description.');
      return;
    }

    // Calculate booking end time (+45 mins)
    const [hours, minutes] = selectedTimeSlot.time.split(':');
    const startTime = new Date();
    startTime.setHours(hours);
    startTime.setMinutes(minutes);
    const endTime = new Date(startTime.getTime() + 45 * 60000); // Add 45 mins

    const bookingData = {
      venueID: selectedTimeSlot.venueName,
      bookingStartTime: selectedTimeSlot.time,
      bookingEndTime: endTime.toTimeString().substring(0, 5), // Format as HH:MM
      bookingDate: selectedDate.toLocaleDateString('en-CA'),
      venueBooker: email,
      bookingDescription: bookingDescription,
    };

    createBooking(bookingData).then((response) => {
      if (response.success) {
        alert('Booking created successfully!');
      } else {
        alert('Error creating booking.');
      }
    });
  };

  const filteredVenues = venues.filter(venue => {
    // Filter by type if a type is selected
    const matchesType = selectedType ? venue.venueType === selectedType : true;
    
    // Filter by capacity if a capacity is selected
    const matchesCapacity = selectedCapacity ? venue.venueCapacity >= parseInt(selectedCapacity, 10) : true;

    // Return true if both filters match
    return matchesType && matchesCapacity;
  });
//clear everything
const clearSearch = () => {
  setSelectedCapacity(''); // Reset capacity filter
  setSelectedType(''); // Reset type filter
  setVenues(originalVenues); // Reset venue list to the original full list
};

  return (
    <div className="create-booking-container">
  
{/* Clear Search Button */}

<Search venueList={venues} setVenueList={setVenues} bookingsList={bookings} />  
<button className="clear-button" onClick={clearSearch}>Clear Search</button>
      {/* Calendar Popup , put calendar and filters in 1 div so u can put them in the same row*/}
      
      < div className="calendarfilter">
      <div className="calendar-container">
        <h3>Select a Date:</h3>
        <Calendar
          className="react-calendar"
          onChange={setSelectedDate}
          value={selectedDate}
          minDate={new Date()}
          maxDate={new Date(new Date().getFullYear(), 11, 31)} // End of the current year
        />
      </div>

      {/* Capacity and Type Filters */}
      < div className="filter-container">
        <label htmlFor="capacity">Venue Capacity:</label>
        <select
          id="capacity"
          className="filter-select"
          value={selectedCapacity}
          onChange={handleCapacityChange}
        >
          <option value="">Capacity</option>
          <option value="100">100+</option>
          <option value="200">200+</option>
          <option value="300">300+</option>
          <option value="400">400+</option>
          <option value="500">500+</option>
        </select>

        <label htmlFor="type">Venue Type:</label>
        <select
          id="type"
          className="filter-select"
          value={selectedType}
          onChange={handleTypeChange}
        >
          <option value="">All Types</option>
          {venueTypes.map((type, index) => (
            <option key={index} value={type}>{type}</option>
          ))}
        </select>
      </div>
      </div>

      {/* Venue List */}
      <div className="venue-list">
        {filteredVenues.map(venue => (
          <div key={venue.id} className="venue-item">
            <div className="venue-header" onClick={() => toggleVenue(venue.id)}>
              <h3>{venue.venueName}</h3>
              <p>{venue.isClosed ? 'Closed' : `Open (Capacity: ${venue.venueCapacity})`}</p>
              <button>{expandedVenueId === venue.id ? '▲' : '▼'}</button>
            </div>

            {/* Venue Details */}
            {expandedVenueId === venue.id && (
              <div className="venue-details">
                <p>Campus: {venue.campus}</p>
                <p>Venue Type: {venue.venueType}</p>
                <p>Capacity: {venue.venueCapacity}</p>

                <div className="time-slots">
                  {venue.timeSlots && venue.timeSlots.length > 0 ? (
                    venue.timeSlots.map((time, index) => (
                      <button
                        key={index}
                        className={`time-slot-button ${isTimeSlotTaken(venue.venueName, venue.id, time) ? 'taken' : ''}`}
                        disabled={isTimeSlotTaken(venue.venueName, venue.id, time)} // Disable if the slot is taken
                        onClick={() => handleTimeSlotSelect(venue.id, venue.venueName, time)}
                      >
                        {time}
                      </button>
                    ))
                  ) : (
                    <p>No available timeslots</p>
                  )}
                </div>

                {/* Show email and description inputs if a time slot is selected */}
                {selectedTimeSlot && selectedTimeSlot.venueID === venue.id && (
                  <>
                    <input
                      type="text"
                      placeholder="Your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="description-input"
                    />
                    <input
                      type="text"
                      placeholder="Booking description"
                      value={bookingDescription}
                      onChange={(e) => setBookingDescription(e.target.value)}
                      className="description-input"
                    />
                    <button className="book-button" onClick={handleCreateBooking}>
                      Book
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdmincreateBooking;
