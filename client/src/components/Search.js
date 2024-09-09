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
    const [selectedClosureOption, setSelectedClosureOption] = useState(false);
    const [selectedCapacity, setSelectedCapacity] = useState(0);

    const searchVenue = () => {
        setVenueList(venueList.filter((venue) => venue.venueName.toLowerCase().includes(searchInput.toLowerCase())));
    }

    const filterVenues = () => {
        setVenueList(venueList.filter((venue) => {
            var matchesCampus = false;
            var matchesVenueType = false;
            var matchesClosureStatus = false;
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
            if (!selectedClosureOption){
                matchesClosureStatus = true;
            }else{
                if(venue.isClosed == selectedClosureOption){
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

            return matchesCampus && matchesVenueType && matchesClosureStatus && matchesCapacity;
        }));
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
        {value:"lecture venue", label:"Lecture Venue"},
        {value:"study room", label:"Study Room"},
        {value:"test venue", label:"Test Venue"},
        {value:"theatre", label:"Theatre"},
        {value:"field", label:"Field"}
    ]

    const closureOptions = [
        {value:false, label:"Open"},
        {value:true, label:"Closed"}
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