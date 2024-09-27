import { getCurrentDatesBookings } from "../utils/getCurrentDatesBookingsUtil";

export const updateBooking = async(id, venueBooker, venueID, bookingDate, bookingStartTime, bookingEndTime, bookingDescription, setBookingsList) => {
    try {
        const response = await fetch(`/api/bookings/${id}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.REACT_APP_API_KEY,
            },
            body: JSON.stringify({ 
            venueID: venueID,
            bookingDate: bookingDate, 
            bookingStartTime: bookingStartTime, 
            bookingEndTime: bookingEndTime, 
            bookingDescription: bookingDescription,
            venueBooker: venueBooker })
        });
        const data = await response.json();
        if (response.ok){
            console.log("Edit successful", data);
            getCurrentDatesBookings(bookingDate, setBookingsList); // For new change to reflect
        }else{
            console.error('Error updating booking:', data.error); // Logs error
        }

    } catch (error) {
    console.error('Error updating booking:', error);
    }
}