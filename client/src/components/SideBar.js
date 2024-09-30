import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SideBar.css';
import { auth } from '../firebase'; 
import { onAuthStateChanged, signOut } from 'firebase/auth'; 
import { getCurrentUser } from '../utils/getCurrentUser';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [user, setUser] = useState(null); 
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
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
          getCurrentUser(user.email, setUserInfo);
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

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate('/login'); 
      })
      .catch((error) => {
        console.error('Error signing out: ', error);
      });
  };

  return (
    <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
      <section className='topSection'>
        <button className="close-btn" onClick={toggleSidebar}>Close</button>
      </section>
      <section className='bottomSection'>
        <button className="dashboard-btn" onClick={() => {navigate('/home'); toggleSidebar()}}>Dashboard</button>
        <button className="venues-btn" onClick={() => {navigate('/venues'); toggleSidebar()}}>Venues</button>
        <button className="reports-btn" onClick={() => {navigate('/bookings'); toggleSidebar()}}>Bookings</button>
        <button className="reports-btn" onClick={() => {userInfo.isAdmin? navigate('/manage-reports') :navigate('/reports'); toggleSidebar()}}>Reports</button>
        <button className="reports-btn" onClick={() => {userInfo.isAdmin? navigate('/manage-requests') :navigate('/requests'); toggleSidebar()}}>Requests</button>
        <button className="logout-btn" onClick={() => {handleLogout();toggleSidebar()}}>Logout</button>
      </section>
    </nav>
  );
};

export default Sidebar;
