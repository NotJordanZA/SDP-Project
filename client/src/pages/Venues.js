import DateHeader from "../components/DateHeader";
import "../styles/Venues.css";
import VenueRow from "../components/VenueRow";
import CalendarPopup from "../components/CalendarPopup";
import Search from "../components/Search";
import { useState, useEffect } from "react";

function Venues(){
    const [allVenues, setAllVenues] = useState([]);
    const [venueList, setVenueList] = useState([]);
    const [bookingsList, setBookingsList] = useState([]);
    const [displayDate, setDisplayDate] = useState(new Date());
    const [formattedDate, setFormattedDate] = useState('');

    const getAllVenues = async () =>{
        try{
          const response = await fetch(`/venues`, {
            method: 'GET',
            cache: 'no-store',
          });
  
          const data = await response.json();
          if (response.ok) {
            console.log('Venues fetched successfully');
            let sortedVenues = data.sort((a, b) => a.venueName.localeCompare(b.venueName));
            setVenueList(sortedVenues);
            setAllVenues(sortedVenues);
            setVenueList(data);
            setAllVenues(data);
          } else {
            console.error('Error fetching venues:', data.error);
          }
        } catch (error) {
          console.log('Error:', error);
        }
    }

    const getCurrentDatesBookings = async (bookingDate) =>{
      try{
        const response = await fetch(`/bookings/findByField?bookingDate=${bookingDate}`, {
          method: 'GET',
        });

        const data = await response.json();
        if (response.ok) {
          console.log('Bookings on ' + bookingDate +' fetched successfully');
          setBookingsList(data);
          // console.log(data);
        } else {
          console.error('Error fetching bookings on ' + bookingDate +':', data.error);
        }
      } catch (error) {
        console.log('Error:', error);
      }
    }

    function formatDate(date) {
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