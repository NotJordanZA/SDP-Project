import '../styles/Venues.css';
// import { getCurrentDatesBookings } from "../utils/getCurrentDatesBookingsUtil";
import { makeBooking } from '../utils/makeBookingUtil';
import { putVenue } from '../utils/putVenueUtil';
import { deleteVenue } from '../utils/deleteVenueUtil';
import { VenueForm } from './VenueForm';
import { createSchedule } from '../utils/createScheduleUtil';
import { createNotification } from '../utils/createNotificationUtil';
import { useState, useEffect, useRef } from "react";
import { auth } from "../firebase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCaretDown, faSquareCaretUp} from '@fortawesome/free-solid-svg-icons';

function VenueRow({id, buildingName, venueName, campus, venueType, venueCapacity, timeSlots, isClosed, bookings, relevantDate, setBookingsList, isAdmin, isManaging, getAllVenues, isScheduling, schedules, setSchedules, allVenues}) {

    const user = auth.currentUser;
    const [isVenueOpen, setIsVenueOpen] = useState(false);
    const [isBooking, setIsBooking] = useState(false);
    const [bookingTime, setBookingTime] = useState("");
    const [customEndTime, setCustomEndTime] = useState("");
    const [bookingEndingTime, setBookingEndingTime] = useState("");
    const [bookingDescriptionText, setBookingDescriptionText] = useState("");
    const [bookerEmail, setBookerEmail] = useState("");
    const [timeSlotsArray, setTimeSlotsArray] = useState([]);
    const [isVenueFormOpen, setIsVenueFormOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null); // eslint-disable-next-line
    const [errorMessage, setErrorMessage] = useState(""); 
    const [clickedScheduleEmail, setClickedScheduleEmail] = useState("");
    const [clickedScheduleDescription, setClickedScheduleDescription] = useState("");
    const [suggestedVenues, setSuggestedVenues] = useState([]);

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]; //schedule table columns

    //now check if a venue has a parrticular timeslot already scheduled
    const isTimeSlotTaken = (venueName, day, time) => {
        return schedules.some(
        (schedule) =>
            schedule.venueID === venueName &&
            schedule.bookingDay === day &&
            schedule.bookingStartTime === time
        );
    };

    const handleTimeSlotClick = (venueID, venueName, day, time) => {
        const clickedSchedule = schedules.find(
            (schedule) =>
                schedule.venueID === venueName &&
                schedule.bookingDay === day &&
                schedule.bookingStartTime === time
        );
        
        if (clickedSchedule) {
            setSelectedSlot({});
            setClickedScheduleEmail(clickedSchedule.venueBooker || "No email available");
            setClickedScheduleDescription(clickedSchedule.bookingDescription || "No description available");
        } else {
            setClickedScheduleEmail("");
            setClickedScheduleDescription("");
            setSelectedSlot({ venueID, venueName, day, time });
        }
    };
    
    const venueInfo = {
        venueName: venueName,
        campus: campus,
        capacity: venueCapacity,
        timeSlots: timeSlots,
    };


    const handleScheduleButtonClick = async () => {
        const [hours, minutes] = selectedSlot.time.split(':');
        const startTime = new Date();
        startTime.setHours(hours);
        startTime.setMinutes(minutes);
        const endTime = new Date(startTime.getTime() + 45 * 60000);
        if (bookingDescriptionText !== "" && bookerEmail !== ""){
            const scheduleData= {
                venueID: venueName,
                venueBooker: bookerEmail,
                bookingDay: selectedSlot.day,
                bookingStartTime: selectedSlot.time,
                bookingEndTime: endTime.toTimeString().substring(0, 5), // Format as "HH:MM"
                bookingDescription: bookingDescriptionText,
            };    
            createSchedule(scheduleData);
            setSchedules(schedules.concat(scheduleData));
            // Create notification data
            const notificationMessage = `A recurring booking has been made in your name by the admin. Booking details: Venue: ${venueName}, Day: Every ${selectedSlot.day}, Time: ${selectedSlot.time}-${endTime.toTimeString().substring(0, 5)}, Description: ${bookingDescriptionText}.`;
            
            const notificationData = {
            dateCreated: new Date().toLocaleString(),
            notificationMessage,
            notificationType: 'Recurring Booking Confirmation',
            read: false,
            recipientEmail: bookerEmail,
            };
    
            // Send notification to the server
            createNotification(notificationData);
        }else{
            const scheduleData = {
                venueID: venueName,
                venueBooker: null,
                bookingDay: selectedSlot.day,
                bookingStartTime: selectedSlot.time,
                bookingEndTime: endTime.toTimeString().substring(0, 5), // Format as "HH:MM"
                bookingDescription: null,
            }; 
            createSchedule(scheduleData);
        }
        setIsVenueOpen(false);
    }

    const toggleVenueForm = () => {
        setIsVenueFormOpen(!isVenueFormOpen);
    }

    const toggleIsBooking = () => {
        setIsBooking(!isBooking);
    } //Toggles booking requirements dropdown

    const toggleBookingDetails = () => setIsVenueOpen(!isVenueOpen); //Toggles venue details dropdown
    
    useEffect(() => { // Populates list with the venues time slots
        setTimeSlotsArray(timeSlots);// eslint-disable-next-line
    }, []);

    const firstRender = useRef(true);

    useEffect(() => {
        if(bookingTime !== "" && customEndTime !== ""){
            const startTime = new Date(`1970-01-01T${bookingTime}:00`);
            const endTime = new Date(`1970-01-01T${customEndTime}:00`);
            if(startTime > endTime){
                alert("Please ensure the Booking End Time is later than the Booking Start Time");
                setCustomEndTime("");
                return;
            }
            setIsBooking(true);
        }
    }, [bookingTime, customEndTime])


    useEffect(() => {
        // Debugging: Log the entire allVenues array to ensure it's populated
        console.log("All venues:", allVenues);
    
        // Normalize campus to lowercase and ensure capacity is a number before comparison
        const filteredVenues = allVenues
            .filter((venue) => {
                // Normalize the campus comparison to lowercase, and ensure capacities are numbers
                const isSameCampus = venue.campus.toLowerCase() === campus.toLowerCase();
                const isSameCapacity = Number(venue.capacity) === Number(venueCapacity);
                const isDifferentVenue = venue.venueName !== venueName;
                return isSameCampus && isSameCapacity && isDifferentVenue;
            })
            .slice(0, 3); // Get up to 3 venues
    
        // Debugging: Log the filtered venues
        console.log("Filtered suggested venues:", filteredVenues);
    
        setSuggestedVenues(filteredVenues);
    }, [allVenues, campus, venueCapacity, venueName]);
    
    
    useEffect(() => {
        if (firstRender.current){// Doesn't run on first render in order to give bookingTime and bookingEndTime time to reflect changes
            firstRender.current = false;
            return;
        }
        const compileBookingData = async () => { // Gets all information needed for a booking together and calls the makeBooking function
            const booker = isAdmin ? bookerEmail : user.email; // Gets entered booker email or user email
    
            if (bookingDescriptionText !== "" && booker !== ""){
                makeBooking(booker, venueName, relevantDate, bookingTime, bookingEndingTime, bookingDescriptionText, setIsVenueOpen, toggleIsBooking, setBookingDescriptionText, setBookingsList);
                if(bookerEmail !== user.email){
                    // Create notification data
                    const notificationMessage = `A booking has been made in your name by the admin. Booking details: venueID: ${venueName}, bookingDate: ${relevantDate}, bookingStartTime: ${bookingTime}, bookingEndTime: ${bookingEndingTime}, bookingDescription: ${bookingDescriptionText}`;
                    const notificationData = {
                        dateCreated: new Date().toLocaleString(),
                        notificationMessage,
                        notificationType: 'Booking Confirmation',
                        read: false,
                        recipientEmail: booker,
                    };

                    console.log('Sending notification data:', notificationData);

                    // Send notification data to the server
                    createNotification(notificationData);
                }
            }
            else{
                makeBooking(null, venueName, relevantDate, bookingTime, bookingEndingTime, null, setIsVenueOpen, toggleIsBooking, setBookingDescriptionText, setBookingsList);;
            }
        }
        if (bookingTime && bookingEndingTime) { // If updated, compileBookingData
            compileBookingData();
            setBookingTime("");
            setCustomEndTime("");
            setBookerEmail("");
            setIsBooking(false);
        }// eslint-disable-next-line
    }, [bookingEndingTime]); // Runs whenever bookingEndTime changes

    const toggleVenueClosure = () => {
        putVenue(id, buildingName, venueName, campus, venueType, venueCapacity, timeSlots, !isClosed, getAllVenues);
        toggleBookingDetails();
    }

    const updateBookingEndTime = () => { // Sets bookingEndTime to be 45 minutes after the selected time
        const slotEnd = new Date((new Date(`1970-01-01T${bookingTime}:00`)).getTime() + 45 * 60000); // Convert to Date for easier comparisions
        setBookingEndingTime(((slotEnd.getHours() < 10 ? '0' : '') + slotEnd.getHours())+":"+((slotEnd.getMinutes() < 10 ? '0' : '') + slotEnd.getMinutes()));// Puts time in the correct format, hh:mm
    }

    const updateCustomEndTime = (time) => { // Sets bookingEndTime to be 45 minutes after the selected time
        const slotEnd = new Date((new Date(`1970-01-01T${time}:00`)).getTime() + 45 * 60000); // Convert to Date for easier comparisions
        setCustomEndTime(((slotEnd.getHours() < 10 ? '0' : '') + slotEnd.getHours())+":"+((slotEnd.getMinutes() < 10 ? '0' : '') + slotEnd.getMinutes()));// Puts time in the correct format, hh:mm
    }

    const isTimeSlotInactive = (timeSlot) => { // Checks whether there is an existing booking during the current time slot
        const slotStart = new Date(`1970-01-01T${timeSlot}:00`); // Convert to Date for easier comparisions
        const slotEnd = new Date(slotStart.getTime() + 45 * 60000); // Sets bookingEndTime to be 45 minutes after the selected time
    
        return bookings.some(booking => {// Returns true or false based on if the time slot has a booking within it
            const bookingStart = new Date(`1970-01-01T${booking.bookingStartTime}:00`); // Convert to Date for easier comparisions
            const bookingEnd = new Date(`1970-01-01T${booking.bookingEndTime}:00`); // Convert to Date for easier comparisions
    
            return (slotStart >= bookingStart && slotStart < bookingEnd) || // Returns false if the time slot has no overlap with a booking
                (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
                (slotStart <= bookingStart && slotEnd >= bookingEnd);
        });
    };

    const timeSlotButtons = timeSlotsArray.map((time) => {// populates a list with buttons corresponding to all time slots
        const buttonClass = isTimeSlotInactive(time) ? "timeslot-button booked" : ((time === bookingTime && isBooking) ? "timeslot-button clicked" : "timeslot-button"); // Greys out a button if the time slot has a booking within its duration
        return (
            <button  
                key={time} 
                className={buttonClass}
                onClick={(e) => { e.stopPropagation(); // Prevents button from toggling dropdown
                    toggleIsBooking(); // Toggles booking state
                    setBookingTime(time); // Sets the currently selected time
                    updateCustomEndTime(time); // Sets the end time
                 }}>
                {time}
            </button>
        );
    });

    const conditionalDropdown = (isClosed) => { // Checks whether a venue is open or closed, prevents dropdown from opening if closed
        if (isClosed && !isManaging){
            return(
                <div className="closed-marker">
                    CLOSED
                </div>
            )
        }
        else{
            return(
                <button className="expand-row-button" onClick={(e) => { 
                    e.stopPropagation(); // Prevents button from toggling dropdown
                    toggleBookingDetails(); // Toggles the state
                }}>
                    <FontAwesomeIcon
                        icon={(isVenueOpen && (!isClosed || isManaging)) ? faSquareCaretUp : faSquareCaretDown} 
                        className="caret-icon"
                    />
                </button>
            )
        }
    }

    return(
        <div className="venue-row-content" onClick={() => toggleBookingDetails()}>
            <VenueForm 
                isOpen = {isVenueFormOpen}
                onClose = {toggleVenueForm}
                id = {id} 
                buildingName = {buildingName}
                venueName = {venueName}
                campus = {campus}
                venueType = {venueType}
                venueCapacity = {venueCapacity}
                timeSlots = {timeSlots}
                isClosed = {isClosed}
                getAllVenues={getAllVenues}
             />
            <div className="venue-row-main">
                <h1 className="venue-row-text">{venueName}</h1>
                {conditionalDropdown(isClosed)}
            </div>
            <div className={`popup ${(isVenueOpen && (!isClosed || isManaging)) ? "open" : "closed"}`} onClick = {(e) => e.stopPropagation()}>{/* Conditional rendering for booking fields */}
                {!isScheduling ? (
                <div>
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
                    {isManaging &&(
                        <div className="venue-info-container">
                        <div className="venue-info-text-category">
                            Closure Status: 
                        </div>
                        <div className="venue-info-text">
                            {isClosed ? "Closed" : "Open"}
                        </div>
                    </div>
                    )}
                    {!isManaging ? (
                        <div>
                            <div className="timeslot-buttons-container">
                                {timeSlotButtons}
                            </div>
                            {isAdmin ? (
                                <div>
                                    <div className="venue-info-container">
                                        <div className="venue-info-text-category">
                                            Custom Times?
                                        </div>
                                    </div>
                                    <div className="times-input-container">
                                        <input className= 'times-input' placeholder='Start Time' type="time" value={bookingTime} onClick={(e) => { e.stopPropagation();}} onChange={ (e) => {setBookingTime(e.target.value);}}></input>
                                        to
                                        <input className= 'times-input' placeholder='End Time' type="time" min={"14:15"} value={customEndTime} onClick={(e) => { e.stopPropagation();}} onChange={ (e) => {setCustomEndTime(e.target.value)}}></input>
                                    </div>
                                    <div className="alternative-venues-container">
    <label className="alternative-venues-label">Alternative Venues</label>
    {suggestedVenues.length > 0 ? (
        <ul className="alternative-venues-list">
            {suggestedVenues.map((venue) => (
                <li className="alternative-venues-item" key={venue.venueName}>
                    {venue.venueName} (Capacity: {venue.capacity})
                </li>
            ))}
        </ul>
    ) : (
        <p>No similar venues available.</p> // Message if no venues match the criteria
    )}
</div>

                                    <div className="admin-book-action-container">
                                        <textarea className={`description-input ${isBooking ? "shown" : "hidden"}`} data-testid = 'description-input-id' value = { bookingDescriptionText } onChange={(e) => setBookingDescriptionText(e.target.value)} required placeholder="Input a booking description" onClick={(e) => e.stopPropagation()}></textarea>
                                        <input className={`email-input ${isBooking ? "shown" : "hidden"}`} data-testid = 'email-input-id' value = { bookerEmail } onChange={(e) => setBookerEmail(e.target.value)} required placeholder="Input booker email" onClick={(e) => e.stopPropagation()}></input>
                                        <button className={`book-button ${isBooking ? "shown" : "hidden"}`} onClick={(e) => { e.stopPropagation(); setBookingEndingTime(customEndTime);}}>Book</button>
                                    </div>
                                </div>
                            ):(
                                <div className="book-action-container">
                                    <textarea className={`description-input ${isBooking ? "shown" : "hidden"}`} data-testid = 'description-input-id' value = { bookingDescriptionText } onChange={(e) => setBookingDescriptionText(e.target.value)} required placeholder="Input a booking description" onClick={(e) => e.stopPropagation()}></textarea>
                                    <button className={`book-button ${isBooking ? "shown" : "hidden"}`} onClick={(e) => { e.stopPropagation(); updateBookingEndTime();}}>Book</button>
                                </div>
                            )}
                        </div>
                    ):(
                        <div className='admin-management-container'>
                            <button className='management-button' onClick={toggleVenueForm}>Edit</button>
                            <button className='management-button' onClick={() => deleteVenue(id, getAllVenues)}>Delete</button>
                            {!isClosed ? (
                                <button className='management-button' onClick = {()=>toggleVenueClosure()}>Close</button>
                            ):(
                                <button className='management-button' onClick = {()=>toggleVenueClosure()}>Open</button>
                            )}
                        </div>
                    )}
                </div>
                ):(
                    <div className='schedules-container'>
                        <table className="schedules-table">
                            <thead>
                                <tr>
                                {/* Top-left corner */}
                                <th className="corner-top-left">Time</th>
                                {daysOfWeek.map((day, index) => (
                                    /* Top-right corner */
                                    <th key={day} className={index === daysOfWeek.length - 1 ? "corner-top-right" : ""}>
                                    {day}
                                    </th>
                                ))}
                                </tr>
                            </thead>
                            <tbody>
                                {timeSlots.map((time, rowIndex) => (
                                <tr key={time}>
                                    {/* Bottom-left corner */}
                                    <th className={rowIndex === timeSlots.length - 1 ? "corner-bottom-left" : ""}>{time}</th>
                                    {daysOfWeek.map((day, colIndex) => (
                                    /* Bottom-right corner */
                                    <td
                                        key={day}
                                        className={
                                        `${isTimeSlotTaken(venueName, day, time)
                                            ? 'scheduled'
                                            : selectedSlot && selectedSlot.venueID === id && selectedSlot.day === day && selectedSlot.time === time
                                            ? 'selected'
                                            : 'available'} ` + 
                                        `${rowIndex === timeSlots.length - 1 && colIndex === daysOfWeek.length - 1 ? "corner-bottom-right" : ""}`
                                        }
                                        onClick={() => handleTimeSlotClick(id, venueName, day, time)}
                                    >
                                        {isTimeSlotTaken(venueName, day, time) ? 'Scheduled' : 'Available'}
                                    </td>
                                    ))}
                                </tr>
                                ))}
                            </tbody>
                        </table>
                        {clickedScheduleEmail && clickedScheduleDescription &&(
                            <div className="schedule-details">
                                <h3>Schedule Details</h3>
                                <p><strong>Email:</strong> {clickedScheduleEmail}</p>
                                <p><strong>Description:</strong> {clickedScheduleDescription}</p>
                            </div>
                        )}
                        {selectedSlot && selectedSlot.venueID === id && (
                            <div className="admin-book-action-container">
                                <textarea className="description-input" data-testid = 'description-input-id' value = { bookingDescriptionText } onChange={(e) => setBookingDescriptionText(e.target.value)} required placeholder="Input a schedule description" onClick={(e) => e.stopPropagation()}></textarea>
                                <input className="email-input" data-testid = 'email-input-id' value = { bookerEmail } onChange={(e) => setBookerEmail(e.target.value)} required placeholder="Input schedule holder email" onClick={(e) => e.stopPropagation()}></input>
                                <button className="book-button" onClick={(e) => { e.stopPropagation(); handleScheduleButtonClick();}}>Schedule</button>
                                {/*error message on the card*/}
                                {errorMessage && <p className="adminrecurringbookings-error-message">{errorMessage}</p>}
                            </div>
                        )}
                    </div>
                )}
                
            </div>
        </div>
    );
}

export default VenueRow;