import AdminRequestRow from "../components/AdminRequestRow";
import { auth } from "../firebase";
import { useState, useEffect } from "react";
import '../styles/AdminRequests.css';
import { useNavigate } from "react-router-dom";
import { getCurrentUsersAdminRequests } from "../utils/getCurrentUsersAdminRequests";
import PopupForm from "../components/AdminRequestForm";

function AdminRequest() {
    const [requestsList, setRequestsList] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const user = auth.currentUser; // Fetches current user
    
    // console.log(user);

    const navigate = useNavigate();
    useEffect(() => { // Reroutes user to /login if they are not logged in
    if (user === null) {
        navigate("/login");
    }
    }, [user, navigate]); // Effect will run when the user or navigate changes

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    const onClose = () => {
        setIsPopupOpen(!isPopupOpen);
        getCurrentUsersAdminRequests(currentUserEmail, setRequestsList);
    }
    
    const currentUserEmail = user ? user.email : null; // Gets current user email if not null, otherwise sets it to null
    // console.log(currentUserEmail);

    useEffect(() => {
        if(user){
            getCurrentUsersAdminRequests(currentUserEmail, setRequestsList);// Gets the bookings of the current user by their email
        }
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
            <button onClick={togglePopup} className="open-popup-button">Submit a Request</button>
            <PopupForm isOpen={isPopupOpen} onClose={onClose} userEmail={currentUserEmail}/>

            <div className="admin-request-list" data-testid="admin-request-list">
                <h2 data-testid="admin-request-heading">My Admin Requests</h2>
                <ul>
                    {requestComponents.length > 0 ? (
                        requestComponents
                    ): (
                        <li className="admin-request-list-entry">No requests available</li>
                    )}
                </ul>
            </div>
        </section>
    );
}

export default AdminRequest;