import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AdminRecurringBookings from '../components/AdminRecurringBookings';  // Adjust path accordingly

// Mock the API calls
global.fetch = jest.fn();

describe('AdminRecurringBookings Component', () => {
  const mockVenues = [ // Mock Venues
    { id: 1, venueName: 'CLM102', venueCapacity: 100 },
    { id: 2, venueName: 'FNB35', venueCapacity: 200 },
  ];

  const mockSchedules = [ // Mock Schedules
    { venueID: 'CLM102', bookingDay: 'Monday', bookingStartTime: '08:00', bookingEndTime: '08:45' },
  ];

  // Mock API calls
  beforeEach(() => {
    fetch.mockClear();
    fetch.mockImplementation((url) => {
      if (url === '/api/venues') { // Mock call to get All venues
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockVenues),
        });
      } else if (url.includes('/api/schedules') && fetch.mock.calls.length === 0) { // Mock call to get all schedule entries
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockSchedules),
        });
      } else if (url.includes('/api/schedules/') && fetch.mock.calls.length === 1) { // Mock all other schedules API calls
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        });
      }
    });
  });

  test('Displays static components', async () => {
    render(<AdminRecurringBookings />);

    // Check if venues are fetched and rendered
    expect(screen.getByLabelText('Filter by Capacity:')).toBeInTheDocument();
  });

  test('Fetches and displays venues correctly', async () => {
    render(<AdminRecurringBookings />);

    // Check if venues are fetched and rendered
    await waitFor(() => {
      expect(screen.getByText('CLM102')).toBeInTheDocument();
      expect(screen.getByText('FNB35')).toBeInTheDocument();
    });
  });

  test('Displays schedule table and marks booked slots', async () => {
    render(<AdminRecurringBookings />);

    // Wait for venues and schedules to load
    await waitFor(() => {
      expect(screen.getByText('CLM102')).toBeInTheDocument();
    });

    // Expand CLM102 to see its schedule
    fireEvent.click(screen.getAllByText('Show Schedule')[0]);

    // Check if the schedule table is rendered
    await waitFor(() => {
      expect(screen.getByText('Time')).toBeInTheDocument();
      expect(screen.getByText('Monday')).toBeInTheDocument();
      expect(screen.getByText('08:00')).toBeInTheDocument();
    });
  });
});
