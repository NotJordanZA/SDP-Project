



// ///works
// import DateHeader from "../components/DateHeader";
// import React, { useState, useEffect } from 'react';
// import '../styles/ManageBookings.css';
// import EditBooking from './ManageBookingsEdit.js';

// const API_URL = process.env.NODE_ENV === 'production' ? 'https://your-production-site.com' : 'http://localhost:3002';

// const getAllBookings = async () => {
//   const response = await fetch(`${API_URL}/bookings`);
//   return await response.json();
// };

// const getBookingById = async (id) => {
//   const response = await fetch(`${API_URL}/bookings/${id}`);
//   return await response.json();
// };

// const createBooking = async (bookingData) => {
//   const response = await fetch(`${API_URL}/bookings/create`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(bookingData),
//   });
//   return await response.json();
// };

// const createRecurringBooking = async (bookingData) => {
//   const response = await fetch(`${API_URL}/Schedules/create`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(bookingData),
//   });
//   return await response.json();
// };

// const updateBooking = async (id, bookingData) => {
//   const response = await fetch(`${API_URL}/bookings/${id}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(bookingData),
//   });

//   if (!response.ok) {
//     throw new Error('Failed to update booking');
//   }
//   return response.json();
// };

// const deleteBooking = async (id) => {
//   const response = await fetch(`${API_URL}/bookings/${id}`, {
//     method: "DELETE",
//   });
//   return await response.json();
// };

// const getAllVenues = async () => {
//   try {
//     const response = await fetch(`${API_URL}/venues`);
//     const data = await response.json();
//     return { venues: data };
//   } catch (error) {
//     console.error("Error fetching venues:", error);
//     return { venues: [] };
//   }
// };

// const getAllSchedules = async () => {
//   const response = await fetch(`${API_URL}/Schedules`);
//   return await response.json();
// };

// const BookingTabs = () => {
//   const [activeTab, setActiveTab] = useState('all');
//   const [bookings, setBookings] = useState([]);
//   const [editingBooking, setEditingBooking] = useState(null);
//   const [filterDate, setFilterDate] = useState('');
//   const [filterBookerEmail, setFilterBookerEmail] = useState('');
//   const [filterVenue, setFilterVenue] = useState('');
//   const [venueInputs, setVenueInputs] = useState({});
//   const [currentBookingVenue, setCurrentBookingVenue] = useState(null);
//   const [venueBooker, setVenueBooker] = useState('');
//   const [venueID, setVenueID] = useState('');
//   const [bookingDate, setBookingDate] = useState('');
//   const [bookingStartTime, setBookingStartTime] = useState('');
//   const [bookingEndTime, setBookingEndTime] = useState('');
//   const [bookingDescription, setBookingDescription] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [bookingDay, setBookingDay] = useState(''); // Initialize bookingDay
//   const [venueCapacity, setVenueCapacity] = useState(''); // NEW: Store selected venue capacity
//   const [venues, setVenues] = useState([]);
//   const [filteredVenues, setFilteredVenues] = useState([]); // NEW: Filtered venues by capacity
  
  
//   const mockVenues = [
//     {
//       id: 1,
//       venueID: "RSEH",
//       campus: "East",
//       venueType: "Lecture Hall",
//       venueCapacity: 500,
//       timeSlots: ["08:00", "09:00", "10:15", "11:15", "12:30", "14:15", "15:15", "16:15"]
//     },
//     {
//       id: 2,
//       venueID: "CLM103",
//       campus: "West",
//       venueType: "Lecture Hall",
//       venueCapacity: 250,
//       timeSlots: ["08:00", "09:00", "10:15", "11:15", "12:30", "14:15", "15:15", "16:15"]
//     },
//     {
//       id: 3,
//       venueID: "NCB01",
//       campus: "Main",
//       venueType: "Classroom",
//       venueCapacity: 100,
//       timeSlots: ["08:00", "09:00", "10:15", "11:15", "12:30", "14:15", "15:15", "16:15"]
//     }
//   ];
//   useEffect(() => {
//     if (activeTab === 'all') {
//       getAllBookings().then(data => setBookings(data.bookings));
//     }
//   }, [activeTab]);

//   useEffect(() => {
//     if (activeTab === 'createbooking' ||  activeTab === 'reoccuringbooking') {
    
