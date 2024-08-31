import { render, screen, fireEvent, waitFor} from '@testing-library/react';
import { MemoryRouter } from "react-router-dom";
import Login from '../pages/Login';
import * as router from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup, getRedirectResult, signOut, deleteUser } from "firebase/auth";
import { act } from 'react';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn(),
    useNavigate: jest.fn(),
  }));
  
  jest.mock("firebase/auth", () => {
    return {
        getAuth: jest.fn(),
        GoogleAuthProvider: jest.fn(),
        signInWithPopup: jest.fn(),
        getRedirectResult: jest.fn(),
        signOut: jest.fn(),
        deleteUser: jest.fn()
    };
  });
  
  GoogleAuthProvider.credentialFromResult = jest.fn();
  
  const navigate = jest.fn()
  const addNewUser = jest.fn()

  
  describe("Login", () => {
    beforeEach(() => {
      jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate)
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
        render(<Login />);
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

        render(<Login/>);
        const loginButton = screen.getByText("Sign In with Google");

        await act(async () => {
            fireEvent.click(loginButton);
        });

        await waitFor(() =>
            expect(signInWithPopup).toHaveBeenCalled()
        );
        // expect(addNewUser).toHaveBeenCalledWith(
        //     'test@wits.ac.za',
        //     'Test',
        //     'User'
        // );
        expect(navigate).toHaveBeenCalledWith("/temp");
    });

    test("Login with non wits email", async () => {
        const user = {
            email: "test@gmail.com",
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

        render(<Login/>);
        const loginButton = screen.getByText("Sign In with Google");

        await act(async () => {
            fireEvent.click(loginButton);
        });

        await waitFor(() =>
            expect(signInWithPopup).toHaveBeenCalled(),
            expect(deleteUser).toHaveBeenCalled(),
            expect(signOut).toHaveBeenCalled()
        );
    });
  });