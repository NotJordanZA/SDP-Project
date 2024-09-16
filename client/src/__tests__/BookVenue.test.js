import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BookVenue from '../pages/BookVenue';
import { MemoryRouter } from "react-router-dom";
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

describe('BookVenue Component', () => {
  beforeEach(() => {
    // auth.currentUser = { email: 'test@wits.ac.za' };
    onAuthStateChanged.mockImplementation((auth, callback) => {
      // Simulate that a user is logged in, and return a mock unsubscribe function
      callback({ email: 'test@wits.ac.za' });
      // console.log("Unsubscribe returned!");
      return jest.fn(); // This is the mock unsubscribe function
    });
  });

  test.skip('renders BookVenue component', () => {
    render(<BookVenue />);
    expect(screen.getByText('Book Venue')).toBeInTheDocument();
  });

  test.skip('handles time click', () => {
    render(<BookVenue />);
    const timeButton = screen.getByText('Select Time');
    fireEvent.click(timeButton);
    expect(screen.getByText('Booking confirmed for:')).toBeInTheDocument();
  });

  test.skip('handles form submission', () => {
    render(<BookVenue />);
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);
    expect(console.log).toHaveBeenCalledWith('Booking confirmed for:', expect.anything(), '', '');
  });
});