import React, { useState } from 'react';
import '../styles/PopupForm.css';
import { CreateAdminRequest } from '../utils/createAdminRequest';

const VenueForm = ({ id, buildingName, venueName, campus, venueType, venueCapacity, timeSlots, isClosed }) => {
  const [requestText, setRequestText] = useState([""]);

  const campusOptions = [ //All options for campus
    {value:"east", label:"East Campus"},
    {value:"west", label:"West Campus"}
  ]

  const venueTypeOptions = [ //All options for venue type
    {value:"lecture venue", label:"Lecture Venue"},
    {value:"study room", label:"Study Room"},
    {value:"tutorial room", label:"Tutorial Room"},
    {value:"test venue", label:"Test Venue"},
    {value:"theatre", label:"Theatre"},
    {value:"field", label:"Field"}
  ]

  const closureOptions = [ //All options for closure status
    {value:false, label:"Open"},
    {value:true, label:"Closed"}
  ]

  const timeOptions = [ //All time slot options
    {value:"08:00", label:"08:00"},
    {value:"09:00", label:"09:00"},
    {value:"10:15", label:"10:15"},
    {value:"11:15", label:"11:15"},
    {value:"12:30", label:"12:30"},
    {value:"14:15", label:"14:15"},
    {value:"15:15", label:"15:15"},
    {value:"16:15", label:"16:15"},
  ]

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
        <h2>Venue</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="BuildingName">Building Name:</label>
            <input>{buildingName}</input>
            <label htmlFor="VenueName">Venue Name:</label>
            <input>{venueName}</input>
            <label htmlFor="Campus">Campus:</label>
            <input>{campus}</input>
            <label htmlFor="VenueType">Venue Type:</label>
            <input>{venueType}</input>
            <label htmlFor="Capacity">Capacity:</label>
            <input>{venueCapacity}</input>
            <label htmlFor="TimeSlots">Time Slots:</label>
            <input>{timeSlots}</input>
            <label htmlFor="isClosed">Closure Status:</label>
            <input>{isClosed}</input>
          </div>
          <button type="submit" className="submit-button">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default VenueForm;
