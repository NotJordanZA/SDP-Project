import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../components/Header';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

jest.mock('firebase/auth', () => ({
    onAuthStateChanged: jest.fn(),
}));

jest.mock('../firebase', () => ({
    auth: {
        currentUser: { email: 'test@wits.ac.za' },
    },
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe('Header Component', () => {
    const mockNavigate = jest.fn();
    const mockToggleSidebar = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        useNavigate.mockReturnValue(mockNavigate);

        // Mock onAuthStateChanged to return an unsubscribe function
        onAuthStateChanged.mockImplementation((auth, callback) => {
            callback({ email: 'test@wits.ac.za' }); // Mock authenticated user
            return jest.fn(); // Mock unsubscribe
        });
    });

    test('renders header with user authenticated', () => {
        render(
            <Header title="Test Title" toggleSidebar={mockToggleSidebar} />, 
            { wrapper: MemoryRouter }
        );

        // Check for the sidebar toggle icon
        const toggleIcon = screen.queryByTestId('sidebar-toggle');
        expect(toggleIcon).toBeInTheDocument();

        // Check for the bell icon
        const bellIcon = screen.queryByTestId('bell-icon');
        expect(bellIcon).toBeInTheDocument();
    });

    test('renders header without user (user is null)', () => {
        // Modify the onAuthStateChanged mock to return null (no user)
        onAuthStateChanged.mockImplementation((auth, callback) => {
            callback(null); // No user logged in
            return jest.fn();
        });

        render(
            <Header title="Test Title" toggleSidebar={mockToggleSidebar} />, 
            { wrapper: MemoryRouter }
        );

        // Check that the sidebar toggle icon is not rendered
        const toggleIcon = screen.queryByTestId('sidebar-toggle');
        expect(toggleIcon).not.toBeInTheDocument();

        // Check that the bell icon is not rendered
        const bellIcon = screen.queryByTestId('bell-icon');
        expect(bellIcon).not.toBeInTheDocument();
    });

    test('navigates to /home when logo is clicked', () => {
        render(
            <Header title="Test Title" toggleSidebar={mockToggleSidebar} />, 
            { wrapper: MemoryRouter }
        );

        // Find the logo and click it
        const logo = screen.getByTestId('logo');
        fireEvent.click(logo);

        expect(mockNavigate).toHaveBeenCalledWith('/home');
    });

    test('toggles sidebar when sidebar toggle icon is clicked', () => {
        render(
            <Header title="Test Title" toggleSidebar={mockToggleSidebar} />, 
            { wrapper: MemoryRouter }
        );

        // Find the sidebar toggle icon and click it
        const toggleIcon = screen.queryByTestId('sidebar-toggle');
        fireEvent.click(toggleIcon);

        expect(mockToggleSidebar).toHaveBeenCalled();
    });
});
