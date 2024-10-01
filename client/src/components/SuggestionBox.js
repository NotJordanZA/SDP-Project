import { useEffect, useState } from "react";

function SuggestionBox({ campus, capacity, venueList }) {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    // Filter venues that match the same campus and capacity as the selected venue
    const filteredVenues = venueList.filter(venue => 
      venue.campus === campus && venue.venueCapacity === capacity && !venue.isClosed
    );
    // Limit suggestions to 3 venues and exclude the selected venue
    setSuggestions(filteredVenues.slice(0, 3));
  }, [campus, capacity, venueList]);

  return (
    <div className="suggestion-box">
      <h3>Suggested Venues</h3>
      {suggestions.length > 0 ? (
        suggestions.map((venue) => (
          <div key={venue.venueName} className="suggestion-item">
            <p>{venue.venueName}</p>
            <p>Building: {venue.buildingName}</p>
            <p>Capacity: {venue.venueCapacity}</p>
          </div>
        ))
      ) : (
        <p>No suggestions available</p>
      )}
    </div>
  );
}

export default SuggestionBox;
