import TextButton from "../components/styledButtons";
import '../styles/Venues.css'
import { useState } from "react";

function VenueRow({venueName}) {

    const [isOpen, setIsOpen] = useState(false);

    const toggleBookingDates = () => setIsOpen(!isOpen);

    return(
        <div className="venue-row-content">
            <div className="venue-row-main">
                <h1 className="venue-row-text">{venueName}</h1>
                <TextButton text={"Book"} onClickFunction={toggleBookingDates}/>
            </div>
            <div className={`popup ${isOpen ? "open" : "closed"}`}>
                <p>This is a popup!!</p>
            </div>
        </div>
    );
}

export default VenueRow;