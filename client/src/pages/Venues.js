import DateHeader from "../components/DateHeader";
import "../styles/Venues.css";
import VenueRow from "../components/VenueRow";
import CalendarPopup from "../components/CalendarPopup";
import Search from "../components/Search";
import { useState, useEffect } from "react";
import { getAllVenues } from "../utils/getAllVenuesUtil";
import { getCurrentDatesBookings } from "../utils/getCurrentDatesBookingsUtil";
import { formatDate } from "../utils/formatDateUtil";

function Venues(){
    const [allVenues, setAllVenues] = useState([]);
    const [venueList, setVenueList] = useState([]);
    const [bookingsList, setBookingsList] = useState([]);
    const [displayDate, setDisplayDate] = useState(new Date());
    const [formattedDate, setFormattedDate] = useState('');

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

    useEffect(() => {
      console.log("Updated bookings list:", bookingsList);
  }, [bookingsList]); // Runs whenever bookingsList changes

    const handleDateChange = (newDate) => {
      setDisplayDate(newDate);
    };

    // const venueComponents = [];
    //Map the elements of venueList onto VenueRow components and add them to an array
    const venueComponents = venueList.map((venue) => {
      // Find all bookings for this venue
      const matchingBookings = bookingsList.filter(booking => booking.venueID === venue.venueName);
      
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