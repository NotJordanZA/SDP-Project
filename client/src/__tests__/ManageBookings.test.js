import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ManageBookings from '../pages/ManageBookings';
import { BrowserRouter as Router, MemoryRouter } from 'react-router-dom';
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getCurrentUser } from '../utils/getCurrentUser';

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

describe('ManageBookings Component', () => {

  beforeEach(() => {
    auth.currentUser = { email: 'test@wits.ac.za' };
    onAuthStateChanged.mockImplementation((auth, callback) => {
      // Simulate that a user is logged in, and return a mock unsubscribe function
      callback({ email: 'test@wits.ac.za' });
      // console.log("Unsubscribe returned!");
      return jest.fn(); // This is the mock unsubscribe function
    });
  });

  test('renders ManageBookings component', () => {
    render(
      <Router>
        <ManageBookings />
      </Router>
    );
    expect(screen.getByText('Manage (Cancel/Edit) a booking')).toBeInTheDocument();
  });

  test('handles tab click', () => {
    render(
      <Router>
        <ManageBookings />
      </Router>
    );
    const manageTabButton = screen.getByText('Manage (Cancel/Edit) a booking');
    fireEvent.click(manageTabButton);
    expect(manageTabButton).toHaveClass('active');
  });

  test('displays bookings', () => {
    render(
      <Router>
        <ManageBookings />
      </Router>
    );
    expect(screen.getByText('Bob Jhonson')).toBeInTheDocument();
    expect(screen.getByText('Jhon Jhonson')).toBeInTheDocument();
    expect(screen.getByText('James Jhonsonn')).toBeInTheDocument();
    expect(screen.getByText('Fred Jhonson')).toBeInTheDocument();
    expect(screen.getByText('Emily Jhonson')).toBeInTheDocument();
    expect(screen.getByText('Pam Jhonson')).toBeInTheDocument();
  });
});