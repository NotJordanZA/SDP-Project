import TextButton from "../components/styledButtons";
import '../styles/Venues.css';
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCaretDown, faSquareCaretUp} from '@fortawesome/free-solid-svg-icons';

function VenueRow({venueName, campus, venueType, venueCapacity, timeSlots}) {

    const [isOpen, setIsOpen] = useState(false);

    const toggleBookingDates = () => setIsOpen(!isOpen);

    const [timeSlotsArray, setTimeSlotsArray] = useState([]);
    
    useEffect(() => {
        setTimeSlotsArray(timeSlots);
    }, []);

    const timeSlotButtons = [];
    //Map the elements of venueList onto VenueRow components and push them to an array
    {timeSlotsArray.map((time) => (
        timeSlotButtons.push(
            <button  key={time} className="timeslot-button">{time}</button>
        )
    ))}

    return(
        <div className="venue-row-content" onClick={() => toggleBookingDates()}>
            <div className="venue-row-main">
                <h1 className="venue-row-text">{venueName}</h1>
                <button className="expand-row-button" onClick={() => setIsOpen}>
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