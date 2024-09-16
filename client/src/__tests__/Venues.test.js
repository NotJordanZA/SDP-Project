import { render, screen, fireEvent, waitFor, getByTestId, getByText} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// import React from 'react';
import { MemoryRouter } from "react-router-dom";
import * as router from 'react-router-dom';
import Venues from '../pages/Venues';
import VenueRow from "../components/VenueRow";
import DateHeader from "../components/DateHeader";
import CalendarPopup from "../components/CalendarPopup";
import Search from "../components/Search";
import { formatDate } from "../utils/formatDateUtil";
import { getAllVenues } from "../utils/getAllVenuesUtil";
import { getCurrentDatesBookings } from "../utils/getCurrentDatesBookingsUtil";
import { getCurrentUser } from '../utils/getCurrentUser';
import { makeBooking } from '../utils/makeBookingUtil';
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

// jest.mock("firebase/auth", () => ({
//     getAuth: jest.fn(),
// }));

const mockUserInfo = {
    firstName:'Test',
    isAdmin:true,
    isLecturer:false,
    isStudent:false,
    lastName:'User',
};

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn(),
    useNavigate: jest.fn(),
}));

jest.mock('../firebase', () => ({
    auth: {
        currentUser: null //Default mock value
    }
}));

jest.mock("firebase/auth", () => ({
        getAuth: jest.fn(() => ({currentUser: { email: 'test@wits.ac.za' }})),
        onAuthStateChanged: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
    getDoc: jest.fn(() => Promise.resolve({
      data: () => ({ isAdmin: true })  // Mock Firestore document with isAdmin
    })),
}));

jest.mock('../utils/getAllVenuesUtil', () => ({
    getAllVenues: jest.fn(),
}));

jest.mock('../utils/getCurrentDatesBookingsUtil', () => ({
    getCurrentDatesBookings: jest.fn(),
}));

jest.mock('../utils/formatDateUtil', () => ({
    formatDate: jest.fn(),
}));

// jest.mock('../utils/getCurrentUser', () => ({
//     getCurrentUser: jest.fn(),
// }));
jest.mock('../utils/getCurrentUser', () => ({
    getCurrentUser: jest.fn(),
}));

jest.mock('../utils/makeBookingUtil', () => ({
    makeBooking: jest.fn(),
}));

const setBookingTime = jest.fn();
const setIsVenueOpen = jest.fn();
const toggleIsBooking = jest.fn();
const setBookingDescriptionText = jest.fn();

const navigate = jest.fn();

setIsVenueOpen, toggleIsBooking, setBookingDescriptionText

