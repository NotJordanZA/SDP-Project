import React, { useState } from 'react';
import '../styles/BookVenue.css';

function BookVenue() {
  const [selectedTime, setSelectedTime] = useState(null);
  const [size, setSize] = useState('');
  const [date, setDate] = useState('');

  const handleTimeClick = (time) => {
    setSelectedTime(time);
  };

  const handleSubmit = () => {
  
    console.log('Booking confirmed for:', selectedTime, size, date);
  };

  return (
    <div className="book-venue">
      <div className="booking-form">
        <label htmlFor="size">Size</label>
        <select id="size" value={size} onChange={(e) => setSize(e.target.value)}>
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="200">200</option>
        </select>

        <label htmlFor="date">Date</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <h3>Select an available time</h3>
        <div className="time-selection">
          <button
            className={selectedTime === '08:00' ? 'selected' : ''}
            onClick={() => handleTimeClick('08:00')}
          >
            08:00
          </button>
          <button
            className={selectedTime === '10:00' ? 'selected' : ''}
            onClick={() => handleTimeClick('10:00')}
          >
            10:00
          </button>
          <button
            className={selectedTime === '12:00' ? 'selected' : ''}
            onClick={() => handleTimeClick('12:00')}
          >
            12:00
          </button>
          <button
            className={selectedTime === '14:00' ? 'selected' : ''}
            onClick={() => handleTimeClick('14:00')}
          >
            14:00
          </button>
          <button
            className={selectedTime === '16:00' ? 'selected' : ''}
            onClick={() => handleTimeClick('16:00')}
          >
            16:00
          </button>
          <button
            className={selectedTime === '18:00' ? 'selected' : ''}
            onClick={() => handleTimeClick('18:00')}
          >
            18:00
          </button>
          <button
            className={selectedTime === '20:00' ? 'selected' : ''}
            onClick={() => handleTimeClick('20:00')}
          >
            20:00
          </button>
          <button
            className={selectedTime === '22:00' ? 'selected' : ''}
            onClick={() => handleTimeClick('22:00')}
          >
            22:00
          </button>
          <button
            className={selectedTime === '00:00' ? 'selected' : ''}
            onClick={() => handleTimeClick('00:00')}
          >
            00:00
          </button>
        </div>

        <button onClick={handleSubmit} className="confirm-booking-button">
          Confirm Booking
        </button>
      </div>
    </div>
  );
}

export default BookVenue;
