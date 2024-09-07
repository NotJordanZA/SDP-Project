import '../styles/Venues.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSliders} from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";

export default function Search({venueList, setVenueList }) {

    const [searchInput, setSearchInput] = useState("");

    const searchVenue = () => {
        setVenueList(venueList.filter((venue) => venue.venueName.toLowerCase().includes(searchInput.toLowerCase())));
    }

    const handleInputChange = (event) => {
        setSearchInput(event.target.value);
      };

    return (
        <div className="greater-search-container">
            <div className="search-container">
                <input className="search-input" placeholder='Search...' value={searchInput} onChange={handleInputChange}/>
                <button className="search-row-button" onClick = {searchVenue}><FontAwesomeIcon icon={faSearch}/></button>
                <button className="search-row-button"><FontAwesomeIcon icon={faSliders}/></button>
            </div>
        </div>
    )
}