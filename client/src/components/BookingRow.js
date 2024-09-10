import '../styles/Bookings.css';

function BookingRow({bookingDate, venueID, time, bookingDescription}){
    return( // Returns a single booking entry with the booking information passed in from MyBookings.
        <li key={bookingDate + "-" + time + "-" + venueID} className="booking-list-entry">
            <span className="booking-date">{bookingDate}</span>
            <span className="booking-venue">{venueID}</span>
            <span className="booking-time">{time}</span>
            <span className="booking-description">Description: {bookingDescription}</span>
        </li>
    );
}

export default BookingRow;