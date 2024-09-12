import React, { useState, useEffect } from 'react';
import '../styles/reports.css';
import PopupForm from '../components/PopupForm';
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

const Reports = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [reports, setReports] = useState([]);
    const [user, setUser] = useState(auth.currentUser); // Local state to track current user
    const navigate = useNavigate();

    useEffect(() => {   
        // Reroutes user to /login if they are not logged in
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    useEffect(() => {
        setUser(auth.currentUser);  // Ensure that the current user is synced with state
    }, []);

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    // Fetch reports from the API
    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await fetch('/reports');  // Adjust the endpoint if necessary
                const data = await response.json();
                console.log(data)
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

    let email = user.email;

    return (
        <section className="report-page">
            <button onClick={togglePopup} className="open-popup-button">Submit a Report</button>
            <PopupForm isOpen={isPopupOpen} onClose={togglePopup} />
            
            <div className="report-list">
                <h2>My Reports</h2>
                <ul>
                    {reports.length > 0 ? (
                        reports
                            .filter(report => report.createdBy === email)  // Filter reports by createdBy field
                            .map(report => (
                                <li key={report.id}>
                                    <p className="report-title">{report.reportType}</p>
                                    <p className="report-text">{report.reportText}</p>
                                    <p className="report-status">{report.reportStatus}</p>
                                    <p className="report-venue">Venue: {report.venueID || report.venue}</p>
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
