import "../styles/Venues.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCaretRight, faCaretLeft} from '@fortawesome/free-solid-svg-icons'
import CalendarPopup from "../components/CalendarPopup";
import { useState } from "react";

function DateHeader(){
    const today = new Date();
    const maxDate = new Date((new Date().getFullYear().toString())+"-12-31");
    
    const [displayDate, setDisplayDate] = useState(new Date());//maybe getting reset to today when calendar causes page reload

    const [isOpen, setIsOpen] = useState(false);

    const toggleCalendar = () => setIsOpen(!isOpen);

    const handleDateChange = (direction) => {//this is not working, gets called 4 times when page is loaded
        console.log("changed date");
        if(!direction && today < displayDate){
            console.log(displayDate);
            setDisplayDate(displayDate-1);
        }else if(direction && maxDate > displayDate){
            console.log(displayDate);
            setDisplayDate(displayDate+1);
        }
    };

    return (
        <main className="date-container">
        <div className="date-content">
            <button className="arrow-button" onClick={handleDateChange(false)}><FontAwesomeIcon icon={faCaretLeft} /></button>
            <button className="date-button"  onClick = {toggleCalendar}>{displayDate}</button>{/*This is seemingly calling handleDateChange*/}
            <button className="arrow-button" onClick={handleDateChange(true)}><FontAwesomeIcon icon={faCaretRight} /></button>
        </div>
        {isOpen &&(
            <CalendarPopup
            // // onChange = {setDisplayDate}
            // // value = {displayDate}
            // onClick = {(value) => setDisplayDate(value)}
            />
            // This is not updating displayDate
        )}
        </main>
    );
}

export default DateHeader;