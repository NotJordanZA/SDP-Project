// import React from 'react';
// import { render, screen, fireEvent } from '@testing-library/react';
// import '@testing-library/jest-dom/extend-expect';
// import ManageVenues from '../pages/ManageVenues';

// describe('ManageVenues Component', () => {
//   // test('renders ManageVenues component', () => {
//   //   render(<ManageVenues />);
//   //   expect(screen.getByText('List of Venues')).toBeInTheDocument();
//   // });

// //   test('displays all venues initially', () => {
// //     render(<ManageVenues />);
// //     expect(screen.getByText('WSS03')).toBeInTheDocument();
// //     expect(screen.getByText('RSEH')).toBeInTheDocument();
// //     expect(screen.getByText('CLM103')).toBeInTheDocument();
// //     expect(screen.getByText('FNB35')).toBeInTheDocument();
// //   });

// //   test('filters venues based on search term', () => {
// //     render(<ManageVenues />);
// //     const searchInput = screen.getByPlaceholderText('Search venues...');
// //     fireEvent.change(searchInput, { target: { value: 'FNB' } });
// //     expect(screen.queryByText('WSS001')).not.toBeInTheDocument();
// //     expect(screen.queryByText('Great Hall')).not.toBeInTheDocument();
// //     expect(screen.queryByText('CLM102')).not.toBeInTheDocument();
// //     expect(screen.getByText('FNB35')).toBeInTheDocument();
// //   });
// // });

// // test('adds a new venue', () => {
// //   render(<ManageVenues />);
// //   fireEvent.click(screen.getByText('Add Venue'));
// //   fireEvent.change(screen.getByPlaceholderText('Building Name'), { target: { value: 'New Building' } });
// //   fireEvent.change(screen.getByPlaceholderText('Venue Name'), { target: { value: 'New Venue' } });
// //   fireEvent.change(screen.getByPlaceholderText('Capacity'), { target: { value: '100' } });
// //   fireEvent.change(screen.getByPlaceholderText('Venue Type'), { target: { value: 'Lecture Venue' } });
// //   fireEvent.click(screen.getByText('Save'));
// //   expect(screen.getByText('New Venue')).toBeInTheDocument();
// // });

// // test('edits an existing venue', () => {
// //   render(<ManageVenues />);
// //   fireEvent.click(screen.getByText('Edit', { selector: 'button' }));
// //   fireEvent.change(screen.getByPlaceholderText('Venue Name'), { target: { value: 'Updated Venue' } });
// //   fireEvent.click(screen.getByText('Save'));
// //   expect(screen.getByText('Updated Venue')).toBeInTheDocument();
// // });

// // test('deletes a venue', () => {
// //   render(<ManageVenues />);
// //   fireEvent.click(screen.getByText('Delete', { selector: 'button' }));
// //   expect(screen.queryByText('WSS001')).not.toBeInTheDocument();
//  });

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
    // Mock the initial state with multiple venues
    const mockVenues = [
      { id: 1, venueName: 'Venue 1', venueCapacity: '100', venueType: 'Lecture Venue', isClosed: false, buildingName: 'Building1', campus: 'Campus1', timeSlots: ['08:00', '09:00'] },
      { id: 2, venueName: 'Venue 2', venueCapacity: '200', venueType: 'Lab', isClosed: true, buildingName: 'Building2', campus: 'Campus2', timeSlots: ['10:00', '11:00'] },
      { id: 3, venueName: 'Venue 3', venueCapacity: '300', venueType: 'Auditorium', isClosed: false, buildingName: 'Building3', campus: 'Campus3', timeSlots: ['12:00', '13:00'] }
    ];

    // Render the component with mock data
    await act(async () => {
      render(
        <MemoryRouter>
          <ManageVenues venues={mockVenues} />
        </MemoryRouter>
      );
    });

    // Log the rendered output for debugging
    screen.debug();

    // Check if all venues are displayed
    mockVenues.forEach(venue => {
      expect(screen.getByText(venue.venueName)).toBeInTheDocument();
      expect(screen.getByText(`Capacity: ${venue.venueCapacity}`)).toBeInTheDocument();
      expect(screen.getByText(`Venue Type: ${venue.venueType}`)).toBeInTheDocument();
    });
  });
});