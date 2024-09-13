import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Reports from '../pages/reports';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

jest.mock('../firebase', () => ({
    auth: {
        currentUser: { email: 'test@wits.ac.za' }, // Mock email
    },
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'), // Mocking react router dom
    useNavigate: jest.fn(),
}));

// Mock for fetch that simulates the API with query parameter filtering
global.fetch = jest.fn((url) => {
    // Parse the URL to get the query parameters
    const urlObj = new URL(url, 'http://localhost'); // assuming 'localhost' is the base URL
    const createdBy = urlObj.searchParams.get('createdBy');

    // Example mock data
    const mockReportsData = [
        {
            id: '1',
            reportType: 'Safety',
            reportText: 'Broken window',
            reportStatus: 'Pending',
            createdBy: 'test@wits.ac.za',
            venueID: 'MSL001',
            roomNumber: '101'
        },
        {
            id: '2',
            reportType: 'Equipment',
            reportText: 'Projector issue',
            reportStatus: 'Resolved',
            createdBy: 'another@wits.ac.za',
            venueID: 'MSL002',
            roomNumber: '102'
        }
    ];

    // Filter mock reports based on the createdBy query parameter
    let filteredReports = mockReportsData;
    if (createdBy) {
        filteredReports = filteredReports.filter(report => report.createdBy === createdBy);
    }

    return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(filteredReports),
    });
});

describe('Reports Page', () => {
    const mockNavigate = jest.fn();

    beforeEach(() => {
        fetch.mockClear(); // Clear existing fetch mocks
        jest.clearAllMocks(); // Clear other mocks
        useNavigate.mockReturnValue(mockNavigate); // Mock useNavigate
    });

    test('Renders static components of Reports page', () => {
        render(<Reports />, { wrapper: MemoryRouter });

        const submitButton = screen.getByRole('button', { name: /Submit a Report/i });
        const reportListHeading = screen.getByRole('heading', { name: /My Reports/i });

        expect(submitButton).toBeInTheDocument();
        expect(reportListHeading).toBeInTheDocument();
    });

    test('Toggles the popup form when "Submit a Report" button is clicked', async () => {
        render(<Reports />, { wrapper: MemoryRouter });
    
        // Initially, the popup should not be open
        expect(screen.queryByText(/Room Number:/i)).not.toBeInTheDocument();
    
        // Click the "Submit" button to open the popup
        const submitButton = screen.getByRole('button', { name: /Submit/i });
        fireEvent.click(submitButton);
    
        // Check if the popup is now rendered
        await waitFor(() => {
            // Look for a unique element in the PopupForm, such as the "Submit" button or form heading
            expect(screen.getByText(/Room Number:/i)).toBeInTheDocument();
        });
    });


    test('Displays "No reports available" when there are no reports for the user', async () => {
        // Mock fetch to return no reports
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve([]),
            })
        );

        render(<Reports />, { wrapper: MemoryRouter });

        await waitFor(() => {
            const noReportsMessage = screen.getByText(/No reports available/i);
            expect(noReportsMessage).toBeInTheDocument();
        });
    });

    test('Redirects to /login if user is not logged in', async () => {
        // Set the current user to null
        auth.currentUser = null;

        render(
            <MemoryRouter>
                <Reports />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/login');
        });
    });
});