//       const fetchVenues = async () => {
//         try {
//           const response = await getAllVenues();
//           const openVenues = mockVenues.filter(venue => venue.venueCapacity > 0);
//           // Filter venues that are open (isClosed === false)
//           // const openVenues = response.venues.filter(venue => !venue.isClosed);
//           setVenues(openVenues || []);  // Store open venues
//         } catch (error) {
//           console.error("Error fetching venues:", error);
//           setVenues([]);
//         }};

//       fetchVenues();
//     }
//   }, [activeTab]);

//   // NEW: Handle filtering venues based on capacity
//   const handleVenueCapacityChange = (e) => {
   
//     const selectedCapacity = parseInt(e.target.value);
//     setVenueCapacity(selectedCapacity);

//     // Filter venues with capacity equal to or higher than selected capacity
//     const filtered = venues.filter(venue => venue.venueCapacity >= selectedCapacity);
//     setFilteredVenues(filtered);  // Update filtered venues
//   };

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
//   const handleTimeSlotClick = (venueID, timeSlot) => {
//     const [hours, minutes] = timeSlot.split(":");
//     const startTime = new Date();
//     startTime.setHours(parseInt(hours), parseInt(minutes), 0);

//     const endTime = new Date(startTime);
//     endTime.setMinutes(startTime.getMinutes() + 45);
//     const endTimeFormatted = endTime.toTimeString().substring(0, 5);

//     // Update the state for the specific venue
//     setVenueInputs((prevState) => ({
//       ...prevState,
//       [venueID]: {
//         ...prevState[venueID],
//         startTime: timeSlot,
//         endTime: endTimeFormatted,
//       },
//     }));

//     setCurrentBookingVenue(venueID); // Track the current booking venue
//   };

//   // Handle email and description for specific venue
//   const handleInputChange = (venueId, field, value) => {
//     setVenueInputs((prevState) => ({
//       ...prevState,
//       [venueId]: {
//         ...prevState[venueId],
//         [field]: value,
//       },
//     }));
//   };

//   const handleBookClick = (venueId) => {
//     const bookingDetails = venueInputs[venueId];

//     if (!bookingDetails || !bookingDetails.startTime || !bookingDetails.endTime || !bookingDetails.email || !bookingDetails.description) {
//       setErrorMessage("Please fill out all required fields.");
//       return;
//     }

//     console.log("Booking created for venue:", venueId, bookingDetails);
//     alert("Booking has been created successfully!");

//     // Clear the input fields for the specific venue
//     setVenueInputs((prevState) => ({
//       ...prevState,
//       [venueID]: {
//         email: '',
//         startTime: '',
//         endTime: '',
//         description: '',
//       },
//     }));

//     setCurrentBookingVenue(null); // Clear the current venue being booked
//   };

//   const handleDelete = async (bookingId) => {
//     try {
//       await deleteBooking(bookingId);
//       setBookings(bookings.filter(booking => booking.id !== bookingId));
//     } catch (error) {
//       console.error("Failed to delete booking:", error);
//     }
//   };
//   const handleCreateBooking = async (e) => {
//     e.preventDefault();

//     try {const schedulesResponse = await fetch(`${API_URL}/Schedules`);
//     console.log("API Response:", schedulesResponse); // Ensure that the response is valid
   
//         // Step 1: Fetch all schedules to check for conflicts
//         // const schedulesResponse = await fetch(`${API_URL}/Schedules`); // Actual API call for schedules
//         // const schedulesData = await schedulesResponse.json();
      
//         const schedulesData = await schedulesResponse.json();
//         const schedules = schedulesData.entry || [];  // Use 'entry' as that's where the schedule data is
//         console.log("Parsed Schedules Data:", schedules); // This should now correctly log the schedules
        
//         // Step 2: Convert the bookingDate to get the day of the week
//         const selectedDate = new Date(bookingDate);
//         const bookingDayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
//        // console.log("Booking Day of Week:", bookingDayOfWeek);  // Debug: Ensure the correct day of the week

//        const conflictingSchedule = schedules.find(schedule => {
//   console.log("Checking schedule with start time:", schedule.bookingStartTime);
//   console.log("User's booking start time:", bookingStartTime);

