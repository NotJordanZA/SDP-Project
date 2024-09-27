import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import '../styles/PopupForm.css';
import { auth } from "../firebase";

const PopupForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    venue: '',
    roomNumber: '',
    reportType: '',
    reportText: '',
    photos: [], // Updated to handle multiple files
  });

  const [venues, setVenues] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [uploading, setUploading] = useState(false);

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
    const files = [...e.target.files];
    const validFiles = files.filter(file =>
      file.type === 'image/jpeg' || file.type === 'image/png'
    );

    if (validFiles.length !== files.length) {
      alert('Please upload only JPEG or PNG images.');
    }

    setFormData((prevData) => ({
      ...prevData,
      photos: validFiles, // Store only valid image files
    }));
  };

  // Fetch all venues from the API
  const getAllVenues = async () => {
    try {
      const response = await fetch('/api/venues', {
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
      setUploading(true);
      
      const venueID = formData.roomNumber;
      let imageUrls = [];
  
      // Step 1: Upload images to Firebase Storage and get URLs
      if (formData.photos.length > 0) {
        const uploadPromises = formData.photos.map((photo) => {
          const storageRef = ref(storage, `report/${venueID}/${photo.name}`);
          const uploadTask = uploadBytesResumable(storageRef, photo);
  
          return new Promise((resolve, reject) => {
            uploadTask.on(
              'state_changed',
              null,
              (error) => reject(error),
              async () => {
                const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(downloadUrl);
              }
            );
          });
        });
  
        // Wait for all uploads to finish and get the image URLs
        imageUrls = await Promise.all(uploadPromises);
      }
  
      // Step 2: Conditionally analyze photos using Rekognition only if reportType is 'Safety'
      if (formData.reportType === "Safety") {
        const formDataForAnalysis = new FormData();
        formData.photos.forEach(photo => {
          formDataForAnalysis.append('photos', photo);
        });
  
        const analysisResponse = await fetch('/api/analyze-photos', {
          method: 'POST',
          body: formDataForAnalysis,
        });
  
        if (!analysisResponse.ok) {
          throw new Error('Failed to analyze photos');
        }
  
        const analysisResults = await analysisResponse.json();
        console.log('Rekognition analysis results:', analysisResults);
  
        // Check for fire detection in analysis results
        const fireDetected = analysisResults.some(result => 
          result.Labels.some(label => label.Name === 'Fire' && label.Confidence > 70) // Adjust confidence threshold as needed
        );
  
        if (fireDetected) {
          alert('Fire detected in one of the uploaded photos!');
        }
      }
  
      // Step 3: Send report data to the API (this part is executed regardless of report type)
      const reportData = {
        venueID,
        reportType: formData.reportType,
        reportText: formData.reportText,
        createdBy: email,
        photos: imageUrls,
      };
  
      const response = await fetch('/api/report-submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit the report');
      }
  
      alert('Report submitted successfully!');
      setFormData({ venue: '', roomNumber: '', reportType: '', reportText: '', photos: [] });
      onClose();
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit the report. Please try again.');
    } finally {
      setUploading(false);
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
            <label htmlFor="photos">Upload Photos (PNG & JPEG Only)</label>
            <input
              type="file"
              id="photos"
              name="photos"
              onChange={handleFileChange}
              multiple // Allow multiple file uploads
              accept="image/jpeg, image/png" // Accept only JPEG and PNG files
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
