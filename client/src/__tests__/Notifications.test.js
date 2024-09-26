import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from "react-router-dom";
import * as router from 'react-router-dom';

import { auth } from '../firebase';
import { onAuthStateChanged } from "firebase/auth";

import { getNotifications } from '../utils/getNotificationsUtil';
import { handleNotificationRead } from '../utils/putNotificationUtil';
import Notifications from '../components/popupNotif';

jest.mock('../firebase', () => ({
    auth: {
      currentUser: null // Default mock value
    }
}));

jest.mock("firebase/auth", () => ({
    getAuth: jest.fn(() => ({ currentUser: { email: 'test@wits.ac.za' }})),
    onAuthStateChanged: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
    getDoc: jest.fn(() => Promise.resolve({
    data: () => ({ isAdmin: false })  // Mock Firestore document with isAdmin
    })),
}));

jest.mock('../utils/getCurrentUser', () => ({
    getCurrentUser: jest.fn(),
}));

jest.mock('../utils/getNotificationsUtil', () => ({
    getNotifications: jest.fn(),
}));

jest.mock('../utils/putNotificationUtil', () => ({
    handleNotificationRead: jest.fn(),
}));

describe('Notifications Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});  // Suppress error logging during tests
    });

    afterEach(() => {
        console.error.mockRestore();  // Restore console error after each test
    });

    test('renders Notifications component with unread notifications', async () => {
      
        onAuthStateChanged.mockImplementation((auth, callback) => {
            callback({ email: 'test@wits.ac.za' });
            return jest.fn(); // Mock unsubscribe function
        });

        getNotifications.mockImplementation((email, setNotifications) => {
            setNotifications([
                {
                    id: 'notif1',
                    notificationMessage: 'This is a reminder for your booking happening tomorrow in FNB37 at 10:15.',
                    notificationType: 'Booking Reminder',
                    read: false,
                    dateCreated: '16 September 2024 at 10:53:55 UTC+2',
                    recipientEmail: 'test@wits.ac.za'
                },
                {
                    id: 'notif2',
                    notificationMessage: 'This is a reminder for your next event.',
                    notificationType: 'Event Reminder',
                    read: false,
                    dateCreated: '15 September 2024 at 10:00:00 UTC+2',
                    recipientEmail: 'test@wits.ac.za'
                }
            ]);
        });

        render(<Notifications isOpen={true} toggleNotification={jest.fn()} />);

        await waitFor(() => {
            const notificationItems = screen.getAllByRole('checkbox');
            expect(notificationItems.length).toBe(2); // Expect two notifications
            expect(notificationItems[0].checked).toBe(false); // Checkbox should not be checked
        });
    });

    test('displays "No notifications available" when there are no notifications', async () => {
        onAuthStateChanged.mockImplementation((auth, callback) => {
            callback({ email: 'test@wits.ac.za' });
            return jest.fn(); 
        });

        getNotifications.mockImplementation((email, setNotifications) => {
            setNotifications([]);
        });

        render(<Notifications isOpen={true} toggleNotification={jest.fn()} />);

        await waitFor(() => {
            const noNotificationsMessage = screen.getByText(/No notifications available/i);
            expect(noNotificationsMessage).toBeInTheDocument();
        });
    });

    test('marks notification as read when checkbox is clicked', async () => {
    
        onAuthStateChanged.mockImplementation((auth, callback) => {
            callback({ email: 'test@wits.ac.za' });
            return jest.fn(); 
        });

        getNotifications.mockImplementation((email, setNotifications) => {
            setNotifications([
                {
                    id: 'notif1',
                    notificationMessage: 'This is your first notification',
                    notificationType: 'Booking Reminder',
                    read: false,
                    dateCreated: '12 September 2024',
                    recipientEmail: 'test@wits.ac.za'
                },
            ]);
        });

        render(<Notifications isOpen={true} toggleNotification={jest.fn()} />);

        const checkbox = await screen.findByRole('checkbox');
        fireEvent.click(checkbox);

        await waitFor(() => {
            expect(handleNotificationRead).toHaveBeenCalledWith(
                {
                    id: 'notif1',
                    notificationMessage: 'This is your first notification',
                    notificationType: 'Booking Reminder',
                    read: false,
                    dateCreated: '12 September 2024',
                    recipientEmail: 'test@wits.ac.za'
                },
                expect.any(Function)
            );
        });
    });

   

    test('closes the notifications panel when close button is clicked', async () => {
        const mockToggleNotification = jest.fn();
        render(<Notifications isOpen={true} toggleNotification={mockToggleNotification} />);

        const closeButton = screen.getByText(/Close/i);
        fireEvent.click(closeButton);  // Simulate close button click

        expect(mockToggleNotification).toHaveBeenCalledTimes(1);  
    });

    test('shows loading state when notifications are being fetched', async () => {
        onAuthStateChanged.mockImplementation((auth, callback) => {
            callback({ email: 'test@wits.ac.za' });
            return jest.fn(); // Mock unsubscribe function
        });

        getNotifications.mockImplementation(() => {
            setTimeout(() => {}, 1000);  
        });

        render(<Notifications isOpen={true} toggleNotification={jest.fn()} />);

        const loadingMessage = screen.getByText(/Your Notifications/i);  
        expect(loadingMessage).toBeInTheDocument();
    });

    // test('handles error when fetching user info', async () => {
    //     onAuthStateChanged.mockImplementation((auth, callback) => {
    //         callback({ email: 'test@wits.ac.za' });
    //         return jest.fn(); 
    //     });

    //     getNotifications.mockImplementation(() => {
    //         throw new Error('Error fetching notifications:');
    //     });

    //     render(<Notifications isOpen={true} toggleNotification={jest.fn()} />);

    //     await waitFor(() => {
    //         expect(console.error).toHaveBeenCalledWith('Error fetching notifications:', expect.any(Error));
    //     });
    // });

    // test('unsubscribes from onAuthStateChanged on unmount', () => {
    //     const mockUnsubscribe = jest.fn();
    //     onAuthStateChanged.mockImplementation(() => mockUnsubscribe);

    //     const { unmount } = render(<Notifications isOpen={true} toggleNotification={jest.fn()} />);
    //     unmount();

    //     expect(mockUnsubscribe).toHaveBeenCalledTimes(1);  
    // });


});
