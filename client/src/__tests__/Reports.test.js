import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Reports from '../pages/reports';
import PopupForm from '../components/PopupForm';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

jest.mock('../firebase', () => ({
    auth: {
        currentUser: { email: 'test@wits.ac.za' }, //mock email
    },
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'), //mocking react router dom
    useNavigate: jest.fn(),
}));

global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true, 
        json: () => Promise.resolve([
            {
                id: '1',
                reportType: 'Safety',
                reportText: 'Broken window',
                reportStatus: 'Pending',
                createdBy: 'test@wits.ac.za',               //mock data
                venueID: 'MSL001',
            },
            {
                id: '2',
                reportType: 'Equipment',
                reportText: 'Projector issue',
                reportStatus: 'Resolved',
                createdBy: 'another@wits.ac.za',
                venueID: 'MSL002',
            }
        ]),
    })
);

describe('Reports Page', () => {
    const mockNavigate = jest.fn();

    beforeEach(() => {
        fetch.mockClear(); //clear existing mocks
        jest.clearAllMocks();
        useNavigate.mockReturnValue(mockNavigate); 
    });

    test('Renders Static Reports Components', () => { //does it actually render the page
        render(<Reports />, { wrapper: MemoryRouter });

        const reportPage = screen.getByRole('button', { name: /Submit a Report/i });
        const reportList = screen.getByRole('heading', { name: /My Reports/i });

        expect(reportPage).toBeInTheDocument();
        expect(reportList).toBeInTheDocument();
    });

    test('Displays "No reports available" when there are no reports for the user', async () => { //what happens if theres no reports associated with the user
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve([]),
            })
        );

        render(<Reports />, { wrapper: MemoryRouter });

        await waitFor(() => {
            const noReports = screen.getByText(/No reports available/i); //expected result
            expect(noReports).toBeInTheDocument();
        });
    });

    test('Redirects to /login if user is not logged in', async () => { //does it kick you out if you not logged in
        auth.currentUser = null; //set user null
    
        render(
            <MemoryRouter>
                <Reports />
            </MemoryRouter>
        );
    
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/login'); //if it does this then it worked
        });
    });
    
});
