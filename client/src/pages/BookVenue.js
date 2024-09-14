import React, { useState, useEffect } from 'react';
import '../styles/BookVenue.css';
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { getCurrentUser } from '../utils/getCurrentUser';

function BookVenue() {
  const [selectedTime, setSelectedTime] = useState(null);
  const [size, setSize] = useState('');
  const [date, setDate] = useState('');
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

  const handleTimeClick = (time) => {
    setSelectedTime(time);
  };

  const handleSubmit = () => {
  
    console.log('Booking confirmed for:', selectedTime, size, date);
  };

  return (
    <div className="book-venue">
      <div className="booking-form">
        <label htmlFor="size">Size</label>
        <select id="size" value={size} onChange={(e) => setSize(e.target.value)}>
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="200">200</option>
        </select>

        <label htmlFor="date">Date</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <h3>Select an available time</h3>
        <div className="time-selection">
          <button
            className={selectedTime === '08:00' ? 'selected' : ''}
            onClick={() => handleTimeClick('08:00')}
          >
            08:00
          </button>
          <button
            className={selectedTime === '10:00' ? 'selected' : ''}
            onClick={() => handleTimeClick('10:00')}
          >
            10:00
          </button>
          <button
            className={selectedTime === '12:00' ? 'selected' : ''}
            onClick={() => handleTimeClick('12:00')}
          >
            12:00
          </button>
          <button
            className={selectedTime === '14:00' ? 'selected' : ''}
            onClick={() => handleTimeClick('14:00')}
          >
            14:00
          </button>
          <button
            className={selectedTime === '16:00' ? 'selected' : ''}
            onClick={() => handleTimeClick('16:00')}
          >
            16:00
          </button>
          <button
            className={selectedTime === '18:00' ? 'selected' : ''}
            onClick={() => handleTimeClick('18:00')}
          >
            18:00
          </button>
          <button
            className={selectedTime === '20:00' ? 'selected' : ''}
            onClick={() => handleTimeClick('20:00')}
          >
            20:00
          </button>
          <button
            className={selectedTime === '22:00' ? 'selected' : ''}
            onClick={() => handleTimeClick('22:00')}
          >
            22:00
          </button>
          <button
            className={selectedTime === '00:00' ? 'selected' : ''}
            onClick={() => handleTimeClick('00:00')}
          >
            00:00
          </button>
        </div>

        <button onClick={handleSubmit} className="confirm-booking-button">
          Confirm Booking
        </button>
      </div>
    </div>
  );
}

export default BookVenue;
