import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import '../styles/AdminCreateBookings.css';
import "../styles/CalendarAdmin.css"; // Calendar custom styles
import Search from './Search'; // Adjust the path based on your folder structure

//api call to fetch venues
const fetchVenues = async () => {
  try {
    const response = await fetch(`/api/venues`);
    return response.json();
  } catch (error) {
    console.error("Error fetching venues:", error);
    return [];
  }
};

//api  call to fetch bookings by date
const fetchBookingsByDate = async (selectedDate) => {
  try {
    const formattedDate = selectedDate.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
    const response = await fetch(`/api/bookings?bookingDate=${formattedDate}`);
    return response.json();
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
};

const fetchSchedules = async () => {
  try {
    const response = await fetch(`/api/schedules`);
    return response.json();
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return [];
  }
};

// const createBooking = async (bookingData) => {
//   try {
//     const response = await fetch(`/api/bookings/create`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(bookingData),
//     });
//     return response.json();
//   } catch (error) {
//     console.error("Error creating booking:", error);
//   }
// };

const AdmincreateBooking = () => {
  const [venues, setVenues] = useState([]);// stores the list of available venues that will be displayed to the Admin,(setVenues) is the function used to update the venues state
  const [bookings, setBookings] = useState([]);
  const [schedules, setSchedules] = useState([]); 
  const [originalVenues, setOriginalVenues] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [expandedVenueId, setExpandedVenueId] = useState(null);
  const [selectedCapacity, setSelectedCapacity] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [venueTypes, setVenueTypes] = useState([]);

  const [email, setEmail] = useState(''); 
  const [bookingDescription, setBookingDescription] = useState(''); 
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null); 
  const [errorMessage, setErrorMessage] = useState('');


  useEffect(() => {
    fetchVenues().then(data => {
      setVenues(data);
      setOriginalVenues(data); // original list of venues
      const types = [...new Set(data.map(venue => venue.venueType))]; //for displaying each venue once in the dropdown
      setVenueTypes(types);
    });
  }, []);

  //fetch bookings whenever the selected date changes
  useEffect(() => {
    if (selectedDate) {
      fetchBookingsByDate(selectedDate).then(data => setBookings(data.bookings));
      fetchSchedules().then(data => setSchedules(data.entry));
    }
  }, [selectedDate]);

  //capacity and type filter changes(dropdowns)
  const handleCapacityChange = (e) => setSelectedCapacity(e.target.value);
  const handleTypeChange = (e) => setSelectedType(e.target.value);


  const toggleVenue = (id) => {
    if (expandedVenueId === id) {
      setExpandedVenueId(null);
    } else {
      setExpandedVenueId(id);
    }
  };

  //convert the selected date to a day of the week (Monday), this is so that we can see all ocupied slots on the selcetd date from schedules
  const getDayOfWeek = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  //check if the time slot is already booked or scheduled
  const isTimeSlotTaken = (venueName, venueID, time) => {
    // the day of the week from the selected date
    const bookingDayOfWeek = getDayOfWeek(selectedDate);
  

    const isBooked = bookings.some(
      (booking) =>
        booking.venueID === venueName &&
        booking.bookingStartTime === time &&
        booking.bookingDate === selectedDate.toLocaleDateString('en-CA')
    );

    // Check for schedule overlaps 
    const isScheduled = schedules.some(
      (schedule) =>
        schedule.venueID === venueName &&
        schedule.bookingStartTime === time &&
        schedule.bookingDay === bookingDayOfWeek //compares the day of the week
    );

    //true if the time slot is  either booked or scheduled
    return isBooked || isScheduled;
  };

  const SelectingtimeSlot = (venueID, venueName, time) => {
    setSelectedTimeSlot({ venueID, venueName, time });

  };

 
  const hCreateBooking = async () => {
    if (!email || !bookingDescription) {
      setErrorMessage('Please enter your email and booking description');
   
      return;
    }

    setErrorMessage('');
   

    const [hours, minutes] = selectedTimeSlot.time.split(':');
    const startTime = new Date(selectedDate);
    startTime.setHours(hours, minutes);
    const endTime = new Date(startTime.getTime() + 45 * 60000);

    const bookingData = {
      venueID: selectedTimeSlot.venueName,
      bookingStartTime: selectedTimeSlot.time,
      bookingEndTime: endTime.toTimeString().substring(0, 5),
      bookingDate: selectedDate.toLocaleDateString('en-CA'),
      venueBooker: email,
      bookingDescription: bookingDescription,
    };

    try {
      console.log('Sending booking data:', bookingData);
      const response = await fetch(`/api/bookings/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
      const result = await response.json();
    
      console.log('API response:', result);
      
      if (result.message==="Booking created successfully") {
        
        setEmail('');
        setBookingDescription('');
     
      } else {
        setErrorMessage('Error creating booking');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };


  const filteredVenues = venues.filter(venue => {
    //filter by venuetype if a type is selected
    const matchesType = selectedType ? venue.venueType === selectedType : true;
    
    //filter by capacity if a capacity is selected
    const matchesCapacity = selectedCapacity ? venue.venueCapacity >= parseInt(selectedCapacity, 10) : true;

    // true if both filters match
    return matchesType && matchesCapacity;
  });
//clear everything
const clearSearch = () => {
  setSelectedCapacity(''); //clear capacity selected
  setSelectedType(''); // clear venue type selected
  setVenues(originalVenues); //Reset venue list to the original full list
};

  return (
    <div className="create-booking-container">
    {/* containins search bar, clear button, calendar, and filters */}
    <div className="top-section">

   
      
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
{/*clear Search Button */}
<div className="search-container">
<Search venueList={venues} setVenueList={setVenues} bookingsList={bookings} />  
<button className="clear-button" onClick={clearSearch}>Clear Search</button>
</div>
      {/*capacity and  venue type filters */}
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
</div>
      {/*venue list */}
      <div className="venue-list">
        {filteredVenues.map(venue => (
          <div key={venue.id} className="venue-item">
            <div className="venue-header" onClick={() => toggleVenue(venue.id)}>
              <h3>{venue.venueName}</h3>
              <p>{venue.isClosed ? 'Closed' : `Open (Capacity: ${venue.venueCapacity})`}</p>
              <button>{expandedVenueId === venue.id ? '▲' : '▼'}</button>
            </div>

            {/*venue details displayed */}
            {expandedVenueId === venue.id && (
              <div className="venue-details">
                <p>Campus: {venue.campus}</p>
                <p>Venue Type: {venue.venueType}</p>
                <p>Capacity: {venue.venueCapacity}</p>

          
                <div className="time-slots">
            {venue.timeSlots && venue.timeSlots.length > 0 ? (
              venue.timeSlots.map((time, index) => {
                const isTaken = isTimeSlotTaken(venue.venueName, venue.id, time); //that time slot already appears in Schedules or Bookings so its taken
                const isSelected = selectedTimeSlot && selectedTimeSlot.time === time && selectedTimeSlot.venueID === venue.id; //User-selected time slot

                return (
                  <button
                    key={index}
                    className={`time-slot-button ${isTaken ? 'taken' : ''} ${isSelected ? 'selected' : ''}`}
                    disabled={isTaken} //disable a slot if taken( so user cant select it)
                    onClick={() => SelectingtimeSlot(venue.id, venue.venueName, time)}
                  >
                    {time}
                  </button>
                );
              })
            ) : (
              <p>No available timeslots</p>
            )}
          </div>

                {/* email and description inputs if a time slot is selected */}
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
                 {errorMessage && <p className="error-message-bookingadmin">{errorMessage}</p>}
                    <button className="book-button" onClick={hCreateBooking}>
                      Book
                    </button>
                   
                    <button className="book-button" onClick={hCreateBooking}>
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
