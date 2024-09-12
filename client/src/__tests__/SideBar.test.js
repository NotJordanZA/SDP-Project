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
});
