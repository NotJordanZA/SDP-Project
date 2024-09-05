// import React, { useState, useEffect } from 'react';
// import './ManageBookings.css';
// import { getAllBookings, deleteBooking, updateBooking, createBooking, getAllVenues } from "../api";
// import EditBooking from './ManageBookingsEdit.js';

// const BookingTabs = () => {
//   const [activeTab, setActiveTab] = useState('all'); 
//   const [bookings, setBookings] = useState([]);
//   const [editingBooking, setEditingBooking] = useState(null);
//   const [filterDate, setFilterDate] = useState(''); 
//   const [filterBookerEmail, setFilterBookerEmail] = useState('');
//   const [filterVenue, setFilterVenue] = useState(''); 

//   const [venueBooker, setVenueBooker] = useState('');
//   const [venueID, setVenueID] = useState('');
//   const [bookingDate, setBookingDate] = useState('');
//   const [bookingStartTime, setBookingStartTime] = useState('');
//   const [bookingEndTime, setBookingEndTime] = useState('');
//   const [bookingDescription, setBookingDescription] = useState('');
//   const [errorMessage, setErrorMessage] = useState(''); 

//   useEffect(() => {
//     if (activeTab === 'all') {
//       // Fetch all bookings 
//       getAllBookings().then(data => setBookings(data.bookings));
//     }
//   }, [activeTab]);

//   const handleEdit = (booking) => {
//     setEditingBooking(booking);
//   };

//   const handleSave = async (updatedBooking) => {
//     try {
//       await updateBooking(updatedBooking.id, updatedBooking);
//       setBookings(bookings.map(b => (b.id === updatedBooking.id ? updatedBooking : b)));
//       setEditingBooking(null);
//     } catch (error) {
//       console.error("Failed to update booking:", error);
//     }
//   };

//   const handleCancel = () => {
//     setEditingBooking(null);
//   };

//   const handleDelete = async (bookingId) => {
//     try {
//       await deleteBooking(bookingId);
//       setBookings(bookings.filter(booking => booking.id !== bookingId));
//     } catch (error) {
//       console.error("Failed to delete booking:", error);
//     }
//   };

//   // Handle creating a booking
//   const handleCreateBooking = async (e) => {
//     e.preventDefault();

//     // Check if there is a conflict in the bookings
//     const conflictingBooking = bookings.find(booking => 
//       booking.venueID === venueID &&
//       booking.bookingDate === bookingDate &&
//       (
//         (bookingStartTime >= booking.bookingStartTime && bookingStartTime < booking.bookingEndTime) || 
//         (bookingEndTime > booking.bookingStartTime && bookingEndTime <= booking.bookingEndTime) ||
//         (bookingStartTime <= booking.bookingStartTime && bookingEndTime >= booking.bookingEndTime)
//       )
//     );

//     if (conflictingBooking) {
//       setErrorMessage("The venue is already booked at this time. Please choose another time.");
//       return;
//     }

//     try {
//       const newBooking = {
//         venueBooker,
//         venueID,
//         bookingDate,
//         bookingStartTime,
//         bookingEndTime,
//         bookingDescription
//       };
//       await createBooking(newBooking);

//       // Refresh the bookings list
//       const data = await getAllBookings();
//       setBookings(data.bookings);

//       // Clear form fields
//       setVenueBooker('');
//       setVenueID('');
//       setBookingDate('');
//       setBookingStartTime('');
//       setBookingEndTime('');
//       setBookingDescription('');
//       setErrorMessage(''); // Clear any previous errors after successful booking
//     } catch (error) {
//       console.error("Error creating booking:", error);
//     }
//   };

//   // Extract unique venues from bookings without duplicates
//   const uniqueVenues = [...new Set(bookings.map(booking => booking.venueID))];

//   // Filter bookings by the selected date, bookerEmail, and venue
//   const filteredBookings = bookings.filter(booking => {
//     return (
//       (filterDate ? booking.bookingDate === filterDate : true) &&
//       (filterBookerEmail ? booking.venueBooker.includes(filterBookerEmail) : true) &&
//       (filterVenue ? booking.venueID === filterVenue : true)
//     );
//   });

//   return (
//     <div className="booking-tabs-container">
//       <div className="tabs">
//         <button onClick={() => setActiveTab('all')} className={activeTab === 'all' ? 'active' : ''}>All Bookings</button>
//         <button onClick={() => setActiveTab('createbooking')} className={activeTab === 'createbooking' ? 'active' : ''}>Create Booking</button>
//       </div>

