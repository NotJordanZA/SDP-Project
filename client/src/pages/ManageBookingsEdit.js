import React, { useState, useEffect } from 'react';
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
// import { getCurrentUser } from '../utils/getCurrentUser';
import '../styles/ManageBookingsEdit.css';

// Fetch all bookings from the API
const getAllBookings = async () => {
  const response = await fetch(`/api/bookings`);
  return await response.json();
};

// Update a booking by its ID
// const updateBooking = async (id, bookingData) => {
//   const response = await fetch(`/api/bookings/${id}`, {
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

const EditBookingForm = ({ booking, onSave, onCancel }) => {
  const [venueBooker, setVenueBooker] = useState(booking.venueBooker || '');
  const [venueID, setVenueID] = useState(booking.venueID || '');
  const [bookingDate, setBookingDate] = useState(booking.bookingDate || '');
  const [bookingStartTime, setBookingStartTime] = useState(booking.bookingStartTime || '');
  const [bookingEndTime, setBookingEndTime] = useState(booking.bookingEndTime || '');
  const [bookingDescription, setBookingDescription] = useState(booking.bookingDescription || '');

  const [validationError, setValidationError] = useState('');
  const [existingBookings, setExistingBookings] = useState([]);

  // const [userInfo, setUserInfo] = useState({});
  // const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Ensure User is logged in
  useEffect(() => {
    // Listen for a change in the auth state
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      // If user is authenticated
      if (firebaseUser) {
        setUser(firebaseUser); //Set current user
        console.log(user);
      } else {
        navigate("/login"); //Reroute to login if user not signed in
      }
      // setIsLoading(false); //Declare firebase as no longer loading
    });
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    }; //Return the listener
    // eslint-disable-next-line
  }, [auth, navigate]);

  // Get info about the current user from the database once firebase is loaded
  // useEffect(() => {
  //   // Fetch current user's info
  //   const fetchUserInfo = async () => {
  //     // If user is signed in
  //     if (user) {
  //       try {
  //         // Instantiate userInfo object
  //         getCurrentUser(user.email, setUserInfo);
  //       } catch (error) {
  //         console.error('Failed to fetch user info: ', error);
  //       }
  //     }
  //   };
  //   // Check if firebase is done loading
  //   if (!isLoading){
  //     fetchUserInfo(); //Get user info
  //   }
  // }, [user, isLoading]);

  // Fetch all existing bookings on component load
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

  // Check for conflicting bookings
  const isBookingConflict = () => {
    if (!Array.isArray(existingBookings) || existingBookings.length === 0) {
      return false; // No bookings to check against
    }

    return existingBookings.some(existingBooking => {
      const existingBookingStart = new Date(`${existingBooking.bookingDate}T${existingBooking.bookingStartTime}`);
      const existingBookingEnd = new Date(`${existingBooking.bookingDate}T${existingBooking.bookingEndTime}`);
      const newBookingStart = new Date(`${bookingDate}T${bookingStartTime}`);
      const newBookingEnd = new Date(`${bookingDate}T${bookingEndTime}`);

      // Check if the venue is the same and there is an overlap in time
      return (
        existingBooking.venueID === venueID &&
        existingBooking.id !== booking.id && // Exclude the current booking being edited
        (
          (newBookingStart >= existingBookingStart && newBookingStart < existingBookingEnd) || // Overlapping start
          (newBookingEnd > existingBookingStart && newBookingEnd <= existingBookingEnd) || // Overlapping end
          (newBookingStart <= existingBookingStart && newBookingEnd >= existingBookingEnd) // Encapsulates existing booking
        )
      );
    });
  };

  // Handle saving the updated booking
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form for booking conflicts
    if (isBookingConflict()) {
      setValidationError('A booking with the same date, time, and venue already exists.');
      return;
    }

    // Create the updated booking object
    const updatedBooking = {
      ...booking,
      venueBooker,
      venueID,
      bookingDate,
      bookingStartTime,
      bookingEndTime,
      bookingDescription,
    };

    try {
      await onSave(updatedBooking); // Call onSave from the parent component to update the booking
    } catch (error) {
      console.error('Error updating booking:', error);
      setValidationError('Error updating booking.');
    }
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

      {/* Validation error message */}
      {validationError && <p className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{validationError}</p>}

      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default EditBookingForm;
