import React, { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; // Import Firebase storage utilities
import { db, storage } from '../firebase'; // Import Firebase Firestore and Storage
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
  const [uploading, setUploading] = useState(false); // State to handle upload status

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
      const response = await fetch('/api/venues', { // API call to get all Venues from the database
        method: 'GET',
        cache: 'no-store',
      });

      const data = await response.json();
      if (response.ok) {
        setVenues(data);
      } else {
        console.error('Error fetching venues:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    getAllVenues();
  }, []);

  // Filter room numbers based on selected building name (venue)
  useEffect(() => {
    if (formData.venue) {
      const matchingRooms = venues
        .filter(v => v.buildingName === formData.venue)
        .map(v => v.venueName);

      setFilteredRooms(matchingRooms);
    } else {
      setFilteredRooms([]);
    }
  }, [formData.venue, venues]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUploading(true); // Set uploading to true during the process

      // Concatenate venue and room number to form venueID
      const venueID = `${formData.venue}${formData.roomNumber}`;
      let imageUrl = null; // Default image URL

      // Check if there's an image and upload it
      if (formData.photos) {
        const storageRef = ref(storage, `reports/${Date.now()}-${formData.photos.name}`);
        const uploadTask = uploadBytesResumable(storageRef, formData.photos);

        // Wait for the upload to complete
        await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            null,
            (error) => reject(error),
            async () => {
              imageUrl = await getDownloadURL(uploadTask.snapshot.ref); // Get the image download URL
              resolve();
            }
          );
        });
      }

      const reportData = {
        venueID,
        reportType: formData.reportType,
        reportText: formData.reportText,
        reportStatus: 'pending',
        resolutionLog: '',
        createdBy: email,
        photos: imageUrl, // Store image URL
      };

      // Add the report to Firestore
      await addDoc(collection(db, 'Reports'), reportData);
      
      alert('Report submitted successfully!');
      setFormData({ venue: '', roomNumber: '', reportType: '', reportText: '', photos: null });
      onClose(); // Close the popup after submission
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit the report. Please try again.');
    } finally {
      setUploading(false); // Stop the upload state
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
    <option key={venue.id} value={venue.buildingName}>
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

          <button type="submit" className="submit-button" disabled={uploading}>
            {uploading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PopupForm;
