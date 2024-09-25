export const deleteBooking = async(id, setBookingsList, email) => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.REACT_APP_API_KEY,
        },
      });
      const data = await response.json();
      if (response.ok){
          console.log("Delete successful", data);
          return("Delete succesful");
      }else{
          console.error('Error deleting booking:', data.error); // Logs error
          return('Error deleting booking');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      return('Error deleting booking');
    }
}