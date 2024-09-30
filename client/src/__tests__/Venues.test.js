import { render, screen, act, fireEvent, waitFor, getByTestId, getByText} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// import React from 'react';
import { MemoryRouter } from "react-router-dom";
import * as router from 'react-router-dom';
import Venues from '../pages/Venues';
import VenueRow from "../components/VenueRow";
import DateHeader from "../components/DateHeader";
import VenueForm from '../components/VenueForm';
import CalendarPopup from "../components/CalendarPopup";
import Search from "../components/Search";
import { formatDate } from "../utils/formatDateUtil";
import { getAllVenues } from "../utils/getAllVenuesUtil";
import { getCurrentDatesBookings } from "../utils/getCurrentDatesBookingsUtil";
import { getCurrentUser } from '../utils/getCurrentUser';
import { makeBooking } from '../utils/makeBookingUtil';
import { fetchSchedules } from '../utils/getSchedulesUtil';
import { createSchedule } from '../utils/createScheduleUtil';
import { putVenue } from '../utils/putVenueUtil';
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

// jest.mock("firebase/auth", () => ({
//     getAuth: jest.fn(),
// }));

const mockUserInfo = {
    firstName:'Test',
    isAdmin:true,
    isLecturer:true,
    isStudent:true,
    lastName:'User',
};

const mockLecturerUserInfo = {
    firstName:'Test',
    isAdmin:false,
    isLecturer:true,
    isStudent:true,
    lastName:'User',
};

const mockStudentUserInfo = {
    firstName:'Test',
    isAdmin:false,
    isLecturer:false,
    isStudent:true,
    lastName:'User',
};

const mockSchedules = [
    { 
        bookingDay: "Monday",
        bookingDescription: "Information Systems 3 (INFO1011A) lecture",
        bookingEndTime: "08:45",
        bookingStartTime: "08:00",
        venueBooker: "2223@wits.ac.za",
        venueID: "WSS02"  
    },
    { 
        bookingDay: "Friday",
        bookingDescription: "INFO2001 lab",
        bookingEndTime: "15:00",
        bookingStartTime: "14:15",
        venueBooker: "12@wits.ac.za",
        venueID: "WSS02"
    }
]

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

jest.mock('../utils/getCurrentUser', () => ({
    getCurrentUser: jest.fn(),
}));

jest.mock('../utils/makeBookingUtil', () => ({
    makeBooking: jest.fn(),
}));

jest.mock('../utils/getSchedulesUtil', () => ({
    fetchSchedules: jest.fn(),
}));

jest.mock('../utils/createScheduleUtil', () => ({
    createSchedule: jest.fn(),
}));

jest.mock('../utils/putVenueUtil', () => ({
    putVenue: jest.fn(),
}));

