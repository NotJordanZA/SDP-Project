import { useState, useEffect } from "react";

export function NotifItem ({notification, handleNotificationRead, setNotifications}) {
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
            
            return `
            This is to inform you that your booking has been cancelled by the admin. Please make another booking or send a request to the admin.
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
        
            return `
            This is to inform you that your booking details have been updated by the admin.
            "${oldDescription}" -> "${newDescription}"
            ${date} in ${venue}, ${startTime}-${endTime}.
            `;
        
        } else if (rawMessage.includes("A booking has been made in your name by the admin")) {
            // Notif Type 3: Booking Made by Admin
            const [, bookingDetails] = rawMessage.split("Booking details:");
            const [venueID, bookingDate, bookingStartTime, bookingEndTime, bookingDescription] = bookingDetails
            .match(/venueID: (.*?), bookingDate: (.*?), bookingStartTime: (.*?), bookingEndTime: (.*?), bookingDescription: (.*)/)
            .slice(1);
        
            return `
            A booking has been made in your name by the admin.
            ${bookingDate} in ${venueID}, ${bookingStartTime}-${bookingEndTime}.
            "${bookingDescription}"
            `;
        
        } else if (rawMessage.includes("A recurring booking has been made in your name by the admin")) {
            // Notif Type 4: Recurring Booking
            const [, recurringDetails] = rawMessage.split("Booking details:");
            const [venue, day, time, description] = recurringDetails
            .match(/Venue: (.*?), Day: (.*?), Time: (.*?), Description: (.*)/)
            .slice(1);
        
            return `
            A recurring booking has been made in your name by the admin.
            ${day} in ${venue}, ${time}.
            "${description}"
            `;
        }
        
        // Return the raw message if no format matches
        return rawMessage;
    }

    return (
        <li className="popupNotif-list" key={notification.id}>
        <input 
            type="checkbox" 
            checked={notification.read} // Pre-check the checkbox if already read
            onChange={() => handleNotificationRead (notification, setNotifications)} 
        />
        <div className='notif-text-container'>
            <p className='notif-text-bold' onClick={togglePopup}>{notification.dateCreated}</p>
            <p className='notif-text-bold' onClick={togglePopup}>{notification.notificationType}</p>
            {popupShown && (
            <p>{formatNotificationMessage(notification.notificationMessage)}</p>
            )
            }
            
        </div>
        </li>
    )

}