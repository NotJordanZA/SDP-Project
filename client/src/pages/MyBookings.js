import BookingRow from "../components/BookingRow";
import { auth } from "../firebase";
import { useState, useEffect } from "react";
import '../styles/Bookings.css';
import { useNavigate } from "react-router-dom";
import { getCurrentUsersBookings } from "../utils/getCurrentUsersBookings";

function MyBookings() {
    const [bookingsList, setBookingsList] = useState([]);
    const user = auth.currentUser; // Fetches current user

    const navigate = useNavigate();
    useEffect(() => { // Reroutes user to /login if they are not logged in
    if (user === null) {
        navigate("/login");
    }
    }, [user, navigate]); // Effect will run when the user or navigate changes
    
    const currentUserEmail = user ? user.email : null; // Gets current user email if not null, otherwise sets it to null

    useEffect(() => {
        if(user){
            getCurrentUsersBookings(currentUserEmail, setBookingsList);// Gets the bookings of the current user by their email
        }// eslint-disable-next-line
      }, [user]);// Only runs if user is defined

    const bookingComponents = bookingsList.map((booking) => { // Creates a list of the bookings to be displayed
        return (                                              // Passes in booking information to BookingRow component
          <BookingRow
            key={booking.bookingDate}
            bookingDate={booking.bookingDate}
            venueID={booking.venueID}
            time= {booking.bookingStartTime + "-" + booking.bookingEndTime}
            bookingDescription={booking.bookingDescription}
          />
        );
    });

    return(
        <section className="booking-page" data-testid="booking-page">
            <div className="booking-list" data-testid="booking-list">
                <h2 data-testid="booking-heading">My Bookings</h2>
                <ul>
                    {bookingComponents.length > 0 ? (
                        bookingComponents
                    ): (
                        <li className="booking-list-entry">No bookings available</li>
                    )}
                </ul>
            </div>
        </section>
    );
}

export default MyBookings;