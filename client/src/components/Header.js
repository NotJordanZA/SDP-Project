import React from 'react';
import '../styles/Header.css'; // Ensure the correct path for your CSS
import logo from '../assets/logoWhite.png'; // Adjust the path as needed
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const Header = ({ title, toggleSidebar }) => {
  let navigate = useNavigate();

  return (
    <main className="whole-page">
      <header className="app-header">
        <i onClick={toggleSidebar} className="fa-solid fa-bars icon-img"></i>
        <h1>{title}</h1>
        <img src={logo} alt="Logo" className="logo" onClick={() => navigate("/home")}/>
      </header>
      <Outlet/>
    </main>
  );
};

export default Header;
