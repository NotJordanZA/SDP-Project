import { GoogleAuthProvider, getAuth, signInWithPopup, getRedirectResult } from "firebase/auth";
import { auth } from "../firebase";
import TextButton from "../components/styledButtons";
import { useNavigate } from "react-router-dom";

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
            console.log(user);
            navigate("/temp");
            // IdP data available using getAdditionalUserInfo(result)
            // ...
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
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
      <div className="Login">
        <TextButton text="Sign In with Google" onClickFunction={signInWithGoogle}/>
      </div>
    );
  }
  
  export default Login;
