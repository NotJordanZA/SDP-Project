import TextButton from "../components/styledButtons";
import '../styles/Venues.css';
import { getCurrentDatesBookings } from "../utils/getCurrentDatesBookingsUtil";
import { useState, useEffect, useRef } from "react";
import { auth } from "../firebase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCaretDown, faSquareCaretUp} from '@fortawesome/free-solid-svg-icons';

function VenueRow({venueName, campus, venueType, venueCapacity, timeSlots, isClosed, bookings, relevantDate}) {

    // const user = auth.currentUser;
    
    const [isOpen, setIsOpen] = useState(false);

    const [isBooking, setIsBooking] = useState(false);

    const [bookingTime, setBookingTime] = useState("");

    const [bookingEndingTime, setBookingEndingTime] = useState("");

    const [bookingDescriptionText, setBookingDescriptionText] = useState("");

    const [timeSlotsArray, setTimeSlotsArray] = useState([]);

    const toggleIsBooking = () => setIsBooking(!isBooking);

    const toggleBookingDates = () => setIsOpen(!isOpen);
    
    useEffect(() => {
        setTimeSlotsArray(timeSlots);
    }, []);

    const firstRender = useRef(true);

    useEffect(() => {
        if (firstRender.current){
            console.log("First Render: "+ firstRender.current);
            firstRender.current = false;
            return;
        }
        if (bookingTime && bookingEndingTime) {
            compileBookingData();
        }
    }, [bookingEndingTime]);

    const updateBookingEndTime = () => {
        const slotEnd = new Date((new Date(`1970-01-01T${bookingTime}:00`)).getTime() + 45 * 60000);
        setBookingEndingTime(((slotEnd.getHours() < 10 ? '0' : '') + slotEnd.getHours())+":"+((slotEnd.getMinutes() < 10 ? '0' : '') + slotEnd.getMinutes()));
    }

    const compileBookingData = () => {
        
        const booker = user.email;

        if (bookingDescriptionText != ""){
            makeBooking(booker, venueName, relevantDate, bookingTime, bookingEndingTime, bookingDescriptionText);
        }
        else{
            makeBooking(booker, venueName, relevantDate, bookingTime, bookingEndingTime, null);
        }
        
    }

    const makeBooking = async(venueBooker, venueID, bookingDate, bookingStartTime, bookingEndTime, bookingDescription) => {
        try{
            const response = await fetch(`/bookings/create`, {
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
                console.log('Booking added successfully:', data);
                setIsOpen(false);
                toggleIsBooking();
                getCurrentDatesBookings(relevantDate);
                setBookingDescriptionText("");
            } else {
                console.error('Error making booking:', data.error);            }
          } catch (error) {
            console.log('Error:', error);
          }
    }

    const isTimeSlotInactive = (timeSlot) => {
        const slotStart = new Date(`1970-01-01T${timeSlot}:00`); 
        const slotEnd = new Date(slotStart.getTime() + 45 * 60000);
        // console.log("End: " + slotEnd);
    
        return bookings.some(booking => {
            const bookingStart = new Date(`1970-01-01T${booking.bookingStartTime}:00`);
            const bookingEnd = new Date(`1970-01-01T${booking.bookingEndTime}:00`);
    
            return (slotStart >= bookingStart && slotStart < bookingEnd) || 
                (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
                (slotStart <= bookingStart && slotEnd >= bookingEnd);
        });
    };

    const timeSlotButtons = timeSlotsArray.map((time) => {

        const buttonClass = isTimeSlotInactive(time) ? "timeslot-button booked" : ((time === bookingTime && isBooking) ? "timeslot-button clicked" : "timeslot-button");
        return (
            <button  
                key={time} 
                className={buttonClass}
                onClick={(e) => { e.stopPropagation();
                    toggleIsBooking();
                    setBookingTime(time);
                 }}>
                {time}
            </button>
        );
    });

    const conditionalDropdown = (isClosed) => {
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
                    e.stopPropagation(); // Prevents the event from bubbling up
                    toggleBookingDates(); // Correctly toggles the state
                }}>
                    <FontAwesomeIcon
                        icon={(isOpen && !isClosed) ? faSquareCaretUp : faSquareCaretDown} 
                        className="caret-icon"
                    />
                </button>
            )
        }
    }

    return(
        <div className="venue-row-content" onClick={() => toggleBookingDates()}>
            <div className="venue-row-main">
                <h1 className="venue-row-text">{venueName}</h1>
                {conditionalDropdown(isClosed)}
            </div>
            <div className={`popup ${(isOpen && !isClosed) ? "open" : "closed"}`}>
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