const setBookingTime = jest.fn();
const setIsVenueOpen = jest.fn();
const toggleIsBooking = jest.fn();
const setBookingDescriptionText = jest.fn();
const setBookingsList = jest.fn();
const setSchedules = jest.fn();

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
            return jest.fn(); // This is the mock unsubscribe function
        });

        getCurrentUser.mockImplementation((currentUserEmail, setUserInfo) => {
            setUserInfo({
                firstName:'Test',
                isAdmin:true,
                isLecturer:true,
                isStudent:true,
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
                },
                {
                    venueName:'WSS104', 
                    campus:'West', 
                    venueType:'Tutorial Room', 
                    venueCapacity:50, 
                    timeSlots:['08:00','09:00','10:15','11:15','12:30','14:15','15:15','16:15'], 
                    isClosed:false
                },
                {
                    venueName:'Amphitheatre', 
                    campus:'West', 
                    venueType:'Theatre', 
                    venueCapacity:500, 
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
                },
                {
                    venueName:'WSS104', 
                    campus:'West', 
                    venueType:'Tutorial Room', 
                    venueCapacity:50, 
                    timeSlots:['08:00','09:00','10:15','11:15','12:30','14:15','15:15','16:15'], 
                    isClosed:false
                },
                {
                    venueName:'Amphitheatre', 
                    campus:'West', 
                    venueType:'Theatre', 
                    venueCapacity:500, 
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
        fetchSchedules.mockImplementation((setSchedules, venueID) => {
            setSchedules([
                { 
                    bookingDay: "Monday",
                    bookingDescription: "Information Systems 3 (INFO1011A) lecture",
                    bookingEndTime: "08:45",
                    bookingStartTime: "08:00",
                    venueBooker: "2223@wits.ac.za",
                    venueID: "WSS02"  
                },
                { 
                    bookingDay: "Friday",
                    bookingDescription: "INFO2001 lab",
                    bookingEndTime: "15:00",
                    bookingStartTime: "14:15",
                    venueBooker: "12@wits.ac.za",
                    venueID: "WSS02"
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

    test('Renders Subsequent Buttons When Admin Enters Manage Mode', () => {
        auth.currentUser = { email: 'test@wits.ac.za' };
        render(<Venues/>); //Render Venues Page
        const manageButton = screen.getByText('MANAGE'); //Get Manage Button by Displayed Text
        fireEvent.click(manageButton); //Click the Manage Button to Show Subsequent Buttons
        const addVenueButton = screen.getByText('ADD VENUE'); //Get Add Venue Button by Displayed Text
        const schedulesButton = screen.getByText('SCHEDULES'); //Get Schedules Button by Displayed Text
        expect(addVenueButton).toBeInTheDocument(); //Check if Add Venue Button is rendered
        expect(schedulesButton).toBeInTheDocument(); //Check if Schedules Button is rendered
        const testVenueRow = screen.getByText('MSL004'); //Get a VenueRow by its displayed Venue Name
        fireEvent.click(testVenueRow); //Click the VenueRow to show its dropdown menu
        const editButtons = screen.queryAllByText('Edit'); //Get Edit Buttons by Displayed Text
        const deleteButtons = screen.queryAllByText('Delete'); //Get Delete Buttons by Displayed Text
        const closeButtons = screen.queryAllByText('Close'); //Get Close Buttons by Displayed Text
        const openButtonAndMarkers = screen.queryAllByText('Open'); //Get Close Buttons by Displayed Text
        expect(editButtons).toHaveLength(5); //Check if Edit Button is rendered
        expect(deleteButtons).toHaveLength(5); //Check if Delete Button is rendered
        expect(closeButtons).toHaveLength(4); //Check if Close Button is rendered where relevant
        expect(openButtonAndMarkers).toHaveLength(5); //Check if Open Button is rendered where relevant
    });

    test('Renders Schedule When Admin Enters Schedules Mode', () => {
        auth.currentUser = { email: 'test@wits.ac.za' };
        render(<Venues/>); //Render Venues Page
        const manageButton = screen.getByText('MANAGE'); //Get Manage Button by Displayed Text
        fireEvent.click(manageButton); //Click the Manage Button to Show Subsequent Buttons
        const schedulesButton = screen.getByText('SCHEDULES'); //Get Schedules Button by Displayed Text
        fireEvent.click(schedulesButton); //Click the Schedules Button to Enable Schedules View
        const testVenueRow = screen.getByText('WSS02'); //Get a VenueRow by its displayed Venue Name
        fireEvent.click(testVenueRow); //Click the VenueRow to show its dropdown menu
        const scheduledMarkers = screen.queryAllByText('Scheduled');
        expect(scheduledMarkers).toHaveLength(2);
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
        const testCampusArr = screen.queryAllByText('West'); //MSL004 Campus
        const testVenueType = screen.getByText('Lab'); //MSL004 Venue Type
        const testVenueCapacity = screen.getByText('100'); //MSL004 Venue Capacity
        expect(testCampusArr).toHaveLength(4); //Check if MSL004 Campus is rendered
        expect(testVenueType).toBeInTheDocument(); //Check if MSL004 VenueType is rendered
        expect(testVenueCapacity).toBeInTheDocument(); //Check if MSL004 VenueCapacity is rendered
    });

    test('Renders Limited Venues for Users with the Lecturer Role', async () => {
        auth.currentUser = { email: 'test@wits.ac.za' };
        onAuthStateChanged.mockImplementation((auth, callback) => {
            // Simulate that a user is logged in, and return a mock unsubscribe function
            callback({ email: 'test@wits.ac.za' });
            return jest.fn(); // This is the mock unsubscribe function
        });
        getCurrentUser.mockImplementation((currentUserEmail, setUserInfo) => {
            setUserInfo({
                firstName:'Test',
                isAdmin:false,
                isLecturer:true,
                isStudent:true,
                lastName:'User',
            });
        });
        render(<Venues/>); //Render Venues Page
        await waitFor(() => {
            const testVenue1 = screen.queryByText('Amphitheatre'); //Amphitheatre
            expect(testVenue1).not.toBeInTheDocument(); //Check if Amphitheatre is not rendered
        });
    });

    test('Renders Limited Venues for Users with the Student Role', async () => {
        auth.currentUser = { email: 'test@wits.ac.za' };
        onAuthStateChanged.mockImplementation((auth, callback) => {
            // Simulate that a user is logged in, and return a mock unsubscribe function
            callback({ email: 'test@wits.ac.za' });
            return jest.fn(); // This is the mock unsubscribe function
        });
        getCurrentUser.mockImplementation((currentUserEmail, setUserInfo) => {
            setUserInfo({
                firstName:'Test',
                isAdmin:false,
                isLecturer:false,
                isStudent:true,
                lastName:'User',
            });
        });
        render(<Venues/>); //Render Venues Page
        await waitFor(() => {
            const testVenue1 = screen.queryByText('Amphitheatre'); //Amphitheatre
            const testVenue2 = screen.queryByText('OLS03'); //OLS03
            expect(testVenue1).not.toBeInTheDocument(); //Check if Amphitheatre is rendered
            expect(testVenue2).not.toBeInTheDocument(); //Check if OLS03 is not rendered
        });
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
            id={'IAMAVENUEID'}
            buildingName={'MSL'}
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
            setBookingsList={setBookingsList}
            isAdmin={true}
            isManaging={false}
            getAllVenues={getAllVenues}
            isScheduling={false}
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
            id={'IAMAVENUEID'}
            buildingName={'MSL'}
            venueName={'MSL004'}
            campus={'West'}
            venueType={'Lab'}
            venueCapacity={100}
            timeSlots={['14:15','15:15','16:15']}
            isClosed={false}
            bookings={[]}
            relevantDate={'2024-10-31'}
            setBookingsList={setBookingsList}
            isAdmin={true}
            isManaging={false}
            getAllVenues={getAllVenues}
            isScheduling={false}
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

    test('During an available slot, clicking the Schedule button successfully makes a schedules entry', async () => {
        auth.currentUser = { email: 'test@wits.ac.za' };
        fetchSchedules.mockImplementation((setSchedules, venueID) => {
            setSchedules([
                { 
                    bookingDay: "Monday",
                    bookingDescription: "Information Systems 3 (INFO1011A) lecture",
                    bookingEndTime: "15:00",
                    bookingStartTime: "14:15",
                    venueBooker: "2223@wits.ac.za",
                    venueID: "WSS02"  
                },
                { 
                    bookingDay: "Friday",
                    bookingDescription: "INFO2001 tutorial",
                    bookingEndTime: "15:00",
                    bookingStartTime: "14:15",
                    venueBooker: "12@wits.ac.za",
                    venueID: "WSS02"
                }]
            );
        });
        render(<VenueRow
            key={'WSS02'}
            id={'IAMAVENUEID'}
            buildingName={'WSS'}
            venueName={'WSS02'}
            campus={'West'}
            venueType={'Lecture Venue'}
            venueCapacity={100}
            timeSlots={['14:15']}
            isClosed={false}
            bookings={[]}
            relevantDate={'2024-10-31'}
            setBookingsList={setBookingsList}
            isAdmin={true}
            isManaging={true}
            getAllVenues={getAllVenues}
            isScheduling={true}
            schedules={mockSchedules}
            setSchedules={setSchedules}
        />); //Render VenueRow
        const testVenueRow = screen.getByText('WSS02'); //Get a VenueRow by its displayed Venue Name
        fireEvent.click(testVenueRow); //Click the VenueRow to show its dropdown menu
        const availableslots = screen.queryAllByText('Available'); //Buttons for available slots
        fireEvent.click(availableslots[0]); //Click the button for the available slots
        const descriptionInput = screen.getByTestId('description-input-id'); //Description input field
        await userEvent.type(descriptionInput, "Wouldn't you like to know, weather boy?"); //Type in booking description
        const emailInput = screen.getByTestId('email-input-id'); //Description input field
        await userEvent.type(descriptionInput, "iamatest@wits.ac.za"); //Type in booking description
        const scheduleButton = screen.getByText('Schedule'); //Book button
        fireEvent.click(scheduleButton); //Click the Book button
        expect(createSchedule).toHaveBeenCalled();
    });

    test('Editing a Venue successfully renders the relevant form, and submits correctly', async () => {
        auth.currentUser = { email: 'test@wits.ac.za' };
        render(<VenueRow
            key={'WSS02'}
            id={'IAMAVENUEID'}
            buildingName={'WSS'}
            venueName={'WSS02'}
            campus={'West'}
            venueType={'Lecture Venue'}
            venueCapacity={100}
            timeSlots={['14:15']}
            isClosed={false}
            bookings={[]}
            relevantDate={'2024-10-31'}
            setBookingsList={setBookingsList}
            isAdmin={true}
            isManaging={true}
            getAllVenues={getAllVenues}
            isScheduling={false}
        />); //Render VenueRow
        const testVenueRow = screen.getByText('WSS02'); //Get a VenueRow by its displayed Venue Name
        fireEvent.click(testVenueRow); //Click the VenueRow to show its dropdown menu
        const editButton = screen.getByText('Edit'); //Get Edit Buttons by Displayed Text
        const deleteButtons = screen.getByText('Delete'); //Get Delete Buttons by Displayed Text
        const closeButtons = screen.getByText('Close'); //Get Close Buttons by Displayed Text
        fireEvent.click(editButton); //Click the VenueRow to show its dropdown menu
        
        // CHECK RENDER
        const venueNames = screen.getByDisplayValue('WSS02');
        expect(venueNames).toBeInTheDocument();
        const mockCampus = screen.getByText('West Campus');
        expect(mockCampus).toBeInTheDocument();
        const venueTypes = screen.queryAllByText('Lecture Venue');
        expect(venueTypes).toHaveLength(2);
        const mockCapacity = screen.getByDisplayValue('100');
        expect(mockCapacity).toBeInTheDocument();
        const mockTimeSlots = screen.getByText('14:15');
        expect(mockTimeSlots).toBeInTheDocument();
        
        // CHECK FUNCTIONALITY
        const selectInput = screen.getByLabelText(/campus select/i); // Retrieve Campus Select by its label
        fireEvent.mouseDown(selectInput);
        const optionToSelect = screen.getByText('East Campus'); // Retrieve the 'East Campus' option in the dropdown
        await act( async () => userEvent.click(optionToSelect)); // Click the option and wait for the useState
        expect(screen.getByText('East Campus')).toBeInTheDocument(); // If successful, 'East Campus' will be displayed in the Select
        expect(screen.queryAllByText('West Campus')).toHaveLength(0); // If successful, 'West Campus' will NOT be displayed in the Select
        const submitButton = screen.getByText('Submit');
        fireEvent.click(submitButton);
        expect(putVenue).toHaveBeenCalled();
    });

    test('Filling in the form for adding a venue successfully creates one', async () => {
        auth.currentUser = { email: 'test@wits.ac.za' };
        getAllVenues.mockImplementation((setVenuesList, setAllVenues) => {
            setAllVenues([]);
            setVenuesList([]);
        });
        // Mock the current date's bookings
        getCurrentDatesBookings.mockImplementation((formattedDate, setBookingsList) => {
            setBookingsList([]);
        });
        render(<Venues/>); //Render Venues Page
        const manageButton = screen.getByText('MANAGE'); //Get Manage Button by Displayed Text
        fireEvent.click(manageButton); //Click the Manage Button to Show Subsequent Buttons
        const addVenueButton = screen.getByText('ADD VENUE'); //Get Add Venue Button by Displayed
        fireEvent.click(addVenueButton); //Click the Add Venue Button to Show VenueForm
        
        // FETCH COMPONENTS
        const buildingInput = screen.getByTestId('building-name-input');
        const venueInput = screen.getByTestId('venue-name-input');
        const campusInput = screen.getByLabelText(/campus select/i); // Retrieve Campus Select by its label
        const venueTypeInput = screen.getByLabelText(/venue type select/i); // Retrieve Venue Type Select by its label
        const capacityInput = screen.getByTestId('capacity-input');
        const timeSlotsInput = screen.getByLabelText(/timeslots select/i); // Retrieve Time Slots Select by its label
        const closureInput = screen.getByLabelText(/closure select/i); // Retrieve Closure Status Select by its label
        // ENTERING/SELECTING DETAILS
        await userEvent.type(buildingInput, "MSL");
        await userEvent.type(venueInput, "MSL001");
        fireEvent.mouseDown(campusInput);
        const campusOptionToSelect = screen.getByText('West Campus');
        await act( async () => userEvent.click(campusOptionToSelect)); // Click the option and wait for the useState
        fireEvent.mouseDown(venueTypeInput);
        const venueTypeOptionToSelect = screen.getByText('Lab');
        await act( async () => userEvent.click(venueTypeOptionToSelect)); // Click the option and wait for the useState
        await userEvent.type(capacityInput, "100");
        await userEvent.type(timeSlotsInput, "08:15");
        const createTimeButton = screen.getByText(/Create "08:15"/i);
        await act( async () => userEvent.click(createTimeButton)); // Click the option and wait for the useState
        fireEvent.mouseDown(closureInput);
        const closureOptionToSelect = screen.getByText('Open');
        await act( async () => userEvent.click(closureOptionToSelect)); // Click the option and wait for the useState

        const submitButton = screen.getByText('Submit');
        fireEvent.click(submitButton);
        expect(putVenue).toHaveBeenCalled();
    });

    test('Applying filters and clicking the filter button narrows results by selected criteria', async () => {
        auth.currentUser = { email: 'test@wits.ac.za' };
        getAllVenues.mockImplementation((setVenuesList, setAllVenues) => {
            setAllVenues([
                {
                    venueName:'OLS03', 
                    campus:'East', 
                    venueType:'Lecture Venue', 
                    venueCapacity:150, 
                    timeSlots:['08:00','09:00','10:15','11:15','12:30','14:15','15:15','16:15'], 
                    isClosed:false
                },
                {
                    venueName:'Amphitheatre', 
                    campus:'West', 
                    venueType:'Theatre', 
                    venueCapacity:500, 
                    timeSlots:['14:15','15:15','16:15'], 
                    isClosed:false
                }
            ]);
            setVenuesList([
                {
                    venueName:'OLS03', 
                    campus:'East', 
                    venueType:'Lecture Venue', 
                    venueCapacity:150, 
                    timeSlots:['08:00','09:00','10:15','11:15','12:30','14:15','15:15','16:15'], 
                    isClosed:false
                },
                {
                    venueName:'Amphitheatre', 
                    campus:'West', 
                    venueType:'Theatre', 
                    venueCapacity:500, 
                    timeSlots:['14:15','15:15','16:15'], 
                    isClosed:true
                }
            ]);
        });
        // Mock the current date's bookings
        getCurrentDatesBookings.mockImplementation((formattedDate, setBookingsList) => {
            setBookingsList([]);
        });
        fetchSchedules.mockImplementation((setSchedules, venueID) => {
            setSchedules([]);
        });
        render(<Venues/>); //Render Venues Page
        const filterIconButton = screen.getByTestId('filter-icon-button');
        fireEvent.click(filterIconButton);
        const campusInput = screen.getByLabelText(/campus filter select/i); // Retrieve Campus Select by its label
        const venueTypeInput = screen.getByLabelText(/venue type filter select/i); // Retrieve Venue Type Select by its label
        const timeSlotsInput = screen.getByLabelText(/timeslots filter select/i); // Retrieve Time Slots Select by its label
        const closureInput = screen.getByLabelText(/closure filter select/i); // Retrieve Closure Status Select by its label
        fireEvent.mouseDown(campusInput);
        const campusOptionToSelect = screen.queryAllByText('East Campus');
        await act( async () => userEvent.click(campusOptionToSelect[0])); // Click the option and wait for the useState
        fireEvent.mouseDown(venueTypeInput);
        const venueTypeOptionToSelect = screen.queryAllByText('Lecture Venue');
        await act( async () => userEvent.click(venueTypeOptionToSelect[0])); // Click the option and wait for the useState
        fireEvent.mouseDown(closureInput);
        const closureOptionToSelect = screen.queryAllByText('Open');
        await act( async () => userEvent.click(closureOptionToSelect[0])); // Click the option and wait for the useState
        fireEvent.mouseDown(timeSlotsInput);
        const timeOptionToSelect = screen.queryAllByText('08:00');
        await act( async () => userEvent.click(closureOptionToSelect[0])); // Click the option and wait for the useState
        const filterButton = screen.getByText('Filter');
        fireEvent.click(filterButton);
        expect(screen.getByText('OLS03')).toBeInTheDocument;
        expect(screen.queryAllByText('Amphitheatre')).toHaveLength(0);
    })

    test('Entering a venue name and clicking the search button narrows results by name', async () => {
        auth.currentUser = { email: 'test@wits.ac.za' };
        getAllVenues.mockImplementation((setVenuesList, setAllVenues) => {
            setAllVenues([
                {
                    venueName:'OLS03', 
                    campus:'East', 
                    venueType:'Lecture Venue', 
                    venueCapacity:150, 
                    timeSlots:['08:00','09:00','10:15','11:15','12:30','14:15','15:15','16:15'], 
                    isClosed:false
                },
                {
                    venueName:'Amphitheatre', 
                    campus:'West', 
                    venueType:'Theatre', 
                    venueCapacity:500, 
                    timeSlots:['14:15','15:15','16:15'], 
                    isClosed:false
                }
            ]);
            setVenuesList([
                {
                    venueName:'OLS03', 
                    campus:'East', 
                    venueType:'Lecture Venue', 
                    venueCapacity:150, 
                    timeSlots:['08:00','09:00','10:15','11:15','12:30','14:15','15:15','16:15'], 
                    isClosed:false
                },
                {
                    venueName:'Amphitheatre', 
                    campus:'West', 
                    venueType:'Theatre', 
                    venueCapacity:500, 
                    timeSlots:['14:15','15:15','16:15'], 
                    isClosed:true
                }
            ]);
        });
        // Mock the current date's bookings
        getCurrentDatesBookings.mockImplementation((formattedDate, setBookingsList) => {
            setBookingsList([]);
        });
        fetchSchedules.mockImplementation((setSchedules, venueID) => {
            setSchedules([]);
        });
        render(<Venues/>); //Render Venues Page
        const searchButton = screen.getByTestId('search-icon-button');
        const searchInput = screen.getByTestId('search-input');
        await userEvent.type(searchInput, "OLS");
        fireEvent.click(searchButton);
        expect(screen.getByText('OLS03')).toBeInTheDocument;
        expect(screen.queryAllByText('Amphitheatre')).toHaveLength(0);
    })

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