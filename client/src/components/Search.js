import '../styles/Venues.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSliders} from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import ReactSlider from 'react-slider';
import Select from 'react-select';
import { VenueForm } from './VenueForm';

export default function Search({venueList, setVenueList, bookingsList, isManaging, setIsManaging, isAdmin, getAllVenues, toggleIsScheduling, isScheduling, ...props }) { //A function for searching and filtering venues
    const [searchInput, setSearchInput] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedCampusOption, setSelectedCampusOption] = useState("");
    const [selectedVenueTypeOption, setSelectedVenueTypeOption] = useState("");
    const [selectedClosureOption, setSelectedClosureOption] = useState(false);
    const [selectedTimeOptions, setSelectedTimeOptions] = useState([]);
    const [selectedCapacity, setSelectedCapacity] = useState(0);
    const [isVenueFormOpen, setIsVenueFormOpen] = useState(false);

    const toggleVenueForm = () => {
        setIsVenueFormOpen(!isVenueFormOpen);
    }

    const searchVenue = () => { // Returns all venues with names that match the user's search, ignoring case
        setVenueList(venueList.filter((venue) => venue.venueName.toLowerCase().includes(searchInput.toLowerCase())));
    }

    const filterVenues = () => { // Returns all venues with fields that match the filter conditions selected by the user
        setVenueList(venueList.filter((venue) => {
            const matchingBookings = bookingsList.filter(booking => booking.venueID === venue.venueName); // Gets bookings for current venue
            var matchesCampus = false;
            var matchesVenueType = false;
            var matchesClosureStatus = false;
            var matchesTime = false;
            var matchesCapacity = false;

            if (!selectedCampusOption){ // If nothing is entered this field is true so that it is not considered in filter
                matchesCampus = true;
            }else{ // Checks that the campus matches what the user selected
                matchesCampus = venue.campus.toLowerCase().includes(selectedCampusOption.value);
            }
            if (!selectedVenueTypeOption){ // If nothing is entered this field is true so that it is not considered in filter
                matchesVenueType = true;
            }else{ // Checks that the Venue Type matches what the user selected
                matchesVenueType = venue.venueType.toLowerCase().includes(selectedVenueTypeOption.value);
            }
            if(!selectedTimeOptions || selectedTimeOptions.length === 0){ // If nothing is entered this field is true so that it is not considered in filter
                matchesTime = true;
            }else{ // Checks whether the times selected by the user are available at this venue
                matchesTime = selectedTimeOptions.every(selectedTime => {
                    const slotStart = new Date(`1970-01-01T${selectedTime.value}:00`);  // Convert to Date for easier comparisions
                    const slotEnd = new Date(slotStart.getTime() + 45 * 60000); // Get the ending time of the slot
    
                    // Check if the selected time does not overlap with any existing booking
                    return !matchingBookings.some(booking => {
                        const bookingStart = new Date(`1970-01-01T${booking.bookingStartTime}:00`); //Convert to Date for easier comparisions
                        const bookingEnd = new Date(`1970-01-01T${booking.bookingEndTime}:00`); //Convert to Date for easier comparisions
                        
                        // Check for overlap
                        return (slotStart >= bookingStart && slotStart < bookingEnd) || 
                            (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
                            (slotStart <= bookingStart && slotEnd >= bookingEnd);
                    });
                });
            }
            if (!selectedClosureOption){ // If nothing is entered this field is true so that it is not considered in filter
                matchesClosureStatus = true;
            }else{
                if(venue.isClosed === selectedClosureOption.value){ // Checks that the Closure Status matches what the user selected
                    matchesClosureStatus = true;
                }
            }
            if (!selectedCapacity){ // If nothing is entered this field is true so that it is not considered in filter
                matchesCapacity = true;
            }else{
                if(selectedCapacity<venue.venueCapacity){ // Checks that the capacity of the venue is equal or greater than what the user selected
                    matchesCapacity = true;
                }
            }

            return matchesCampus && matchesVenueType && matchesClosureStatus && matchesTime && matchesCapacity; // Checks that all fields are satisfied
        }));
    }

    const handleInputChange = (event) => { // For when the input in the search bar changes
        setSearchInput(event.target.value);
    };

    const toggleFilterDropwdown = () => { // Sets the state of the filter dropdown
        setIsFilterOpen(!isFilterOpen);
    }

    const campusOptions = [ //All options for campus
        {value:"east", label:"East Campus"},
        {value:"west", label:"West Campus"},
        {value:"education", label:"Education Campus"},
    ]

    const venueTypeOptions = [ //All options for venue type
        {value:"lecture venue", label:"Lecture Venue"},
        {value:"study room", label:"Study Room"},
        {value:"tutorial room", label:"Tutorial Room"},
        {value:"test venue", label:"Test Venue"},
        {value:"lab", label:"Lab"},
        {value:"theatre", label:"Theatre"},
        {value:"field", label:"Field"},
        {value:"other", label:"Other"}
    ]

    const closureOptions = [ //All options for closure status
        {value:false, label:"Open"},
        {value:true, label:"Closed"}
    ]

    const timeOptions = [ //All time slot options
        {value:"08:00", label:"08:00"},
        {value:"09:00", label:"09:00"},
        {value:"10:15", label:"10:15"},
        {value:"11:15", label:"11:15"},
        {value:"12:30", label:"12:30"},
        {value:"14:15", label:"14:15"},
        {value:"15:15", label:"15:15"},
        {value:"16:15", label:"16:15"},
    ]

    return (
        <main className="greater-search-container" {...props}>
            <VenueForm 
                isOpen = {isVenueFormOpen}
                onClose = {toggleVenueForm}
                id = {""} 
                buildingName = {""}
                venueName = {""}
                campus = {""}
                venueType = {""}
                venueCapacity = {0}
                timeSlots = {[]}
                isClosed = {""}
                getAllVenues={getAllVenues}
             />
            <div className="inner-search-container">
                <div className="main-search-row">
                    <input className="search-input" placeholder='Search...' value={searchInput} onChange={handleInputChange} data-testid='search-input'/>
                    <button className="search-row-button" onClick = {searchVenue} data-testid='search-icon-button'><FontAwesomeIcon icon={faSearch}/></button>
                    <button className="search-row-button" onClick = {toggleFilterDropwdown} data-testid='filter-icon-button'><FontAwesomeIcon icon={faSliders}/></button>
                    {isAdmin && (
                        <button className={`search-manage-button ${isManaging ? "clicked" : ""}`}
                         onClick={() => {setIsManaging(!isManaging);
                            if (isScheduling) {
                                toggleIsScheduling();
                          }}}>MANAGE</button>
                    )}
                </div>
                <div className={`filter-dropdown ${isFilterOpen ? "open" : "closed"}`}>{/* Conditional rendering for filter optoins */}
                    <div className="filter-row">
                        <p className="filter-text">Campus:</p>
                        <Select
                            defaultValue={selectedCampusOption}
                            onChange={setSelectedCampusOption}
                            options={campusOptions}
                            isClearable={true}
                            styles={{
                                control: (provided) => ({
                                  ...provided,
                                  marginRight: '20px',
                                }),
                                menu: (provided) => ({
                                  ...provided,
                                  zIndex: 9999, // Set z-index to a high value to ensure it's on top
                                }),
                            }}
                            aria-label='campus filter select'
                        />
                    </div>
                    <div className="filter-row">
                        <p className="filter-text">Venue Type:</p>
                        <Select
                            defaultValue={selectedVenueTypeOption}
                            onChange={setSelectedVenueTypeOption}
                            options={venueTypeOptions}
                            isClearable={true}
                            styles={{
                                control: (provided) => ({
                                  ...provided,
                                  marginRight: '20px',
                                }),
                                menu: (provided) => ({
                                  ...provided,
                                  zIndex: 9999, // Set z-index to a high value to ensure it's on top
                                }),
                            }}
                            aria-label='venue type filter select'
                        />
                    </div>
                    <div className="filter-row">
                        <p className="filter-text">Closure Status:</p>
                        <Select
                            defaultValue={selectedClosureOption}
                            onChange={setSelectedClosureOption}
                            options={closureOptions}
                            isClearable={true}
                            styles={{
                                control: (provided) => ({
                                  ...provided,
                                  marginRight: '20px',
                                }),
                                menu: (provided) => ({
                                  ...provided,
                                  zIndex: 9999, // Set z-index to a high value to ensure it's on top
                                }),
                            }}
                            aria-label='closure filter select'
                        />
                    </div>
                    <div className="filter-row">
                        <p className="filter-text">Available Times:</p>
                        <Select
                            defaultValue={selectedTimeOptions}
                            onChange={setSelectedTimeOptions}
                            options={timeOptions}
                            isClearable={true}
                            isMulti={true}
                            styles={{
                                control: (provided) => ({
                                  ...provided,
                                  marginRight: '20px',
                                }),
                                menu: (provided) => ({
                                  ...provided,
                                  zIndex: 9999, // Set z-index to a high value to ensure it's on top
                                }),
                            }}
                            aria-label='timeslots filter select'
                        />
                    </div>
                    <div className="filter-row">
                        <p className="filter-text">Capacity:</p>
                        <ReactSlider
                            className="capacity-slider"
                            thumbClassName="slider-thumb"
                            trackClassName="slider-track"
                            min={0}
                            max={2000}
                            value={selectedCapacity}
                            onChange={setSelectedCapacity}
                        />
                        <p className="slider-text" >
                            {selectedCapacity}
                        </p>
                    </div>
                    <div className='filter-button-container'>
                        <button className='book-button' onClick={filterVenues}>Filter</button>
                    </div>
                </div>
                {isManaging &&(
                    <div className='manage-popup-container'>
                        <button onClick={toggleVenueForm}>ADD VENUE</button>
                        <button className = {`${isScheduling ? "clicked" : ""}`} onClick={toggleIsScheduling}>SCHEDULES</button>
                    </div>
                )}
            </div>
        </main>
    )
}