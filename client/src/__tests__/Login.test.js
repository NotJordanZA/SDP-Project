import { render, screen, fireEvent, waitFor} from '@testing-library/react';
import { MemoryRouter } from "react-router-dom";
import Login from '../pages/Login';
import { addNewUser } from "../utils/addNewUserUtil";
import * as router from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup, getRedirectResult, signOut, deleteUser } from "firebase/auth";
import { act } from 'react';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn(),
    useNavigate: jest.fn(),
  }));
  
jest.mock("firebase/auth", () => ({
//return {
    getAuth: jest.fn(),
    GoogleAuthProvider: jest.fn(),
    signInWithPopup: jest.fn(),
    getRedirectResult: jest.fn(),
    signOut: jest.fn().mockResolvedValueOnce(),
    deleteUser: jest.fn().mockResolvedValueOnce(),
//};
}));

jest.mock('firebase/storage', () => ({
    getStorage: jest.fn(),
}));

jest.mock('../utils/addNewUserUtil', () => ({
addNewUser: jest.fn(),
}));

GoogleAuthProvider.credentialFromResult = jest.fn();

const navigate = jest.fn();
//const addNewUser = jest.fn();


describe("Login", () => {

    beforeEach(() => {
        jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate);
    })
    // beforeEach(() => {
    //     render(
    //         <MemoryRouter>
    //             <Login />
    //         </MemoryRouter>
    //         );
    // });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders Login button', () => {
        render(<Login/>);
        expect(screen.getByText("Sign In with Google")).toBeInTheDocument();
    });

    test("Login with wits email", async () => {
        const user = {
            email: "test@wits.ac.za",
            displayName: "Test User"
        };

        signInWithPopup.mockResolvedValueOnce({
            user: user,
            credential: {
                accessToken: 'token',
            },
        });

        GoogleAuthProvider.credentialFromResult.mockReturnValueOnce({
            accessToken: 'token',
        });

        // addNewUser.mockRejectedValueOnce(new Error('Error adding user'));

        render(<Login/>);
        const loginButton = screen.getByText("Sign In with Google");

        await act(async () => {
            fireEvent.click(loginButton);
        });

        await waitFor(() =>
            expect(signInWithPopup).toHaveBeenCalled()
        );
        await waitFor(() => {
            expect(addNewUser).toHaveBeenCalledWith(
                'test@wits.ac.za',
                'Test',
                'User'
            );
        });
        
        expect(navigate).toHaveBeenCalledWith("/home");
    });

    test("Login with non wits email", async () => {
        const user = {
            displayName: "Test User",
            email: "test@gmail.com",
            emailVerified: true,
            isAnonymous: false,
            //metadata: ,
            metadata: null,
            //metadata: Object { createdAt: "1725361949472", lastLoginAt: "1725361949472", lastSignInTime: "Tue, 03 Sep 2024 11:12:29 GMT"},
            //multiFactor: ,
            phoneNumber: null,
            photoURL: "https://lh3.googleusercontent.com/a/ACg8ocJvTlfXalUHj1OlyHD7ZIGZmcxflSyEeg7uEugyYlU6S22H3nfg=s96-c",
            providerId: "firebase",
            uid: "qxmkjstnQKMvteZN8e69bErvB803",
        };

        signInWithPopup.mockResolvedValueOnce({
            user: user,
            credential: {
                accessToken: 'token',
            },
        });

        GoogleAuthProvider.credentialFromResult.mockReturnValueOnce({
            accessToken: 'token',
        });

        deleteUser.mockRejectedValueOnce(new Error('Error deleting user'));
        signOut.mockRejectedValueOnce(new Error('Sign-out error'));

        render(<Login/>);
        const loginButton = screen.getByText("Sign In with Google");

        await act(async () => {
            fireEvent.click(loginButton);
        });

        await waitFor(() =>
            console.log("Checking if signInWithPopup was called..."),
            expect(signInWithPopup).toHaveBeenCalled()
        );
        await waitFor(() =>
            console.log("Checking if signOut was called..."),
            expect(signOut).toHaveBeenCalled()
        );
        await waitFor(() =>
            console.log("Checking if deleteUser was called..."),
            expect(deleteUser).toHaveBeenCalledWith(user)
        );
    });
});