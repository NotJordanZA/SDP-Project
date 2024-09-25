export const getCurrentDaySchedules = async (bookingDay, bookingsList, setBookingsList) =>{
    try{
      const response = await fetch(`/api/schedules/findByField?bookingDay=${bookingDay}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.REACT_APP_API_KEY,
        },
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Schedules on ' + bookingDay +' fetched successfully');
        setBookingsList(bookingsList.concat(data));
        console.log(bookingsList.concat(data));
      } else {
        console.error('Error fetching schedules on ' + bookingDay +':', data.error);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  }