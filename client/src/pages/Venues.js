import DateHeader from "../components/DateHeader";
import "../styles/Venues.css";
import VenueRow from "../components/VenueRow";
import Search from "../components/Search";
import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

function Venues(){
    const [allVenues, setAllVenues] = useState([]);
    const [venueList, setVenueList] = useState([]);
    const [bookingsList, setBookingsList] = useState([]);
    const [displayDate, setDisplayDate] = useState(new Date());
    const [formattedDate, setFormattedDate] = useState('');
    const user = auth.currentUser;

    const navigate = useNavigate();
    useEffect(() => { // Reroutes user to /login if they are not logged in
    if (user === null) {
        navigate("/login");
    }
    }, [user, navigate]); // Effect will run when the user or navigate changes
    

    const getAllVenues = async () =>{
        try{
          const response = await fetch(`/venues`, { // API call to get all Venues from the database
            method: 'GET',
            cache: 'no-store',
          });
  
          const data = await response.json();
          if (response.ok) {
            let sortedVenues = data.sort((a, b) => a.venueName.localeCompare(b.venueName)); // Sorts venues alphabetically
            setVenueList(sortedVenues); // Sets venue list that is displayed and stores filtered/searched venues
            setAllVenues(sortedVenues); // Sets a venue list that holds all venues so that venues are not lost after filtering
          } else {
            console.error('Error fetching venues:', data.error); // Logs error
          }
        } catch (error) {
          console.error('Error:', error);
        }
    }

    const getCurrentDatesBookings = async (bookingDate) =>{ // Fetches bookings on the day selected on the page
      try{
        const response = await fetch(`/bookings/findByField?bookingDate=${bookingDate}`, { // Calls the API to get current days bookings
          method: 'GET',
        });

        const data = await response.json();
        if (response.ok) {
          // console.log('Bookings on ' + bookingDate +' fetched successfully');
          setBookingsList(data); // Sets list with all of the days bookings
        } else {
          console.error('Error fetching bookings on ' + bookingDate +':', data.error); // Logs error
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }

    function formatDate(date) { // Formats the date to be in the format used in the database
      var d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + (d.getDate()),
          year = d.getFullYear();
  
      if (month.length < 2) 
          month = '0' + month;
      if (day.length < 2) 
          day = '0' + day;
  
      return [year, month, day].join('-');
    }

    useEffect(() => {
      // Get all venues when page first loads
      getAllVenues();
    }, []);// Only runs on first load

    useEffect(() => {
      // Update the formatted date when displayDate changes
      setFormattedDate(formatDate(displayDate));
    }, [displayDate]); // Only runs when displayDate changes
    
    useEffect(() => {
      // Call getCurrentDatesBookings when formattedDate changes
      if (formattedDate) {
        getCurrentDatesBookings(formattedDate);
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
          getCurrentDatesBookings={getCurrentDatesBookings}
        />
      );
    });

    

    return (
        <main>
            <DateHeader displayDate={displayDate} onDateChange={handleDateChange}/>
            <Search venueList = {allVenues} setVenueList = {setVenueList} bookingsList = {bookingsList}/>
            {venueComponents}
        </main>
    );
}

export default Venues;