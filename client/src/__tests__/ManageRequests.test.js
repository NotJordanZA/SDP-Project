import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router, MemoryRouter } from 'react-router-dom';
import ManageRequests from '../pages/ManageRequests';
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

describe('ManageRequests Component', () => {

  beforeEach(() => {
    auth.currentUser = { email: 'test@wits.ac.za' };
    onAuthStateChanged.mockImplementation((auth, callback) => {
      // Simulate that a user is logged in, and return a mock unsubscribe function
      callback({ email: 'test@wits.ac.za' });
      // console.log("Unsubscribe returned!");
      return jest.fn(); // This is the mock unsubscribe function
    });
  });

  test('renders ManageRequests component', () => {
    render(
      <Router>
        <ManageRequests />
      </Router>
    );
    expect(screen.getByText('richard.klein@wits.ac.za')).toBeInTheDocument();
    expect(screen.getByText('I would like to make a recurring booking for NCB103 for every Tuesday for my COMS2013A lecture.')).toBeInTheDocument();
  });

  test('handles edit button click', () => {
    const { container } = render(
      <Router>
        <ManageRequests />
      </Router>
    );
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);
    expect(container.innerHTML).toContain('book-venue');
  });

  test('handles delete button click', () => {
    render(
      <Router>
        <ManageRequests />
      </Router>
    );
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    // Add your assertion here based on what should happen when delete is clicked
    // For example, you might check if the request card is removed from the DOM
  });
});