//   // Check if the booking conflicts with the schedule
//   return (
//     schedule.venueID === venueID &&
//     schedule.bookingStartTime === bookingStartTime && schedule.bookingDay===bookingDayOfWeek// Make sure to compare correctly
//   );
// });


//         if (conflictingSchedule) {
//             console.log("Conflicting schedule found:", conflictingSchedule);  // Debug: Check what schedule is conflicting
//             setErrorMessage("The venue is already booked according to the schedule at this time. Please choose another time.");
//             return; // Exit the function early if there's a conflict
//         }

//         // Step 4: Fetch all bookings to check for conflicts
//         const bookingsResponse = await fetch(`${API_URL}/bookings`); // Actual API call for bookings
//         const bookingsData = await bookingsResponse.json();
//         const bookings = bookingsData.bookings || [];

//         const conflictingBooking = bookings.find(booking =>
//             booking.venueID === venueID &&
//             booking.bookingDate === bookingDate &&
//             (
//                 (bookingStartTime >= booking.bookingStartTime && bookingStartTime < booking.bookingEndTime) ||  // Overlap case 1
//                 (bookingEndTime > booking.bookingStartTime && bookingEndTime <= booking.bookingEndTime) ||      // Overlap case 2
//                 (bookingStartTime <= booking.bookingStartTime && bookingEndTime >= booking.bookingEndTime)      // Overlap case 3 (encapsulates booking)
//             )
//         );

//         if (conflictingBooking) {
//             console.log("Conflicting booking found:", conflictingBooking);  // Debug: Check what booking is conflicting
//             setErrorMessage("The venue is already booked at this time. Please choose another time.");
//             return;
//         }

//         // Step 5: Proceed with creating the booking if no conflicts exist
//         const newBooking = {
//             venueBooker,
//             venueID,
//             bookingDate,
//             bookingStartTime,
//             bookingEndTime,
//             bookingDescription,
//         };

//         const createBookingResponse = await fetch(`${API_URL}/bookings/create`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(newBooking),
//         });

//         if (!createBookingResponse.ok) {
//             throw new Error("Failed to create booking");
//         }

//         // Fetch updated bookings and clear form fields
//         const data = await getAllBookings();
//         setBookings(data.bookings);

//         // Clear form fields after successful booking
//         setVenueBooker('');
//         setVenueID('');
//         setBookingDate('');
//         setBookingStartTime('');
//         setBookingEndTime('');
//         setBookingDescription('');
//         setErrorMessage('');

//     } catch (error) {
//         console.error("Error creating booking:", error);
//         setErrorMessage("There was an error processing the booking. Please try again.");
//     }
// };


// const handleRecurringBooking = async () => {
//   try {
//     const schedules = await getAllSchedules(); // Get all existing schedules

//     // Convert the selected booking date into the day of the week
//     const selectedDate = new Date(bookingDate);
//     const bookingDayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });

//     // Check if required fields are filled
//     if (!venueID || !bookingStartTime || !bookingEndTime || !venueBooker || !bookingDay || !bookingDescription) {
//       setErrorMessage("Please fill out all required fields.");
//       return;
//     }

//     const recurringBooking = {
//       bookingDay: bookingDayOfWeek, 
//       bookingDescription,
//       bookingEndTime,
//       bookingStartTime,
//       venueBooker,
//       venueID,
//     };

//     for (let i = 0; i < 10; i++) {
//       const newDate = new Date();
//       newDate.setDate(newDate.getDate() + (7 * i)); // Weekly recurrence
//       const bookingDate = newDate.toISOString().split('T')[0]; // Format date as yyyy-mm-dd

//       console.log("Creating recurring booking for:", bookingDate); // Log the date to see what is being sent

//       // Check for conflicting schedule
//       const conflictingSchedule = schedules.find(schedule =>
//         schedule.venueID === venueID &&
//         schedule.bookingDay === newDate.toLocaleString('en-US', { weekday: 'long' }) &&
//         (
//           (bookingStartTime >= schedule.bookingStartTime && bookingStartTime < schedule.bookingEndTime) ||
//           (bookingEndTime > schedule.bookingStartTime && bookingEndTime <= schedule.bookingEndTime) ||
//           (bookingStartTime <= schedule.bookingStartTime && bookingEndTime >= schedule.bookingEndTime)
//         )
//       );

