export const getAllVenues = async (setVenueList, setAllVenues) =>{
    try{
      const response = await fetch(`/venues`, {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'x-api-key': process.env.REACT_APP_API_KEY,
        },
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