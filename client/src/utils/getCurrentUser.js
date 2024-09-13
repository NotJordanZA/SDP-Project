export const getCurrentUser = async (currentUserEmail) =>{ // Gets the requests of the current user by their email
    try{
      const response = await fetch(`/users/${currentUserEmail}`, { // API call which GETs based on user email
        method: 'GET',
      });

      const data = await response.json();
      if (response.ok) {
        // console.log('Requests by ' + currentUserEmail +' fetched successfully');
        return(data); // Sets requestsList with API response
      } else {
        console.error('Error fetching requests by ' + currentUserEmail +':', data.error); // Logs API error
        return null;
      }
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
}