//       if (conflictingSchedule) {
//         alert(`There is a conflict for ${newDate.toDateString()} at this time.`);
//         return;
//       }

//       const response = await createRecurringBooking({ ...recurringBooking, bookingDate });
//       console.log("API Response:", response); // Log the API response to check if the call is successful
//     }

//     alert("Recurring booking has been saved!");
//   } catch (error) {
//     console.error("Error creating recurring booking:", error); // Log the exact error
 
//   }
// };


// // const handleRecurringBooking = async () => {
// //   try {
// //     const schedules = await getAllSchedules(); // Get all existing schedules

// //     // Convert the selected booking date into the day of the week
// //     const selectedDate = new Date(bookingDate);
// //     const bookingDayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });

// //     const recurringBooking = {
// //       bookingDay: bookingDayOfWeek, // Use dynamic day of the week based on the selected date
// //       bookingDescription,
// //       bookingEndTime,
// //       bookingStartTime,
// //       venueBooker,
// //       venueID,
// //     };

// //     for (let i = 0; i < 10; i++) {
// //       const newDate = new Date();
// //       newDate.setDate(newDate.getDate() + (7 * i)); // Weekly recurrence
// //       const bookingDate = newDate.toISOString().split('T')[0]; // Format date as yyyy-mm-dd

// //       // Check for conflicting schedule
// //       const conflictingSchedule = schedules.find(schedule =>
// //         schedule.venueID === venueID &&
// //         schedule.bookingDay === newDate.toLocaleString('en-US', { weekday: 'long' }) &&
// //         (
// //           (bookingStartTime >= schedule.bookingStartTime && bookingStartTime < schedule.bookingEndTime) ||
// //           (bookingEndTime > schedule.bookingStartTime && bookingEndTime <= schedule.bookingEndTime) ||
// //           (bookingStartTime <= schedule.bookingStartTime && bookingEndTime >= schedule.bookingEndTime)
// //         )
// //       );

// //       if (conflictingSchedule) {
// //         alert(`There is a conflict for ${newDate.toDateString()} at this time.`);
// //         return; // Exit if there's a conflict
// //       }

// //       await createRecurringBooking({ ...recurringBooking, bookingDate });
// //     }

// //     alert("Recurring booking has been saved!");
// //   } catch (error) {
// //     console.error("Error creating recurring booking:", error);
// //     alert("There was an error saving the recurring booking.");
// //   }
// // };


//   const uniqueVenues = [...new Set(bookings.map(booking => booking.venueID))];

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
//         <button onClick={() => setActiveTab('reoccuringbooking')} className={activeTab === 'reoccuringbooking' ? 'active' : ''}>Reoccuring Booking</button>
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
//                 <label htmlFor="venueID">Venue Name:</label>
//                 <select
//                   id="venueID"
//                   value={venueID}
//                   onChange={(e) => setVenueID(e.target.value)}
//                   required
//                 >
//                   <option value="">Select a Venue</option>
//                   {venues && venues.map((venue) => (
//                     <option key={venue.venueID} value={venue.venueID}>
//                       {venue.venueID}
//                     </option>
//                   ))}
//                 </select>
//               </div>

             
//                 <div className="form-group">
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

//               {errorMessage && <p className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</p>}

//               <button type="submit">Create Booking</button>
//             </form>

//             {/* Recurring Booking Button */}
//             <button type="button" onClick={handleRecurringBooking}>Book Recurring Booking</button>
//           </div>
//         )}


// {activeTab === 'reoccuringbooking' && (

//       <div className="reoccur-tab-content">
//         <h2>Create New Booking</h2>

//         {/* Venue Capacity Dropdown */}
//         <div className="form-group">
//           <label htmlFor="venueCapacity">Select Capacity:</label>
//           <select
//             id="venueCapacity"
//             value={venueCapacity}
//             onChange={handleVenueCapacityChange}
//           >
//             <option value="">Select Capacity</option>
//             <option value="50">50+</option>
//             <option value="100">100+</option>
//             <option value="200">200+</option>
//             <option value="300">300+</option>
//             <option value="400">400+</option>
//             <option value="500">500+</option>
//           </select>
//         </div>

