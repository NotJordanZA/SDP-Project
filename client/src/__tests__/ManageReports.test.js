import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router, MemoryRouter } from 'react-router-dom';
import * as router from 'react-router-dom';
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import ManageReports from '../pages/ManageReports';
import {fetchAllReports} from '../utils/AdminfetchAllReports';
import { getCurrentUser } from '../utils/getCurrentUser';


jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock('../firebase', () => ({
  auth: {
      currentUser: null //Default mock value
  }
}));

jest.mock("firebase/auth", () => ({
      getAuth: jest.fn(() => ({currentUser: { email: 'test@wits.ac.za' }})),
      onAuthStateChanged: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getDoc: jest.fn(() => Promise.resolve({
    data: () => ({ isAdmin: true })  // Mock Firestore document with isAdmin
  })),
}));

jest.mock('../utils/getCurrentUser');

jest.mock('../utils/AdminfetchAllReports', () => ({
  fetchAllReports: jest.fn(),
  
  }));
describe('ManageReports Component', () => {

  beforeEach(() => {
    auth.currentUser = { email: 'test@wits.ac.za' };
    onAuthStateChanged.mockImplementation((auth, callback) => {
      // Simulate that a user is logged in, and return a mock unsubscribe function
      callback({ email: 'test@wits.ac.za' });
      // console.log("Unsubscribe returned!");
      return jest.fn(); // This is the mock unsubscribe function
    });
    navigate = jest.fn();

    // Mock useNavigate with this new mock navigate function
    
    jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate);
    fetchAllReports.mockImplementation((setReports)=>{
      setReports([
        {
          
            venueID:  "MSL 2005",
            reportType: "Equipment",
            reportStatus: "pending",
            createdBy: "test@students.wits.ac.za",
            resolutionLog: "Handle",
            reportText: "Broken Light"
            
        },
        {
          venueID:  "MSL 3005",
          reportType: "Safety",
          reportStatus: "In Progress",
          createdBy: "test2@students.wits.ac.za",
          resolutionLog: "__",
           reportText: "Broken Light2"
        },
        {
          venueID:  "MSL 1005",
          reportType: "Maintenance Issue",
          reportStatus: "pending",
          createdBy: "test@3students.wits.ac.za",
          resolutionLog: "Handle2",
          reportText: "Broken Light3"
      }
    ]);
    });

  });

  test('renders static ManageReports components', () => {
    render(
    
        < ManageReports />
 
    );
    expect(screen.getByText('Reports Management')).toBeInTheDocument();
    expect(screen.getByText('Pending Reports')).toBeInTheDocument();
    expect(screen.getByText('In Progress Reports')).toBeInTheDocument();
    expect(screen.getByText('Resolved Reports')).toBeInTheDocument();
  });
  test('renders ManageReports component', () => {
    render(<ManageReports />);
    expect(screen.getByText('Reports Management')).toBeInTheDocument();
  });

  test.skip('displays reports message', () => {
    render(<ManageReports />);
    expect(screen.getByText('Here are your reports...')).toBeInTheDocument();
  });


  test.skip('searches reports by email or venue', async () => {
    fetchAllReports.mockImplementation((setReports) => {
      setReports([
        {
          id: "1",
          venueID: "MSL 2005",
          reportType: "Equipment",
          reportStatus: "pending",
          createdBy: "test@students.wits.ac.za",
          resolutionLog: "Handle",
          reportText: "Broken Light"
        },
        {
          id: "2",
          venueID: "MSL 2006",
          reportType: "Safety",
          reportStatus: "pending",
          createdBy: "test2@students.wits.ac.za",
          resolutionLog: "",
          reportText: "Safety Issue"
        }
      ]);
    });
  
    render(<ManageReports />);
  
    fireEvent.change(screen.getByPlaceholderText(/search by email or venue/i), { target: { value: 'test@students.wits.ac.za' } });
  
    expect(await screen.findByText('Broken Light')).toBeInTheDocument();
    expect(screen.queryByText('Safety Issue')).not.toBeInTheDocument();
  });
  


});