import TextButton from "../components/styledButtons";
import '../styles/Venues.css';
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCaretDown, faSquareCaretUp} from '@fortawesome/free-solid-svg-icons';

function VenueRow({venueName, campus, venueType, venueCapacity, timeSlots, bookings}) {

    const [isOpen, setIsOpen] = useState(false);

    const toggleBookingDates = () => setIsOpen(!isOpen);

    const [timeSlotsArray, setTimeSlotsArray] = useState([]);
    
    useEffect(() => {
        setTimeSlotsArray(timeSlots);
    }, []);

    const isTimeSlotInactive = (timeSlot) => {
        const slotStart = new Date(`1970-01-01T${timeSlot}:00`); 
        const slotEnd = new Date(slotStart.getTime() + 45 * 60000);
    
        return bookings.some(booking => {
            const bookingStart = new Date(`1970-01-01T${booking.bookingStartTime}:00`);
            const bookingEnd = new Date(`1970-01-01T${booking.bookingEndTime}:00`);
    
            return (slotStart >= bookingStart && slotStart < bookingEnd) || 
                (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
                (slotStart <= bookingStart && slotEnd >= bookingEnd);
        });
    };

    const timeSlotButtons = timeSlotsArray.map((time) => {
        const buttonClass = isTimeSlotInactive(time) ? "timeslot-button booked" : "timeslot-button";
        return (
            <button  
                key={time} 
                className={buttonClass}
                onClick={(e) => { e.stopPropagation() }}>
                {time}
            </button>
        );
    });

    return(
        <div className="venue-row-content" onClick={() => toggleBookingDates()}>
            <div className="venue-row-main">
                <h1 className="venue-row-text">{venueName}</h1>
                <button className="expand-row-button" onClick={(e) => { 
                    e.stopPropagation(); // Prevents the event from bubbling up
                    toggleBookingDates(); // Correctly toggles the state
                }}>
                    <FontAwesomeIcon
                        icon={isOpen ? faSquareCaretUp : faSquareCaretDown} 
                        className="caret-icon"
                    />
                </button>
            </div>
            <div className={`popup ${isOpen ? "open" : "closed"}`}>
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
            </div>
        </div>
    );
}

export default VenueRow;