//         {/* Display Filtered Venues in Cards */}
//         {filteredVenues.map(venue => (
//     <div key={venue.id} className="venue-card">
//       <h3>{venue.venueID}</h3>
//       <p><strong>Campus:</strong> {venue.campus}</p>
//       <p><strong>Venue Type:</strong> {venue.venueType}</p>
//       <p><strong>Capacity:</strong> {venue.venueCapacity}</p>

//       <div className="timeslots">
//         {venue.timeSlots.map((time, index) => (
//           <button
//             key={index}
//             className={`timeslot-btn ${bookingStartTime === time ? 'selected' : ''}`}
//             onClick={() => handleTimeSlotClick(time)}
//           >
//             {time}
//           </button>
//         ))}
//       </div>

//       {/* Show description and day dropdown only if a time slot is selected */}
//       {bookingStartTime && (
//         <>
//           <div className="form-group">
//             <label htmlFor="bookingDescription">Input a booking description</label>
//             <input
//               type="text"
//               id="bookingDescription"
//               placeholder="Input a booking description"
//               value={bookingDescription}
//               onChange={(e) => setBookingDescription(e.target.value)}
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="bookingDay">Select Day:</label>
//             <select
//               id="bookingDay"
//               value={bookingDay}
//               onChange={(e) => setBookingDay(e.target.value)}
//               required
//             >
//               <option value="">Select a Day</option>
//               <option value="Monday">Monday</option>
//               <option value="Tuesday">Tuesday</option>
//               <option value="Wednesday">Wednesday</option>
//               <option value="Thursday">Thursday</option>
//               <option value="Friday">Friday</option>
//             </select>
//           </div>

//           <div className="form-group">
//             <label htmlFor="venueBooker">Booker Email:</label>
//             <input
//               type="email"
//               id="venueBooker"
//               value={venueBooker}
//               onChange={(e) => setVenueBooker(e.target.value)}
//               required
//             />
//           </div>

//           <button type="button" className="book-btn" onClick={handleBookClick}>Book</button>
//         </>
//       )}
//     </div>
//   ))}
     

    

         

       

     
            

//           {errorMessage && <p className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</p>}

      
    
        
//       </div>



//     )}
//   </div>
// </div>
// );
// };

// export default BookingTabs;


// import DateHeader from "../components/DateHeader";
// import React, { useState, useEffect } from 'react';
// import '../styles/ManageBookings.css';
// import EditBooking from './ManageBookingsEdit.js';

// const API_URL = process.env.NODE_ENV === 'production' ? 'https://your-production-site.com' : 'http://localhost:3002';

// // API functions
// const getAllBookings = async () => {
//   const response = await fetch(`${API_URL}/bookings`);
//   return await response.json();
// };

// const getBookingById = async (id) => {
//   const response = await fetch(`${API_URL}/bookings/${id}`);
//   return await response.json();
// };

// const createBooking = async (bookingData) => {
//   const response = await fetch(`${API_URL}/bookings/create`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(bookingData),
//   });
//   return await response.json();
// };

// const createRecurringBooking = async (bookingData) => {
//   const response = await fetch(`${API_URL}/Schedules/create`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(bookingData),
//   });
//   return await response.json();
// };

// const updateBooking = async (id, bookingData) => {
//   const response = await fetch(`${API_URL}/bookings/${id}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(bookingData),
//   });

//   if (!response.ok) {
//     throw new Error('Failed to update booking');
//   }
//   return response.json();
// };

// const deleteBooking = async (id) => {
//   const response = await fetch(`${API_URL}/bookings/${id}`, {
//     method: "DELETE",
//   });
//   return await response.json();
// };

// // Get all venues from the API
// const getAllVenues = async () => {
//   try {
//     const response = await fetch(`${API_URL}/venues`);
//     const data = await response.json();
//     return { venues: data };
//   } catch (error) {
//     console.error("Error fetching venues:", error);
//     return { venues: [] };
//   }
// };

// const getAllSchedules = async () => {
//   const response = await fetch(`${API_URL}/Schedules`);
//   return await response.json();
// };

