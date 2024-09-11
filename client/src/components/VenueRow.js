import '../styles/Venues.css';
import { getCurrentDatesBookings } from "../utils/getCurrentDatesBookingsUtil";
import { useState, useEffect, useRef } from "react";
import { auth } from "../firebase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCaretDown, faSquareCaretUp} from '@fortawesome/free-solid-svg-icons';

function VenueRow({venueName, campus, venueType, venueCapacity, timeSlots, isClosed, bookings, relevantDate}) {

    const user = auth.currentUser;
    
    const [isVenueOpen, setIsVenueOpen] = useState(false);

    const [isBooking, setIsBooking] = useState(false);

    const [bookingTime, setBookingTime] = useState("");

    const [bookingEndingTime, setBookingEndingTime] = useState("");

    const [bookingDescriptionText, setBookingDescriptionText] = useState("");

    const [timeSlotsArray, setTimeSlotsArray] = useState([]);

    const toggleIsBooking = () => setIsBooking(!isBooking); //Toggles booking requirements dropdown

    const toggleBookingDetails = () => setIsVenueOpen(!isVenueOpen); //Toggles venue details dropdown
    
    useEffect(() => { // Populates list with the venues time slots
        setTimeSlotsArray(timeSlots);
    }, []);

    const firstRender = useRef(true);

    useEffect(() => {
        if (firstRender.current){// Doesn't run on first render in order to give bookingTime and bookingEndTime time to reflect changes
            firstRender.current = false;
            return;
        }
        if (bookingTime && bookingEndingTime) { // If updated, compileBookingData
            compileBookingData();
        }
    }, [bookingEndingTime]); // Runs whenever bookingEndTime changes

    const updateBookingEndTime = () => { // Sets bookingEndTime to be 45 minutes after the selected time
        const slotEnd = new Date((new Date(`1970-01-01T${bookingTime}:00`)).getTime() + 45 * 60000); // Convert to Date for easier comparisions
        setBookingEndingTime(((slotEnd.getHours() < 10 ? '0' : '') + slotEnd.getHours())+":"+((slotEnd.getMinutes() < 10 ? '0' : '') + slotEnd.getMinutes()));// Puts time in the correct format, hh:mm
    }

    const compileBookingData = () => { // Gets all information needed for a booking together and calls the makeBooking function
        
        const booker = user.email; // Gets user email

        if (bookingDescriptionText != ""){
            makeBooking(booker, venueName, relevantDate, bookingTime, bookingEndingTime, bookingDescriptionText);
        }
        else{
            makeBooking(booker, venueName, relevantDate, bookingTime, bookingEndingTime, null);
        }
        
    }

    const makeBooking = async(venueBooker, venueID, bookingDate, bookingStartTime, bookingEndTime, bookingDescription) => { // Makes a new bookings 
        try{
            const response = await fetch(`/bookings/create`, { //Calls the API to create a new booking
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    venueBooker,
                    venueID,
                    bookingDate,
                    bookingStartTime,
                    bookingEndTime,
                    bookingDescription,
                }),
            });
    
            const data = await response.json();
            if (response.ok) {
                // console.log('Booking added successfully:', data);
                setIsVenueOpen(false); // Closes the dropdown on booking
                toggleIsBooking(); // Changes the booking status, closing the popup
                getCurrentDatesBookings(relevantDate); // Calls this function again so that the new booking is reflected on the page
                setBookingDescriptionText(""); // Resets the booking description field
            } else {
                console.error('Error making booking:', data.error); // Logs error
            }
          } catch (error) {
            console.error('Error:', error); // Logs error
          }
    }

    const isTimeSlotInactive = (timeSlot) => { // Checks whether there is an existing booking during the current time slot
        const slotStart = new Date(`1970-01-01T${timeSlot}:00`); // Convert to Date for easier comparisions
        const slotEnd = new Date(slotStart.getTime() + 45 * 60000); // Sets bookingEndTime to be 45 minutes after the selected time
    
        return bookings.some(booking => {// Returns true or false based on if the time slot has a booking within it
            const bookingStart = new Date(`1970-01-01T${booking.bookingStartTime}:00`); // Convert to Date for easier comparisions
            const bookingEnd = new Date(`1970-01-01T${booking.bookingEndTime}:00`); // Convert to Date for easier comparisions
    
            return (slotStart >= bookingStart && slotStart < bookingEnd) || // Returns false if the time slot has no overlap with a booking
                (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
                (slotStart <= bookingStart && slotEnd >= bookingEnd);
        });
    };

    const timeSlotButtons = timeSlotsArray.map((time) => {// populates a list with buttons corresponding to all time slots
        const buttonClass = isTimeSlotInactive(time) ? "timeslot-button booked" : ((time === bookingTime && isBooking) ? "timeslot-button clicked" : "timeslot-button"); // Greys out a button if the time slot has a booking within its duration
        return (
            <button  
                key={time} 
                className={buttonClass}
                onClick={(e) => { e.stopPropagation(); // Prevents button from toggling dropdown
                    toggleIsBooking(); // Toggles booking state
                    setBookingTime(time); // Sets the currently selected time
                 }}>
                {time}
            </button>
        );
    });

    const conditionalDropdown = (isClosed) => { // Checks whether a venue is open or closed, prevents dropdown from opening if closed
        if (isClosed){
            return(
                <div className="closed-marker">
                    CLOSED
                </div>
            )
        }
        else{
            return(
                <button className="expand-row-button" onClick={(e) => { 
                    e.stopPropagation(); // Prevents button from toggling dropdown
                    toggleBookingDetails(); // Toggles the state
                }}>
                    <FontAwesomeIcon
                        icon={(isVenueOpen && !isClosed) ? faSquareCaretUp : faSquareCaretDown} 
                        className="caret-icon"
                    />
                </button>
            )
        }
    }

    return(
        <div className="venue-row-content" onClick={() => toggleBookingDetails()}>
            <div className="venue-row-main">
                <h1 className="venue-row-text">{venueName}</h1>
                {conditionalDropdown(isClosed)}
            </div>
            <div className={`popup ${(isVenueOpen && !isClosed) ? "open" : "closed"}`}>{/* Conditional rendering for booking fields */}
                <div className="venue-info-container">
                    <div className="venue-info-text-category">
                        Campus: 
                    </div>
                    <div className="venue-info-text">
                        {campus}
                    </div>
                </div>
                <div className="venue-info-container">
                    <div className="venue-info-text-category">
                        Venue Type: 
                    </div>
                    <div className="venue-info-text">
                        {venueType}
                    </div>
                </div>
                <div className="venue-info-container">
                    <div className="venue-info-text-category">
                        Capacity: 
                    </div>
                    <div className="venue-info-text">
                        {venueCapacity}
                    </div>
                </div>
                <div className="timeslot-buttons-container">
                    {timeSlotButtons}
                </div>
                <div className="book-action-container">
                    <textarea className={`description-input ${isBooking ? "shown" : "hidden"}`} value = { bookingDescriptionText } onChange={(e) => setBookingDescriptionText(e.target.value)} required placeholder="Input a booking description" onClick={(e) => e.stopPropagation()}></textarea>
                    <button className={`book-button ${isBooking ? "shown" : "hidden"}`} onClick={(e) => { e.stopPropagation(); updateBookingEndTime();}}>Book</button>
                </div>
            </div>
        </div>
    );
}

export default VenueRow;