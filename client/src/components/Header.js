// Header.js
import React, { useState, useEffect } from 'react';
import '../styles/Header.css'; 
import logo from '../assets/logoWhite.png';
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase"; 
import { onAuthStateChanged } from 'firebase/auth';

const Header = ({ title, toggleSidebar,toggleNotification }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
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
        <h1>{title}</h1>
        <div className="header-icons">
          {/* Bell icon for notifications */}
          {user && (
            <i 
            
              className="fa-solid fa-bell bell-icon" 
              data-testid="bell-icon"
              onClick={toggleNotification}
             // onClick={() => navigate("/notifications")}
        
            />
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