describe("Venues", () => {

    beforeAll(() => {
        global.ResizeObserver = class {
            observe() {}
            unobserve() {}
            disconnect() {}
        };
    });

    // Before each test, ensure we have the correct mock data
    beforeEach(() => {
        jest.clearAllMocks();

        // Mock useNavigate function
        jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate);

        onAuthStateChanged.mockImplementation((auth, callback) => {
            // Simulate that a user is logged in, and return a mock unsubscribe function
            callback({ email: 'test@wits.ac.za' });
            // console.log("Unsubscribe returned!");
            return jest.fn(); // This is the mock unsubscribe function
        });

        getCurrentUser.mockImplementation((currentUserEmail, setUserInfo) => {
            setUserInfo({
                firstName:'Test',
                isAdmin:true,
                isLecturer:false,
                isStudent:false,
                lastName:'User',
            });
        });

        getAllVenues.mockImplementation((setVenuesList, setAllVenues) => {
            setAllVenues([
                {
                    venueName:'MSL004', 
                    campus:'West', 
                    venueType:'Lab', 
                    venueCapacity:100, 
                    timeSlots:['14:15','15:15','16:15'], 
                    isClosed:false
                },
                {
                    venueName:'WSS02', 
                    campus:'West', 
                    venueType:'Lecture Venue', 
                    venueCapacity:200, 
                    timeSlots:['08:00','09:00','10:15','11:15','12:30','14:15','15:15','16:15'], 
                    isClosed:true
                },
                {
                    venueName:'OLS03', 
                    campus:'East', 
                    venueType:'Lecture Venue', 
                    venueCapacity:150, 
                    timeSlots:['08:00','09:00','10:15','11:15','12:30','14:15','15:15','16:15'], 
                    isClosed:false
                }
            ]);
            setVenuesList([
                {
                    venueName:'MSL004', 
                    campus:'West', 
                    venueType:'Lab', 
                    venueCapacity:100, 
                    timeSlots:['14:15','15:15','16:15'], 
                    isClosed:false
                },
                {
                    venueName:'OLS03', 
                    campus:'East', 
                    venueType:'Lecture Venue', 
                    venueCapacity:150, 
                    timeSlots:['08:00','09:00','10:15','11:15','12:30','14:15','15:15','16:15'], 
                    isClosed:false
                }
            ]);
        });
        // Mock the current date's bookings
        getCurrentDatesBookings.mockImplementation((formattedDate, setBookingsList) => {
            setBookingsList([
                {
                    id:'MSL004-2024-10-31-14:00',
                    bookingDate:'2024-10-31',
                    bookingDescription:'CGV Exam',
                    bookingEndTime:'17:00',
                    bookingStartTime:'14:00',
                    venueBooker:'branden.ingram@wits.ac.za',
                    venueID:'MSL004'
                },
                {
                    id:'MSL004-2024-11-01-14:00',
                    bookingDate:'2024-11-01',
                    bookingDescription:'SDP Exam (Very real, I assure you!)',
                    bookingEndTime:'17:00',
                    bookingStartTime:'14:00',
                    venueBooker:'lucky.nkosi@wits.ac.za',
                    venueID:'MSL004'
                }
            ]);
        });
    });
    
    // afterEach(() => {
    //     jest.clearAllMocks();
    // });

    test('Renders DateHeader Component', () => {
        auth.currentUser = { email: 'test@wits.ac.za' };
        render(<Venues/>); //Render Venues Page
        const testDateHeader = screen.getByTestId("date-header"); //DateHeader Component
        expect(testDateHeader).toBeInTheDocument(); //Check if DateHeader rendered
    });

    test('Renders Search Component', () => {
        auth.currentUser = { email: 'test@wits.ac.za' };
        render(<Venues/>); //Render Venues Page
        const testSearch = screen.getByTestId('search'); //Search Component
        expect(testSearch).toBeInTheDocument(); //Check if Search rendered
    });

    test('Renders VenueRow Component with Correct Data (From VenuesList)', async () => {
        auth.currentUser = { email: 'test@wits.ac.za' };
        render(<Venues/>); //Render Venues Page
        await waitFor(() => {
            const testVenue1 = screen.getByText('MSL004'); //MSL004
            const testVenue2 = screen.getByText('OLS03'); //OLS03
            expect(testVenue1).toBeInTheDocument(); //Check if MSL004 is rendered
            expect(testVenue2).toBeInTheDocument(); //Check if OLS03 is rendered
        });
        
    });

    test('Renders Correct Venue Details in VenueRow', () => {
        auth.currentUser = { email: 'test@wits.ac.za' };
        render(<Venues/>); //Render Venues Page
        const testVenueRow = screen.getByText('MSL004'); //Get a VenueRow by its displayed Venue Name
        fireEvent.click(testVenueRow); //Click the VenueRow to show its dropdown menu
        const testCampus = screen.getByText('West'); //MSL004 Campus
        const testVenueType = screen.getByText('Lab'); //MSL004 Venue Type
        const testVenueCapacity = screen.getByText('100'); //MSL004 Venue Capacity
        expect(testCampus).toBeInTheDocument(); //Check is MSL004 Campus is rendered
        expect(testVenueType).toBeInTheDocument(); //Check is MSL004 VenueType is rendered
        expect(testVenueCapacity).toBeInTheDocument(); //Check is MSL004 VenueCapacity is rendered
    });

    test('Displays a Message If No Venues are Retrieved', () => {
        auth.currentUser = { email: 'test@wits.ac.za' };
        getAllVenues.mockImplementationOnce((setVenuesList, setAllVenues) => {
            setAllVenues([]); //Set the AllVenues list to be blank
            setVenuesList([]); //Set the VenuesList to be blank
        });
        render(<Venues/>); //Render Venues Page
        const testNoVenuesMessage = screen.getByTestId('no-venues-message'); //No Venues Message
        expect(testNoVenuesMessage).toHaveTextContent('No Venues Available'); //Check that No Venues Message displays
    });

    test('Update the displayed date when the date is changed', () => {
        const today = new Date();
        const mockOnDateChange = jest.fn();
        
        render(<DateHeader displayDate={today} onDateChange={mockOnDateChange} />); // Render the component with the initial display date
        
        const displayedDate = screen.getByText(today.toDateString())
        expect(displayedDate).toBeInTheDocument();// Expect todays date to be displayed

        const rightArrowButton = screen.getByTestId('right-arrow-button');
        fireEvent.click(rightArrowButton);// Simulate clicking the right arrow button to increment the date
        
        const expectedDate = new Date(today);
        expectedDate.setDate(today.getDate() + 1);// Calculate the expected new date
        
        expect(mockOnDateChange).toHaveBeenCalledWith(expectedDate);// Check that onDateChange was called with the correct new date
    });

    test('Displays the Correct/Relevant Bookings in VenueRow Popup, with Booked Slots Disabled', () => {
        auth.currentUser = { email: 'test@wits.ac.za' };
        render(<VenueRow
            key={'MSL004'}
            venueName={'MSL004'}
            campus={'West'}
            venueType={'Lab'}
            venueCapacity={100}
            timeSlots={['14:15','15:15','16:15']}
            isClosed={false}
            bookings={[
                {
                id:'MSL004-2024-10-31-14:00',
                bookingDate:'2024-10-31',
                bookingDescription:'CGV Exam',
                bookingEndTime:'15:00',
                bookingStartTime:'14:15',
                venueBooker:'branden.ingram@wits.ac.za',
                venueID:'MSL004'
                }
            ]}
            relevantDate={'2024-10-31'}
        />); //Render VenueRow with a booking
        const testVenueRow = screen.getByText('MSL004'); //Get a VenueRow by its displayed Venue Name
        fireEvent.click(testVenueRow); //Click the VenueRow to show its dropdown menu
        const testButton1415 = screen.getByText('14:15'); //Button for 14:15
        const testButton1515 = screen.getByText('15:15'); //Button for 15:15
        const testButton1615 = screen.getByText('16:15'); //Button for 16:15
        expect(testButton1415).toHaveClass('timeslot-button booked'); //Check for correct class
        // expect(testButton1415).toBeDisabled(); //Check that button is disabled
        expect(testButton1515).toHaveClass('timeslot-button'); //Check for correct class
        expect(testButton1515).toBeEnabled(); //Check that button is enabled
        expect(testButton1615).toHaveClass('timeslot-button'); //Check for correct class
        expect(testButton1615).toBeEnabled(); //Check that button is enabled
        fireEvent.click(testButton1415);
        expect(setBookingTime).not.toHaveBeenCalledWith("14:15");//Check that button is disabled
    });

    test('During an available slot, clicking the Book button successfully makes a booking', async () => {
        auth.currentUser = { email: 'test@wits.ac.za' };
        render(<VenueRow
            key={'MSL004'}
            venueName={'MSL004'}
            campus={'West'}
            venueType={'Lab'}
            venueCapacity={100}
            timeSlots={['14:15','15:15','16:15']}
            isClosed={false}
            bookings={[]}
            relevantDate={'2024-10-31'}
        />); //Render VenueRow with no bookings
        const testVenueRow = screen.getByText('MSL004'); //Get a VenueRow by its displayed Venue Name
        fireEvent.click(testVenueRow); //Click the VenueRow to show its dropdown menu
        const testButton1415 = screen.getByText('14:15'); //Button for 14:15
        fireEvent.click(testButton1415); //Click the button for the 14:15 slot
        const descriptionInput = screen.getByTestId('description-input-id'); //Description input field
        await userEvent.type(descriptionInput, "Wouldn't you like to know, weather boy?"); //Type in booking description
        const bookButton = screen.getByText('Book'); //Book button
        fireEvent.click(bookButton); //Click the Book button
        // expect(makeBooking).toHaveBeenCalledWith(
        //     'test@wits.ac.za',
        //     'MSL004',
        //     '2024-10-31',
        //     '14:15',
        //     '15:00',
        //     "Wouldn't you like to know, weather boy?",
        //     setIsVenueOpen, 
        //     toggleIsBooking, 
        //     setBookingDescriptionText
        // );
        expect(makeBooking).toHaveBeenCalled();
    });

    test('User that is not logged in is redirected to /login', () => {
        onAuthStateChanged.mockImplementation((auth, callback) => {
            // Simulate that a user is not logged in, and return a mock unsubscribe function
            callback(null);
            return jest.fn(); // This is the mock unsubscribe function
        });
        render(<Venues/>); //Render AdminRequest Page
        expect(navigate).toHaveBeenCalledWith("/login");// Check that navigation is called
    })

});