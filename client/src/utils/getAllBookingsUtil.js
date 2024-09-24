export const getAllBookings = async (currentUserEmail, setBookingsList) =>{ // Gets the bookings of the current user by their email
    try{
      const response = await fetch(`/api/bookings`, { // API call which GETs bookings
        method: 'GET',
      });

      const data = await response.json();
      if (response.ok) {
        setBookingsList(data); // Sets bookingList with API response
      } else {
        console.error('Error fetching bookings:', data.error); // Logs API error
      }
    } catch (error) {
      console.error('Error:', error);
    }
}