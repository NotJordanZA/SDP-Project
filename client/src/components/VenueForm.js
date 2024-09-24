import React, { useEffect, useState } from 'react';
import '../styles/PopupForm.css';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { putVenue } from '../utils/putVenueUtil';

const TIME_REGEX = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

export const VenueForm = ({ id, buildingName, venueName, campus, venueType, venueCapacity, timeSlots, isClosed, onClose, isOpen, getAllVenues }) => {
  const [selectedBuildingName, setSelectedBuildingName] = useState(buildingName);
  const [selectedVenueName, setSelectedVenueName] = useState(venueName);
  const [selectedCampusOption, setSelectedCampusOption] = useState(campus);
  const [selectedVenueTypeOption, setSelectedVenueTypeOption] = useState(venueType);
  const [selectedClosureOption, setSelectedClosureOption] = useState(isClosed);
  const [selectedTimeOptions, setSelectedTimeOptions] = useState(timeSlots);
  const [selectedCapacity, setSelectedCapacity] = useState(venueCapacity);
  const [timeValidationError, setTimeValidationError] = useState(null); // To store validation error messages

  useEffect(()=>{
    setSelectedBuildingName(buildingName);
    // eslint-disable-next-line
  }, [])

  const onFormClose = () => {
    setSelectedBuildingName(buildingName);
    setSelectedVenueName(venueName);
    setSelectedCampusOption(campus);
    setSelectedVenueTypeOption(venueType);
    setSelectedCapacity(venueCapacity);
    setSelectedTimeOptions(timeSlots);
    setSelectedClosureOption(isClosed);
    setTimeValidationError(null);
    onClose();
  }

  const handleTimeChange = (selectedOptions) => {
    const customTimeSlots = selectedOptions ? selectedOptions.map(option => option.value) : [];

    const validTimeSlots = customTimeSlots.filter(time => {
      return findOption(timeOptions, time) || TIME_REGEX.test(time); // Keep valid predefined or custom times
    });

    const invalidTime = customTimeSlots.find(time => {
      // Check if the time is custom (not in predefined options) and doesn't match the regex
      return !findOption(timeOptions, time) && !TIME_REGEX.test(time);
    });

    if (invalidTime) {
      setTimeValidationError(`Invalid time format: ${invalidTime}. Please use hh:mm format.`);
    } else {
      setTimeValidationError(null); // Clear error if everything is valid
    }
    setSelectedTimeOptions(validTimeSlots);
  };

  const campusOptions = [ //All options for campus
    {value:"East", label:"East Campus"},
    {value:"West", label:"West Campus"}
  ]

  const venueTypeOptions = [ //All options for venue type
    {value:"Lecture Venue", label:"Lecture Venue"},
    {value:"Study Room", label:"Study Room"},
    {value:"Tutorial Room", label:"Tutorial Room"},
    {value:"Test Venue", label:"Test Venue"},
    {value:"Theatre", label:"Theatre"},
    {value:"Field", label:"Field"}
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

  const findOption = (options, value) => {
    return options.find(option => option.value === value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(id, selectedBuildingName, selectedVenueName, selectedCampusOption.value, selectedVenueTypeOption.value, selectedCapacity, selectedTimeOptions, selectedClosureOption.value);
    putVenue(id, selectedBuildingName, selectedVenueName, selectedCampusOption.value, selectedVenueTypeOption.value, selectedCapacity, selectedTimeOptions, selectedClosureOption.value, getAllVenues);
    alert('Form submitted successfully');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay" data-testid = "popup-overlay" onClick = {(e) => e.stopPropagation()}>
      <div className="popup-content" data-testid = "popup-content">
        <button className="close-button" onClick={onFormClose}>X</button>
        <h2>Venue</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="BuildingName">Building Name:</label>
            <input 
              value = {selectedBuildingName}
              onChange={(e) => setSelectedBuildingName(e.target.value)}
              required
            />
            <label htmlFor="VenueName">Venue Name:</label>
            <input 
              value = {selectedVenueName}
              onChange={(e) => setSelectedVenueName(e.target.value)}
              required
            />
            <label htmlFor="Campus">Campus:</label>
            <Select
              defaultValue={findOption(campusOptions, selectedCampusOption)}
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
              required
            />
            <label htmlFor="VenueType">Venue Type:</label>
            <Select
                defaultValue={findOption(venueTypeOptions, selectedVenueTypeOption)}
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
                required
            />
            <label htmlFor="Capacity">Capacity:</label>
            <input 
              value = {selectedCapacity}
              onChange={(e) => setSelectedCapacity(e.target.value)}
              required
            />
            <label htmlFor="TimeSlots">Time Slots:</label>
            <CreatableSelect
              value={selectedTimeOptions.map(slot => findOption(timeOptions, slot) || { value: slot, label: slot })}
              defaultValue={timeSlots.map((slot) => findOption(timeOptions, slot))}
              onChange={handleTimeChange}
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
              required
            />
            {timeValidationError && <p style={{ color: 'red' }}>{timeValidationError}</p>}
            <label htmlFor="isClosed">Closure Status:</label>
            <Select
              defaultValue={findOption(closureOptions, selectedClosureOption)}
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
              required
            />
          </div>
          <button type="submit" className="submit-button">Submit</button>
        </form>
      </div>
    </div>
  );
};
