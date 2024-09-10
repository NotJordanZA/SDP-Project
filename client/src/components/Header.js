import React, { useState, useEffect } from 'react';
import '../styles/Header.css'; 
import logo from '../assets/logoWhite.png';
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase"; 
import { onAuthStateChanged } from 'firebase/auth';

const Header = ({ title, toggleSidebar }) => {
  const [user, setUser] = useState(null); // State to track user
  const navigate = useNavigate();

  // Listen for changes to the authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // If user is logged in, set the user
      } else {
        setUser(null); // If no user is logged in, set user to null
      }
    });


    return () => unsubscribe();
  }, []);

  const reroute = (path) => {
    navigate(path);
  }

  return (
    <main className="whole-page">
      <header className="app-header">
        {}
        {user && (
          <i onClick={toggleSidebar} className="fa-solid fa-bars icon-img"></i>
        )}
        <h1>{title}</h1>
        <img src={logo} alt="Logo" className="logo" onClick={() => navigate("/home")}/>
      </header>
      <Outlet/>
    </main>
  );
};

export default Header;
