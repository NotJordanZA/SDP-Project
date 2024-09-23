import React, { useState, useEffect } from 'react';
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
// import { getCurrentUser } from '../utils/getCurrentUser';
import AllBookings from '../components/AdminAllBookings.js'; 
import '../styles/ManageBookings.css';

const ManageBookings = () => {
  const [activeTab, setActiveTab] = useState('all');
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'all':
        return <AllBookings handleEdit={() => {}} />;
      case 'createbooking':
        navigate("/venues");
        break;
      case 'recurringbooking':
        navigate("/venues");
        break;
      default:
        return <AllBookings handleEdit={() => {}} />;
    }
  };

  return (
    <div className="adminmanage-bookings-container">
      <div className="adminmanage-tabs">
        <button
          onClick={() => setActiveTab('all')}
          className={`adminmanage-tab ${activeTab === 'all' ? 'adminmanage-active' : ''}`}
        >
          All Bookings
        </button>
        <button
          onClick={() => setActiveTab('createbooking')}
          className={`adminmanage-tab ${activeTab === 'createbooking' ? 'adminmanage-active' : ''}`}
        >
          Create Booking
        </button>
        <button
          onClick={() => setActiveTab('recurringbooking')}
          className={`adminmanage-tab ${activeTab === 'recurringbooking' ? 'adminmanage-active' : ''}`}
        >
          Recurring Booking
        </button>
      </div>

      <div className="adminmanage-tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ManageBookings;