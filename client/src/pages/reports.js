import React, { useState, useEffect } from 'react';
import '../styles/reports.css';
import PopupForm from '../components/PopupForm';
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const Reports = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Ensure User is logged in
    useEffect(() => {
        // Listen for a change in the auth state
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          // If user is authenticated
          if (firebaseUser) {
            setUser(firebaseUser); //Set current user
          } else {
            navigate("/login"); //Reroute to login if user not signed in
          }
          setIsLoading(false); //Declare firebase as no longer loading
        });
        return () => unsubscribe(); //Return the listener
      }, [auth, navigate]);

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    // Fetch reports from the API
    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await fetch('/reports');  // Adjust the endpoint if necessary
                const data = await response.json();
                setReports(data); // Update the state with the fetched reports
            } catch (error) {
                console.error('Error fetching reports:', error);
            }
        };

        fetchReports();
    }, []);  // Empty dependency array to run only on mount

    return (
        <section className="report-page">
            <button onClick={togglePopup} className="open-popup-button">Submit a Report</button>
            <PopupForm isOpen={isPopupOpen} onClose={togglePopup} />
            
            <div className="report-list">
                <h2>My Reports</h2>
                <ul>
                    {reports.length > 0 ? (
                        reports
                            .filter(report => report.createdBy === user.email)  // Filter reports by createdBy field
                            .map(report => (
                                <li key={report.id}>
                                    <span className="report-title">{report.reportType}</span>
                                    <span className="report-text">{report.reportText}</span>
                                    <span className="report-status">{report.reportStatus}</span>
                                    <span className="report-venue">Venue: {report.venueID || report.venue}</span>
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
