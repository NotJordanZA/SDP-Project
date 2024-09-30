export const getAllBookings = async (currentUserEmail, setBookingsList) =>{ // Gets the bookings of the current user by their email
    try{
      const response = await fetch(`/api/bookings`, { // API call which GETs bookings
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.REACT_APP_API_KEY,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setBookingsList(data); // Sets bookingList with API response
        // console.log("Got all bookings from: ", location);
      } else {
        console.error('Error fetching bookings:', data.error); // Logs API error
      }
    } catch (error) {
      console.error('Error:', error);
    }
}