// // Component
// const BookingTabs = () => {
//   const [activeTab, setActiveTab] = useState('all');
//   const [bookings, setBookings] = useState([]);
//   const [editingBooking, setEditingBooking] = useState(null);
//   const [filterDate, setFilterDate] = useState('');
//   const [filterBookerEmail, setFilterBookerEmail] = useState('');
//   const [filterVenue, setFilterVenue] = useState('');
//   const [venueInputs, setVenueInputs] = useState({});
//   const [currentBookingVenue, setCurrentBookingVenue] = useState(null);
//   const [venueBooker, setVenueBooker] = useState('');
//   const [venueID, setVenueID] = useState('');
//   const [bookingDate, setBookingDate] = useState('');
//   const [bookingStartTime, setBookingStartTime] = useState('');
//   const [bookingEndTime, setBookingEndTime] = useState('');
//   const [bookingDescription, setBookingDescription] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [bookingDay, setBookingDay] = useState('');
//   const [venueCapacity, setVenueCapacity] = useState('');
//   const [venues, setVenues] = useState([]);
//   const [filteredVenues, setFilteredVenues] = useState([]);
//   const [selectedTimeSlot, setSelectedTimeSlot] = useState(null); // Store the selected time slot
//   const [formVisible, setFormVisible] = useState(false); // Toggle the form visibility
  
  
//   // Fetch all bookings when the 'all' tab is active
//   useEffect(() => {
//     if (activeTab === 'all') {
//       getAllBookings().then(data => setBookings(data.bookings));
//     }
//   }, [activeTab]);

//   // Fetch all venues when 'createbooking' or 'reoccuringbooking' is active
//   useEffect(() => {
//     if (activeTab === 'createbooking' ||  activeTab === 'reoccuringbooking') {
    
//             const fetchVenues = async () => {
//               try {
//                 const response = await getAllVenues();
//                 const openVenues = response.venues.filter(venue => !venue.isClosed);
              
//                 setVenues(openVenues || []);  // Store open venues
//               } catch (error) {
//                 console.error("Error fetching venues:", error);
//                 setVenues([]);
//               }};
      
//             fetchVenues();
//           }
//         }, [activeTab]);

//   // Handle filtering venues based on capacity
//   const handleVenueCapacityChange = (e) => {
//     const selectedCapacity = parseInt(e.target.value);
//     setVenueCapacity(selectedCapacity);
//     const filtered = venues.filter(venue => venue.venueCapacity >= selectedCapacity);
//     setFilteredVenues(filtered);
//   };

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

//   const handleTimeSlotClick = (venueID, timeSlot) => {
//     const [hours, minutes] = timeSlot.split(":");
//     const startTime = new Date();
//     startTime.setHours(parseInt(hours), parseInt(minutes), 0);

//     const endTime = new Date(startTime);
//     endTime.setMinutes(startTime.getMinutes() + 45);
//     const endTimeFormatted = endTime.toTimeString().substring(0, 5);

//     setVenueInputs((prevState) => ({
//       ...prevState,
//       [venueID]: {
//         ...prevState[venueID],
//         startTime: timeSlot,
//         endTime: endTimeFormatted,
//       },
//     }));

//     setCurrentBookingVenue(venueID);
//   };

//   // Handle email and description for specific venue
//   const handleInputChange = (venueId, field, value) => {
//     setVenueInputs((prevState) => ({
//       ...prevState,
//       [venueId]: {
//         ...prevState[venueId],
//         [field]: value,
//       },
//     }));
//   };

//   const handleBookClick = async (venueId) => {
//     const bookingDetails = venueInputs[venueId];
//     if (!bookingDetails || !bookingDetails.startTime || !bookingDetails.endTime || !bookingDetails.email || !bookingDetails.description) {
//       setErrorMessage("Please fill out all required fields.");
//       return;
//     }

//     try {
//       const bookingData = {
//         venueID: venueId,
//         venueBooker: bookingDetails.email,
//         bookingStartTime: bookingDetails.startTime,
//         bookingEndTime: bookingDetails.endTime,
//         bookingDescription: bookingDetails.description,
//         bookingDate,
//         bookingDay
//       };
//       await createBooking(bookingData);
//       alert("Booking has been created successfully!");

