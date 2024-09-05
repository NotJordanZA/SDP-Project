import TextButton from "../components/styledButtons";
import '../styles/Venues.css';
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCaretDown, faSquareCaretUp} from '@fortawesome/free-solid-svg-icons';

function VenueRow({venueName, campus, venueType, venueCapacity}) {

    const [isOpen, setIsOpen] = useState(false);

    const toggleBookingDates = () => setIsOpen(!isOpen);

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
            </div>
        </div>
    );
}

export default VenueRow;