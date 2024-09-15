import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from '../components/SideBar';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

jest.mock('firebase/auth', () => ({
    onAuthStateChanged: jest.fn(),
    signOut: jest.fn(),
}));

jest.mock('../firebase', () => ({
    auth: {
        currentUser: { email: 'test@wits.ac.za' }, // Mock email
    },
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe('Sidebar Component', () => {
    const mockNavigate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        useNavigate.mockReturnValue(mockNavigate);

        // Mock onAuthStateChanged to return an unsubscribe function
        onAuthStateChanged.mockImplementation((auth, callback) => {
            callback({ email: 'test@wits.ac.za' });
            return jest.fn(); // Mock unsubscribe
        });
    });

    test('Renders sidebar only when user is authenticated', () => {
        render(<Sidebar isOpen={true} toggleSidebar={jest.fn()} />, { wrapper: MemoryRouter });

        // Use getAllByRole for handling multiple elements with same role
        const dashboardButton = screen.getAllByRole('button', { name: /Dashboard/i })[0]; // The first Dashboard button
        expect(dashboardButton).toBeInTheDocument();
    });

    test('Does not render sidebar when no user is authenticated', () => {
        onAuthStateChanged.mockImplementation((auth, callback) => {
            callback(null); // No user logged in
            return jest.fn();
        });

        render(<Sidebar isOpen={true} toggleSidebar={jest.fn()} />, { wrapper: MemoryRouter });

        const dashboardButton = screen.queryByRole('button', { name: /Dashboard/i });
        expect(dashboardButton).not.toBeInTheDocument();
    });

    test('Navigates to Dashboard when the "Dashboard" button is clicked', () => {
        render(<Sidebar isOpen={true} toggleSidebar={jest.fn()} />, { wrapper: MemoryRouter });

        const dashboardButton = screen.getAllByRole('button', { name: /Dashboard/i })[0]; // The first Dashboard button
        fireEvent.click(dashboardButton);

        expect(mockNavigate).toHaveBeenCalledWith('/home');
    });

    test('Admin dropdown opens and closes when clicked', () => {
        render(<Sidebar isOpen={true} toggleSidebar={jest.fn()} />, { wrapper: MemoryRouter });
    
        // Find the "Admin" button
        const adminButton = screen.getByRole('button', { name: /^Admin$/i });
        
        // Click to open the dropdown
        fireEvent.click(adminButton);
        
        // Check if "Manage Bookings" button appears when dropdown is open
        const manageBookingsButton = screen.getByRole('button', { name: /Manage Bookings/i });
        expect(manageBookingsButton).toBeInTheDocument(); // Button should be in the document
        expect(manageBookingsButton).toBeVisible(); // Button should be visible when the dropdown is open
    
        // Check if the dropdown container has the 'open' class
        const dropdownContainer = screen.getByText(/Manage Bookings/i).closest('div');
        expect(dropdownContainer).toHaveClass('open'); // Should have 'open' class when dropdown is open
        
        // Click the "Admin" button again to close the dropdown
        fireEvent.click(adminButton);
    
        // Check if the dropdown container no longer has the 'open' class
        expect(dropdownContainer).not.toHaveClass('open'); // Should no longer have 'open' class
    });
    
    test('Logs out and navigates to /login', async () => {
        signOut.mockResolvedValue(); // Simulate successful sign out

        render(<Sidebar isOpen={true} toggleSidebar={jest.fn()} />, { wrapper: MemoryRouter });

        const logoutButton = screen.getByRole('button', { name: /Logout/i });
        fireEvent.click(logoutButton);

        await waitFor(() => {
            expect(signOut).toHaveBeenCalledWith(auth);
            expect(mockNavigate).toHaveBeenCalledWith('/login');
        });
    });
    test('Logs an error when sign out fails', async () => {
        const mockError = new Error('Failed to sign out'); // Create a mock error
        signOut.mockRejectedValue(mockError); // Simulate a failed sign out
    
        // Spy on console.error to capture the error output
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
        render(<Sidebar isOpen={true} toggleSidebar={jest.fn()} />, { wrapper: MemoryRouter });
    
        const logoutButton = screen.getByRole('button', { name: /Logout/i });
        fireEvent.click(logoutButton);
    
        await waitFor(() => {
            expect(signOut).toHaveBeenCalledWith(auth);
            expect(consoleErrorSpy).toHaveBeenCalledWith('Error signing out: ', mockError);
        });
    
        // Restore the original console.error after the test
        consoleErrorSpy.mockRestore();
    });
    
    
    test('Navigates to correct pages when sub-admin buttons are clicked', () => {
        render(<Sidebar isOpen={true} toggleSidebar={jest.fn()} />, { wrapper: MemoryRouter });
    
        // Open the Admin dropdown
        const adminButton = screen.getByRole('button', { name: /^Admin$/i });
        fireEvent.click(adminButton);
    
        // Click each sub-admin button and verify navigation
        const adminDashboardButton = screen.getByRole('button', { name: /Admin Dashboard/i });
        fireEvent.click(adminDashboardButton);
        expect(mockNavigate).toHaveBeenCalledWith('/HomeAdmin');
    
        const manageBookingsButton = screen.getByRole('button', { name: /Manage Bookings/i });
        fireEvent.click(manageBookingsButton);
        expect(mockNavigate).toHaveBeenCalledWith('/manage-bookings');
    
        const manageReportsButton = screen.getByRole('button', { name: /Manage Reports/i });
        fireEvent.click(manageReportsButton);
        expect(mockNavigate).toHaveBeenCalledWith('/manage-reports');
    
        const manageRequestsButton = screen.getByRole('button', { name: /Manage Requests/i });
        fireEvent.click(manageRequestsButton);
        expect(mockNavigate).toHaveBeenCalledWith('/manage-requests');
    
        const manageVenuesButton = screen.getByRole('button', { name: /Manage Venues/i });
        fireEvent.click(manageVenuesButton);
        expect(mockNavigate).toHaveBeenCalledWith('/manage-venues');
    });
        


});
