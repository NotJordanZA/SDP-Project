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

  // Mock fetch for venues in all tests
  const mockFetchVenues = () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { buildingName: 'Building A', venueName: 'Room 101' },
          { buildingName: 'Building B', venueName: 'Room 102' },
        ]),
      })
    );
  };

  test('renders the PopupForm when open', async () => {
    mockFetchVenues();
    render(<PopupForm isOpen={true} onClose={mockCloseFunction} />);

    await waitFor(() => {
      expect(screen.getByLabelText('Venue:')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Building A')).toBeInTheDocument();
      expect(screen.getByText('Building B')).toBeInTheDocument();
    });
  });

  test('does not render the PopupForm when closed', () => {
    render(<PopupForm isOpen={false} onClose={mockCloseFunction} />);
    expect(screen.queryByText('Submit a Report')).not.toBeInTheDocument();
  });

  test.skip('allows only JPEG or PNG files for photo upload', async () => {
    mockFetchVenues();
    render(<PopupForm isOpen={true} onClose={mockCloseFunction} />);

    const fileInput = screen.getByLabelText('Upload Photos (PNG & JPEG Only)');

    const validFile = new File(['valid image'], 'image.jpg', { type: 'image/jpeg' });
    const invalidFile = new File(['invalid file'], 'document.pdf', { type: 'application/pdf' });

    window.alert = jest.fn();

    fireEvent.change(fileInput, { target: { files: [validFile, invalidFile] } });

    expect(window.alert).toHaveBeenCalledWith('Please upload only JPEG or PNG images.');
  });

  test('shows validation error if required fields are missing', () => {
    mockFetchVenues();
    render(<PopupForm isOpen={true} onClose={mockCloseFunction} />);

    fireEvent.click(screen.getByText('Submit'));

    expect(screen.getByLabelText('Venue:')).toBeInvalid();
    expect(screen.getByLabelText('Room Number:')).toBeInvalid();
    expect(screen.getByLabelText('Type of Concern:')).toBeInvalid();
    expect(screen.getByLabelText('Report Text:')).toBeInvalid();
  });

  // test('submits the form successfully with photos', async () => {
  //   mockFetchVenues();

  //   // Mock fetch for report submission
  //   global.fetch = jest.fn().mockResolvedValueOnce({
  //     ok: true,
  //     json: () => Promise.resolve(),
  //   });

  //   const validFile = new File(['valid image'], 'image.jpg', { type: 'image/jpeg' });
  //   render(<PopupForm isOpen={true} onClose={mockCloseFunction} />);

  //   fireEvent.change(screen.getByLabelText('Venue:'), { target: { value: 'Building A' } });
  //   fireEvent.change(screen.getByLabelText('Room Number:'), { target: { value: 'Room 101' } });
  //   fireEvent.change(screen.getByLabelText('Type of Concern:'), { target: { value: 'Safety' } });
  //   fireEvent.change(screen.getByLabelText('Report Text:'), { target: { value: 'Test issue description' } });
  //   fireEvent.change(screen.getByLabelText('Upload Photos (PNG & JPEG Only)'), { target: { files: [validFile] } });

  //   fireEvent.click(screen.getByText('Submit'));

  //   await waitFor(() => {
  //     expect(global.fetch).toHaveBeenCalledTimes(1);
  //   });

  //   expect(mockCloseFunction).toHaveBeenCalled();
  // });

  // test('shows an error message if the photo upload fails', async () => {
  //   mockFetchVenues();

  //   global.fetch = jest.fn().mockRejectedValueOnce(new Error('Failed to upload'));

  //   window.alert = jest.fn();

  //   render(<PopupForm isOpen={true} onClose={mockCloseFunction} />);

  //   fireEvent.change(screen.getByLabelText('Venue:'), { target: { value: 'Building A' } });
  //   fireEvent.change(screen.getByLabelText('Room Number:'), { target: { value: 'Room 101' } });
  //   fireEvent.change(screen.getByLabelText('Type of Concern:'), { target: { value: 'Safety' } });
  //   fireEvent.change(screen.getByLabelText('Report Text:'), { target: { value: 'Test issue description' } });

  //   fireEvent.click(screen.getByText('Submit'));

  //   await waitFor(() => {
  //     expect(global.fetch).toHaveBeenCalledTimes(1);
  //     expect(window.alert).toHaveBeenCalledWith('Failed to upload');
  //   });
  // });


  
  test('handles getAllVenues API failure', async () => {
    // Mock the fetch function to reject with an error
    global.fetch = jest.fn().mockRejectedValueOnce(new Error('Failed to fetch venues'));
  
    // Silence console.error to prevent unnecessary output
    jest.spyOn(console, 'error').mockImplementation(() => {});
  
    render(<PopupForm isOpen={true} onClose={mockCloseFunction} />);
  
    // Expect an error to be logged
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error:', expect.any(Error));
    });
  
    console.error.mockRestore();
  });

  
  test('closes the form when the close button is clicked', async () => {
    mockFetchVenues();
    render(<PopupForm isOpen={true} onClose={mockCloseFunction} />);

    fireEvent.click(screen.getByText('X'));

    expect(mockCloseFunction).toHaveBeenCalled();
  });

  test('handles API fetch failure gracefully', async () => {
    global.fetch = jest.fn(() => Promise.reject('API is down'));

    jest.spyOn(console, 'error').mockImplementation(() => {}); // Silence console.error

    render(<PopupForm isOpen={true} onClose={mockCloseFunction} />);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error:', 'API is down');
    });

    console.error.mockRestore();
  });

  test.skip('accepts multiple valid image files for upload', async () => {
    mockFetchVenues();

    render(<PopupForm isOpen={true} onClose={mockCloseFunction} />);

    const fileInput = screen.getByLabelText('Upload Photos (PNG & JPEG Only)');

    const validFile1 = new File(['image1'], 'image1.jpg', { type: 'image/jpeg' });
    const validFile2 = new File(['image2'], 'image2.png', { type: 'image/png' });

    fireEvent.change(fileInput, { target: { files: [validFile1, validFile2] } });

    expect(fileInput.files).toHaveLength(2);
    expect(fileInput.files[0].name).toBe('image1.jpg');
    expect(fileInput.files[1].name).toBe('image2.png');
  });
});
