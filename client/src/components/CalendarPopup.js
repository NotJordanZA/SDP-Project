import Calendar from 'react-calendar';
import "../styles/Venues.css";
import "../styles/Calendars.css"

function CalendarPopup({ onChange, value }){
    const today = new Date(); // For setting the earliest day for booking to today
    const finalDayofYear = new Date((new Date().getFullYear().toString())+"-12-31"); // For setting the latest day for booking to the final day of the year
    return (
        <div>
        <Calendar 
        className="react-calendar"
        minDate={today}
        maxDate={finalDayofYear}
        onChange={onChange}
        value={value}/>
        </div>
    );
}

export default CalendarPopup;