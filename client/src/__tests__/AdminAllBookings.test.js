import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AdminAllBookings from '../components/AdminAllBookings';
import EditBooking from '../pages/ManageBookingsEdit';

// Mock the API calls
global.fetch = jest.fn();

// Mock EditBooking component
jest.mock('../pages/ManageBookingsEdit', () => () =>
     <div>
        <button>Save</button>
        <button>Cancel</button>
     </div>
);
// Mock booking data
describe('AdminAllBookings Component', () => {
  const mockBookings = [
    {
      id: 1,
      bookingDate: '2024-09-15',
      bookingStartTime: '10:00',
      bookingEndTime: '12:00',
      venueBooker: 'test@students.wits.ac.za',
      venueID: 'CLM103',
    },
    {
      id: 2,
      bookingDate: '2024-09-16',
      bookingStartTime: '14:00',
      bookingEndTime: '16:00',
      venueBooker: 'lecturer@wits.ac.za',
      venueID: 'FNB35',
    },
  ];
  // Mock API calls
  beforeEach(() => {
    fetch.mockClear();
    fetch.mockImplementation((url) => {
      if (url === '/api/bookings') { // Mock call to get All Bookings
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ bookings: mockBookings }),
        });
      } else if (url.includes('/api/bookings/') && fetch.mock.calls.length === 1) { // Mock all other bookings API calls
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        });
      }
    });
  });

  test('Displays all bookings correctly', async () => {
    render(<AdminAllBookings />);

    // Check if the bookings are fetched and rendered
    await waitFor(() => {
      expect(screen.getByText('2024-09-15')).toBeInTheDocument();
      expect(screen.getByText('Booked by: test@students.wits.ac.za')).toBeInTheDocument();
      expect(screen.getByText('Venue Name: CLM103')).toBeInTheDocument();

      expect(screen.getByText('2024-09-16')).toBeInTheDocument();
      expect(screen.getByText('Booked by: lecturer@wits.ac.za')).toBeInTheDocument();
      expect(screen.getByText('Venue Name: FNB35')).toBeInTheDocument();
    });
  });

  test('Filters bookings by date', async () => {
    render(<AdminAllBookings />);

    // Wait for the bookings to be loaded
    await waitFor(() => {
      expect(screen.getByText('2024-09-15')).toBeInTheDocument();
      expect(screen.getByText('2024-09-16')).toBeInTheDocument();
    });

    // Filter by specific date
    fireEvent.change(screen.getByLabelText('Filter by Date:'), {
      target: { value: '2024-09-15' },
    });

    // Check if the filtered bookings are displayed correctly
    await waitFor(() => {
      expect(screen.getByText('2024-09-15')).toBeInTheDocument();
      expect(screen.queryByText('2024-09-16')).not.toBeInTheDocument();
    });
  });

  test('Filters bookings by booker email', async () => {
    render(<AdminAllBookings />);

    // Wait for the bookings to be loaded
    await waitFor(() => {
      expect(screen.getByText('2024-09-15')).toBeInTheDocument();
      expect(screen.getByText('2024-09-16')).toBeInTheDocument();
    });

    // Filter by students
    fireEvent.change(screen.getByLabelText('Filter by Booker Email (Lecturer/Student):'), {
      target: { value: '@students.wits.ac.za' },
    });

    // Check if the filtered bookings are displayed correctly
    await waitFor(() => {
      expect(screen.getByText('2024-09-15')).toBeInTheDocument();
      expect(screen.queryByText('2024-09-16')).not.toBeInTheDocument();
    });
  });

  test('Clicking edit opens edit page', async () => {
    render(<AdminAllBookings />);

    // Wait for the bookings to be loaded
    await waitFor(() => {
      expect(screen.getByText('2024-09-15')).toBeInTheDocument();
    });

    // Click the Edit button for the first booking
    fireEvent.click(screen.getAllByText('Edit')[0]);

    // Check if the EditBooking component is displayed
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  test('Clicking delete calls the API', async () => {
    render(<AdminAllBookings />);

    // Wait for the bookings to be loaded
    await waitFor(() => {
      expect(screen.getByText('2024-09-15')).toBeInTheDocument();
    });

    // Click the delete button for the first booking
    fireEvent.click(screen.getAllByText('Delete')[0]);

    // Wait for the call to the API to be made
    await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/bookings/1', { method: 'DELETE' }); // Expect the API to be called with DELETE
    })
  });
});
