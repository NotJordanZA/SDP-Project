import React, { useState } from 'react';
import '../styles/PopupForm.css';
import { CreateAdminRequest } from '../utils/createAdminRequest';

const PopupForm = ({ isOpen, onClose, userEmail }) => {
  const [requestText, setRequestText] = useState([""]);

  const handleInputChange = (e) => {
    setRequestText(e.target.value);
  };

  const handleSubmit = (e) =>{
    e.preventDefault();
    CreateAdminRequest(userEmail, requestText);
    alert('Request submitted successfully!');
    onClose();
    setRequestText("");
  }

  if (!isOpen) return null;

  return (
    <div className="popup-overlay" data-testid = "popup-overlay">
      <div className="popup-content" data-testid = "popup-content">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>Submit a Request</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="requestText">Request Description:</label>
            <textarea
              style={{resize: "none"}}
              type="text"
              id="requestText"
              name="requestText"
              value={requestText}
              onChange={handleInputChange}
              placeholder="Describe your request"
              required
            />
          </div>
          <button type="submit" className="submit-button">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default PopupForm;
