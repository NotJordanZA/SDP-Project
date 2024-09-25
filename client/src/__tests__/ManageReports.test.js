import React from 'react';
import { render, screen, fireEvent,within } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import * as router from 'react-router-dom';
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import ManageReports from '../pages/ManageReports';
import { fetchAllReports, updateRep } from '../utils/AdminfetchAllReports';
import { waitFor } from '@testing-library/react';

// Mock necessary modules
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock('../firebase', () => ({
  auth: { currentUser: null }, // Default mock value for auth.currentUser
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({ currentUser: { email: 'test@wits.ac.za' } })),
  onAuthStateChanged: jest.fn(),
}));

jest.mock('../utils/AdminfetchAllReports', () => ({
  fetchAllReports: jest.fn(),
  updateRep: jest.fn(),
}));
updateRep.mockResolvedValueOnce({});

describe('ManageReports Component - Set Report to In Progress', () => {
  let navigate;

  beforeEach(() => {
    // Set up mock auth state
    auth.currentUser = { email: 'test@wits.ac.za' };
    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback({ email: 'test@wits.ac.za' });
      return jest.fn(); // Mock unsubscribe function
    });

    // Set up mock for navigation
    navigate = jest.fn();
    jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate);

    // Mock fetchAllReports
    fetchAllReports.mockImplementation((setReports) => {
      setReports([
        {
          id: "1",
          venueID: "MSL 2005",
          reportType: "Equipment",
          reportStatus: "pending",
          createdBy: "test@students.wits.ac.za",
          resolutionLog: "Handle",
          reportText: "Broken Light",
          photos: ['image1.jpg'],
        },
        {
          id: "2",
          venueID: "MSL 3005",
          reportType: "Safety",
          reportStatus: "In Progress",
          createdBy: "test2@students.wits.ac.za",
          resolutionLog: "__",
          reportText: "Broken Light2",
          photos: [],
        },
        {
          id: "3",
          venueID: "MSL 1005",
          reportType: "Maintenance Issue",
          reportStatus: "pending",
          createdBy: "test3@students.wits.ac.za",
          resolutionLog: "Handle2",
          reportText: "Broken Light3",
          photos: ['image2.jpg'],
        },
      ]);
    });
  });

  test('fetches reports on mount and displays them', async () => {
    render(<ManageReports />);
  
    // Adjust the expectation to match the actual number of calls
    expect(fetchAllReports).toHaveBeenCalledTimes(1);
  
    // Check if the reports are displayed after fetching
    expect(screen.getByText('Broken Light')).toBeInTheDocument();
    expect(screen.getByText('Broken Light3')).toBeInTheDocument();
  });
  


  test('switches between all tabs using handleTabChange', async () => {
    render(<ManageReports />);
  
    // Check default tab "Pending" is active
    expect(screen.getByText('Pending Reports')).toHaveClass('active');
  
    // Switch to "In Progress"
    fireEvent.click(screen.getByText('In Progress Reports'));
    expect(screen.getByText('In Progress Reports')).toHaveClass('active');
    expect(screen.getByText('Broken Light2')).toBeInTheDocument();
    
    // Switch to "Resolved" tab
    fireEvent.click(screen.getByText('Resolved Reports'));
    expect(screen.getByText('Resolved Reports')).toHaveClass('active');
  
    // Switch back to "Pending" tab
    fireEvent.click(screen.getByText('Pending Reports'));
    expect(screen.getByText('Pending Reports')).toHaveClass('active');
    expect(screen.getByText('Broken Light')).toBeInTheDocument();
  });
  

  test('opens and closes image modal with multiple images', async () => {
    render(<ManageReports />);
  
    // Click on the first image to open the modal
    fireEvent.click(screen.getAllByAltText(/Report 1/)[0]);
    expect(screen.getByRole('img', { name: 'Enlarged' })).toBeInTheDocument();
  
    // Close the modal by clicking the close button
    fireEvent.click(screen.getByText('X'));
    expect(screen.queryByRole('img', { name: 'Enlarged' })).not.toBeInTheDocument();
  
    // Open the second image and close by clicking outside
    fireEvent.click(screen.getAllByAltText(/Report 1/)[1]);
    expect(screen.getByRole('img', { name: 'Enlarged' })).toBeInTheDocument();
  
    // Close the modal by clicking the "X"
    fireEvent.click(screen.getByText('X'));
    expect(screen.queryByRole('img', { name: 'Enlarged' })).not.toBeInTheDocument();
  });
  
  
  // Test for static rendering of the ManageReports components
  test('renders static ManageReports components', () => {
    render(<ManageReports />);
    expect(screen.getByText('Reports Management')).toBeInTheDocument();
    expect(screen.getByText('Pending Reports')).toBeInTheDocument();
    expect(screen.getByText('In Progress Reports')).toBeInTheDocument();
    expect(screen.getByText('Resolved Reports')).toBeInTheDocument();
  });

  // Test for rendering and checking report content
  test('renders reports and checks report content', async () => {
    render(<ManageReports />);

    // Check if "Pending" reports are displayed
    expect(screen.getByText('Broken Light')).toBeInTheDocument();
    expect(screen.getByText('Broken Light3')).toBeInTheDocument();
    
    // Switch to the "In Progress" tab
    fireEvent.click(screen.getByText('In Progress Reports'));

    // Check if the "In Progress" report is displayed
    expect(screen.getByText('Broken Light2')).toBeInTheDocument();
  });

  // Test for switching between tabs and ensuring proper filtering of reports
  test('switches between tabs and filters reports', async () => {
    render(<ManageReports />);

    // Initial state should show "Pending" reports
    expect(screen.getByText('Broken Light')).toBeInTheDocument();
    expect(screen.getByText('Broken Light3')).toBeInTheDocument();
    
    // Switch to "In Progress"
    fireEvent.click(screen.getByText('In Progress Reports'));
    expect(screen.getByText('Broken Light2')).toBeInTheDocument();
    expect(screen.queryByText('Broken Light')).not.toBeInTheDocument(); // Pending report should not show
  });

  // Expanded test to ensure editing, saving, and cancelling of the resolution log works
  test('edits, saves, and cancels resolution log (covers lines 134-149)', async () => {
    render(<ManageReports />);

    // Click the "Edit Resolution Log" button for the first report
    fireEvent.click(screen.getAllByText('Edit Resolution Log')[0]);

    // Enter a new resolution log and save it
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Fixed issue' } });
    fireEvent.click(screen.getByText('Save'));

    // Check if the new resolution log is displayed
    expect(await screen.findByText('Fixed issue')).toBeInTheDocument();

    // Test cancelling the edit
    fireEvent.click(screen.getAllByText('Edit Resolution Log')[0]);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Cancelled update' } });
    fireEvent.click(screen.getByText('Cancel'));
    
    // Ensure the log has not changed after cancelling
    expect(screen.queryByText('Cancelled update')).not.toBeInTheDocument();
    expect(screen.getByText('Fixed issue')).toBeInTheDocument();
  });

  // Test for opening and closing image modal (covers lines 248-251)
  test('opens and closes image modal (covers lines 248-251)', async () => {
    render(<ManageReports />);

    // Click on an image to open the modal
    fireEvent.click(screen.getAllByAltText(/Report 1/)[0]);

    // Check if the modal appears with the enlarged image
    expect(screen.getByRole('img', { name: 'Enlarged' })).toBeInTheDocument();

    // Close the modal
    fireEvent.click(screen.getByText('X'));

    // Ensure the modal closes
    expect(screen.queryByRole('img', { name: 'Enlarged' })).not.toBeInTheDocument();
  });


  test('switches between tabs using handleTabChange', async () => {
    render(<ManageReports />);
  
    // Check the default tab (Pending) is active
    expect(screen.getByText('Pending Reports')).toHaveClass('active');
  
    // Switch to "In Progress" tab
    fireEvent.click(screen.getByText('In Progress Reports'));
  
    // Check that the "In Progress" tab is now active
    expect(screen.getByText('In Progress Reports')).toHaveClass('active');
  
    // Ensure "Broken Light2" (In Progress) report is displayed, and "Broken Light" (Pending) is not
    expect(screen.getByText('Broken Light2')).toBeInTheDocument();
    expect(screen.queryByText('Broken Light')).not.toBeInTheDocument();
  });

  test('closes the image modal when the close button is clicked', async () => {
    render(<ManageReports />);
  
    // Click the image to open the modal
    fireEvent.click(screen.getAllByAltText(/Report 1/)[0]);
  
    // Check if the modal appears with the enlarged image
    expect(screen.getByRole('img', { name: 'Enlarged' })).toBeInTheDocument();
  
    // Click the close button to close the modal
    fireEvent.click(screen.getByText('X'));
  
    // Ensure the modal is closed
    expect(screen.queryByRole('img', { name: 'Enlarged' })).not.toBeInTheDocument();
  });
  
  // test('sets a report to In Progress and verifies the UI is updated', async () => {
  //   // Arrange: Prepare mock reports and ensure updateRep is mocked
  //   const mockReports = [
  //     {
  //       id: "1",
  //       venueID: "MSL 2005",
  //       reportType: "Equipment",
  //       reportStatus: "pending",  // Initial status
  //       createdBy: "test@students.wits.ac.za",
  //       resolutionLog: "Handle",
  //       reportText: "Broken Light",
  //       photos: ['image1.jpg'],
  //     },
  //   ];
  
  //   updateRep.mockResolvedValueOnce({}); // Simulate successful update
  
  //   // Mock the fetchAllReports implementation to return our mock data
  //   fetchAllReports.mockImplementationOnce((setReports) => {
  //     setReports(mockReports);
  //   });
  
  //   // Act: Render the component
  //   render(<ManageReports />);
  
  //   // Assert: Check that the pending report is rendered
  //   expect(screen.getByText('Broken Light')).toBeInTheDocument();
  
  //   // Act: Click the "In Progress" button
  //   const reportCard = screen.getByText('Broken Light').closest('.report-card');
  //   const inProgressButton = within(reportCard).getByText(/In Progress/i);
  //   fireEvent.click(inProgressButton);
  
  //   // Assert: Wait for the `updateRep` function to be called with correct arguments
  //   await waitFor(() => {
  //     expect(updateRep).toHaveBeenCalledWith(
  //       "1", // The report ID
  //       expect.objectContaining({ reportStatus: "In Progress" }) // The updated status
  //     );
  //   });
  
  //   // Assert: Ensure that the UI reflects the updated status
  //   await waitFor(() => {
  //     expect(screen.getByText(/In Progress/i)).toBeInTheDocument();
  //   });
  // }, { timeout: 2000 }); // Extend timeout if necessary

  test('displays "No reports available" when no reports are fetched', async () => {
    fetchAllReports.mockImplementationOnce((setReports) => {
      setReports([]); // Mock empty report list
    });

    render(<ManageReports />);

    // Check if the message for no reports is displayed
    expect(await screen.findByText(/No Pending reports available for this type/)).toBeInTheDocument();
  });

  test('displays "No reports available" when no reports are fetched', async () => {
    fetchAllReports.mockImplementationOnce((setReports) => {
      setReports([]); // Mock empty report list
    });
  
    render(<ManageReports />);
  
    // Check if the message for no reports is displayed
    expect(await screen.findByText(/No Pending reports available for this type/)).toBeInTheDocument();
  });
  
  
  

  test('saves edited resolution log and updates the UI', async () => {
    render(<ManageReports />);
  
    // Click "Edit Resolution Log" for the first report
    fireEvent.click(screen.getAllByText('Edit Resolution Log')[0]);
  
    // Simulate entering new resolution log text
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'New resolution log' } });
  
    // Save the new resolution log
    fireEvent.click(screen.getByText('Save'));
  
    // Check if the new resolution log is displayed
    expect(screen.getByText('New resolution log')).toBeInTheDocument();
  });
  
  test('opens and closes image modal when clicking on a report image', async () => {
    render(<ManageReports />);
  
    // Click the image to open the modal
    fireEvent.click(screen.getAllByAltText(/Report 1/)[0]);
  
    // Check if the modal appears with an enlarged image
    expect(screen.getByRole('img', { name: 'Enlarged' })).toBeInTheDocument();
  
    // Close the modal by clicking the close button
    fireEvent.click(screen.getByText('X'));
  
    // Ensure modal closes
    expect(screen.queryByRole('img', { name: 'Enlarged' })).not.toBeInTheDocument();
  });
  
  
  

  // Test for redirecting to login if the user is not authenticated
  test('redirects to login if user is not authenticated', async () => {
    // Simulate user not logged in by calling onAuthStateChanged with null
    auth.currentUser = null;
    onAuthStateChanged.mockImplementationOnce((auth, callback) => callback(null));
  
    render(<ManageReports />);
  
    // Wait for navigation to happen
    expect(navigate).toHaveBeenCalledWith('/login');
  });
  
});
