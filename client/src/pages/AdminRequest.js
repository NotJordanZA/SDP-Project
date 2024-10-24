import AdminRequestRow from "../components/AdminRequestRow";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import '../styles/AdminRequests.css';
import { useNavigate } from "react-router-dom";
import { getCurrentUsersAdminRequests } from "../utils/getCurrentUsersAdminRequests";
import PopupForm from "../components/AdminRequestForm";

function AdminRequest() {
    const [requestsList, setRequestsList] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isInfoPopupOpen, setIsInfoPopupOpen] = useState(false);
    // const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    
    // console.log(user);

    const navigate = useNavigate();

    // Ensure User is logged in
    useEffect(() => {
        // Listen for a change in the auth state
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          // If user is authenticated
          if (firebaseUser) {
            setUser(firebaseUser); //Set current user
            console.log(user);
          } else {
            navigate("/login"); //Reroute to login if user not signed in
          }
          // setIsLoading(false); //Declare firebase as no longer loading
        });
        return () => {
          if (unsubscribe) {
            unsubscribe();
          }
        }; //Return the listener
        // eslint-disable-next-line
      }, [auth, navigate]);

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    const onClose = () => {
        setIsPopupOpen(!isPopupOpen);
        getCurrentUsersAdminRequests(currentUserEmail, setRequestsList);
    }

  const infoButtonClick = () => {
    setIsInfoPopupOpen(!isInfoPopupOpen);
  };
    
    const currentUserEmail = user ? user.email : null; // Gets current user email if not null, otherwise sets it to null
    // console.log(currentUserEmail);

    useEffect(() => {
        if(user){
            getCurrentUsersAdminRequests(currentUserEmail, setRequestsList);// Gets the bookings of the current user by their email
        }// eslint-disable-next-line
      }, [user]);// Only runs if user is defined

    const requestComponents = requestsList.map((request) => { // Creates a list of the bookings to be displayed
        return (                                              // Passes in booking information to BookingRow component
          <AdminRequestRow
            key={request.requesterEmail}
            requestStatus={request.requestStatus}
            requestDescription={request.requestText}
          />
        );
    });

    return(
        <section className="admin-request-page" data-testid="admin-request-page">
            <label className="goldenLabel">Submit a request or complaint to our admin team using the button above. You can view the status of your existing requests below.</label>
            <PopupForm isOpen={isPopupOpen} onClose={onClose} userEmail={currentUserEmail}/>

            <div className="admin-request-list" data-testid="admin-request-list">
                <h2 data-testid="admin-request-heading">My Admin Requests
                   <button onClick={infoButtonClick}>i</button>
                   {/* Conditional rendering of the info popup */}
                   {isInfoPopupOpen && (
                      <div className="info-popup">
                          <p>
                              Would you like to do something you don't have the permissions for? <br/>
                              e.g: booking a special venue like the Great Hall, or moving the location of your booking?<br/>
                              Make a request to the admins!
                          </p>
                      </div>
                   )}
                </h2>
                <ul>
                    {requestComponents.length > 0 ? (
                        requestComponents
                    ): (
                        <li className="admin-request-list-entry">No requests available</li>
                    )}
                </ul>
            </div>
            <button onClick={togglePopup} className="open-popup-button">Submit a Request</button>
        </section>
    );
}

export default AdminRequest;