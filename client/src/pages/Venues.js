import DateHeader from "../components/DateHeader";
import "../styles/Venues.css";
import VenueRow from "../components/VenueRow";
import Search from "../components/Search";
import { useState, useEffect } from "react";
import { getCurrentUser } from '../utils/getCurrentUser';
import { getAllVenues } from "../utils/getAllVenuesUtil";
import { getCurrentDatesBookings } from "../utils/getCurrentDatesBookingsUtil";
import { getCurrentDaySchedules } from "../utils/getCurrentDaysSchedules";
import { fetchSchedules } from "../utils/getSchedulesUtil";
import { formatDate } from "../utils/formatDateUtil";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

function Venues(){
    const [allVenues, setAllVenues] = useState([]);
    const [venueList, setVenueList] = useState([]);
    const [bookingsList, setBookingsList] = useState([]);
    const [displayDate, setDisplayDate] = useState(new Date());
    const [formattedDate, setFormattedDate] = useState('');
    const [userInfo, setUserInfo] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [isManaging, setIsManaging] = useState(false);
    const [isScheduling, setIsScheduling] = useState(false);
    const [schedules, setSchedules] = useState([]);
    // const user = auth.currentUser;
    const studentVenueTypes = ["Tutorial Room", "Study Room"];
    const lecturerVenueTypes = ["Tutorial Room", "Study Room", "Lecture Venue", "Lab", "Test Venue"];
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

    const toggleIsScheduling = () => {
        setIsScheduling(!isScheduling);
    }
    const navigate = useNavigate();
    
    const callGetAllVenues = () => {
      getAllVenues(setVenueList, setAllVenues);
    }

    // Ensure User is logged in
    useEffect(() => {
      // Listen for a change in the auth state
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        // If user is authenticated
        if (firebaseUser) {
          setUser(firebaseUser); //Set current user
          console.log(user);
        } else {
          navigate("/login"); //Reroute to login if user not signed in
        }
        setIsLoading(false); //Declare firebase as no longer loading
      });
      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      }; //Return the listener
      // eslint-disable-next-line
    }, [auth, navigate]);

    // Get info about the current user from the database once firebase is loaded
    useEffect(() => {
      // Fetch current user's info
      const fetchUserInfo = async () => {
        // If user is signed in
        if (user) {
          try {
            // Instantiate userInfo object
            // const userData = await getCurrentUser(user.email);
            getCurrentUser(user.email, setUserInfo);
            //setUserInfo(userData);
          } catch (error) {
            console.error('Failed to fetch user info: ', error);
          }
        }
      };
      // Check if firebase is done loading
      if (!isLoading){
        fetchUserInfo(); //Get user info
      }
    }, [user, isLoading]);


    useEffect(() => {
      if (venueList.length > 0) {
        const venueArray = venueList.map(venue => ({
          venueName: venue.venueName,
          campus: venue.campus,
          capacity: venue.venueCapacity,
          timeSlots: venue.timeSlots,
        }));
    
       // console.log(venueArray); // You can log or use this array as needed.
      }
    }, [venueList]); // This will run whenever venueList changes.
    


    useEffect(() => {
      callGetAllVenues();
      fetchSchedules(setSchedules);
    }, []);// Only runs on first load

    useEffect(() => {
      // Update the formatted date when displayDate changes
      setFormattedDate(formatDate(displayDate));
    }, [displayDate]); // Only runs when displayDate changes
    
    useEffect(() => {
      // Call getCurrentDatesBookings when formattedDate changes
      if (formattedDate) {
        getCurrentDatesBookings(formattedDate, setBookingsList);
        getCurrentDaySchedules(weekday[displayDate.getDay()], bookingsList, setBookingsList);
      }// eslint-disable-next-line
    }, [formattedDate]); // Only runs when formattedDate changes

    const handleDateChange = (newDate) => { // Function for changing the selected date
      setDisplayDate(newDate);
    };
    const venueArray = venueList.map(venue => ({
      venueName: venue.venueName,
      campus: venue.campus,
      capacity: venue.venueCapacity,
  }));
    //Map the elements of venueList onto VenueRow components and add them to an array
    const venueComponents = venueList.map((venue) => {
      // Find all bookings for this venue
      const matchingBookings = bookingsList.filter(booking => booking.venueID === venue.venueName);
      
      // console.log(userInfo.isAdmin);

      if (isLoading) {
        return (
          <p>Loading...</p>
        );
      }

      if (userInfo.isAdmin === true){
        return (
          <VenueRow
            key={venue.venueName}
            id={venue.id}
            buildingName={venue.buildingName}
            venueName={venue.venueName}
            campus={venue.campus}
            venueType={venue.venueType}
            venueCapacity={venue.venueCapacity}
            timeSlots={venue.timeSlots}
            isClosed={venue.isClosed}
            bookings={matchingBookings}
            relevantDate={formattedDate}
            setBookingsList={setBookingsList}
            isAdmin={userInfo.isAdmin}
            isManaging={isManaging}
            getAllVenues={callGetAllVenues}
            isScheduling={isScheduling}
            schedules={schedules}
            setSchedules={setSchedules}
            allVenues = {venueArray}
          />
        );
      }
      else if ((userInfo.isLecturer === true) && (lecturerVenueTypes.indexOf(venue.venueType) !== -1)){
        return (
          <VenueRow
            key={venue.venueName}
            venueName={venue.venueName}
            campus={venue.campus}
            venueType={venue.venueType}
            venueCapacity={venue.venueCapacity}
            timeSlots={venue.timeSlots}
            isClosed={venue.isClosed}
            bookings={matchingBookings}
            relevantDate={formattedDate}
            setBookingsList={setBookingsList}
            isAdmin={false}
            isManaging={false}
            getAllVenues={null}
            isScheduling={null}
            schedules={null}
            setSchedules={null}
            allVenues = {venueArray}
          />
        )
      }
      else if ((userInfo.isStudent === true) && (studentVenueTypes.indexOf(venue.venueType) !== -1)){
        return (
          <VenueRow
            key={venue.venueName}
            venueName={venue.venueName}
            campus={venue.campus}
            venueType={venue.venueType}
            venueCapacity={venue.venueCapacity}
            timeSlots={venue.timeSlots}
            isClosed={venue.isClosed}
            bookings={matchingBookings}
            relevantDate={formattedDate}
            setBookingsList={setBookingsList}
            isAdmin={false}
            isManaging={false}
            getAllVenues={null}
            isScheduling={null}
            schedules={null}
            setSchedules={null}
            allVenues = {venueArray}
          />
        )
      }

      return null;
      
    });

    return (
        <main>
          <label className="goldenLabel" id="venuesLabel">Book a venue for a lecture, study session, or test. Click on the date below to select a day then choose from our list of venues. You can use the search and filter features if you're looking for something specific.</label>
            <DateHeader displayDate={displayDate} onDateChange={handleDateChange} isManaging={isManaging} data-testid="date-header"/>
            <Search venueList = {allVenues} setVenueList = {setVenueList} bookingsList = {bookingsList} isManaging = {isManaging} setIsManaging = {setIsManaging} isAdmin = {userInfo.isAdmin} getAllVenues={callGetAllVenues} toggleIsScheduling={toggleIsScheduling} isScheduling={isScheduling} data-testid="search"/>
            {
              venueComponents.length > 0 ? 
                (
                  <div data-testid="venue-list">
                      {venueComponents}
                  </div>
                ):(
                  <p data-testid="no-venues-message">No Venues Available</p>
                )
            }
        </main>
    );
}

export default Venues;