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
import {updateReq, getAllRequests} from '../pages/ManageRequests';
import {handledenyClick} from '../utils/AdminhandledenyReq';

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
getAllRequests: jest.fn(),
updateReq: jest.fn(),

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
  jest.mock('../utils/AdminhandledenyReq', () => ({
    handledenyClick: jest.fn(),
    
    }));
    //mock fetch globally
    global.fetch = jest.fn();
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
            requesterEmail: "test2@wits.ac.za",
            requestStatus: "pending",
            requestText: "I want sturrock park. Give it to me.",
            id:"121"
        },
        {
          requesterEmail: "test3@students.wits.ac.za",
          requestStatus: "approved",
          requestText: "I.",
          id:"11"
      }

    ]);
    });
   
});

afterEach(() => {
  jest.clearAllMocks(); //clear mocks after each test
});

test('redirects to login if user is not authenticated', async () => {
  //set mock user to null= user is not logged in
  auth.currentUser = null;

  //mock the onAuthStateChanged function to simulate the authentication change.The callback is called with null to indicate no user is authenticated.
  onAuthStateChanged.mockImplementationOnce((auth, callback) => callback(null));

  //render the ManageRequests component 
  render(<ManageRequests />);
  //navigate function is called with the /login path,indicating that the user is redirected to the login page when unauthenticated.
  expect(navigate).toHaveBeenCalledWith('/login');
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
  //expect to see pending for status and Lecturer for role 
  expect(screen.getByText('pending')).toBeInTheDocument();
  expect(screen.getByText('Lecturer')).toBeInTheDocument();


  
});

test('renders requests based on active tab', async () => {
  render(<ManageRequests />);

  //clicking on Pending Requests tab
  fireEvent.click(screen.getByText('Pending Requests'));
  expect(screen.getByText('I want sturrock park. Give it to me.')).toBeInTheDocument();
  

  //Switch to Approved tab
  fireEvent.click(screen.getByText('Approved Requests'));
  expect(screen.getByText('I.')).toBeInTheDocument();
  //testing the determinerole ascpect that it displays role as student when a request comes from a student
  expect(screen.getByText('Student')).toBeInTheDocument();
  //change to  the Denied tab
  fireEvent.click(screen.getByText('Denied Requests'));
  expect(screen.getByText('Please please please book the great hall for me every day')).toBeInTheDocument();
  
});
  test('Renders approve and deny button', () => {
   render(

        <ManageRequests />
  
    );
    const approveButton = screen.getByText('APPROVE');
    const denyButton = screen.getByText('DENY');
    expect(approveButton).toBeInTheDocument();
    expect(denyButton).toBeInTheDocument();
  });
  
  //check that buttons call corect function when click

  test('Clicking approve button functionality', () => {
    render(
 
         <ManageRequests />
   
     );
     const approveButton = screen.getByText('APPROVE');
     fireEvent.click(approveButton);
     expect(handleApproveClick).toHaveBeenCalled();
  
   });

   test('Clicking deny  button functionality', () => {
    render(
 
         <ManageRequests />
   
     );
     const denyButton = screen.getByText('DENY');
     fireEvent.click(denyButton);
     expect(handledenyClick).toHaveBeenCalled();
  
   });

   //below are all the tests related to updateReq
   describe('updateReq function', () => {
    test('should update the request successfully', async () => {
      //mock a successful response from fetch
      global.fetch.mockResolvedValueOnce({
        ok: true,//response was sucessful
        json: async () => ({ message: 'Request updated successfully' }),//mocked json response
      });
//call updateReq with params
      const result = await updateReq('121', { requestStatus: 'approved' });
//verify that it was called with its correct arguments
      expect(global.fetch).toHaveBeenCalledWith('/api/adminRequests/121', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.REACT_APP_API_KEY,
        },
        body: JSON.stringify({ requestStatus: 'approved' }),//convert the request data to a JSON string
      });
      //verify that the result matches the mocked successful response
      expect(result).toEqual({ message: 'Request updated successfully' });
    });

    test('should throw an error if the update fails', async () => {
      //mocck a failed response from fetch
    global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Internal server error' }),
      });

      await expect(updateReq('121', { requestStatus: 'approved' }))
        .rejects.toThrow('Failed to update request');
        //verify that updateReq throws an error when the response is not OK
      expect(global.fetch).toHaveBeenCalledWith('/api/adminRequests/121', {
        method: 'PUT',
       headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.REACT_APP_API_KEY,
        },
        //convert the request data to a JSON string
        body: JSON.stringify({ requestStatus: 'approved' }),
      });
    });
  });


  
   
});