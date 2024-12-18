export const getCurrentDatesBookings = async (bookingDate, bookingsList,  setBookingsList) =>{
    try{
      const response = await fetch(`/api/bookings/findByField?bookingDate=${bookingDate}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.REACT_APP_API_KEY,
        },
      });

      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        console.error('Error fetching bookings on ' + bookingDate +':', data.error);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  }