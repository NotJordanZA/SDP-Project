import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router, MemoryRouter } from 'react-router-dom';
import * as router from 'react-router-dom';
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import ManageRequests from '../pages/ManageRequests';
import {fetchRequests} from '../utils/getAllRequests';
import { getCurrentUser } from '../utils/getCurrentUser';
import {handleApproveClick} from '../utils/AdminhandleApprovecClick';

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


jest.mock('../utils/getAllRequests', () => ({
fetchRequests: jest.fn(),

}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));
const navigate = jest.fn();
jest.mock('../utils/AdminhandleApprovecClick', () => ({
  handleApproveClick: jest.fn(),
  
  }));
describe('ManageRequests Component', () => {

  beforeEach(() => {
    auth.currentUser = { email: 'test@wits.ac.za' };
    onAuthStateChanged.mockImplementation((auth, callback) => {
      // Simulate that a user is logged in, and return a mock unsubscribe function
      callback({ email: 'test@wits.ac.za' });
      // console.log("Unsubscribe returned!");
      return jest.fn(); // This is the mock unsubscribe function
    });
  
    // Mock useNavigate function

    jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate);
    fetchRequests.mockImplementation((setRequests)=>{
      setRequests([
        {
            requesterEmail: "test@wits.ac.za",
            requestStatus: "denied",
            requestText: "Please please please book the great hall for me every day",
            id:"321"
        },
        {
            requesterEmail: "test@wits.ac.za",
            requestStatus: "pending",
            requestText: "I want sturrock park. Give it to me.",
            id:"121"
        },
        {
          requesterEmail: "test3@wits.ac.za",
          requestStatus: "approved",
          requestText: "I.",
          id:"11"
      }
    ]);
    });
   
});


  test('renders static ManageRequests components', () => {
    render(
    
        <ManageRequests />
 
    );
    expect(screen.getByText('Admin Requests Management')).toBeInTheDocument();
    expect(screen.getByText('Pending Requests')).toBeInTheDocument();
    expect(screen.getByText('Approved Requests')).toBeInTheDocument();
    expect(screen.getByText('Denied Requests')).toBeInTheDocument();
  });
test('renders ManageRequests components with correct data', () => {
  render(
  
      <ManageRequests />

  );
  expect(screen.getByText('I want sturrock park. Give it to me.')).toBeInTheDocument();
  // expect(screen.getByText('test@wits.ac.za')).toBeInTheDocument();
  expect(screen.getByText('pending')).toBeInTheDocument();
  expect(screen.getByText('Lecturer')).toBeInTheDocument();
  
});

  test('Renders approve and deny button', () => {
   render(

        <ManageRequests />
  
    );
    const approveButton = screen.getByText('Approve Request');
    const denyButton = screen.getByText('Deny Request');
    expect(approveButton).toBeInTheDocument();
    expect(denyButton).toBeInTheDocument();
  });
  //check that buttons call corect function when click

  test('Clicking approve  button functionality', () => {
    render(
 
         <ManageRequests />
   
     );
     const approveButton = screen.getByText('Approve Request');
     fireEvent.click(approveButton);
     expect(handleApproveClick).toHaveBeenCalled();
  
   });
});