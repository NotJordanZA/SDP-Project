// Polyfill TextDecoder and TextEncoder for Firebase compatibility in Node.js environment
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PopupForm from '../components/PopupForm';

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

// Mock venues API fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([
      { buildingName: 'Building A', venueName: 'Room 101' },
      { buildingName: 'Building B', venueName: 'Room 102' },
    ]),
  })
);

describe('PopupForm Component', () => {
  const mockCloseFunction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the PopupForm when open', () => {
    render(<PopupForm isOpen={true} onClose={mockCloseFunction} />);
    
    // Check if form elements are rendered
    expect(screen.getByText('Submit a Report')).toBeInTheDocument();
    expect(screen.getByLabelText('Venue:')).toBeInTheDocument();
    expect(screen.getByLabelText('Room Number:')).toBeInTheDocument();
    expect(screen.getByLabelText('Type of Concern:')).toBeInTheDocument();
    expect(screen.getByLabelText('Report Text:')).toBeInTheDocument();
    expect(screen.getByLabelText('Upload Photos:')).toBeInTheDocument();
  });

  test('does not render the PopupForm when closed', () => {
    render(<PopupForm isOpen={false} onClose={mockCloseFunction} />);

    // Expect the form not to be rendered
    expect(screen.queryByText('Submit a Report')).not.toBeInTheDocument();
  });
});
