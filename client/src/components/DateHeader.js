import "../styles/Venues.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCaretRight, faCaretLeft} from '@fortawesome/free-solid-svg-icons'
import CalendarPopup from "../components/CalendarPopup";
import { useState } from "react";

function DateHeader( {displayDate, onDateChange, isManaging, ...props} ){
    const today = new Date();
    const maxDate = new Date((new Date().getFullYear().toString())+"-12-31");
    
    // const [displayDate, setDisplayDate] = useState(today);

    const [isOpen, setIsOpen] = useState(false);

    const toggleCalendar = () => setIsOpen(!isOpen);

    const handleDateChange = (direction) => {
        const newDate = new Date(displayDate);
        if(!direction && today < displayDate){
            newDate.setDate(displayDate.getDate()-1);
        }else if(direction && maxDate > displayDate){
            newDate.setDate(newDate.getDate()+1);
        }
        onDateChange(newDate);
        setIsOpen(false);
    };

    const handleCalendarChange = (date) => {
        onDateChange(date);
        setIsOpen(false);
    };

    return (
        <main className="date-container" {...props}>
            <div className="date-content">
                {!isManaging ? (
                    <>
                        <button className="arrow-button" onClick={() => handleDateChange(false)}><FontAwesomeIcon icon={faCaretLeft} /></button>
                        <button className="date-button"  onClick = {toggleCalendar}>{displayDate.toDateString()}</button>
                        <button className="arrow-button" data-testid = 'right-arrow-button' onClick={() => handleDateChange(true)}><FontAwesomeIcon icon={faCaretRight} /></button>
                    </>
                ):(
                    <h1>Managing</h1>
                )}     
            </div>
            <div className={`calendar-popup ${isOpen ? "open" : "closed"}`}>
                <CalendarPopup
                onChange = {handleCalendarChange}
                value = {displayDate}
                />
            </div>
        </main>
    );
}

export default DateHeader;