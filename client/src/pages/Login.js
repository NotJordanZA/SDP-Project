import { GoogleAuthProvider, signInWithPopup, /*getRedirectResult,*/ signOut, deleteUser } from "firebase/auth";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { addNewUser } from "../utils/addNewUserUtil";
import { getCurrentUser } from '../utils/getCurrentUser';
import { useNavigate } from "react-router-dom";
import '../styles/Login.css'
import logo from '../assets/logoBlue.png';
import { useState, useEffect } from "react";
// eslint-disable-next-line
const USER_REGEX = /^[\w-\.]+@([\w-]+\.)?(wits\.ac\.za)$/; //Only Wits emails allowed.

function Login(){
    const navigate = useNavigate();
    const [loginFailed, setLoginFailed] = useState(false);
    const [authenticating, setAuthenticating] = useState(false); // Flag to track ongoing authentication
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userInfo, setUserInfo] = useState({});

    // Ensure User is logged in
    useEffect(() => {
      // Listen for a change in the auth state
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        // If user is authenticated
        if (firebaseUser && !authenticating) { //Check if user is authenticated and not in the middle of authenticating) {
          setUser(firebaseUser); //Set current user
          console.log(user);
        } else if (!firebaseUser && !authenticating) { //Not signed in, make sure they are on the login page
          // navigate("/login"); //Reroute to login if user not signed in
          console.log("Not logged in!");
        }
      });
      setIsLoading(false); //Declare firebase as no longer loading
      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      }; //Return the listener
      // eslint-disable-next-line
    }, [auth, navigate]);

    // Get info about the current user from the database once firebase is loaded
    useEffect(() => {
      // Fetch current user's info
      const fetchUserInfo = async () => {
        // If user is signed in
        if (user) {
          try {
            // Instantiate userInfo object
            // const userData = await getCurrentUser(user.email);
            getCurrentUser(user.email, setUserInfo);
            console.log(user.email);
            //setUserInfo(userData);
          } catch (error) {
            console.error('Failed to fetch user info: ', error);
          }
        }
      };
      // Check if firebase is done loading
      if (!isLoading){
        fetchUserInfo(); //Get user info
      }
      // eslint-disable-next-line
    }, [user, isLoading]);

    // Route user to the home page if they are logged in and exist in the database
    useEffect(() => {
      if (!isLoading && !(Object.keys(userInfo).length === 0)) {
        navigate("/home");
      }
    }, [userInfo, isLoading, navigate]);

    const signInWithGoogle = () =>{
      setAuthenticating(true);
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider)//;
      //getRedirectResult(auth)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access Google APIs.
            // const credential = GoogleAuthProvider.credentialFromResult(result);
            // const token = credential.accessToken;

            // The signed-in user info.
            const user = result.user;
            // console.log(user);
            let email = user.email;
            const isWitsEmail = USER_REGEX.test(email);
            const isMarkerEmail = (email === "witsinfrastructure1@gmail.com") || (email === "witsinfrastructure2@gmail.com") || (email === "witsinfrastructure3@gmail.com");
            if(isWitsEmail || isMarkerEmail){
              let displayName = user.displayName;
              let firstName = displayName.split(" ")[0]; // Gets user's first name
              let lastName = displayName.slice(displayName.indexOf(firstName) + firstName.length + 1); // Gets user's last name
              addNewUser(email, firstName, lastName); // Calls the API to add new user to the database
              navigate("/home");
            }else{
              signOut(auth).then(() => {
                //console.log(user);
                console.log("Signout succesful");
                console.log(user);
                setLoginFailed(true);
              }).catch((error) =>{
                console.log('Signout Error:', error);
              });

              deleteUser(user).then(() => {
                // User deleted.
                console.log('Successfully deleted user');
              }).catch((error) => {
                // An error ocurred
                console.log('Error deleting user:', error);
              });
              // deleteUser(user);

              
            }
            
            // IdP data available using getAdditionalUserInfo(result)
            // ...
        }).catch((error) => {
            // Handle Errors here.
            console.log(error); // REVIEW: The app running doesn't like `console.error` here, but the tests don't like `console.log`
            // const errorCode = error.code;
            // const errorMessage = error.message;
            // // The email of the user's account used.
            // const email = error.customData.email;
            // // The AuthCredential type that was used.
            // const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        })
        .finally(() => 
          setAuthenticating(false)
        ); //Reset authenticating regardless of outcome
    }

    // const navigate = useNavigate();
    // auth.onAuthStateChanged((user) => {
    //     if (user) {
    //         navigate("/temp");
    //     } else {
    //     }
    //   });

    return (
      <div className="login-page">
        <main className="main-content">
          <img src={logo} alt="Logo" className="login-logo" />
          <button className="login-button" onClick={()=>signInWithGoogle()}>
            Sign In with Google
          </button>
          <div className={`info-text ${loginFailed ? "open" : "closed"}`}>Please log in with valid Wits credentials.</div>
        </main>
      </div>
    );
  }
  
  export default Login;
