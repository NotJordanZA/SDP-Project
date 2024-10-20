// Header.js
import React, { useState, useEffect } from 'react';
import '../styles/Header.css'; 
import logo from '../assets/logoWhite.png';
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase"; 
import { onAuthStateChanged } from 'firebase/auth';
import { getNotifications } from '../utils/getNotificationsUtil';

const Header = ({ title, toggleSidebar,toggleNotification }) => {
  const [user, setUser] = useState(null);
  const [notificationsheader, setNotificationsHeader] = useState([]); //store notifications

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        getNotifications(currentUser.email, (notificationsData) => {
          const unreadNotificationsheader = notificationsData.filter(
            (notification) => !notification.read
          );
          setNotificationsHeader(unreadNotificationsheader); //store unread notifications
        
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);
  
  
  return (
    <main className="whole-page">
      <header className="app-header">
        {/* Sidebar toggle icon */}
        {user && (
          <i 
            onClick={toggleSidebar} 
            className="fa-solid fa-bars menu-button" 
            data-testid="sidebar-toggle"
          ></i>
        )}
        <h1 id='title-text' onClick={() => navigate("/home")}>{title}</h1>
        <div className="header-icons">
            {/*notification bell with red dot : this is displayed only when the user has notifications */}
            {user && (
            <div className="notificationHeader-notification-container" onClick={toggleNotification}>
              <i 
                className="fa-solid fa-bell bell-icon" 
                data-testid="bell-icon"
              />
              {notificationsheader.length > 0 && <span className="notificationHeader-red-dot"></span>}
            </div>
          )}
          {/* Logo */}
          <img 
            src={logo} 
            alt="Logo" 
            className="logo" 
            data-testid="logo"
            onClick={() => navigate("/home")} 
          />
        </div>
      </header>
      <Outlet/>
    </main>
  );
};

export default Header;
