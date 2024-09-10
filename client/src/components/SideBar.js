import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SideBar.css';
import { auth } from '../firebase'; // Import Firebase auth module
import { onAuthStateChanged, signOut } from 'firebase/auth'; // Import signOut from Firebase

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [user, setUser] = useState(null); // State to track user
  const navigate = useNavigate();

  // Listen for changes to the authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        navigate('/login'); // Redirect to login if no user
      }
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, [navigate]);

  if (user === null) {
    return null;
  }

  const handleNavigation = (path) => {
    navigate(path); 
    toggleSidebar(); 
  };

  const handleLogout = () => {
    signOut(auth)//Firebase signOut 
      .then(() => {
        navigate('/login'); // Redirect to login after signing out
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
        <button className="dashboard-btn" onClick={() => handleNavigation('/home')}>Dashboard</button>
        <button className="venues-btn" onClick={() => handleNavigation('/venues')}>Venues</button>
        <button className="reports-btn" onClick={() => handleNavigation('/reports')}>Reports</button>
        <button className="logout-btn" onClick={handleLogout}>Logout</button> {}
      </section>
      </nav>
  );
};

export default Sidebar;
