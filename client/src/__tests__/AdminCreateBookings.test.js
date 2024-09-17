import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AdminCreateBooking from '../components/AdminCreateBookings';

// Mock the API calls
global.fetch = jest.fn();

describe('AdminCreateBooking', () => {
    // Mock venues
    const mockVenues = [
        { id: 1, venueName: 'FNB35', venueCapacity: 100, venueType: 'Lecture Venue', timeSlots: ['09:00', '10:00'] },
        { id: 2, venueName: 'MSL004', venueCapacity: 200, venueType: 'Lab', timeSlots: ['11:00', '12:00'] },
    ];
    beforeEach(() => {
        // Reset the fetch mock before each test
        fetch.mockClear();
    });
    // For react-calendar
    beforeAll(() => {
        global.ResizeObserver = class {
            observe() {}
            unobserve() {}
            disconnect() {}
        };
    });

    test('Renders the calendar, filters, and clear button', () => {
        render(<AdminCreateBooking />);

        // Check if the calendar is displayed
        expect(screen.getByText('Select a Date:')).toBeInTheDocument();

        // Check for filters
        expect(screen.getByLabelText('Venue Capacity:')).toBeInTheDocument();
        expect(screen.getByLabelText('Venue Type:')).toBeInTheDocument();

        // Check for the clear button
        expect(screen.getByText('Clear Search')).toBeInTheDocument();
    });

    test('Fetches venues on mount', async () => {
        // Mock API response with venue data
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve(mockVenues),
            })
        );

        render(<AdminCreateBooking />);

        // Wait for the venues to be loaded
        await waitFor(() => {
            expect(screen.getByText('FNB35')).toBeInTheDocument();
            expect(screen.getByText('MSL004')).toBeInTheDocument();
        });
    });

    test('Filters venues based on capacity', async () => {
        // Mock API response with venue data
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve(mockVenues),
            })
        );

        render(<AdminCreateBooking />);

        // Wait for the venues to be loaded
        await waitFor(() => {
            expect(screen.getByText('FNB35')).toBeInTheDocument();
            expect(screen.getByText('MSL004')).toBeInTheDocument();
        });

        // Select a capacity
        fireEvent.change(screen.getByLabelText('Venue Capacity:'), { target: { value: '200' } });

        // Expect only MSL004 to be displayed
        await waitFor(() => {
            expect(screen.queryByText('FNB35')).not.toBeInTheDocument();
            expect(screen.getByText('MSL004')).toBeInTheDocument();
        });
    });

    test('filters venues based on type', async () => {
        // Mock API response with venue data
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve(mockVenues),
            })
        );

        render(<AdminCreateBooking />);

        // Wait for the venues to load
        await waitFor(() => {
            expect(screen.getByText('FNB35')).toBeInTheDocument();
            expect(screen.getByText('MSL004')).toBeInTheDocument();
        });

        // Select a venue type
        fireEvent.change(screen.getByLabelText('Venue Type:'), { target: { value: 'Lecture Venue' } });

        // Expect only FNB35 to be displayed
        await waitFor(() => {
            expect(screen.getByText('FNB35')).toBeInTheDocument();
            expect(screen.queryByText('MSL004')).not.toBeInTheDocument();
        });
    });
});
