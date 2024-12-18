import { getCurrentDatesBookings } from "../utils/getCurrentDatesBookingsUtil";
import { getAllBookings } from "./getAllBookingsUtil";

export const makeBooking = async(venueBooker, venueID, bookingDate, bookingStartTime, bookingEndTime, bookingDescription, setIsVenueOpen, toggleIsBooking, setBookingDescriptionText, setBookingsList) => { // Makes a new bookings 
    try{
        const response = await fetch(`/api/bookings/create`, { //Calls the API to create a new booking
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': process.env.REACT_APP_API_KEY,
            },
            body: JSON.stringify({
                venueBooker,
                venueID,
                bookingDate,
                bookingStartTime,
                bookingEndTime,
                bookingDescription,
            }),
        });

        const data = await response.json();
        if (response.ok) {
            if(setIsVenueOpen && toggleIsBooking && setBookingDescriptionText){
              setIsVenueOpen(false); // Closes the dropdown on booking
              toggleIsBooking(); // Changes the booking status, closing the popup
              getCurrentDatesBookings(bookingDate, setBookingsList); // Calls this function again so that the new booking is reflected on the page
              setBookingDescriptionText(""); // Resets the booking description field
              alert("Booking made successfully!");
            }else if(setBookingsList){
              getAllBookings(null, setBookingsList);
              alert("Booking updated successfully!");
            }
            // console.log('Booking added successfully:', data);
            
        } else {
            console.error('Error making booking:', data.error); // Logs error
            return "error";
        }
      } catch (error) {
        console.error('Error:', error); // Logs error
        alert("Error");
      }
}