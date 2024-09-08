import '../styles/Venues.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSliders} from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import ReactSlider from 'react-slider';
import Select from 'react-select';

export default function Search({venueList, setVenueList }) {

    const [searchInput, setSearchInput] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedCampusOption, setSelectedCampusOption] = useState("");
    const [selectedVenueTypeOption, setSelectedVenueTypeOption] = useState("");
    const [selectedClosureOption, setSelectedClosureOption] = useState("");

    const searchVenue = () => {
        setVenueList(venueList.filter((venue) => venue.venueName.toLowerCase().includes(searchInput.toLowerCase())));
    }

    const handleInputChange = (event) => {
        setSearchInput(event.target.value);
    };

    const toggleFilterDropwdown = () => {
        setIsFilterOpen(!isFilterOpen);
    }

    const campusOptions = [
        {value:"east", label:"East Campus"},
        {value:"west", label:"West Campus"}
    ]

    const venueTypeOptions = [
        {value:"lecture hall", label:"Lecture Hall"},
        {value:"study room", label:"Study Room"},
        {value:"test venue", label:"Test Venue"},
        {value:"theatre", label:"Theatre"},
        {value:"field", label:"Field"}
    ]

    const closureOptions = [
        {value:"open", label:"Open"},
        {value:"closed", label:"Closed"}
    ]

    return (
        <div className="greater-search-container">
            <div className="search-container">
                <div className="main-search-row">
                    <input className="search-input" placeholder='Search...' value={searchInput} onChange={handleInputChange}/>
                    <button className="search-row-button" onClick = {searchVenue}><FontAwesomeIcon icon={faSearch}/></button>
                    <button className="search-row-button" onClick = {toggleFilterDropwdown}><FontAwesomeIcon icon={faSliders}/></button>
                </div>
                <div className={`filter-dropdown ${isFilterOpen ? "open" : "closed"}`}>
                    <div className="filter-row">
                        <p>Campus:</p>
                        <Select
                            defaultValue={selectedCampusOption}
                            onChange={setSelectedCampusOption}
                            options={campusOptions}
                            isClearable={true}
                        />
                    </div>
                    <div className="filter-row">
                        <p>Venue Type:</p>
                        <Select
                            defaultValue={selectedVenueTypeOption}
                            onChange={setSelectedVenueTypeOption}
                            options={venueTypeOptions}
                            isClearable={true}
                        />
                    </div>
                    <div className="filter-row">
                        <p>Closure Status:</p>
                        <Select
                            defaultValue={selectedClosureOption}
                            onChange={setSelectedClosureOption}
                            options={closureOptions}
                            isClearable={true}
                        />
                    </div>
                    <div className="filter-row">
                        <p>Capacity:</p>
                        <ReactSlider
                            className="capacity-slider"
                            thumbClassName="slider-thumb"
                            trackClassName="slider-track"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}