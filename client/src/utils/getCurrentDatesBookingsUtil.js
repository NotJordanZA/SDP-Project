export const getCurrentDatesBookings = async (bookingDate, setBookingsList) =>{
    try{
      const response = await fetch(`/bookings/findByField?bookingDate=${bookingDate}`, {
        method: 'GET',
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Bookings on ' + bookingDate +' fetched successfully');
        setBookingsList(data);
        // console.log(data);
      } else {
        console.error('Error fetching bookings on ' + bookingDate +':', data.error);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  }