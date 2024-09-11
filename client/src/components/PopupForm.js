import React, { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure correct path to your firebase.js
import '../styles/PopupForm.css';
import { auth } from "../firebase";

const PopupForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    venue: '',
    roomNumber: '',
    reportType: '',
    reportText: '',
    photos: null,
  });

  const [venues, setVenues] = useState([]); // State to store all venue data
  const [filteredRooms, setFilteredRooms] = useState([]); // Initialize as an empty array
  
  const user = auth.currentUser;
  let email = user.email;

  const typesTypes = ['Equipment', 'Safety', 'Room Details', 'Other'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      photos: e.target.files[0], // Assuming single file upload for simplicity
    }));
  };

  // Fetch all venues from the API
  const getAllVenues = async () => {
    try {
      const response = await fetch('/venues', { // API call to get all Venues from the database
        method: 'GET',
        cache: 'no-store',
      });

      const data = await response.json();
      if (response.ok) {
        setVenues(data);
         // Store the venue data in state
      } else {
        console.error('Error fetching venues:', data.error); // Logs error
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

// Filter room numbers based on selected building name (venue)
useEffect(() => {
  if (formData.venue) {
    // Filter venues that match the selected buildingName
    const matchingRooms = venues
      .filter(v => v.buildingName === formData.venue)
      .map(v => v.venueName); // Get the venueName which represents the room

    setFilteredRooms(matchingRooms); // Set filtered rooms based on the venue selection
  } else {
    setFilteredRooms([]); // Reset if no venue is selected
  }
}, [formData.venue, venues]);

  useEffect(() => {
    // Get all venues when page first loads
    getAllVenues();
  }, []); // Only runs on first load

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Concatenate venue and room number to form venueID
      const venueID = `${formData.venue}${formData.roomNumber}`;

      const reportData = {
        venueID, // This is now venue + roomNumber concatenated
        reportType: formData.reportType,
        reportText: formData.reportText,
        reportStatus: 'pending', // Default value for reportStatus
        resolutionLog: '', // Default value for resolutionLog
        createdBy: email, // Add the email of the logged-in user
      };

      // Add the report to the "Reports" collection in Firestore
      await addDoc(collection(db, 'Reports'), reportData);
      
      alert('Report submitted successfully!');
      setFormData({ venue: '', roomNumber: '', reportType: '', reportText: '', photos: null });
      onClose(); // Close the popup after submission
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit the report. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>Submit a Report</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="venue">Venue:</label>
            <select
              id="venue"
              name="venue"
              value={formData.venue}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>Select a venue</option>
              {venues.map((venue) => (
                <option key={venue.buildingName} value={venue.buildingName}>
                  {venue.buildingName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
  <label htmlFor="roomNumber">Room Number:</label>
  <select
    id="roomNumber"
    name="roomNumber"
    value={formData.roomNumber}
    onChange={handleInputChange}
    required
  >
    <option value="" disabled>Select a room number</option>
    {Array.isArray(filteredRooms) && filteredRooms.length > 0 ? (
      filteredRooms.map((room) => (
        <option key={room} value={room}>
          {room}
        </option>
      ))
    ) : (
      <option value="" disabled>No rooms available</option>
    )}
  </select>
</div>

          <div className="form-group">
            <label htmlFor="concernType">Type of Concern:</label>
            <select
              id="concernType"
              name="reportType"
              value={formData.reportType}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>Select a concern type</option>
              {typesTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="reportText">Report Text:</label>
            <input
              type="text"
              id="reportText"
              name="reportText"
              value={formData.reportText}
              onChange={handleInputChange}
              placeholder="Describe the issue"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="photos">Upload Photos:</label>
            <input
              type="file"
              id="photos"
              name="photos"
              onChange={handleFileChange}
            />
          </div>

          <button type="submit" className="submit-button">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default PopupForm;
