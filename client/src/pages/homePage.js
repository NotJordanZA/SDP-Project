import React, { useState, useEffect } from 'react';
import '../styles/homePage.css';
import MainIcon from '../components/mainIcon.js'; // Ensure the correct import path
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getCurrentUser } from '../utils/getCurrentUser';

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
        // console.log(user);
      } else {
        navigate("/login"); //Reroute to login if user not signed in
      }
      setIsLoading(false); //Declare firebase as no longer loading
    });
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    }; //Return the listener
    // eslint-disable-next-line
  }, [auth, navigate]);

  // Get info about the current user from the database once firebase is loaded
  useEffect(() => {
    // Fetch current user's info
    const fetchUserInfo = async () => {
      // If user is signed in
      if (user) {
        try {
          // Instantiate userInfo object
          getCurrentUser(user.email, setUserInfo);
          setUserName(user.displayName);
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

    return (   
      <article>
        <section className='welcome-section'>
          <h2 className='welcome-name'>Welcome {userName}</h2> {/* Display the user's name or email */}
        </section>
        <section className="home-page">
          <MainIcon iconClass="fa-solid fa-house icon-img" text={userInfo.isAdmin ? "MANAGE/BOOK VENUES" : "BOOK A VENUE"} onClickFunction={() => navigate("/venues")}/>
          <MainIcon iconClass="fa-solid fa-user-tie icon-img" text={userInfo.isAdmin ? "MANAGE REQUESTS" : "MAKE A REQUEST"} onClickFunction ={() =>userInfo.isAdmin ? navigate("/manage-requests") : navigate("/requests")}/>
          <MainIcon iconClass="fa-solid fa-clipboard-check icon-img" text={userInfo.isAdmin ? "MANAGE BOOKINGS" : "MY BOOKINGS"} onClickFunction={() => navigate("/bookings")}/>
          <MainIcon iconClass="fa-solid fa-file-alt icon-img" text={userInfo.isAdmin ? "MANAGE REPORTS" : "FILE A REPORT"} onClickFunction={() => userInfo.isAdmin ? navigate("/manage-reports") : navigate("/reports")}/> 
        </section>
      </article>
    );
};

export default HomePage;