//       <div className="tab-content">
//         {activeTab === 'all' && editingBooking === null && (
//           <div className="all-bookings-tab-content">
//             <div className="filters">
//               <div className="date-filter">
//                 <label htmlFor="filter-date">Filter by Date:</label>
//                 <input
//                   type="date"
//                   id="filter-date"
//                   value={filterDate}
//                   onChange={(e) => setFilterDate(e.target.value)}
//                 />
//               </div>
//               <div className="email-filter">
//                 <label htmlFor="filter-bookerEmail">Filter by Booker Email (Lecturer/Student):</label>
//                 <select
//                   id="filter-bookerEmail"
//                   value={filterBookerEmail}
//                   onChange={(e) => setFilterBookerEmail(e.target.value)}
//                 >
//                   <option value="">All</option>
//                   <option value="@students.wits.ac.za">Students</option>
//                   <option value="@wits.ac.za">Lecturers</option>
//                 </select>
//               </div>
//               <div className="venue-filter">
//                 <label htmlFor="filter-venue">Filter by Venue:</label>
//                 <select
//                   id="filter-venue"
//                   value={filterVenue}
//                   onChange={(e) => setFilterVenue(e.target.value)}
//                 >
//                   <option value="">All Venues</option>
//                   {uniqueVenues.map((venue, index) => (
//                     <option key={index} value={venue}>
//                       {venue}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {filteredBookings.length > 0 ? (
//               filteredBookings.map(booking => (
//                 <div key={booking.id} className="booking-card">
//                   <h3>{booking.bookingDate}</h3>
//                   <p>Booked by: {booking.venueBooker}</p>
//                   <p>Date & Time: {booking.bookingDate} - Time: {booking.bookingStartTime} - {booking.bookingEndTime}</p>
//                   <p>Venue Name: {booking.venueID}</p>
//                   <button onClick={() => handleEdit(booking)}>Edit</button>
//                   <button onClick={() => handleDelete(booking.id)}>Delete</button>
//                 </div>
//               ))
//             ) : (
//               <p>No bookings found</p>
//             )}
//           </div>
//         )}

//         {editingBooking && (
//           <EditBooking
//             booking={editingBooking}
//             onSave={handleSave}
//             onCancel={handleCancel}
//           />
//         )}

//         {activeTab === 'createbooking' && (
//           <div className="createbooking-tab-content">
//             <h2>Create New Booking</h2>
//             <form onSubmit={handleCreateBooking}>
//               <div className="form-group">
//                 <label htmlFor="venueBooker">Booker Email:</label>
//                 <input
//                   type="email"
//                   id="venueBooker"
//                   value={venueBooker}
//                   onChange={(e) => setVenueBooker(e.target.value)}
//                   required
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="venueID">Venue ID:</label>
//                 <input
//                   type="text"
//                   id="venueID"
//                   value={venueID}
//                   onChange={(e) => setVenueID(e.target.value)}
//                   required
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="bookingDate">Booking Date:</label>
//                 <input
//                   type="date"
//                   id="bookingDate"
//                   value={bookingDate}
//                   onChange={(e) => setBookingDate(e.target.value)}
//                   required
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="bookingStartTime">Start Time:</label>
//                 <input
//                   type="time"
//                   id="bookingStartTime"
//                   value={bookingStartTime}
//                   onChange={(e) => setBookingStartTime(e.target.value)}
//                   required
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="bookingEndTime">End Time:</label>
//                 <input
//                   type="time"
//                   id="bookingEndTime"
//                   value={bookingEndTime}
//                   onChange={(e) => setBookingEndTime(e.target.value)}
//                   required
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="bookingDescription">Description:</label>
//                 <textarea
//                   id="bookingDescription"
//                   value={bookingDescription}
//                   onChange={(e) => setBookingDescription(e.target.value)}
//                   required
//                 />
//               </div>

//               {/* Move error message below all the form fields and just above the button */}
//               {errorMessage && <p className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</p>}

//               <button type="submit">Create Booking</button>
//             </form>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };


import React, { useState, useEffect } from 'react';
import './ManageBookings.css';
import { getAllBookings, deleteBooking, updateBooking, createBooking, getAllVenues } from "../api";
import EditBooking from './ManageBookingsEdit.js';

const BookingTabs = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [bookings, setBookings] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);
  const [filterDate, setFilterDate] = useState('');
  const [filterBookerEmail, setFilterBookerEmail] = useState('');
  const [filterVenue, setFilterVenue] = useState('');

  // State for creating bookings
  const [venueBooker, setVenueBooker] = useState('');
  const [venueID, setVenueID] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingStartTime, setBookingStartTime] = useState('');
  const [bookingEndTime, setBookingEndTime] = useState('');
  const [bookingDescription, setBookingDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // New state for venues
  const [venues, setVenues] = useState([]); // Initialize venues as an empty array

  // Fetch all bookings when the 'All Bookings' tab is active
  useEffect(() => {
    if (activeTab === 'all') {
      getAllBookings().then(data => setBookings(data.bookings));
    }
  }, [activeTab]);

  // Fetch all venues for the dropdown when the 'Create Booking' tab is active
  useEffect(() => {
    if (activeTab === 'createbooking') {
      const fetchVenues = async () => {
        try {
          const response = await getAllVenues(); // Fetch venues using the getAllVenues function
          setVenues(response.venues || []); // Ensure venues is an array
        } catch (error) {
          console.error("Error fetching venues:", error);
          setVenues([]); // Fallback to an empty array in case of error
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

  // Handle creating a booking
  const handleCreateBooking = async (e) => {
    e.preventDefault();

    // Check if there is a conflict in the bookings
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

      // Refresh the bookings list
      const data = await getAllBookings();
      setBookings(data.bookings);

      // Clear form fields
      setVenueBooker('');
      setVenueID('');
      setBookingDate('');
      setBookingStartTime('');
      setBookingEndTime('');
      setBookingDescription('');
      setErrorMessage(''); // Clear any previous errors after successful booking
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  // Extract unique venues from bookings without duplicates
  const uniqueVenues = [...new Set(bookings.map(booking => booking.venueID))];

  // Filter bookings by the selected date, bookerEmail, and venue
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
        {venue.venueName} {/* Displaying the venue name in the dropdown */}
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

              {/* Move error message below all the form fields and just above the button */}
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

