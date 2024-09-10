import React, {useEffect} from 'react';
import '../styles/homePage.css';
import MainIcon from '../components/mainIcon'; // Ensure the correct import path
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

const HomePage = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  useEffect(() => {
    if (user === null) {
      console.log(user);
      navigate("/login");
    }
  }, [user, navigate]); // Effect will run when the user or navigate changes

  if (user === null) {
    return null;
  }

  

  return (
    <article className="home-page">
        <MainIcon iconClass="fa-solid fa-house icon-img" text="BOOK A VENUE" onClickFunction ={() =>navigate("/venues")}/>
        <MainIcon iconClass="fa-solid fa-calendar icon-img" text="VIEW CALENDAR" />
        <MainIcon iconClass="fa-solid fa-clipboard-check icon-img" text="MY BOOKINGS" onClickFunction ={() =>navigate("/bookings")}/>
        <MainIcon iconClass="fa-solid fa-file-alt icon-img" text="FILE A REPORT" onClickFunction ={() =>navigate("/reports")}/> 
    </article>
  );

  
};

export default HomePage;
