import React, { useState, useEffect } from 'react';
import '../styles/homePage.css';
import MainIcon from '../components/mainIcon'; // Ensure the correct import path
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getCurrentUser } from '../utils/getCurrentUser';
import CalendarAdmin from '../assets/CalendarAdmin.svg';
import AdminReport from '../assets/AdminReport.svg';
import question from '../assets/Question.svg';
import venue from '../assets/Venue.svg';

const HomePage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');

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
          setUserName(user?.displayName || user?.email); // Use displayName if available, otherwise fallback to email
          // console.log(userData);
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

  if (userInfo.isAdmin === true){
    return (
      <article>
        <section className='welcome-section'>
          <h2 className='welcome-name'>Welcome {userName}</h2> {/* Display the user's name or email */}
        </section>
          <div className="home">
          <div className="card" onClick={() => navigate('/manage-bookings')}>
            <img src={CalendarAdmin} alt="Manage Bookings" className="card-logo" />
            <h2>Manage Bookings</h2>
          </div>
          <div className="card" onClick={() => navigate('/manage-reports')}>
            <img src={AdminReport} alt="My Reports" className="card-logo" />
            <h2>Manage Reports</h2>
          </div>
          <div className="card" onClick={() => navigate('/manage-requests')}>
            <img src={question} alt="Manage Requests" className="card-logo" />
            <h2>Manage Requests</h2>
          </div>
          <div className="card" onClick={() => navigate('/manage-venues')}>
            <img src={venue} alt="Manage Venues" className="card-logo" />
            <h2>Manage Venues</h2>
        </div>
      </div>
      </article>
      
    );
  } else {
    return (   
      <article>
        <section className='welcome-section'>
          <h2 className='welcome-name'>Welcome {userName}</h2> {/* Display the user's name or email */}
        </section>
        <section className="home-page">
          <MainIcon iconClass="fa-solid fa-house icon-img" text="BOOK A VENUE" onClickFunction={() => navigate("/venues")}/>
          <MainIcon iconClass="fa-solid fa-user-tie icon-img" text="MAKE A REQUEST" onClickFunction ={() =>navigate("/requests")}/>
          <MainIcon iconClass="fa-solid fa-clipboard-check icon-img" text="MY BOOKINGS" onClickFunction={() => navigate("/bookings")}/>
          <MainIcon iconClass="fa-solid fa-file-alt icon-img" text="FILE A REPORT" onClickFunction={() => navigate("/reports")}/> 
        </section>
      </article>
    );
  }

  
};

export default HomePage;
