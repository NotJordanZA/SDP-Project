import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ManageVenues from '../pages/ManageVenues';
import * as router from 'react-router-dom'; // Import react-router-dom and assign to router

// Mocking necessary modules and functions
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const navigate = jest.fn();

describe('ManageVenues Component', () => {
  beforeEach(() => {
    jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate);
    // Mock window.confirm
    window.confirm = jest.fn(() => true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('toggles venue status', async () => {
    // Mock the initial state or data to ensure the button is present
    const mockVenues = [
      { id: 1, venueName: 'Test Venue', venueCapacity: '100', venueType: 'Lecture Venue', isClosed: false }
    ];

    // Render the component with mock data
    await act(async () => {
      render(
        <MemoryRouter>
          <ManageVenues venues={mockVenues} />
        </MemoryRouter>
      );
    });

    // Find all toggle buttons
    const toggleButtons = await screen.findAllByText('Close Venue', { selector: 'button' });
    
    // Interact with the first toggle button
    fireEvent.click(toggleButtons[0]);
    const openButtons = await screen.findAllByText('Open Venue', { selector: 'button' });
    expect(openButtons.length).toBeGreaterThan(0);
    
    // Interact with the first "Open Venue" button
    fireEvent.click(openButtons[0]);
    const closeButtons = await screen.findAllByText('Close Venue', { selector: 'button' });
    expect(closeButtons.length).toBeGreaterThan(0);
  });

  test('displays all venues', async () => {
    // Mock the initial state or data to ensure the venues are present
    const mockVenues = [
      { id: 1, venueName: 'Venue 1', venueCapacity: '100', venueType: 'Lecture Venue', isClosed: false },
      { id: 2, venueName: 'Venue 2', venueCapacity: '200', venueType: 'Lab', isClosed: false }
    ];

    // Render the component with mock data
    await act(async () => {
      render(
        <MemoryRouter>
          <ManageVenues venues={mockVenues} />
        </MemoryRouter>
      );
    });

    // Check if all venues are displayed
    await waitFor(() => {
      const venue1 = screen.getByText('Venue 1');
      const venue2 = screen.getByText('Venue 2');

      expect(venue1).toBeInTheDocument();
      expect(venue2).toBeInTheDocument();
    });
  });

  test('allows admin to create a new venue', async () => {
    // Mock the initial state or data to ensure the form is present
    const mockVenues = [];

    // Render the component with mock data
    await act(async () => {
      render(
        <MemoryRouter>
          <ManageVenues venues={mockVenues} />
        </MemoryRouter>
      );
    });

    // Open the form
    fireEvent.click(screen.getByText('Add Venue'));

    // Find and fill the form fields
    fireEvent.change(screen.getByPlaceholderText('Building Name'), { target: { value: 'New Building' } });
    fireEvent.change(screen.getByPlaceholderText('Venue Name'), { target: { value: 'New Venue' } });
    fireEvent.change(screen.getByPlaceholderText('Capacity'), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText('Campus'), { target: { value: 'East' } });
    fireEvent.change(screen.getByLabelText('Venue Type'), { target: { value: 'Lecture Venue' } });

    // Submit the form
    fireEvent.click(screen.getByText('Save'));

    // Wait for the new venue to appear in the list
    await waitFor(() => {
      const newVenue = screen.getByText('New Venue');
      expect(newVenue).toBeInTheDocument();
    });
  });
});