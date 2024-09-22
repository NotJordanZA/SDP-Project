export const putVenue = async(id, buildingName, venueName, campus, venueType, venueCapacity, timeSlots, isClosed, getAllVenues) => {
    if(id !== ""){
      try {
        const response = await fetch(`/api/venues/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            buildingName: buildingName,
            venueName: venueName,
            campus: campus, 
            venueType: venueType, 
            venueCapacity: venueCapacity, 
            timeSlots: timeSlots,
            isClosed: isClosed })
        });
        const data = await response.json();
        if (response.ok){
            console.log("Edit successful", data);
            getAllVenues();
        }else{
            console.error('Error updating venue information:', data.error); // Logs error
        }

      } catch (error) {
        console.error('Error updating venue information:', error);
      }
    }else{
      try {
        const response = await fetch(`/api/venues`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            buildingName: buildingName,
            venueName: venueName,
            campus: campus, 
            venueType: venueType, 
            venueCapacity: venueCapacity, 
            timeSlots: timeSlots,
            isClosed: isClosed })
        });
        const data = await response.json();
        if (response.ok){
            console.log("Create successful", data);
            getAllVenues();
        }else{
            console.error('Error creating venue:', data.error); // Logs error
        }
  
      } catch (error) {
        console.error('Error creating venue:', error);
      }
    }
}