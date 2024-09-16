import { render, screen, fireEvent, waitFor} from '@testing-library/react';
import { MemoryRouter } from "react-router-dom";
import * as router from 'react-router-dom';
import { getCurrentUsersBookings } from '../utils/getCurrentUsersBookings';
import MyBookings from '../pages/myBookings';
import BookingRow from '../components/BookingRow';
import { auth } from '../firebase';
import { onAuthStateChanged } from "firebase/auth";
import { getCurrentUser } from '../utils/getCurrentUser';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn(),
    useNavigate: jest.fn(),
}));

jest.mock('../firebase', () => ({
    auth: {
      currentUser: null // Default mock value
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

jest.mock('../utils/getCurrentUser');

jest.mock('../utils/getCurrentUsersBookings', () => ({
    getCurrentUsersBookings: jest.fn(),
}));

const navigate = jest.fn();

describe("MyBookings", () => {
    beforeEach(() => {
        // Mock useNavigate function
        jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate);

        onAuthStateChanged.mockImplementation((auth, callback) => {
            // Simulate that a user is not logged in, and return a mock unsubscribe function
            callback({ email: 'test@wits.ac.za' });
            // console.log("Unsubscribe returned!");
            return jest.fn(); // This is the mock unsubscribe function
          });

        // Mock the current date's bookings
        getCurrentUsersBookings.mockImplementation((currentUserEmail, setBookingsList) => {
            setBookingsList([
                {
                    id:'MSL004-2024-10-31-14:00',
                    bookingDate:'2024-10-31',
                    bookingDescription:'CGV Exam',
                    bookingEndTime:'17:00',
                    bookingStartTime:'14:00',
                    venueBooker:'test@wits.ac.za',
                    venueID:'MSL004'
                },
                {
                    id:'MSL004-2024-11-01-14:00',
                    bookingDate:'2024-11-01',
                    bookingDescription:'SDP Exam (Very real, I assure you!)',
                    bookingEndTime:'17:00',
                    bookingStartTime:'14:00',
                    venueBooker:'test@wits.ac.za',
                    venueID:'MSL004'
                }
            ]);
        });
    });

    afterEach(() => {
        jest.clearAllMocks(); // Reset mocks between tests
    });

    test('Renders Static My Bookings Components', () => {
        auth.currentUser = { email: 'test@wits.ac.za' };
        render(<MyBookings/>); //Render MyBookings Page
        const myBookingsSection = screen.getByTestId('booking-page'); //BookingPage Component
        const myBookingsList = screen.getByTestId('booking-list'); //BookingPage Component
        const myBookingsHeading = screen.getByTestId('booking-heading'); //BookingPage Component
        expect(myBookingsSection).toBeInTheDocument(); //Check if section rendered
        expect(myBookingsList).toBeInTheDocument(); //Check if list rendered
        expect(myBookingsHeading).toBeInTheDocument(); //Check if heading rendered
    });

    test('Renders BookingRow Component with Correct Data (From BookingsList)', () => {
        auth.currentUser = { email: 'test@wits.ac.za' };
        render(<MyBookings/>); //Render MyBookings Page
        const booking1 = screen.getByText('2024-10-31');// Looking for first booking
        const booking2 = screen.getByText('2024-11-01');// Looking for second booking
        expect(booking1).toBeInTheDocument();// Check if first booking is rendered
        expect(booking2).toBeInTheDocument();// Check if second booking is rendered
    });

    test('Check if user that is not logged in is redirected to /login', () => {
        onAuthStateChanged.mockImplementation((auth, callback) => {
            // Simulate that a user is logged in, and return a mock unsubscribe function
            callback(null);
            // console.log("Unsubscribe returned!");
            return jest.fn(); // This is the mock unsubscribe function
        });
        render(<MyBookings/>); //Render MyBookings Page
        expect(navigate).toHaveBeenCalledWith("/login");// Check that navigation is called
    })
});