import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
import "../styles/Venues.css";
import "../styles/Calendars.css"

function CalendarPopup({ onChange, value }){
    const today = new Date();
    const finalDayofYear = new Date((new Date().getFullYear().toString())+"-12-31");
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