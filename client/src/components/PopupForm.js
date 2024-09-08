import React, { useState } from 'react';
import '../styles/PopupForm.css'; // Ensure your styles are correctly set
const PopupForm = ({ isOpen, onClose }) => {
  // Define the state for the form
  const [formData, setFormData] = useState({
    venue: '',
    roomNumber: '',
    concernType: '',
    photos: null,
  });

  const venues = ['CLM', 'FNB', 'Solomon Mahlangu House', 'WSS', 'MSL'];
  const roomNumbers = ['100', '101', '102', '103', '104', '105'];
  const concernTypes = ['Equipment', 'Safety', 'Room Details', 'Other'];

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
      photos: e.target.files[0], // Assume single file upload for simplicity
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission (e.g., send data to a server)
    onClose(); // Close the popup after submission
  };

  if (!isOpen) return null; // Don't render the form if it's not open

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>Submit a Report</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="venue">Venue Building:</label>
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
              <option value="" disabled>Select a room</option>
              {roomNumbers.map((roomNumber) => (
                <option key={roomNumber} value={roomNumber}>
                  {roomNumber}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="concernType">Type of Concern:</label>
            <select
              id="concernType"
              name="concernType"
              value={formData.concernType}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>Select a concern type</option>
              {concernTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
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
