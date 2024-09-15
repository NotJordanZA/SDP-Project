export const getAllVenues = async (setVenueList, setAllVenues) =>{
    try{
      const response = await fetch(`/api/venues`, {
        method: 'GET',
        cache: 'no-store',
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Venues fetched successfully');
        let sortedVenues = data.sort((a, b) => a.venueName.localeCompare(b.venueName));
        setVenueList(sortedVenues);
        setAllVenues(sortedVenues);
      } else {
        console.error('Error fetching venues:', data.error);
      }
    } catch (error) {
      console.log('Error:', error);
    }
}