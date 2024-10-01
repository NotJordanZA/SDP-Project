import React, { useState, useEffect } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
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

  const [venues, setVenues] = useState([]); // Full venue data
  const [filteredRooms, setFilteredRooms] = useState([]); // Rooms filtered based on selected building
  const [uniqueBuildings, setUniqueBuildings] = useState([]); // Unique building names
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
  
    if (validFiles.length > 3) {
      alert('You can only upload a maximum of 3 photos.');
      return;
    }
  
    setFormData((prevData) => ({
      ...prevData,
      photos: validFiles, // Store only valid image files and limit to 3
    }));
  };

  useEffect(() => {
    // Fetch all venues from the API
    const getAllVenues = async () => {
      try {
        const response = await fetch('/api/venues', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.REACT_APP_API_KEY,
          },
          cache: 'no-store',
        });
  
        const data = await response.json();
        if (response.ok) {
          // Store all venue data
          setVenues(data);
          
          // Extract unique building names and sort them alphabetically
          const uniqueBuildings = Array.from(new Set(data.map(venue => venue.buildingName)))
            .sort((a, b) => a.localeCompare(b)); // Sort alphabetically
          
          setUniqueBuildings(uniqueBuildings); // Set state for unique buildings
        } else {
          console.error('Error fetching venues:', data.error);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    getAllVenues();
  }, []);

  // Filter room numbers based on selected building name (venue)
  useEffect(() => {
    if (formData.venue) {
      // Filter all venues to get rooms for the selected building
      const matchingRooms = venues
        .filter(v => v.buildingName === formData.venue)
        .map(v => v.venueName); // Get all room names for the selected building

      setFilteredRooms(matchingRooms);
    } else {
      setFilteredRooms([]); // Reset rooms if no building is selected
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
      let fireDetected = false;
      if (formData.reportType === "Safety") {
        try {
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
          fireDetected = analysisResults.some(result => 
            result.Labels.some(label => label.Name === 'Fire' && label.Confidence > 70) // Adjust confidence threshold as needed
          );
  
          if (fireDetected) {
            // List of buildings to bypass the friend's API
            const excludedBuildings = [
              'WEC Marang Block',
              'WEC Leseding Block',
              'WEC Linder Auditorium',
              'WEC Khanya Block',
              'WEC Centre',
              'WEC Bohlaleng Block'
            ];
  
            if (excludedBuildings.includes(formData.venue)) {
              alert('Fire detected! Please evacuate the building and alert Education Campus Safety.');
            } else {
              // Send alert to the friend's API if the building is not excluded
              alert('Fire detected! Alerting Campus Safety:');
  
              const alertData = {
                description: `Fire detected in ${formData.venue}.`,
                building_name: formData.venue,
                type: 'fire',
                photo: null // Assuming the API does not need a photo in this call
              };
  
              const alertResponse = await fetch('https://campussafetyapp.azurewebsites.net/incidents/report-incidents-external', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(alertData),
              });
  
              if (!alertResponse.ok) {
                const errorText = await alertResponse.text();
                console.error('Failed to send emergency alert:', alertResponse.status, alertResponse.statusText, errorText);
              } else {
                alert('Campus Safety have been alerted. Please evacuate the building.');
              }
            }
          } else {
            alert('Unable to detect fire. Please inform campus safety of any immediate dangers.');
          }
        } catch (error) {
          alert('Unable to detect fire. Please inform campus safety of any immediate dangers.');
          console.error('Error analyzing photos:', error);
        }
      }
  
      // Step 4: Send report data to your API (this part is executed regardless of alert status)
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
              {uniqueBuildings.map((buildingName, index) => (
                <option key={index} value={buildingName}>
                  {buildingName}
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
                filteredRooms.map((room, index) => (
                  <option key={index} value={room}>
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
         <label htmlFor="photos">Upload Photos (PNG & JPEG Only, Max 3)</label>
        <input
          type="file"
          id="photos"
         name="photos"
         onChange={handleFileChange}
         multiple // Allow multiple file uploads
        accept="image/jpeg, image/png" // Accept only JPEG and PNG files
  />
  <p>{formData.photos.length} / 3 photos selected</p>
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
