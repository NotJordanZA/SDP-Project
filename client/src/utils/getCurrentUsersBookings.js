export const getCurrentUsersBookings = async (currentUserEmail, setBookingsList) =>{ // Gets the bookings of the current user by their email
    try{
      const response = await fetch(`/api/bookings/findByField?venueBooker=${currentUserEmail}`, { // API call which GETs based on user email
        method: 'GET',
      });

      const data = await response.json();
      if (response.ok) {
        // console.log('Bookings by ' + currentUserEmail +' fetched successfully');
        setBookingsList(data); // Sets bookingList with API response
      } else {
        console.error('Error fetching bookings by ' + currentUserEmail +':', data.error); // Logs API error
      }
    } catch (error) {
      console.error('Error:', error);
    }
}