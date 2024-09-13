import DateHeader from "../components/DateHeader";
import "../styles/Venues.css";
import VenueRow from "../components/VenueRow";
import Search from "../components/Search";
import { useState, useEffect } from "react";
import { getCurrentUser } from '../utils/getCurrentUser';
import { getAllVenues } from "../utils/getAllVenuesUtil";
import { getCurrentDatesBookings } from "../utils/getCurrentDatesBookingsUtil";
import { formatDate } from "../utils/formatDateUtil";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

function Venues(){
    const [allVenues, setAllVenues] = useState([]);
    const [venueList, setVenueList] = useState([]);
    const [bookingsList, setBookingsList] = useState([]);
    const [displayDate, setDisplayDate] = useState(new Date());
    const [formattedDate, setFormattedDate] = useState('');
    const [userInfo, setUserInfo] = useState({});
    const user = auth.currentUser;
    const studentVenueTypes = ["Tutorial Room", "Study Room"];
    const lecturerVenueTypes = ["Tutorial Room", "Study Room", "Lecture Venue", "Lab"];

    function wait(milliseconds) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, milliseconds); // Convert seconds to milliseconds
      });
    }

    wait(100)
      .then(() => {
        if (user === null) {
          navigate("/login");
        }
        setUserInfo(getCurrentUser(user.email));
      })
      .catch((error) => {
        console.error(error);
      });

    const navigate = useNavigate();
    useEffect(() => { // Reroutes user to /login if they are not logged in
    if (user === null) {
        navigate("/login");
    }
    }, [user, navigate]); // Effect will run when the user or navigate changes
    
    useEffect(() => {
      getAllVenues(setVenueList, setAllVenues);
    }, []);// Only runs on first load

    useEffect(() => {
      // Update the formatted date when displayDate changes
      setFormattedDate(formatDate(displayDate));
    }, [displayDate]); // Only runs when displayDate changes
    
    useEffect(() => {
      // Call getCurrentDatesBookings when formattedDate changes
      if (formattedDate) {
        getCurrentDatesBookings(formattedDate, setBookingsList);
      }
    }, [formattedDate]); // Only runs when formattedDate changes

  //   useEffect(() => {
  //     console.log("Updated bookings list:", bookingsList);
  // }, [bookingsList]); // Runs whenever bookingsList changes

    const handleDateChange = (newDate) => { // Function for changing the selected date
      setDisplayDate(newDate);
    };

    //Map the elements of venueList onto VenueRow components and add them to an array
    const venueComponents = venueList.map((venue) => {
      // Find all bookings for this venue
      const matchingBookings = bookingsList.filter(booking => booking.venueID === venue.venueName);
      
      // console.log(userInfo.isAdmin);

      // if (userInfo.isAdmin === true){
        return (
          <VenueRow
            key={venue.venueName}
            venueName={venue.venueName}
            campus={venue.campus}
            venueType={venue.venueType}
            venueCapacity={venue.venueCapacity}
            timeSlots={venue.timeSlots}
            isClosed={venue.isClosed}
            bookings={matchingBookings}
            relevantDate={formattedDate}
          />
        );
      // }
      // else if ((userInfo.isLecturer === true) && (lecturerVenueTypes.indexOf(venue.venueType) !== -1)){
      //   <VenueRow
      //       key={venue.venueName}
      //       venueName={venue.venueName}
      //       campus={venue.campus}
      //       venueType={venue.venueType}
      //       venueCapacity={venue.venueCapacity}
      //       timeSlots={venue.timeSlots}
      //       isClosed={venue.isClosed}
      //       bookings={matchingBookings}
      //       relevantDate={formattedDate}
      //     />
      // }
      // else if ((userInfo.isStudent === true) && (studentVenueTypes.indexOf(venue.venueType) !== -1)){
      //   <VenueRow
      //       key={venue.venueName}
      //       venueName={venue.venueName}
      //       campus={venue.campus}
      //       venueType={venue.venueType}
      //       venueCapacity={venue.venueCapacity}
      //       timeSlots={venue.timeSlots}
      //       isClosed={venue.isClosed}
      //       bookings={matchingBookings}
      //       relevantDate={formattedDate}
      //     />
      // }
      
    });

    

    return (
        <main>
            <DateHeader displayDate={displayDate} onDateChange={handleDateChange} data-testid="date-header"/>
            <Search venueList = {allVenues} setVenueList = {setVenueList} bookingsList = {bookingsList} data-testid="search"/>
            {
              venueComponents.length > 0 ? 
                (
                  <div data-testid="venue-list">
                      {venueComponents}
                  </div>
                ):(
                  <p data-testid="no-venues-message">No Venues Available</p>
                )
            }
        </main>
    );
}

export default Venues;