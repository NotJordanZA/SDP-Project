import BookingRow from "../components/BookingRow";
import { auth } from "../firebase";
import { useState, useEffect } from "react";
import '../styles/Bookings.css';
import { useNavigate } from "react-router-dom";

function MyBookings() {
    const [bookingsList, setBookingsList] = useState([]);
    const user = auth.currentUser;

    const navigate = useNavigate();
    useEffect(() => { // Reroutes user to /login if they are not logged in
    if (user === null) {
        console.log(user);
        navigate("/login");
    }
    }, [user, navigate]); // Effect will run when the user or reroute changes
    
    const currentUserEmail = user.email;

    const getCurrentUsersBookings = async (bookingDate) =>{
        try{
          const response = await fetch(`/bookings/findByField?venueBooker=${currentUserEmail}`, {
            method: 'GET',
          });
  
          const data = await response.json();
          if (response.ok) {
            console.log('Bookings by ' + currentUserEmail +' fetched successfully');
            setBookingsList(data);
          } else {
            console.error('Error fetching bookings by ' + currentUserEmail +':', data.error);
          }
        } catch (error) {
          console.log('Error:', error);
        }
    }

    useEffect(() => {
        if(user){
            getCurrentUsersBookings();
        }
      }, [user]);// Only runs if user is defined

    const bookingComponents = bookingsList.map((booking) => {
        return (
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
        <section className="booking-page">
            <div className="booking-list">
                <h2>My Bookings</h2>
                <ul>
                    {bookingComponents}
                </ul>
            </div>
        </section>
    );
}

export default MyBookings;