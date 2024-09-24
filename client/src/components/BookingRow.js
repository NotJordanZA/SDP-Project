import '../styles/Bookings.css';
import { deleteBooking } from '../utils/deleteBookingUtil';
import { EditBookingForm } from './EditBookingForm';
import { useState } from 'react';

function BookingRow({bookingDate, venueID, time, bookingDescription, venueBooker, currentEmail, getBookings, setBookingsList, isAdmin}){

    const [isEditBookingFormOpen, setIsEditBookingFormOpen] = useState(false);

    const toggleEditBookingForm = () => {
        setIsEditBookingFormOpen(!isEditBookingFormOpen);
    }

    const onEditClick = () =>{
        toggleEditBookingForm();
    }

    const onDeleteClick = async (id) =>{
        const deleteStatus = await deleteBooking(id, setBookingsList, venueBooker);
        alert(deleteStatus);
        if(deleteStatus === "Delete succesful"){
            getBookings(venueBooker, setBookingsList);
            if(venueBooker !== currentEmail){ // Check to see if an Admin is deleting another user's booking
                // Create the notification
                const notification = {
                    dateCreated: new Date().toLocaleString(),
                    notificationMessage: `This is to inform you that your booking has been cancelled by the admin. These are the booking details: venueID: ${venueID}, bookingDate: ${bookingDate}, bookingStartTime: ${time.substring(0, 5)}, bookingEndTime: ${time.substring(6, 11)}, bookingDescription: ${bookingDescription}. Please make another booking or send a request to the admin.`,
                    notificationType: "Booking Cancelled",
                    read: false,
                    recipientEmail: venueBooker,
                };
            
                console.log('Notification to be sent:', notification); // Log the notification data
            
                const notificationResponse = await fetch('/api/notifications', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(notification),
                });
            
                if (!notificationResponse.ok) {
                    const errorData = await notificationResponse.json();
                    console.error('Error creating notification:', errorData);
                    throw new Error('Failed to create notification');
                }
            }
        }
    }

    const hasBookingDatePassed = () => {
        const currentDate = new Date();
        const bookingDateTime = new Date(`${bookingDate}T${time.substring(6, 11)}`); // Combine date and time for comparison
        return bookingDateTime < currentDate;
    }

    return( // Returns a single booking entry with the booking information passed in from MyBookings.
        <>
            <EditBookingForm 
                id={venueID + "-" + bookingDate + "-" + time.substring(0, 5)}
                venueName={venueID}
                bookingDate={bookingDate}
                bookingTime={time}
                bookingDescription={bookingDescription}
                isOpen={isEditBookingFormOpen} 
                onClose={toggleEditBookingForm}
                isAdmin={isAdmin}
                bookerEmail={venueBooker}
                getBookings={getBookings}
                setBookingsList={setBookingsList}
            />
            <li key={venueID + "-" + bookingDate + "-" + time.substring(0, 5)} className={`booking-list-entry ${hasBookingDatePassed() ? 'past-booking' : ''}`}>
                <span className="booking-date">{bookingDate}{hasBookingDatePassed() && (<span className='past-booking-span'>PAST BOOKING</span>)}</span>
                <span className="booking-venue">{venueID}</span>
                <span className="booking-time">{time}</span>
                {isAdmin && (
                    <span className="booking-description"><strong>{venueBooker}</strong></span>
                )}
                <span className="booking-description">Description: {bookingDescription}</span>
                <div className='manage-booking-buttons'>
                    <button onClick={() => onEditClick()}>Edit</button>
                    <button onClick={() => onDeleteClick(venueID + "-" + bookingDate + "-" + time.substring(0, 5))}>Delete</button>
                </div>
            </li>
        </>
    );
}

export default BookingRow;