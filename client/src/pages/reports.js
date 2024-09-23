import React, { useState, useEffect } from 'react';
import '../styles/reports.css';
import PopupForm from '../components/PopupForm';
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const Reports = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [reports, setReports] = useState([]);
    // const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
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
        //   setIsLoading(false); //Declare firebase as no longer loading
        });
        return () => {
          if (unsubscribe) {
            unsubscribe();
          }
        }; //Return the listener
    // eslint-disable-next-line
    }, [auth, navigate]);

    // useEffect(() => {
    //     setUser(auth.currentUser);  // Ensure that the current user is synced with state
    // }, []);

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

// Fetch reports from the API
useEffect(() => {
    const fetchReports = async () => {
        try {
            const queryParams = new URLSearchParams({
                createdBy: user.email // Pass the user's email to filter reports by the creator
            });
            const response = await fetch(`/api/reports?${queryParams.toString()}`);  // Adjust the endpoint if necessary
            const data = await response.json();
            setReports(data); // Update the state with the fetched reports
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    };

    if (user) {
        fetchReports();
    }
}, [user]);  // Only fetch reports if the user is logged in
    if (!user) {
        return null;  // Prevents rendering if no user is logged in, redirect happens in the useEffect
    }

    // let email = user.email;

    return (
        <section className="report-page">
            <button onClick={togglePopup} className="open-popup-button">Submit a Report</button>
            <PopupForm isOpen={isPopupOpen} onClose={togglePopup} />
            
            <div className="report-list">
                <h2>My Reports</h2>
                <ul>
  {reports.length > 0 ? (
    reports
      .filter(report => report.createdBy === user.email)
      .map(report => (
        <li key={report.id}>
          <p className="report-title">{report.reportType}</p>
          <p className="report-text">{report.reportText}</p>
          <p className="report-status">{report.reportStatus}</p>
          <p className="report-venue">Venue: {report.venueID || report.venue}</p>

          {/* Check if there is a photo URL and display it */}
          {report.photos && (
            <img
              src={report.photos}
              alt="Report related"
              className="report-photo"
              style={{ width: '100px', height: '100px' }}
            />
          )}
        </li>
      ))
  ) : (
    <li>No reports available</li>
  )}
</ul>

            </div>
        </section>
    );
};

export default Reports;
