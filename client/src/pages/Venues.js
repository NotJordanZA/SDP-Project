import CalendarPopup from "../components/CalendarPopup";
import DateHeader from "../components/DateHeader";
import "../styles/Venues.css";
import VenueRow from "../components/VenueRow";
import { useState, useEffect } from "react";

function Venues(){
    const [venueList, setVenueList] = useState([]);

    const getAllVenues = async () =>{
        try{
          const response = await fetch(`/venues`, {
            method: 'GET',
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

    useEffect(() => {
        getAllVenues();
      }, []);//only runs on first load

    const venueComponents = [];
    //Map the elements of venueList onto VenueRow components and push them to an array
    {venueList.map((venue) => (
        venueComponents.push(
            <VenueRow
                key={venue.venueName} 
                venueName={venue.venueName}
                campus={venue.campus}
                venueType={venue.venueType}
                venueCapacity={venue.venueCapacity}
                timeSlots={venue.timeSlots}
            />
        )
    ))}

    return (
        <main>
            <DateHeader/>
            {venueComponents}
        </main>
    );
}

export default Venues;