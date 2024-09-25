// Polyfill TextDecoder and TextEncoder for Firebase compatibility in Node.js environment
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PopupForm from '../components/PopupForm';
import { addDoc, collection } from 'firebase/firestore'; // Import mocks for Firestore

// Mock Firebase Firestore methods
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  addDoc: jest.fn(),
}));

// Mock Firebase Auth
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    currentUser: { email: 'test@example.com' },
  })),
}));

jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(),
  ref: jest.fn(),
  uploadBytesResumable: jest.fn(),
  getDownloadURL: jest.fn(),
}));

describe('PopupForm Component', () => {
  const mockCloseFunction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the PopupForm when open', async () => {
    // Mock the global fetch to resolve with venue data
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { buildingName: 'Building A', venueName: 'Room 101' },
          { buildingName: 'Building B', venueName: 'Room 102' },
        ]),
      })
    );

    render(<PopupForm isOpen={true} onClose={mockCloseFunction} />);

    // Wait for venues to be fetched and dropdown options to be updated
    await waitFor(() => {
      expect(screen.getByLabelText('Venue:')).toBeInTheDocument();
    });

    // Simulate the fetch being completed and the state updated
    await waitFor(() => {
      expect(screen.getByText('Building A')).toBeInTheDocument();
      expect(screen.getByText('Building B')).toBeInTheDocument();
    });
  });

  test('does not render the PopupForm when closed', () => {
    render(<PopupForm isOpen={false} onClose={mockCloseFunction} />);

    // Expect the form not to be rendered
    expect(screen.queryByText('Submit a Report')).not.toBeInTheDocument();
  });

  test('filters room numbers based on selected venue', async () => {
    // Mock the global fetch to resolve with venue data
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { buildingName: 'Building A', venueName: 'Room 101' },
          { buildingName: 'Building B', venueName: 'Room 102' },
        ]),
      })
    );

    render(<PopupForm isOpen={true} onClose={mockCloseFunction} />);

    // Wait for venues to be loaded
    await waitFor(() => {
      expect(screen.getByText('Building A')).toBeInTheDocument();
    });

    // Select a venue
    fireEvent.change(screen.getByLabelText('Venue:'), { target: { value: 'Building A' } });

    // Check that the filtered room numbers are displayed
    await waitFor(() => {
      expect(screen.getByText('Room 101')).toBeInTheDocument();
    });
  });

  test.skip('submits the form successfully', async () => {
    // Mock the global fetch to resolve with venue data
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { buildingName: 'Building A', venueName: 'Room 101' },
          { buildingName: 'Building B', venueName: 'Room 102' },
        ]),
      })
    );

    render(<PopupForm isOpen={true} onClose={mockCloseFunction} />);

    // Wait for venues to be loaded
    await waitFor(() => {
      expect(screen.getByText('Building A')).toBeInTheDocument();
    });

    // Fill out the form
    fireEvent.change(screen.getByLabelText('Venue:'), { target: { value: 'Building A' } });
    fireEvent.change(screen.getByLabelText('Room Number:'), { target: { value: 'Room 101' } });
    fireEvent.change(screen.getByLabelText('Type of Concern:'), { target: { value: 'Safety' } });
    fireEvent.change(screen.getByLabelText('Report Text:'), { target: { value: 'Test issue description' } });

    // Submit the form
    fireEvent.click(screen.getByText('Submit'));

    // Wait for the addDoc function to be called
    await waitFor(() => {
      expect(addDoc).toHaveBeenCalledWith(collection(expect.any(Object), 'Reports'), {
        venueID: 'Building ARoom 101',
        reportType: 'Safety',
        reportText: 'Test issue description',
        reportStatus: 'pending',
        resolutionLog: '',
        createdBy: 'test@example.com',
      });
    });
  });

  test('handles API fetch failure gracefully', async () => {
    // Mock console.error
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // Make fetch fail
    global.fetch = jest.fn(() => Promise.reject('API is down'));

    render(<PopupForm isOpen={true} onClose={mockCloseFunction} />);

    // Wait for the error to be logged
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error:', 'API is down');
    });

    // Restore the original console.error implementation
    console.error.mockRestore();
  });
});
