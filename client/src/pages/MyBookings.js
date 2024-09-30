import BookingRow from "../components/BookingRow";
import { auth } from "../firebase";
import { useState, useEffect } from "react";
import '../styles/Bookings.css';
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { getCurrentUsersBookings } from "../utils/getCurrentUsersBookings";
import { getAllBookings } from "../utils/getAllBookingsUtil";
import { getCurrentUser } from "../utils/getCurrentUser";

function MyBookings() {
    const [bookingsList, setBookingsList] = useState([]);
    const [filterDate, setFilterDate] = useState('');
    const [filterBookerEmail, setFilterBookerEmail] = useState('');
    const [filterVenue, setFilterVenue] = useState('');
    const [userInfo, setUserInfo] = useState({});
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
      // eslint-disable-next-line
    }, [auth, navigate]);

    // Get info about the current user from the database once firebase is loaded
    useEffect(() => {
      // Fetch current user's info
      const fetchUserInfo = async () => {
        // If user is signed in
        if (user) {
          try {
            // Instantiate userInfo object
            // const userData = await getCurrentUser(user.email);
            getCurrentUser(user.email, setUserInfo);
            //setUserInfo(userData);
          } catch (error) {
            console.error('Failed to fetch user info: ', error);
          }
        }
      };
      // Check if firebase is done loading
      if (!isLoading){
        fetchUserInfo(); //Get user info
      }
    }, [user, isLoading]);
    
    useEffect(() => {
        if(!userInfo.isAdmin && !isLoading){
          getCurrentUsersBookings(user.email, setBookingsList);// Gets the bookings of the current user by their email
          console.log(userInfo);
        }else if(userInfo.isAdmin && !isLoading){
          console.log("I am here");
          getAllBookings(null, setBookingsList);
        }// eslint-disable-next-line
    }, [userInfo]);// Only runs if user is defined

    const sortBookings = (bookings) => {
      const today = new Date(); // Current date

      return bookings.sort((a, b) => {
        const dateA = new Date(`${a.bookingDate}T${a.bookingEndTime}`);
        const dateB = new Date(`${b.bookingDate}T${b.bookingEndTime}`);

        // If both dates are in the future, sort by ascending date
        if (dateA >= today && dateB >= today) {
          return dateA - dateB;
        }

        // If both dates are in the past, sort by ascending date
        if (dateA < today && dateB < today) {
          return dateA - dateB;
        }

        // If one is in the past and the other in the future, future dates come first
        if (dateA >= today && dateB < today) {
          return -1;
        }
        if (dateA < today && dateB >= today) {
          return 1;
        }

        return 0;
      });
    };

    const filteredBookings = bookingsList.filter(booking => {
      return (
        (filterDate ? booking.bookingDate === filterDate : true) &&
        (filterBookerEmail ? booking.venueBooker.includes(filterBookerEmail) : true) &&
        (filterVenue ? booking.venueID.toLowerCase().includes(filterVenue.toLowerCase()) : true)
      );
    });

    sortBookings(filteredBookings);

    if (isLoading) {
      return (
        <p>Loading...</p>
      );
    }

    const bookingComponents = filteredBookings.map((booking) => { // Creates a list of the bookings to be displayed
        return (                                              // Passes in booking information to BookingRow component
          <BookingRow
            key={booking.venueID + "-" + booking.bookingDate + "-" + booking.bookingStartTime}
            bookingDate={booking.bookingDate}
            venueID={booking.venueID}
            time= {booking.bookingStartTime + "-" + booking.bookingEndTime}
            bookingDescription={booking.bookingDescription}
            venueBooker = {booking.venueBooker}
            currentEmail = {user.email}
            getBookings = {!userInfo.isAdmin ? getCurrentUsersBookings: getAllBookings}
            setBookingsList={setBookingsList}
            isAdmin = {userInfo.isAdmin}
            bookingsList = {bookingsList}
          />
        );
    });

    return(
        <section className="booking-page" data-testid="booking-page">
            <div className="booking-list" data-testid="booking-list">
                <h2 data-testid="booking-heading">{userInfo.isAdmin ? "All Bookings" : "My Bookings"}</h2>
                {userInfo.isAdmin && (
                  <div className="booking-filters-container">
                    <label htmlFor="filter-date">Filter by Date:</label>
                    <input
                      type="date"
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                    />
                    <label htmlFor="filter-bookerEmail">Filter by Booker Email:</label>
                    <input
                      value={filterBookerEmail}
                      placeholder="lucky@wits.ac.za"
                      onChange={(e) => setFilterBookerEmail(e.target.value)}
                    />
                    <label htmlFor="filter-venue">Filter by Venue:</label>
                    <input
                      value={filterVenue}
                      placeholder="CLM101"
                      onChange={(e) => setFilterVenue(e.target.value)}
                    />
                  </div>
                )}
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