//       // Clear the input fields for the specific venue
//       setVenueInputs((prevState) => ({
//         ...prevState,
//         [venueId]: {
//           email: '',
//           startTime: '',
//           endTime: '',
//           description: '',
//         },
//       }));
//     } catch (error) {
//       console.error("Error creating booking:", error);
//       setErrorMessage("There was an error processing the booking.");
//     }
//   };

//   const handleDelete = async (bookingId) => {
//     try {
//       await deleteBooking(bookingId);
//       setBookings(bookings.filter(booking => booking.id !== bookingId));
//     } catch (error) {
//       console.error("Failed to delete booking:", error);
//     }
//   };

//   const handleRecurringBooking = async () => {
//     try {
//       const schedules = await getAllSchedules();
//       const selectedDate = new Date(bookingDate);
//       const bookingDayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });

//       if (!venueID || !bookingStartTime || !bookingEndTime || !venueBooker || !bookingDay || !bookingDescription) {
//         setErrorMessage("Please fill out all required fields.");
//         return;
//       }

//       const recurringBooking = {
//         bookingDay: bookingDayOfWeek,
//         bookingDescription,
//         bookingEndTime,
//         bookingStartTime,
//         venueBooker,
//         venueID,
//       };

//       for (let i = 0; i < 10; i++) {
//         const newDate = new Date();
//         newDate.setDate(newDate.getDate() + (7 * i));
//         const bookingDate = newDate.toISOString().split('T')[0];

//         const conflictingSchedule = schedules.find(schedule =>
//           schedule.venueID === venueID &&
//           schedule.bookingDay === newDate.toLocaleString('en-US', { weekday: 'long' }) &&
//           (
//             (bookingStartTime >= schedule.bookingStartTime && bookingStartTime < schedule.bookingEndTime) ||
//             (bookingEndTime > schedule.bookingStartTime && bookingEndTime <= schedule.bookingEndTime) ||
//             (bookingStartTime <= schedule.bookingStartTime && bookingEndTime >= schedule.bookingEndTime)
//           )
//         );

//         if (conflictingSchedule) {
//           alert(`There is a conflict for ${newDate.toDateString()} at this time.`);
//           return;
//         }

//         await createRecurringBooking({ ...recurringBooking, bookingDate });
//       }

//       alert("Recurring booking has been saved!");
//     } catch (error) {
//       console.error("Error creating recurring booking:", error);
//     }
//   };

//   return (
//     <div className="booking-tabs-container">
//       <div className="tabs">
//         <button onClick={() => setActiveTab('all')} className={activeTab === 'all' ? 'active' : ''}>All Bookings</button>
//         <button onClick={() => setActiveTab('createbooking')} className={activeTab === 'createbooking' ? 'active' : ''}>Create Booking</button>
//         <button onClick={() => setActiveTab('reoccuringbooking')} className={activeTab === 'reoccuringbooking' ? 'active' : ''}>Recurring Booking</button>
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
//                   {venues.map((venue, index) => (
//                     <option key={index} value={venue.venueID}>
//                       {venue.venueID}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {bookings.length > 0 ? (
//               bookings.map(booking => (
//                 <div key={booking.id} className="booking-card">
//                   <h3>{booking.bookingDate}</h3>
//                   <p>Booked by: {booking.venueBooker}</p>
//                   <p>Date & Time: {booking.bookingStartTime} - {booking.bookingEndTime}</p>
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
//             <form onSubmit={handleBookClick}>
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
//                 <label htmlFor="venueID">Venue Name:</label>
//                 <select
//                   id="venueID"
//                   value={venueID}
//                   onChange={(e) => setVenueID(e.target.value)}
//                   required
//                 >
//                   <option value="">Select a Venue</option>
//                   {venues.map(venue => (
//                     <option key={venue.venueID} value={venue.venueID}>
//                       {venue.venueID}
//                     </option>
//                   ))}
//                 </select>
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

//               {errorMessage && <p className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</p>}

//               <button type="submit">Create Booking</button>
//             </form>

//             {/* Recurring Booking Button */}
//             <button type="button" onClick={handleRecurringBooking}>Book Recurring Booking</button>
//           </div>
//         )}

//         {activeTab === 'reoccuringbooking' && (
//           <div className="reoccur-tab-content">
//             <h2>Create Recurring Booking</h2>

