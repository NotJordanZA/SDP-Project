import React, { useState } from 'react';
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
  const user = auth.currentUser;
  let email = user.email;
  const venues = ['CLM', 'FNB', 'Solomon Mahlangu House', 'WSS', 'MSL'];
  const roomNumbers = ['100', '101', '102', '103', '104', '105'];
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
                <option key={venue} value={venue}>
                  {venue}
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
              {roomNumbers.map((room) => (
                <option key={room} value={room}>
                  {room}
                </option>
              ))}
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
