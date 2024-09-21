import '../styles/Venues.css';
// import { getCurrentDatesBookings } from "../utils/getCurrentDatesBookingsUtil";
import { makeBooking } from '../utils/makeBookingUtil';
import { editVenue } from '../utils/editVenueUtil';
import { useState, useEffect, useRef } from "react";
import { auth } from "../firebase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCaretDown, faSquareCaretUp} from '@fortawesome/free-solid-svg-icons';

function VenueRow({id, buildingName, venueName, campus, venueType, venueCapacity, timeSlots, isClosed, bookings, relevantDate, setBookingsList, isAdmin, isManaging}) {

    const user = auth.currentUser;
    
    const [isVenueOpen, setIsVenueOpen] = useState(false);

    const [isBooking, setIsBooking] = useState(false);

    const [bookingTime, setBookingTime] = useState("");

    const [customEndTime, setCustomEndTime] = useState("");

    const [bookingEndingTime, setBookingEndingTime] = useState("");

    const [bookingDescriptionText, setBookingDescriptionText] = useState("");

    const [bookerEmail, setBookerEmail] = useState("");

    const [timeSlotsArray, setTimeSlotsArray] = useState([]);

    const toggleIsBooking = () => {
        if(!isAdmin){
            setIsBooking(!isBooking);
        }
    } //Toggles booking requirements dropdown

    const toggleBookingDetails = () => setIsVenueOpen(!isVenueOpen); //Toggles venue details dropdown
    
    useEffect(() => { // Populates list with the venues time slots
        setTimeSlotsArray(timeSlots);// eslint-disable-next-line
    }, []);

    const firstRender = useRef(true);

    useEffect(() => {
        if(bookingTime !== "" && customEndTime !== ""){
            const startTime = new Date(`1970-01-01T${bookingTime}:00`);
            const endTime = new Date(`1970-01-01T${customEndTime}:00`);
            if(startTime > endTime){
                alert("Please ensure the Booking End Time is later than the Booking Start Time");
                setCustomEndTime("");
                return;
            }
            setIsBooking(true);
        }
    }, [bookingTime, customEndTime])

    useEffect(() => {
        if (firstRender.current){// Doesn't run on first render in order to give bookingTime and bookingEndTime time to reflect changes
            firstRender.current = false;
            return;
        }
        const compileBookingData = () => { // Gets all information needed for a booking together and calls the makeBooking function
            const booker = isAdmin ? bookerEmail : user.email; // Gets entered booker email or user email
    
            if (bookingDescriptionText !== "" && booker !== ""){
                makeBooking(booker, venueName, relevantDate, bookingTime, bookingEndingTime, bookingDescriptionText, setIsVenueOpen, toggleIsBooking, setBookingDescriptionText, setBookingsList);
            }
            else{
                makeBooking(null, venueName, relevantDate, bookingTime, bookingEndingTime, null, setIsVenueOpen, toggleIsBooking, setBookingDescriptionText, setBookingsList);;
            }
        }
        if (bookingTime && bookingEndingTime) { // If updated, compileBookingData
            compileBookingData();
            setBookingTime("");
            setCustomEndTime("");
        }// eslint-disable-next-line
    }, [bookingEndingTime]); // Runs whenever bookingEndTime changes

    const toggleVenueClosure = () => {
        editVenue(id, buildingName, venueName, campus, venueType, venueCapacity, timeSlots, !isClosed);
        toggleBookingDetails();
    }

    const updateBookingEndTime = () => { // Sets bookingEndTime to be 45 minutes after the selected time
        const slotEnd = new Date((new Date(`1970-01-01T${bookingTime}:00`)).getTime() + 45 * 60000); // Convert to Date for easier comparisions
        setBookingEndingTime(((slotEnd.getHours() < 10 ? '0' : '') + slotEnd.getHours())+":"+((slotEnd.getMinutes() < 10 ? '0' : '') + slotEnd.getMinutes()));// Puts time in the correct format, hh:mm
    }

    const updateCustomEndTime = (time) => { // Sets bookingEndTime to be 45 minutes after the selected time
        const slotEnd = new Date((new Date(`1970-01-01T${time}:00`)).getTime() + 45 * 60000); // Convert to Date for easier comparisions
        setCustomEndTime(((slotEnd.getHours() < 10 ? '0' : '') + slotEnd.getHours())+":"+((slotEnd.getMinutes() < 10 ? '0' : '') + slotEnd.getMinutes()));// Puts time in the correct format, hh:mm
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
                    updateCustomEndTime(time); // Sets the end time
                 }}>
                {time}
            </button>
        );
    });

    const conditionalDropdown = (isClosed) => { // Checks whether a venue is open or closed, prevents dropdown from opening if closed
        if (isClosed && !isManaging){
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
                        icon={(isVenueOpen && (!isClosed || isManaging)) ? faSquareCaretUp : faSquareCaretDown} 
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
            <div className={`popup ${(isVenueOpen && (!isClosed || isManaging)) ? "open" : "closed"}`} onClick = {(e) => e.stopPropagation()}>{/* Conditional rendering for booking fields */}
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
                {isManaging &&(
                    <div className="venue-info-container">
                    <div className="venue-info-text-category">
                        Closure Status: 
                    </div>
                    <div className="venue-info-text">
                        {isClosed ? "Closed" : "Open"}
                    </div>
                </div>
                )}
                {!isManaging ? (
                    <div>
                        <div className="timeslot-buttons-container">
                            {timeSlotButtons}
                        </div>
                        {isAdmin ? (
                            <div>
                                <div className="venue-info-container">
                                    <div className="venue-info-text-category">
                                        Custom Times?
                                    </div>
                                </div>
                                <div className="times-input-container">
                                    <input className= 'times-input' placeholder='Start Time' type="time" value={bookingTime} onClick={(e) => { e.stopPropagation();}} onChange={ (e) => {setBookingTime(e.target.value);}}></input>
                                    to
                                    <input className= 'times-input' placeholder='End Time' type="time" min={"14:15"} value={customEndTime} onClick={(e) => { e.stopPropagation();}} onChange={ (e) => {setCustomEndTime(e.target.value)}}></input>
                                </div>
                                <div className="admin-book-action-container">
                                    <textarea className={`description-input ${isBooking ? "shown" : "hidden"}`} data-testid = 'description-input-id' value = { bookingDescriptionText } onChange={(e) => setBookingDescriptionText(e.target.value)} required placeholder="Input a booking description" onClick={(e) => e.stopPropagation()}></textarea>
                                    <input className={`email-input ${isBooking ? "shown" : "hidden"}`} data-testid = 'email-input-id' value = { bookerEmail } onChange={(e) => setBookerEmail(e.target.value)} required placeholder="Input booker email" onClick={(e) => e.stopPropagation()}></input>
                                    <button className={`book-button ${isBooking ? "shown" : "hidden"}`} onClick={(e) => { e.stopPropagation(); setBookingEndingTime(customEndTime);}}>Book</button>
                                </div>
                            </div>
                        ):(
                            <div className="book-action-container">
                                <textarea className={`description-input ${isBooking ? "shown" : "hidden"}`} data-testid = 'description-input-id' value = { bookingDescriptionText } onChange={(e) => setBookingDescriptionText(e.target.value)} required placeholder="Input a booking description" onClick={(e) => e.stopPropagation()}></textarea>
                                <button className={`book-button ${isBooking ? "shown" : "hidden"}`} onClick={(e) => { e.stopPropagation(); updateBookingEndTime();}}>Book</button>
                            </div>
                        )}
                    </div>
                ):(
                    <div className='admin-management-container'>
                        <button className='management-button'>Edit</button>
                        <button className='management-button'>Delete</button>
                        {!isClosed ? (
                            <button className='management-button' onClick = {()=>toggleVenueClosure()}>Close</button>
                        ):(
                            <button className='management-button' onClick = {()=>toggleVenueClosure()}>Open</button>
                        )}
                    </div>
                )}
                
            </div>
        </div>
    );
}

export default VenueRow;