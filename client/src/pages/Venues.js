import DateHeader from "../components/DateHeader";
import "../styles/Venues.css";
import VenueRow from "../components/VenueRow";
import CalendarPopup from "../components/CalendarPopup";
import { useState, useEffect } from "react";

function Venues(){
    const [venueList, setVenueList] = useState([]);
    const [bookingsList, setBookingsList] = useState([]);
    const [displayDate, setDisplayDate] = useState(new Date());

    const getAllVenues = async () =>{
        try{
          const response = await fetch(`/venues`, {
            method: 'GET',
            cache: 'no-store',
          });
  
          const data = await response.json();
          if (response.ok) {
            console.log('Venues fetched successfully');
            setVenueList(data);
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
      const formattedDate = formatDate(displayDate);
      getCurrentDatesBookings(formattedDate);
      
    }, [displayDate]);// Runs whenever displayDate changes

    useEffect(() => {
      console.log("Updated bookings list:", bookingsList);
  }, [bookingsList]); // Runs whenever bookingsList changes

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
          bookings={matchingBookings}
        />
      );
    });

    const handleDateChange = (newDate) => {
      setDisplayDate(newDate);
    };

    return (
        <main>
            <DateHeader displayDate={displayDate} onDateChange={handleDateChange}/>
            {venueComponents}
        </main>
    );
}

export default Venues;