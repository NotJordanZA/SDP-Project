import React, { useState, useEffect } from 'react';
import '../styles/reports.css';
import PopupForm from '../components/PopupForm';
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const Reports = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [reports, setReports] = useState([]);
    const [user, setUser] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null); // State for the selected image
    const navigate = useNavigate();

    // Ensure User is logged in
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser); // Set current user
            } else {
                navigate("/login"); // Reroute to login if user not signed in
            }
        });
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [navigate]); // Only include 'navigate' if it's coming from React Router and can change
    
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
                const response = await fetch(`/api/reports?${queryParams.toString()}`, {
                    method: "GET",
                    headers: {
                      'Content-Type': 'application/json',
                      'x-api-key': process.env.REACT_APP_API_KEY,
                    },
                  });  // Adjust the endpoint if necessary
                const data = await response.json();
                setReports(data); // Update the state with the fetched reports
            } catch (error) {
                console.error('Error fetching reports:', error);
            }
        };

        if (user) {
            fetchReports();
        }
    }, [user]);

    if (!user) {
        return null;
    }

    // Function to handle image click and show it in a larger view
    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl); // Set the clicked image URL in the state
    };

    // Function to close the image modal
    const closeImageModal = () => {
        setSelectedImage(null); // Clear the selected image
    };

    return (
        <section className="report-page">
            <button onClick={togglePopup} className="open-popup-button">Submit a Report</button>
            <label className="goldenLabel">Please inform our staff of any safety, equipment, information, or miscellaneous concerns and issus by submitting a report above.<br></br>You can view your existing reports in the window below.<br></br><br></br>Notice: Safety Alerts on Education Campus are currently in progress. Please alert Education Campus Safety directly of any immediate threats.<br></br></label>
            <PopupForm isOpen={isPopupOpen} onClose={togglePopup} />       
            <div className="report-list">
                <h2>My Reports</h2>
                <ul>
                    {reports.length > 0 ? (
                        reports
                            .filter(report => report.createdBy === user.email)  // Filter reports by createdBy field
                            .map(report => (
                                <li key={report.id}>
                                    <p className="report-title">{report.reportType}</p>
                                    <p className="report-text">{report.reportText}</p>
                                    <p className="report-status">{report.reportStatus}</p>
                                    <p className="report-venue">Venue: {report.venueID || report.venue}</p>

                                    {/* Display the attached images (if any) */}
                                    {report.photos && report.photos.length > 0 && (
                                        <div className="photos-container">
                                            {report.photos.map((photoUrl, index) => (
                                                <img
                                                key={index}
                                                src={photoUrl}
                                                alt={``} // Use something descriptive without the word "photo"
                                                className="report-photo"
                                                style={{ width: '100px', height: '100px', cursor: 'pointer', margin: '5px' }}
                                                onClick={() => handleImageClick(photoUrl)}
                                            />
                              
                                            ))}
                                        </div>
                                    )}
                                </li>
                            ))
                    ) : (
                        <li>No reports available</li>
                    )}
                </ul>
            </div>

            {/* Image Modal */}
            {selectedImage && (
                <div className="image-modal" onClick={closeImageModal}>
                    <div className="image-modal-content">
                        <span className="close-button" onClick={closeImageModal}>X</span>
                        <img src={selectedImage} alt="Enlarged" className="large-image" />
                    </div>
                </div>
            )}
        </section>
    );
};

export default Reports;
