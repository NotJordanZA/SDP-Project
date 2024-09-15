import BookingRow from "../components/BookingRow";
import { auth } from "../firebase";
import { useState, useEffect } from "react";
import '../styles/Bookings.css';
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { getCurrentUsersBookings } from "../utils/getCurrentUsersBookings";

function MyBookings() {
    const [bookingsList, setBookingsList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    const navigate = useNavigate();

    // Ensure User is logged in
    useEffect(() => {
      // Listen for a change in the auth state
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        // If user is authenticated
        if (firebaseUser) {
          setUser(firebaseUser); //Set current user
          console.log(user);
        } else {
          navigate("/login"); //Reroute to login if user not signed in
        }
        setIsLoading(false); //Declare firebase as no longer loading
      });
      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      }; //Return the listener
    }, [auth, navigate]);
    
    // const currentUserEmail = user ? user.email : null; // Gets current user email if not null, otherwise sets it to null

    useEffect(() => {
        if(user){
            getCurrentUsersBookings(user.email, setBookingsList);// Gets the bookings of the current user by their email
        }
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