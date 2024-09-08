import React, { useState, useEffect } from 'react';
import '../styles/reports.css';
import PopupForm from '../components/PopupForm';

const Reports = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [reports, setReports] = useState([]);

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
                        reports.map(report => (
                            <li key={report.id}>
                                <span className="report-title">{report.reportType}</span>
                                <span className="report-text">{report.reportText}</span>
                                <span className="report-status">{report.reportStatus}</span>
                                <span className="report-venue">Venue: {report.venueID || report.venue}</span>
                                <span className="report-room">Room: {report.roomNumber}</span>
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
