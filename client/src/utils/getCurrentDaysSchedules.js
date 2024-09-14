export const getCurrentDaySchedules = async (bookingDay, bookingsList, setBookingsList) =>{
    try{
      const response = await fetch(`/schedules/findByField?bookingDay=${bookingDay}`, {
        method: 'GET',
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