//             {/* Venue Capacity Dropdown */}
//             <div className="form-group">
//               <label htmlFor="venueCapacity">Select Capacity:</label>
//               <select
//                 id="venueCapacity"
//                 value={venueCapacity}
//                 onChange={handleVenueCapacityChange}
//               >
//                 <option value="">Select Capacity</option>
//                 <option value="50">50+</option>
//                 <option value="100">100+</option>
//                 <option value="200">200+</option>
//                 <option value="300">300+</option>
//                 <option value="400">400+</option>
//                 <option value="500">500+</option>
//               </select>
//             </div>

//             {/* Display Filtered Venues */}
//             {filteredVenues.map(venue => (
//               <div key={venue.id} className="venue-card">
//                 <h3>{venue.venueID}</h3>
//                 <p><strong>Campus:</strong> {venue.campus}</p>
//                 <p><strong>Venue Type:</strong> {venue.venueType}</p>
//                 <p><strong>Capacity:</strong> {venue.venueCapacity}</p>

//                 <div className="timeslots">
//                   {venue.timeSlots.map((time, index) => (
//                     <button
//                       key={index}
//                       className={`timeslot-btn ${bookingStartTime === time ? 'selected' : ''}`}
//                       onClick={() => handleTimeSlotClick(venue.venueID, time)}
//                     >
//                       {time}
//                     </button>
//                   ))}
//                 </div>

//                 {bookingStartTime && (
//                   <>
//                     <div className="form-group">
//                       <label htmlFor="bookingDescription">Input a booking description</label>
//                       <input
//                         type="text"
//                         id="bookingDescription"
//                         placeholder="Input a booking description"
//                         value={bookingDescription}
//                         onChange={(e) => setBookingDescription(e.target.value)}
//                         required
//                       />
//                     </div>

//                     <div className="form-group">
//                       <label htmlFor="bookingDay">Select Day:</label>
//                       <select
//                         id="bookingDay"
//                         value={bookingDay}
//                         onChange={(e) => setBookingDay(e.target.value)}
//                         required
//                       >
//                         <option value="">Select a Day</option>
//                         <option value="Monday">Monday</option>
//                         <option value="Tuesday">Tuesday</option>
//                         <option value="Wednesday">Wednesday</option>
//                         <option value="Thursday">Thursday</option>
//                         <option value="Friday">Friday</option>
//                       </select>
//                     </div>

//                     <div className="form-group">
//                       <label htmlFor="venueBooker">Booker Email:</label>
//                       <input
//                         type="email"
//                         id="venueBooker"
//                         value={venueBooker}
//                         onChange={(e) => setVenueBooker(e.target.value)}
//                         required
//                       />
//                     </div>

//                     <button type="button" className="book-btn" onClick={() => handleBookClick(venue.venueID)}>Book</button>
//                   </>
//                 )}
//               </div>
//             ))}

//             {errorMessage && <p className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</p>}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BookingTabs;


import React, { useState, useEffect } from 'react';
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { getCurrentUser } from '../utils/getCurrentUser';
import AllBookings from '../components/AdminAllBookings.js'; 
import CreateBooking from '../components/AdminCreateBookings.js'; 
import RecurringBooking from '../components/AdminRecurringBookings.js'; 
import '../styles/ManageBookings.css';

const ManageBookings = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Ensure User is logged in
  useEffect(() => {
    // Listen for a change in the auth state
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      // If user is authenticated
      if (firebaseUser) {
        setUser(firebaseUser); //Set current user
      } else {
        navigate("/login"); //Reroute to login if user not signed in
      }
      setIsLoading(false); //Declare firebase as no longer loading
    });
    return () => unsubscribe(); //Return the listener
  }, [auth, navigate]);

  // Get info about the current user from the database once firebase is loaded
  useEffect(() => {
    // Fetch current user's info
    const fetchUserInfo = async () => {
      // If user is signed in
      if (user) {
        try {
          // Instantiate userInfo object
          const userData = await getCurrentUser(user.email);
          setUserInfo(userData);
        } catch (error) {
          console.error('Failed to fetch user info: ', error);
        }
      }
    };
    // Check if firebase is done loading
    if (!isLoading){
      fetchUserInfo(); //Get user info
    }
  }, [user, isLoading]);

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
