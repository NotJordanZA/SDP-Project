export const editVenue = async(id, buildingName, venueName, campus, venueType, venueCapacity, timeSlots, isClosed) => {
    try {
        const response = await fetch(`/api/venues/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
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
        }else{
            console.error('Error updating venue information:', data.error); // Logs error
        }

      } catch (error) {
        console.error('Error updating venue information:', error);
      }
}