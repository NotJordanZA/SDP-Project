import '../styles/Venues.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSliders} from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import ReactSlider from 'react-slider';
import Select from 'react-select';

export default function Search({venueList, setVenueList, bookingsList }) {

    const [searchInput, setSearchInput] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedCampusOption, setSelectedCampusOption] = useState("");
    const [selectedVenueTypeOption, setSelectedVenueTypeOption] = useState("");
    const [selectedClosureOption, setSelectedClosureOption] = useState(false);
    const [selectedTimeOptions, setSelectedTimeOptions] = useState([]);
    const [selectedCapacity, setSelectedCapacity] = useState(0);

    const searchVenue = () => {
        setVenueList(venueList.filter((venue) => venue.venueName.toLowerCase().includes(searchInput.toLowerCase())));
    }

    const filterVenues = () => {
        setVenueList(venueList.filter((venue) => {
            const matchingBookings = bookingsList.filter(booking => booking.venueID === venue.venueName);
            var matchesCampus = false;
            var matchesVenueType = false;
            var matchesClosureStatus = false;
            var matchesTime = false;
            var matchesCapacity = false;

            if (!selectedCampusOption){
                matchesCampus = true;
            }else{
                matchesCampus = venue.campus.toLowerCase().includes(selectedCampusOption.value);
            }
            if (!selectedVenueTypeOption){
                matchesVenueType = true;
            }else{
                matchesVenueType = venue.venueType.toLowerCase().includes(selectedVenueTypeOption.value);
            }
            if(!selectedTimeOptions || selectedTimeOptions.length === 0){
                matchesTime = true;
            }else{
                matchesTime = selectedTimeOptions.every(selectedTime => {
                    const slotStart = new Date(`1970-01-01T${selectedTime.value}:00`); 
                    const slotEnd = new Date(slotStart.getTime() + 45 * 60000);
    
                    // Check if the selected time does not overlap with any existing booking
                    return !matchingBookings.some(booking => {
                        const bookingStart = new Date(`1970-01-01T${booking.bookingStartTime}:00`);
                        const bookingEnd = new Date(`1970-01-01T${booking.bookingEndTime}:00`);
                        
                        // Check for overlap
                        return (slotStart >= bookingStart && slotStart < bookingEnd) || 
                            (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
                            (slotStart <= bookingStart && slotEnd >= bookingEnd);
                    });
                });
            }
            if (!selectedClosureOption){
                matchesClosureStatus = true;
            }else{
                if(venue.isClosed === selectedClosureOption.value){
                    matchesClosureStatus = true;
                }else{
                    matchesClosureStatus = false;
                }
            }
            if (!selectedCapacity){
                matchesCapacity = true;
            }else{
                if(selectedCapacity<venue.venueCapacity){
                    matchesCapacity = true;
                }else{
                    matchesCapacity = false;
                }
            }

            return matchesCampus && matchesVenueType && matchesClosureStatus && matchesTime && matchesCapacity;
        }));
    }

    const handleInputChange = (event) => {
        setSearchInput(event.target.value);
    };

    const handleCapacityChange = (event) => {
        const newCapacityValue = event.target.value;
        setSelectedCapacity(newCapacityValue);
        console.log(selectedCapacity);
    }

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
        {value:false, label:"Open"},
        {value:true, label:"Closed"}
    ]

    const timeOptions = [
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
        <div className="greater-search-container">
            <div className="search-container">
                <div className="main-search-row">
                    <input className="search-input" placeholder='Search...' value={searchInput} onChange={handleInputChange}/>
                    <button className="search-row-button" onClick = {searchVenue}><FontAwesomeIcon icon={faSearch}/></button>
                    <button className="search-row-button" onClick = {toggleFilterDropwdown}><FontAwesomeIcon icon={faSliders}/></button>
                </div>
                <div className={`filter-dropdown ${isFilterOpen ? "open" : "closed"}`}>
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
            </div>
        </div>
    )
}