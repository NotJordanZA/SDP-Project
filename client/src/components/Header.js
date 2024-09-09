import React from 'react';
import '../styles/Header.css'; // Ensure the correct path for your CSS
import logo from '../assets/logoWhite.png'; // Adjust the path as needed
import { Outlet } from "react-router-dom";

const Header = ({ title, toggleSidebar }) => {
  return (
    <main>
      <header className="app-header">
        <i onClick={toggleSidebar} className="fa-solid fa-bars icon-img"></i>
        <h1>{title}</h1>
        <img src={logo} alt="Logo" className="logo" />
      </header>
      <Outlet/>
    </main>
  );
};

export default Header;
