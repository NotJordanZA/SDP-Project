import React, { useState, useEffect, useRef } from 'react';
import '../styles/ManageVenues.css';

const baseURL = process.env.NODE_ENV === 'production' ? 'https://your-production-site.com' : 'http://localhost:3002';

function Venues() {
  const [searchTerm, setSearchTerm] = useState(''); 
  const [firebaseVenues, setFirebaseVenues] = useState([]); 
  const [showForm, setShowForm] = useState(false); 
  const [newVenue, setNewVenue] = useState({ buildingName: '', venueName: '', campus: '', venueCapacity: '', venueType: '', isClosed: false }); 
  const [buildingSearchTerm, setBuildingSearchTerm] = useState(''); 
  const [editingVenue, setEditingVenue] = useState(null); 
  const [matchingBuildings, setMatchingBuildings] = useState([]); 
  const [sortCriteria, setSortCriteria] = useState('venueName'); // State to hold the sort criteria
  const suggestionsRef = useRef(null);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch(`${baseURL}/venues`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const venuesFromAPI = await response.json();
        console.log('Fetched venues:', venuesFromAPI); // Log fetched venues
        setFirebaseVenues(venuesFromAPI);
      } catch (error) {
        console.error('Error fetching venues:', error);
      }
    };

    fetchVenues();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setMatchingBuildings([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEditClick = (venue) => {
    setEditingVenue(venue);
    setNewVenue(venue);
    setShowForm(true);
  };

  const handleDeleteClick = async (venueId) => {
    try {
      const response = await fetch(`${baseURL}/venues/${venueId}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Refresh venues
      const fetchResponse = await fetch(`${baseURL}/venues`);
      const venuesFromAPI = await fetchResponse.json();
      setFirebaseVenues(venuesFromAPI);
    } catch (error) {
      console.error('Error deleting venue:', error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', newVenue); // Log form submission
    try {
      let response;
      if (editingVenue) {
        response = await fetch(`${baseURL}/venues/${editingVenue.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newVenue)
        });
      } else {
        response = await fetch(`${baseURL}/venues`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...newVenue, isClosed: false }) // Default isClosed to false
        });
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log('Response:', await response.json()); // Log response

      setShowForm(false);
      setEditingVenue(null);
      setNewVenue({ buildingName: '', venueName: '', campus: '', venueCapacity: '', venueType: '', isClosed: false });

      const fetchResponse = await fetch(`${baseURL}/venues`);
      const venuesFromAPI = await fetchResponse.json();
      setFirebaseVenues(venuesFromAPI);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingVenue(null);
    setNewVenue({ buildingName: '', venueName: '', campus: '', venueCapacity: '', venueType: '', isClosed: false });
  };

  const handleBuildingNameChange = async (e) => {
    const searchTerm = e.target.value;
    setNewVenue({ ...newVenue, buildingName: searchTerm });

    if (searchTerm.length > 0) {
      try {
        const response = await fetch(`${baseURL}/venues?buildingName=${searchTerm}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const buildingsFromAPI = await response.json();
        const buildingsSet = new Set(buildingsFromAPI.map(venue => venue.buildingName));
        setMatchingBuildings([...buildingsSet].filter(building => building.toLowerCase().includes(searchTerm.toLowerCase())));
      } catch (error) {
        console.error('Error fetching buildings:', error);
      }
    } else {
      setMatchingBuildings([]);
    }
  };

  const handleBuildingClick = (building) => {
    setNewVenue({ ...newVenue, buildingName: building });
    setMatchingBuildings([]);
  };

  const handleToggleVenueStatus = async (venue) => {
    const confirmation = window.confirm(`Are you sure you want to ${venue.isClosed ? 'open' : 'close'} this venue?`);
    if (confirmation) {
      try {
        const response = await fetch(`${baseURL}/venues/${venue.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isClosed: !venue.isClosed })
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Refresh venues
        const fetchResponse = await fetch(`${baseURL}/venues`);
        const venuesFromAPI = await fetchResponse.json();
        setFirebaseVenues(venuesFromAPI);
      } catch (error) {
        console.error('Error toggling venue status:', error);
      }
    }
  };

  const sortedVenues = [...firebaseVenues].sort((a, b) => {
    if (sortCriteria === 'venueName') {
      return a.venueName.localeCompare(b.venueName);
    } else if (sortCriteria === 'capacityAsc') {
      return a.venueCapacity - b.venueCapacity;
    } else if (sortCriteria === 'capacityDesc') {
      return b.venueCapacity - a.venueCapacity;
    } else if (sortCriteria === 'venueType') {
      return a.venueType.localeCompare(b.venueType);
    } else if (sortCriteria === 'openClosed') {
      return a.isClosed - b.isClosed;
    }
    return 0;
  });

  const filteredVenues = sortedVenues.filter(venue =>
    venue.venueName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    venue.buildingName.toLowerCase().includes(buildingSearchTerm.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search by venue name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <input
        type="text"
        placeholder="Search by building name"
        value={buildingSearchTerm}
        onChange={(e) => setBuildingSearchTerm(e.target.value)}
      />
      <button onClick={() => setShowForm(true)}>Add Venue</button>

      <div className="sort-container">
        <label>Sort by: </label>
        <select value={sortCriteria} onChange={(e) => setSortCriteria(e.target.value)}>
          <option value="venueName">Venue Name</option>
          <option value="capacityAsc">Capacity (Ascending)</option>
          <option value="capacityDesc">Capacity (Descending)</option>
          <option value="venueType">Venue Type</option>
          <option value="openClosed">Open/Closed</option>
        </select>
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeForm}>&times;</span>
            <h2>{editingVenue ? 'Edit Venue' : 'Add Venue'}</h2>
            <form onSubmit={handleFormSubmit}>
              <label>Building Name</label>
              <textarea
                value={newVenue.buildingName}
                onChange={handleBuildingNameChange}
                placeholder="Building Name"
                required
              />
              {matchingBuildings.length > 0 && (
                <ul className="suggestions" ref={suggestionsRef}>
                  {matchingBuildings.map((building, index) => (
                    <li key={index} onClick={() => handleBuildingClick(building)}>
                      {building}
                    </li>
                  ))}
                </ul>
              )}
              <label>Venue Name</label>
              <textarea
                value={newVenue.venueName}
                onChange={(e) => setNewVenue({ ...newVenue, venueName: e.target.value })}
                placeholder="Venue Name"
                required
              />
              <label>Campus</label>
              <select
                value={newVenue.campus}
                onChange={(e) => setNewVenue({ ...newVenue, campus: e.target.value })}
                required
              >
                <option value="">Select Campus</option>
                <option value="East">East</option>
                <option value="West">West</option>
              </select>
              <label>Capacity</label>
              <input
                type="number"
                placeholder="Capacity"
                value={newVenue.venueCapacity}
                onChange={(e) => setNewVenue({ ...newVenue, venueCapacity: e.target.value })}
                required
              />
              <label>Venue Type</label>
              <select
                value={newVenue.venueType}
                onChange={(e) => setNewVenue({ ...newVenue, venueType: e.target.value })}
                required
              >
                <option value="">Select Venue Type</option>
                <option value="Lecture Venue">Lecture Venue</option>
                <option value="Tutorial/Study Room">Tutorial/Study Room</option>
                <option value="Amphitheatre">Amphitheatre</option>
                <option value="Test Venue">Test Venue</option>
                <option value="other">Other</option>
              </select>
              <button type="submit">Save</button>
              <button type="button" onClick={closeForm}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {filteredVenues.length > 0 ? (
        filteredVenues.map(venue => (
          <div key={venue.id} className="venue-card">
            <h3>{venue.venueName}</h3>
            <p>Capacity: {venue.venueCapacity}</p>
            <p>Venue Type: {venue.venueType}</p>
            <button onClick={() => handleEditClick(venue)}>Edit</button>
            <button onClick={() => handleDeleteClick(venue.id)}>Delete</button>
            <button onClick={() => handleToggleVenueStatus(venue)}>
              {venue.isClosed ? 'Open Venue' : 'Close Venue'}
            </button>
          </div>
        ))
      ) : (
        <p>No venues found</p>
      )}
    </div>
  );
}

export default Venues;