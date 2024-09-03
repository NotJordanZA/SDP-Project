import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function CalendarPopup(){
    const today = new Date();
    const finalDayofYear = new Date((new Date().getFullYear().toString())+"-12-31");
    return (
        <div>
        <Calendar 
        minDate={today}
        maxDate={finalDayofYear}/>
        </div>
    );
}

export default CalendarPopup;