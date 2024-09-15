import { render, screen, fireEvent, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from "react-router-dom";
import * as router from 'react-router-dom';
import { getCurrentUsersAdminRequests } from '../utils/getCurrentUsersAdminRequests';
import { CreateAdminRequest } from '../utils/createAdminRequest';
import AdminRequestRow from '../components/AdminRequestRow';
import AdminRequest from '../pages/AdminRequest';
import { auth } from '../firebase';
import { onAuthStateChanged } from "firebase/auth";
import { wait } from '@testing-library/user-event/dist/utils';

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
    // getAuth: jest.fn(() => ({currentUser: { email: 'test@wits.ac.za' }})),
    // onAuthStateChanged: jest.fn((auth, callback) => {
    //     // Simulate that a user is logged in, and return a mock unsubscribe function
    //     callback({ email: 'test@wits.ac.za' });
    //     // console.log("Unsubscribe returned!");
    //     return jest.fn(); // This is the mock unsubscribe function
    // }),
    onAuthStateChanged: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
    getDoc: jest.fn(() => Promise.resolve({
        data: () => ({ isAdmin: true })  // Mock Firestore document with isAdmin
    })),
}));

jest.mock('../utils/getCurrentUsersAdminRequests', () => ({
    getCurrentUsersAdminRequests: jest.fn(),
}));

jest.mock('../utils/createAdminRequest', () => ({
    CreateAdminRequest: jest.fn(),
}));

const navigate = jest.fn();

describe("AdminRequests", () => {
    beforeEach(() => {
        // Mock useNavigate function
        jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate);
        
        onAuthStateChanged.mockImplementation((auth, callback) => {
            // Simulate that a user is logged in, and return a mock unsubscribe function
            callback({ email: 'test@wits.ac.za' });
            // console.log("Unsubscribe returned!");
            return jest.fn(); // This is the mock unsubscribe function
        });

        // Mock the current date's requests
        getCurrentUsersAdminRequests.mockImplementation((currentUserEmail, setRequestsList) => {
            setRequestsList([
                {
                    requesterEmail: "test@wits.ac.za",
                    requestStatus: "denied",
                    requestText: "Please please please book the great hall for me every day"
                },
                {
                    requesterEmail: "test@wits.ac.za",
                    requestStatus: "pending",
                    requestText: "I want sturrock park. Give it to me."
                }
            ]);
        });
    });

    afterEach(() => {
        jest.clearAllMocks(); // Reset mocks between tests
    });

    test('Renders Static My Bookings Components', () => {
        auth.currentUser = { email: 'test@wits.ac.za' };
        render(<AdminRequest/>); //Render AdminRequest Page
        const adminRequestSection = screen.getByTestId('admin-request-page'); //AdminRequestPage Component
        const adminRequestList = screen.getByTestId('admin-request-list'); //AdminRequestPage Component
        const adminRequestHeading = screen.getByTestId('admin-request-heading'); //AdminRequestPage Component
        const requestButton = screen.getByText("Submit a Request"); ////AdminRequestPage Component
        expect(adminRequestSection).toBeInTheDocument(); //Check if section rendered
        expect(adminRequestList).toBeInTheDocument(); //Check if list rendered
        expect(adminRequestHeading).toBeInTheDocument(); //Check if heading rendered
        expect(requestButton).toBeInTheDocument(); //Check if button rendered
    });

    test('Renders AdminRequestRow Component with Correct Data (From RequestsList)', async () => {
        // auth.currentUser = { email: 'test@wits.ac.za' };
        render(<AdminRequest/>); //Render AdminRequest Page
        await waitFor(() => {
            const request1 = screen.getByText("Description: Please please please book the great hall for me every day");// Looking for first request
            const request2 = screen.getByText("Description: I want sturrock park. Give it to me.");// Looking for second request
            expect(request1).toBeInTheDocument();// Check if first request is rendered
            expect(request2).toBeInTheDocument();// Check if second request is rendered
        });
    });

    test('Checks that form pops up when submit a request button is clicked', () => {
        auth.currentUser = { email: 'test@wits.ac.za' };
        render(<AdminRequest/>); //Render AdminRequest Page
        const requestButton = screen.getByText("Submit a Request"); ////AdminRequestPage Component
        fireEvent.click(requestButton);
        const popupOverlay = screen.getByTestId("popup-overlay");
        const popupContent = screen.getByTestId("popup-content");
        const closeButton = screen.getByText("X");
        const requestTextArea = screen.getByPlaceholderText("Describe your request");
        const submitButton = screen.getByText("Submit");
        expect(popupOverlay).toBeInTheDocument();
        expect(popupContent).toBeInTheDocument();
        expect(closeButton).toBeInTheDocument();
        expect(requestTextArea).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
    });

    test('Checks that form submission calls createAdminRequest with correct arguments', async () => {
        // auth.currentUser = { email: 'test@wits.ac.za' };
        render(<AdminRequest/>); //Render AdminRequest Page
        // auth.currentUser = { email: 'test@wits.ac.za' };
        const requestButton = screen.getByText("Submit a Request"); ////AdminRequestPage Component
        fireEvent.click(requestButton);
        const requestTextArea = screen.getByPlaceholderText("Describe your request");
        const submitButton = screen.getByText("Submit");

        await userEvent.type(requestTextArea, 'I want to own the great hall!');
        fireEvent.click(submitButton);

        expect(CreateAdminRequest).toHaveBeenCalledWith('test@wits.ac.za', 'I want to own the great hall!');
    });

    test('Check if user that is not logged in is redirected to /login', () => {
        onAuthStateChanged.mockImplementation((auth, callback) => {
            // Simulate that a user is logged in, and return a mock unsubscribe function
            callback(null);
            // console.log("Unsubscribe returned!");
            return jest.fn(); // This is the mock unsubscribe function
        });
        render(<AdminRequest/>); //Render AdminRequest Page
        expect(navigate).toHaveBeenCalledWith("/login");// Check that navigation is called
    })
});