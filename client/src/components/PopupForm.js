import React, { useState } from 'react';
import '../styles/PopupForm.css'; // Ensure your styles are correctly set

const PopupForm = ({ isOpen, onClose }) => {
  // Define the state for the form
  const [formData, setFormData] = useState({
    venueID: '',
    reportType: '',
    reportText: '',
    photos: null,
  });

  const venues = ['CLM132', 'FNB132', 'Solomon Mahlangu House132', 'WSS132', 'MSL132'];
  const typesTypes = ['Equipment', 'Safety', 'Room Details', 'Other'];
  const reportTexts = ['Broken projector', 'Slippery floor', 'Dirty whiteboard', 'Other'];

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
            <label htmlFor="venue">Venue:</label>
            <select
              id="venue"
              name="venueID"
              value={formData.venueID}
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
            <select
              id="reportText"
              name="reportText"
              value={formData.reportText}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>Select a report</option>
              {reportTexts.map((text) => (
                <option key={text} value={text}>
                  {text}
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
