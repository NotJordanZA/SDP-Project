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

    test.skip('Does not render sidebar when no user is authenticated', () => {
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
    


});
