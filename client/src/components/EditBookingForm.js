import React, { useEffect, useState } from 'react';
import '../styles/EditBookingPopupForm.css';
import Select from 'react-select';
import { getAllBookings } from '../utils/getAllBookingsUtil';
import { makeBooking } from '../utils/makeBookingUtil';
import { deleteBooking } from '../utils/deleteBookingUtil';
import { getAllVenues } from "../utils/getAllVenuesUtil";
import { updateBooking } from '../utils/putBookingUitl';

export const EditBookingForm = ({ id, venueName, bookingDate, bookingTime, bookingDescription, onClose, isOpen, isAdmin, bookerEmail, setBookingsList, getBookings}) => {
  const [selectedVenueName, setSelectedVenueName] = useState(venueName);
  const [selectedBookingDate, setSelectedBookingDate] = useState(bookingDate.replace(/:/g, '-'));
  const [selectedBookingDescription, setSelectedBookingDescription] = useState(bookingDescription);
  const [bookingStartTime, setBookingStartTime] = useState(bookingTime.substring(0, 5));
  const [bookingEndTime, setBookingEndTime] = useState(bookingTime.substring(6, 11));
  const [existingBookings, setExistingBookings] = useState([]);
  const [venuesList, setVenuesList] = useState('');
  const [uniqueVenues, setUniqueVenues] = useState([]);
  

  useEffect(()=>{
    if(isOpen){
      getAllVenues(setVenuesList, null);
    }
  }, [isOpen])

  useEffect(()=>{
    if(venuesList.length !== 0){
      setUniqueVenues([...new Set(venuesList.map(venue => venue.venueName))]);
    }
  }, [venuesList])
  

  useEffect(() => {
    if(bookingStartTime !== "" && bookingEndTime !== ""){
        const startTime = new Date(`1970-01-01T${bookingStartTime}:00`);
        const endTime = new Date(`1970-01-01T${bookingEndTime}:00`);
        if(startTime > endTime){
            alert("Please ensure the Booking End Time is later than the Booking Start Time");
            setBookingEndTime("");
            return;
        }
    }
  }, [bookingStartTime, bookingEndTime])

  useEffect(()=>{
    getAllBookings(null, setExistingBookings);
  },[])

  const onFormClose = () => {
    setSelectedVenueName(venueName);
    setSelectedBookingDate(bookingDate);
    setSelectedBookingDescription(bookingDescription);
    onClose();
  }

  // Checks if two dates are on the same day
  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };
  
  const isBookingConflict = () => {
    if (!Array.isArray(existingBookings) || existingBookings.length === 0) {
      console.log('No bookings to check against');
      return false; // No bookings to check against
    }
  
    return existingBookings.some(existingBooking => {
      const existingBookingStart = new Date(`${existingBooking.bookingDate}T${existingBooking.bookingStartTime}`);
      const existingBookingEnd = new Date(`${existingBooking.bookingDate}T${existingBooking.bookingEndTime}`);
      const newBookingStart = new Date(`${selectedBookingDate}T${bookingStartTime}`);
      const newBookingEnd = new Date(`${selectedBookingDate}T${bookingEndTime}`);
  
      console.log("Checking venue:", existingBooking.venueID, "against", venueName);
      console.log("Checking date:", newBookingStart, "against", existingBookingStart);
  
      // Ensure the venues are the same
      const isSameVenue = existingBooking.venueID === venueName;
      
      // Check if the dates are on the same day
      const isSameBookingDay = isSameDay(newBookingStart, existingBookingStart);
  
      if (!isSameVenue || !isSameBookingDay) {
        console.log('No conflict for this booking');
        return false; // Skip if not the same venue or not the same day
      }
  
      // Check if there is an overlap in time
      const isTimeConflict = (
        (newBookingStart >= existingBookingStart && newBookingStart < existingBookingEnd) || 
        (newBookingEnd > existingBookingStart && newBookingEnd <= existingBookingEnd) || 
        (newBookingStart <= existingBookingStart && newBookingEnd >= existingBookingEnd)
      );
  
      if (isSameVenue && isSameBookingDay && isTimeConflict && existingBooking.id !== id) {
        console.log('Conflict detected for booking:', existingBooking);
        return true;
      } else {
        console.log('No conflict for this booking');
        return false;
      }
    });
  };
  

  // saving the updated booking
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form for booking overlaps
    if (isBookingConflict()) {
      console.log(isBookingConflict());
      alert('A booking with the same date, time, and venue already exists.');
      return;
    }

    // Check if ID will remain the same
    if (venueName === selectedVenueName && bookingTime.substring(0, 5) === bookingStartTime && bookingDate === selectedBookingDate) {
        updateBooking(id, bookerEmail, selectedVenueName, selectedBookingDate, bookingStartTime, bookingEndTime, selectedBookingDescription, null, null, null, setExistingBookings)
    }else{
      // Make a new booking with the updated details
      makeBooking(bookerEmail, selectedVenueName, selectedBookingDate, bookingStartTime, bookingEndTime, selectedBookingDescription, null, null, null, setExistingBookings);
      // Delete the outdated booking
      deleteBooking(id, setExistingBookings, bookerEmail);
    }
    
    // Identify the fields that have changed
    const changes = [];
    if (bookingTime.substring(0, 5) !== bookingStartTime) {
      changes.push(`bookingStartTime: ${bookingTime.substring(0, 5)} -> ${bookingStartTime}`);
    }
    if (bookingTime.substring(6, 11) !== bookingEndTime) {
      changes.push(`bookingEndTime: ${bookingTime.substring(6, 11)} -> ${bookingEndTime}`);
    }
    if (bookingDescription !== selectedBookingDescription) {
      changes.push(`bookingDescription: ${bookingDescription} -> ${selectedBookingDescription}`);
    }
    if (bookingDate !== selectedBookingDate) {
      changes.push(`bookingDate: ${bookingDate} -> ${selectedBookingDate}`);
    }
    if (venueName !== selectedVenueName) {
      changes.push(`venueID: ${venueName} -> ${selectedVenueName}`);
    }
  
    // Create the notification
    const notification = {
      dateCreated: new Date().toLocaleString(),
      notificationMessage: `This is to inform you that your booking details have been updated by the admin.
    These are the updated booking details: ${changes.join(', ')}.
    New details: venue: ${selectedVenueName}, Date: ${selectedBookingDate}, Start Time: ${bookingStartTime}, End Time: ${bookingEndTime}, Description: ${selectedBookingDescription}.`,
      notificationType: "Booking Details Updated",
      read: false,
      recipientEmail: bookerEmail, // Assuming the booking details contain the venueBookerEmail
    };

    console.log('Notification to be sent:', notification); // Log the notification data

    const notificationResponse = await fetch('/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.REACT_APP_API_KEY,
      },
      body: JSON.stringify(notification),
    });

    if (!notificationResponse.ok) {
      const errorText = await notificationResponse.text();
      console.error('Error creating notification:', errorText);
      throw new Error('Failed to create notification');
    }
    getBookings(bookerEmail, setBookingsList);
    alert('Form submitted successfully');
    onClose();
  };

  const venueOptions = uniqueVenues.map((venue) => ({
    value: venue,
    label: venue
  }));

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

  if (!isOpen) return null;

  return (
    <div className="popup-overlay" data-testid = "popup-overlay" onClick = {(e) => e.stopPropagation()}>
      <div className="popup-content" data-testid = "popup-content">
        <button className="close-button" onClick={onFormClose}>X</button>
        <h2>Booking</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="VenueName">Venue Name:</label>
            {isAdmin? (
            <Select
                value={findOption(venueOptions, selectedVenueName)}
                onChange={(selectedOption) => setSelectedVenueName(selectedOption?.value || '')}
                options={venueOptions}
                isClearable={false}
                isMulti={false}
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
            ):(
              <p><strong>{venueName}</strong></p>
            )}
            <label htmlFor="BookingDate">Booking Date:</label>
            <input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              max={(new Date((new Date().getFullYear().toString())+"-12-31")).toISOString().split('T')[0]} 
              value = {selectedBookingDate}
              onChange={(e) => setSelectedBookingDate(e.target.value)}
              required
            />
            <label htmlFor="BookingTime">{isAdmin? "Booking Time:":"Booking Start Time:"}</label>
            {isAdmin? (
              <div className="form-times-container">
                <input className= 'times-input' placeholder='Start Time' type="time" value={bookingStartTime} onClick={(e) => { e.stopPropagation();}} onChange={ (e) => {setBookingStartTime(e.target.value);}}></input>
                  to
                <input className= 'times-input' placeholder='End Time' type="time" min={bookingStartTime} value={bookingEndTime} onClick={(e) => { e.stopPropagation();}} onChange={ (e) => {setBookingEndTime(e.target.value)}}></input>
             </div>
            ):(
              <Select
                defaultValue={findOption(timeOptions, bookingStartTime)}
                onChange={(selectedOption) => setBookingStartTime(selectedOption?.value || '')}
                options={timeOptions}
                isClearable={false}
                isMulti={false}
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
            )}
            <label htmlFor="BookingDescription">Booking Description:</label>
            <input 
              value = {selectedBookingDescription}
              onChange={(e) => setSelectedBookingDescription(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button">Submit</button>
        </form>
      </div>
    </div>
  );
};

