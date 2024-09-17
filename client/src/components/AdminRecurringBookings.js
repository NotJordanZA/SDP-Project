import React, { useState, useEffect } from 'react';
import '../styles/AdminReccuringBooking.css'; 

//fetch venues
const fetchVenues = async () => {
  try {
    const response = await fetch(`/api/venues`);
    return response.json();
  } catch (error) {
    console.error("Error fetching venues:", error);
    return [];
  }
};

//fetch schedules
const fetchSchedules = async () => {
  try {
    const response = await fetch(`/api/schedules`);
    return response.json();
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return [];
  }
};

//add a schedule slot
const addScheduleSlot = async (scheduleData) => {
  try {
    const response = await fetch(`/api/schedules/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scheduleData),
    });
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Failed to add booking");
    }
  } catch (error) {
    console.error("Error adding booking:", error);
  }
};

const AdminRecurringBookings = () => {
  const [venues, setVenues] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [expandedVenueId, setExpandedVenueId] = useState(null);

  const [selectedSlot, setSelectedSlot] = useState(null); 
  const [venueBooker, setVenueBooker] = useState(""); 
  const [bookingDescription, setBookingDescription] = useState(""); 
  const [errorMessage, setErrorMessage] = useState(""); 
  
  const [selectedCapacity, setSelectedCapacity] = useState(""); 

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]; //schedule table columns
  const timeSlots = ["08:00", "09:00",   "10:15",  "11:15", "12:00", "13:15",    "14:15", "16:15"]; //schedule table rows
  useEffect(() => {
    fetchVenues().then(data => {
      setVenues(data);
    });
    
    fetchSchedules().then(data => {
      setSchedules(data.entry || []);
    });
  }, []);
  //filtering based on capacity

const filteredVenues = venues.filter(venue => {
  if (selectedCapacity) {
    //ensure the venueCapacity and selectedCapacity are numeric
    return Number(venue.venueCapacity) >= Number(selectedCapacity); 
  }
  return true; //when drop down is not selected return all venues
});

  //now check if a venue has a parrticular timeslot already scheduled
  const isTimeSlotTaken = (venueName, day, time) => {
    return schedules.some(
      (schedule) =>
        schedule.venueID === venueName &&
        schedule.bookingDay === day &&
        schedule.bookingStartTime === time
    );
  };


  const handleTimeSlotClick = (venueID, venueName, day, time) => {
    if (!isTimeSlotTaken(venueName, day, time)) {
      setSelectedSlot({ venueID, venueName, day, time });
      setErrorMessage(""); 

    }
  };

  const handleCreateBooking = async () => {
    // Validate inputs
    if (!venueBooker || !bookingDescription) {
      setErrorMessage("Please enter your email and booking description.");
      return;
    }
  
    // Schedule slot end time = start time + 45 mins
    const [hours, minutes] = selectedSlot.time.split(':');
    const startTime = new Date();
    startTime.setHours(hours);
    startTime.setMinutes(minutes);
    const endTime = new Date(startTime.getTime() + 45 * 60000); // 45-minute slot
  
    const bookingData = {
      venueID: selectedSlot.venueName,
      venueBooker,
      bookingDay: selectedSlot.day,
      bookingStartTime: selectedSlot.time,
      bookingEndTime: endTime.toTimeString().substring(0, 5), // Format as "HH:MM"
      bookingDescription: bookingDescription,
    };
  
    try {
      const newSchedule = await addScheduleSlot(bookingData);
      if (newSchedule) {
        setSchedules([...schedules, newSchedule]); // Update the schedule list
        setSelectedSlot(null); // Clear selected slot
        setVenueBooker(""); // Clear form fields
        setBookingDescription("");
  
        // Create notification data
        const notificationMessage = `A recurring booking has been made in your name by the admin. Booking details: Venue: ${bookingData.venueID}, Day: Every ${bookingData.bookingDay}, Time: ${bookingData.bookingStartTime}-${bookingData.bookingEndTime}, Description: ${bookingData.bookingDescription}.`;
        
        const notificationData = {
          dateCreated: new Date().toLocaleString('en-US', { timeZone: 'UTC', hour12: true }),
          notificationMessage,
          notificationType: 'Recurring Booking Confirmation',
          read: false,
          recipientEmail: bookingData.venueBooker,
        };
  
        // Send notification to the server
        const notificationResponse = await fetch('/api/notifications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(notificationData),
        });
  
        if (!notificationResponse.ok) {
          throw new Error('Failed to create notification');
        }
  
        console.log('Notification created successfully');
      }
    } catch (error) {
      console.error("An error occurred while adding the booking or notification:", error);
      setErrorMessage("An error occurred while adding the booking.");
    }
  };
  

  
  const toggleVenue = (id) => {
    if (expandedVenueId === id) {
      setExpandedVenueId(null);
    } else {
      setExpandedVenueId(id);
    }
  };

  return (
    <div className="adminrecurringbookings-container">
      {/* Capacity Filter */}
      <div className="adminrecurringbookings-filter-container">
        <label htmlFor="capacity">Filter by Capacity:</label>
        <select
          id="capacity"
          value={selectedCapacity}
          onChange={(e) => setSelectedCapacity(e.target.value)}
        >
          <option value="">Select capacity</option>
          <option value="50">50+</option>
          <option value="100">100+</option>
          <option value="200">200+</option>
          <option value="300">300+</option>
          <option value="400">400+</option>
          <option value="500">500+</option>
        </select>
      </div>
  
      <div className="adminrecurringbookings-venue-list">
        {filteredVenues.length > 0 ? (
          filteredVenues.map((venue) => ( 
            <div key={venue.id} className="adminrecurringbookings-venue-schedule">
              <h2 >{venue.venueName}</h2>
              <button onClick={() => toggleVenue(venue.id)}>
                {expandedVenueId === venue.id ? 'Hide Schedule' : 'Show Schedule'}
              </button>
  
              {expandedVenueId === venue.id && (
                <>
                  <div className="adminrecurringbookings-venue-schedule-wrapper">
                    <table className="adminrecurringbookings-table">
                      <thead className="adminrecurringbookings-tablerowscols">
                        <tr>
                          <th>Time</th>
                          {daysOfWeek.map((day) => (
                            <th key={day}>{day}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {timeSlots.map((time) => (
                          <tr key={time}>
                            <td>{time}</td>
                            {daysOfWeek.map((day) => (
                              <td
                                key={day}
                                className={
                                  isTimeSlotTaken(venue.venueName, day, time)
                                    ? 'scheduled'
                                    : selectedSlot && selectedSlot.venueID === venue.id && selectedSlot.day === day && selectedSlot.time === time
                                      ? 'selected'
                                      : 'available'
                                }
                                onClick={() => handleTimeSlotClick(venue.id, venue.venueName, day, time)}
                              >
                                {isTimeSlotTaken(venue.venueName, day, time) ? 'Scheduled' : 'Available'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
  
                    {/* input fields below the table when a slot is selected */}
                    {selectedSlot && selectedSlot.venueID === venue.id && (
                      <div className="adminrecurringbookings-booking-form">
                        <input
                          type="email"
                          placeholder="Enter your email"
                          value={venueBooker}
                          onChange={(e) => setVenueBooker(e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="Enter booking description"
                          value={bookingDescription}
                          onChange={(e) => setBookingDescription(e.target.value)}
                        />
                        <button className="adminrecurringbookings-button" onClick={handleCreateBooking}>
                          Add schedule
                        </button>
  
                        {/*error message on the card*/}
                        {errorMessage && <p className="adminrecurringbookings-error-message">{errorMessage}</p>}
  
                     
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <p>No venues available</p>
        )}
      </div>
    </div>
  );
  
};

export default AdminRecurringBookings;
