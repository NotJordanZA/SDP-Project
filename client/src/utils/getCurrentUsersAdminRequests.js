export const getCurrentUsersAdminRequests = async (currentUserEmail, setRequestsList) =>{ // Gets the requests of the current user by their email
    try{
      const response = await fetch(`/adminRequests/findByField?requesterEmail=${currentUserEmail}`, { // API call which GETs based on user email
        method: 'GET',
        headers: {
          'x-api-key': process.env.REACT_APP_API_KEY,
        },
      });

      const data = await response.json();
      if (response.ok) {
        // console.log('Requests by ' + currentUserEmail +' fetched successfully');
        setRequestsList(data); // Sets requestsList with API response
      } else {
        console.error('Error fetching requests by ' + currentUserEmail +':', data.error); // Logs API error
      }
    } catch (error) {
      console.error('Error:', error);
    }
}