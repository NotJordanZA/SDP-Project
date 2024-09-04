import { GoogleAuthProvider, signInWithPopup, getRedirectResult, signOut, deleteUser } from "firebase/auth";
import { auth } from "../firebase";
import { addNewUser } from "../utils/addNewUserUtil";
import TextButton from "../components/styledButtons";
import { useNavigate } from "react-router-dom";
import '../styles/Login.css'
import logo from '../assets/inverseLogo.png';

const USER_REGEX = /^[\w-\.]+@([\w-]+\.)?(wits\.ac\.za)$/; //Only Wits emails allowed.

function Login(){
    const navigate = useNavigate();

    const signInWithGoogle = () =>{
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider)//;
      //getRedirectResult(auth)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access Google APIs.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;

            // The signed-in user info.
            const user = result.user;
            // console.log(user);
            let email = user.email;
            const isWitsEmail = USER_REGEX.test(email);
            if(isWitsEmail){
              let displayName = user.displayName;
              let firstName = displayName.split(" ")[0];
              let lastName = displayName.slice(displayName.indexOf(firstName) + firstName.length + 1);
              addNewUser(email, firstName, lastName);
              navigate("/temp");
            }else{
              signOut(auth).then(() => {
                //console.log(user);
                console.log("Signout succesful");
                console.log(user);
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
        });
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
          <TextButton text="Sign In with Google" onClickFunction={signInWithGoogle}/>
        </main>
      </div>
    );
  }
  
  export default Login;
