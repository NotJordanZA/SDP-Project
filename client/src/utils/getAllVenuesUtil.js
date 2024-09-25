export const getAllVenues = async (setVenueList, setAllVenues) =>{
    try{
      const response = await fetch(`/api/venues`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.REACT_APP_API_KEY,
        },
        cache: 'no-store',
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Venues fetched successfully');
        let sortedVenues = data.sort((a, b) => a.venueName.localeCompare(b.venueName));
        if(setAllVenues){
          setAllVenues(sortedVenues);
        }
        setVenueList(sortedVenues);
      } else {
        console.error('Error fetching venues:', data.error);
      }
    } catch (error) {
      console.log('Error:', error);
    }
}