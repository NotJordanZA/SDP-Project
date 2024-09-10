import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SideBar.css';
import { auth } from '../firebase'; 
import { onAuthStateChanged, signOut } from 'firebase/auth'; 

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [user, setUser] = useState(null); 
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        navigate('/login'); 
      }
    });

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
    signOut(auth)
      .then(() => {
        navigate('/login'); 
      })
      .catch((error) => {
        console.error('Error signing out: ', error);
      });
  };

  const toggleAdminDropdown = () => {
    setAdminDropdownOpen(!adminDropdownOpen);
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
        
        {/* Admin Button with dropdown */}
        <button className="admin-btn" onClick={toggleAdminDropdown}>Admin</button>

        {/* Instead of conditional rendering, toggle the class to control visibility */}
        <div className={`admin-subbuttons ${adminDropdownOpen ? 'open' : ''}`}>
          <button className="sub-btn" onClick={() => handleNavigation('/HomeAdmin')}>Admin Dashboard</button>
          <button className="sub-btn" onClick={() => handleNavigation('/manage-bookings')}>Manage Bookings</button>
          <button className="sub-btn" onClick={() => handleNavigation('/manage-reports')}>Manage Reports</button>
          <button className="sub-btn" onClick={() => handleNavigation('/manage-requests')}>Manage Requests</button>
          <button className="sub-btn" onClick={() => handleNavigation('/manage-venues')}>Manage Venues</button>
        </div>
        
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </section>
    </nav>
  );
};

export default Sidebar;
