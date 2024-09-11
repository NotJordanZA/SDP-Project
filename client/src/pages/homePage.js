import React, {useEffect} from 'react';
import '../styles/homePage.css';
import MainIcon from '../components/mainIcon'; // Ensure the correct import path
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

const HomePage = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const userName = user?.displayName || user?.email; // Use displayName if available, otherwise fallback to email

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
    <article>
      <section className='welcome-section'>
        <h2 className='welcome-name'>Welcome {userName}</h2> {/* Display the user's name or email */}
      </section>
      <section className="home-page">
        <MainIcon iconClass="fa-solid fa-house icon-img" text="BOOK A VENUE" onClickFunction={() => navigate("/venues")}/>
        <MainIcon iconClass="fa-solid fa-user-tie icon-img" text="MAKE A REQUEST" onClickFunction ={() =>navigate("/requests")}/>
        <MainIcon iconClass="fa-solid fa-clipboard-check icon-img" text="MY BOOKINGS" onClickFunction={() => navigate("/bookings")}/>
        <MainIcon iconClass="fa-solid fa-file-alt icon-img" text="FILE A REPORT" onClickFunction={() => navigate("/reports")}/> 
      </section>
    </article>
  );
};

export default HomePage;
