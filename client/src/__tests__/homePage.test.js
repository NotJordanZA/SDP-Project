import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '../pages/homePage'; // Adjust the path as necessary
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { getCurrentUser } from '../utils/getCurrentUser';

jest.mock('../firebase', () => ({
  auth: {
    currentUser: null,  // Mock the initial state as user not logged in
  },
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

jest.mock('../utils/getCurrentUser', () => ({
  getCurrentUser: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Preserve other functions of react-router-dom
  useNavigate: jest.fn(),  // Mock the useNavigate hook
}));

describe('HomePage Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);  // Mock the navigation function
    onAuthStateChanged.mockImplementation((auth, callback) => {
      // Simulate that a user is logged in, and return a mock unsubscribe function
      callback({ email: 'test@wits.ac.za', displayName: 'Test User' });
      // console.log("Unsubscribe returned!");
      return jest.fn(); // This is the mock unsubscribe function
    });
    getCurrentUser.mockImplementation((currentUserEmail, setUserInfo) => {
      setUserInfo({
          firstName:'Test',
          isAdmin:false,
          isLecturer:true,
          isStudent:false,
          lastName:'User',
      });
  });
  });

  test('Redirects to /login if user is not logged in', async () => {
    // Render the HomePage with the user set to null
    onAuthStateChanged.mockImplementation((auth, callback) => {
      // Simulate that a user is not logged in, and return a mock unsubscribe function
      callback(null);
      // console.log("Unsubscribe returned!");
      return jest.fn(); // This is the mock unsubscribe function
    });
    render(<HomePage />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    // Ensure the component returns null
    // expect(screen.queryByText(/Welcome/i)).toBeNull();
  });

  test('Renders MainIcon components when the user is logged in', () => {
    auth.currentUser = { email: 'test@wits.ac.za' };

    render(<HomePage />, { wrapper: MemoryRouter });

    const bookVenueIcon = screen.getByText(/BOOK A VENUE/i);
    const viewCalendarIcon = screen.getByText(/MAKE A REQUEST/i);
    const myBookingsIcon = screen.getByText(/MY BOOKINGS/i);
    const fileReportIcon = screen.getByText(/FILE A REPORT/i);

    expect(bookVenueIcon).toBeInTheDocument();
    expect(viewCalendarIcon).toBeInTheDocument();
    expect(myBookingsIcon).toBeInTheDocument();
    expect(fileReportIcon).toBeInTheDocument();
  });

  test('Navigates correctly when MainIcon components are clicked', () => {
    auth.currentUser = { email: 'test@wits.ac.za' };

    render(<HomePage />, { wrapper: MemoryRouter });

    const bookVenueIcon = screen.getByText(/BOOK A VENUE/i);
    fireEvent.click(bookVenueIcon);
    expect(mockNavigate).toHaveBeenCalledWith('/venues');
    
    const makeRequestIcon = screen.getByText(/MAKE A REQUEST/i);
    fireEvent.click(makeRequestIcon);
    expect(mockNavigate).toHaveBeenCalledWith('/requests');

    const myBookingsIcon = screen.getByText(/MY BOOKINGS/i);
    fireEvent.click(myBookingsIcon);
    expect(mockNavigate).toHaveBeenCalledWith('/bookings');

    const fileReportIcon = screen.getByText(/FILE A REPORT/i);
    fireEvent.click(fileReportIcon);
    expect(mockNavigate).toHaveBeenCalledWith('/reports');
  });

  test("Displays user's name correctly when logged in", async () => {
    // Mock a user being logged in
    auth.currentUser = { displayName: 'Test User'};

    render(<HomePage />, { wrapper: MemoryRouter });

    await waitFor(() => {
      // Check if the user's email is displayed in the welcome message
      const welcomeMessage = screen.getByText(/Welcome Test User/i);
      expect(welcomeMessage).toBeInTheDocument();
    });
  });

  

});
