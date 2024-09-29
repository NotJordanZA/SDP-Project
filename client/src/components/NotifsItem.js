import { useState } from "react";
import { handleNotificationRead } from '../utils/putNotificationUtil'; // Import the handleNotificationRead function
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

export function NotifItem ({notification, setNotifications}) {
    const [popupShown, setPopupShown] = useState(false);

    const togglePopup = () => {
        setPopupShown(!popupShown);
    }

    const formatNotificationMessage = (rawMessage) => {
        // Check if the message contains a specific keyword to determine its type
        if (rawMessage.includes("cancelled by the admin")) {
            // Notif Type 1: Booking Cancellation
            // eslint-disable-next-line
            const [_, details] = rawMessage.split("These are the booking details:");
            const [venueID, bookingDate, bookingStartTime, bookingEndTime, bookingDescription] = details
            .match(/venueID: (.*?), bookingDate: (.*?), bookingStartTime: (.*?), bookingEndTime: (.*?), bookingDescription: (.*)/)
            .slice(1);
            
            return `This is to inform you that your booking has been cancelled by the admin. Please make another booking or send a request to the admin.
            ${bookingDate} in ${venueID}, ${bookingStartTime}-${bookingEndTime}.
            "${bookingDescription}"
            `;
        
        } else if (rawMessage.includes("updated by the admin")) {
            // Notif Type 2: Booking Update
            // eslint-disable-next-line
            const [_, updatedDetails] = rawMessage.split("These are the updated booking details:");
            const [, oldDescription, newDetails] = updatedDetails.split(/bookingDescription: (.*?) -> (.*?) New details:/);
            const [venue, date, startTime, endTime, newDescription] = newDetails
            .match(/venue: (.*?), Date: (.*?), Start Time: (.*?), End Time: (.*?), Description: (.*)/)
            .slice(1);
        
            return `This is to inform you that your booking details have been updated by the admin.
            "${oldDescription}" -> "${newDescription}"
            ${date} in ${venue}, ${startTime}-${endTime}.
            `;
        
        } else if (rawMessage.includes("A booking has been made in your name by the admin")) {
            // Notif Type 3: Booking Made by Admin
            const [, bookingDetails] = rawMessage.split("Booking details:");
            const [venueID, bookingDate, bookingStartTime, bookingEndTime, bookingDescription] = bookingDetails
            .match(/venueID: (.*?), bookingDate: (.*?), bookingStartTime: (.*?), bookingEndTime: (.*?), bookingDescription: (.*)/)
            .slice(1);
        
            return `A booking has been made in your name by the admin.
            ${bookingDate} in ${venueID}, ${bookingStartTime}-${bookingEndTime}.
            "${bookingDescription}"
            `;
        
        } else if (rawMessage.includes("A recurring booking has been made in your name by the admin")) {
            // Notif Type 4: Recurring Booking
            const [, recurringDetails] = rawMessage.split("Booking details:");
            const [venue, day, time, description] = recurringDetails
            .match(/Venue: (.*?), Day: (.*?), Time: (.*?), Description: (.*)/)
            .slice(1);
        
            return `A recurring booking has been made in your name by the admin.
            ${day} in ${venue}, ${time}.
            "${description}"
            `;
        }
        
        // Return the raw message if no format matches
        return rawMessage;
    }

    const timeSince = (creationDateStr) => {
        // Convert date string (DD/MM/YYYY, HH:MM:SS) into a date object
        const creationDate = new Date(creationDateStr.split(', ')[0].split('/').reverse().join('-') + 'T' + creationDateStr.split(', ')[1]);
      
        // Get current date
        const now = new Date();
      
        const diffInTime = now - creationDate; //Calculate difference in time (in milliseconds)
        const diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24)); //Convert difference to days for displaying
        const remainingMsAfterDays = diffInTime % (1000 * 60 * 60 * 24); //Remaining time after fetching days
        const diffInHours = Math.floor(remainingMsAfterDays / (1000 * 60 * 60)); //Convert time to hours for display
        const remainingMsAfterHours = remainingMsAfterDays % (1000 * 60 * 60); //Remaining time after fetching hours
        const diffInMinutes = Math.floor(remainingMsAfterHours / (1000 * 60)); //Convert time to minutes for display

        if (diffInDays > 0) {
            return `${diffInDays}d ${diffInHours}h ago`;
        }
        else {
            return `${diffInHours}h ${diffInMinutes}m ago`;
        }
        
    }

    return (
        <li className="popupNotif-list" key={notification.id}>
        {/* <input 
            type="checkbox" 
            checked={notification.read} // Pre-check the checkbox if already read
            onChange={() => handleNotificationRead (notification, setNotifications)} 
        /> */}
        <button
            className = {`checkmark ${notification.read ? "checked" : ""}`}
            onClick={() => 
                handleNotificationRead (notification, setNotifications)
            }
            data-testid='checkmark-button'
            title="Mark as Read?"
        >
            <FontAwesomeIcon icon={faCheck}/>
        </button>
        <div className='notif-text-container'>
            <p className='notif-text-bold' onClick={togglePopup}>{timeSince(notification.dateCreated)}</p>
            <p className='notif-text-bold' onClick={togglePopup}>{notification.notificationType}</p>
            {popupShown && (
            <p>{formatNotificationMessage(notification.notificationMessage)}</p>
            )
            }
            
        </div>
        </li>
    )

}