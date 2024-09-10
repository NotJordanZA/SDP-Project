import { render, screen, fireEvent, waitFor} from '@testing-library/react';
import { MemoryRouter } from "react-router-dom";
import * as router from 'react-router-dom';
import Venues from '../pages/Venues';
import VenueRow from "../components/VenueRow";
import { getAllVenues } from "../utils/getAllVenuesUtil";
import { getCurrentDatesBookings } from "../utils/getCurrentDatesBookingsUtil";
import { formatDate } from "../utils/formatDateUtil";

jest.mock("firebase/auth", () => ({
    getAuth: jest.fn(),
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

describe("Venues", () => {

    // Before each test, ensure we have the correct mock data
    beforeEach(() => {
        // Mock the venues list
        getAllVenues.mockImplementation((setVenuesList, setAllVenues) => {
            setAllVenues([
                {
                    venueName:'MSL004', 
                    campus:'West', venueType:'Lab', 
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
        render(<Venues/>); //Render Venues Page
        const testDateHeader = screen.getByTestId('date-header'); //DateHeader Component
        expect(testDateHeader).toBeInTheDocument(); //Check if DateHeader rendered
    });

    test('Renders Search Component', () => {
        render(<Venues/>); //Render Venues Page
        const testSearch = screen.getByTestId('search'); //Search Component
        expect(testSearch).toBeInTheDocument(); //Check if Search rendered
    });

    test('Renders VenueRow Component with Correct Data (From VenuesList)', () => {
        render(<Venues/>); //Render Venues Page
        const testVenue1 = screen.getByText('MSL004'); //MSL004
        const testVenue2 = screen.getByText('OLS03'); //OLS03
        expect(testVenue1).toBeInTheDocument(); //Check if MSL004 is rendered
        expect(testVenue2).toBeInTheDocument(); //Check if OLS03 is rendered
    });

    test('Renders Correct Venue Details in VenueRow', () => {
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
        getAllVenues.mockImplementationOnce((setVenuesList, setAllVenues) => {
            setAllVenues([]); //Set the AllVenues list to be blank
            setVenuesList([]); //Set the VenuesList to be blank
        });
        render(<Venues/>); //Render Venues Page
        const testNoVenuesMessage = screen.getByTestId('no-venues-message'); //No Venues Message
        expect(testNoVenuesMessage).toHaveTextContent('No Venues Available'); //Check that No Venues Message displays
    });

    test('Calls handleDateChange When Date is Changed in DateHeader', () => {
        render(<Venues/>); //Render Venues Page
        const testDateHeader = screen.getByTestId('date-header'); //DateHeader Component
        const testNewDate = new Date('2024-10-31');
        fireEvent.change(testDateHeader, {target: {value:testNewDate} }); //Simulate a change to the current date
        expect(screen.queryByText(/Thu Oct 31 2024/i)).toBeInTheDocument(); //Check if the new date is rendered correctly (case-insensitive)
    });

    test('Displays the Correct/Relevant Bookings in VenueRow Popup, with Booked Slots Disabled', () => {
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
            relevantDate={2024-10-31}
        />); //Render VenueRow with a booking
        const testVenueRow = screen.getByText('MSL004'); //Get a VenueRow by its displayed Venue Name
        fireEvent.click(testVenueRow); //Click the VenueRow to show its dropdown menu
        const testButton1415 = screen.getByText('14:15'); //Button for 14:15
        const testButton1515 = screen.getByText('15:15'); //Button for 15:15
        const testButton1615 = screen.getByText('16:15'); //Button for 16:15
        expect(testButton1415).toHaveClass('timeslot-button booked'); //Check for correct class
        expect(testButton1415).toBeDisabled(); //Check that button is disabled
        expect(testButton1515).toHaveClass('timeslot-button'); //Check for correct class
        expect(testButton1515).toBeEnabled(); //Check that button is enabled
        expect(testButton1615).toHaveClass('timeslot-button'); //Check for correct class
        expect(testButton1615).toBeEnabled(); //Check that button is enabled
    });

});