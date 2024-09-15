import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ManageReports from '../pages/ManageReports';
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

describe('ManageReports Component', () => {

  beforeEach(() => {
    auth.currentUser = { email: 'test@wits.ac.za' };
    onAuthStateChanged.mockImplementation((auth, callback) => {
      // Simulate that a user is logged in, and return a mock unsubscribe function
      callback({ email: 'test@wits.ac.za' });
      // console.log("Unsubscribe returned!");
      return jest.fn(); // This is the mock unsubscribe function
    });
  });

  test('renders ManageReports component', () => {
    render(<ManageReports />);
    expect(screen.getByText('Manage Reports')).toBeInTheDocument();
  });

  test('displays reports message', () => {
    render(<ManageReports />);
    expect(screen.getByText('Here are your reports...')).toBeInTheDocument();
  });
});