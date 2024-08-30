import { GoogleAuthProvider, signInWithPopup, getRedirectResult, signOut, deleteUser } from "firebase/auth";
import { auth } from "../firebase";
import TextButton from "../components/styledButtons";
import { useNavigate } from "react-router-dom";

const USER_REGEX = /^[\w-\.]+@([\w-]+\.)?(wits\.ac\.za)$/; //Only Wits emails allowed.

function Login(){
    const navigate = useNavigate();

    const addNewUser = async (userEmail, firstName, lastName) =>{
      let isStudent = true;
      let isLecturer = false;
      let isAdmin = false;
      try{
        const response = await fetch(`/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userEmail,
            firstName,
            lastName,
            isStudent,
            isLecturer,
            isAdmin,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          console.log('User updated successfully:', data);
        } else {
          console.error('Error updating user:', data.error);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }

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
              let lastName = displayName.slice(displayName.indexOf(firstName) + firstName.length);
              addNewUser(email, firstName, lastName);
              navigate("/temp");
            }else{
              deleteUser(user).then(() => {
                // User deleted.
                console.log('Successfully deleted user');
              }).catch((error) => {
                // An error ocurred
                console.log('Error deleting user:', error);
              });

              signOut(auth).then(() => {
                console.log(user);
                console.log("Signout succesful");
              }).catch((error) =>{
                console.error(error);
              });
            }
            
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
