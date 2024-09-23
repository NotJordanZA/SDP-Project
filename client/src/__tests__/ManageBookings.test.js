import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ManageBookings from '../pages/ManageBookings';
import { BrowserRouter as Router, MemoryRouter } from 'react-router-dom';
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getCurrentUser } from '../utils/getCurrentUser';
import AllBookings from '../components/AdminAllBookings';
import * as router from 'react-router-dom';


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

jest.mock('../utils/getCurrentUser');

const navigate = jest.fn();

jest.mock('../components/AdminAllBookings', () => () => <div>All Bookings Component</div>); // Mocks All Bookings Component. First ()=> is jest.fn itself, second ()=> is to make it a functional react component.

describe('ManageBookings Component', () => {
  beforeEach(() => {
    auth.currentUser = { email: 'test@wits.ac.za' };
    onAuthStateChanged.mockImplementation((auth, callback) => {
      // Simulate that a user is logged in, and return a mock unsubscribe function
      callback({ email: 'test@wits.ac.za' });
      // console.log("Unsubscribe returned!");
      return jest.fn(); // This is the mock unsubscribe function
    });
    jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate);
  });
  
  test('Renders ManageBookings Static Components', () => {
    render(<ManageBookings />);

    expect(screen.getByText('All Bookings')).toBeInTheDocument(); // Checks that all buttons are on the screen
    expect(screen.getByText('Create Booking')).toBeInTheDocument();
    expect(screen.getByText('Recurring Booking')).toBeInTheDocument();
  });

  test('Expects All Bookings to be the default screen', () => {
    render(<ManageBookings />);

    expect(screen.getByText('All Bookings Component')).toBeInTheDocument(); // Checks that All Bookings Component is rendered

    expect(screen.getByText('All Bookings')).toHaveClass('adminmanage-active'); // Checks that the correct button is active
    expect(screen.getByText('Create Booking')).not.toHaveClass('adminmanage-active');
    expect(screen.getByText('Recurring Booking')).not.toHaveClass('adminmanage-active');
  });

  test('Switches to Venues page when clicked', () => {
    render(<ManageBookings />);

    expect(screen.getByText('All Bookings Component')).toBeInTheDocument(); // Checks that All Bookings Component is rendered initially

    const createBookingButton = screen.getByText('Create Booking');
    fireEvent.click(createBookingButton);

    expect(navigate).toHaveBeenCalledWith("/venues"); // Checks that user is navigated to /venues
  });

  test('Switches to Venues page when clicked', () => {
    render(<ManageBookings />);

    expect(screen.getByText('All Bookings Component')).toBeInTheDocument(); // Checks that All Bookings Component is rendered initially

    const recurringBookingButton = screen.getByText('Recurring Booking');
    fireEvent.click(recurringBookingButton);

    expect(navigate).toHaveBeenCalledWith("/venues"); // Checks that user is navigated to /venues
  });
});