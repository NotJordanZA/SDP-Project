

import React, { useState, useEffect } from 'react';
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
// import { getCurrentUser } from '../utils/getCurrentUser';
import '../styles/ManageRequests.css';
import {fetchRequests} from '../utils/getAllRequests';
import {handleApproveClick} from '../utils/AdminhandleApprovecClick';
export const getAllRequests = async () => {
  const response = await fetch(`/api/adminRequests`);
  return await response.json();
};
// update a Request- change status from pending to approved
export const updateReq= async (id, ReqData) => {
const response = await fetch(`/api/adminRequests/${id}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(ReqData),
});

// return await response.json();
if (!response.ok) {
  throw new Error('Failed to update request');
}
return response.json();

};

function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('pending'); 
  // const [userInfo, setUserInfo] = useState({});
  // const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
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

  // Get info about the current user from the database once firebase is loaded
  // useEffect(() => {
  //   // Fetch current user's info
  //   const fetchUserInfo = async () => {
  //     // If user is signed in
  //     if (user) {
  //       try {
  //         // Instantiate userInfo object
  //         getCurrentUser(user.email, setUserInfo);
  //       } catch (error) {
  //         console.error('Failed to fetch user info: ', error);
  //       }
  //     }
  //   };
  //   // Check if firebase is done loading
  //   if (!isLoading){
  //     fetchUserInfo(); //Get user info
  //   }
    
  // }, [user, isLoading]);

  useEffect(() => {
   

    fetchRequests(setRequests, getAllRequests);
  }, []);

  // this function handles approving a request


  //this function handles denying a request
  const handleDenyClick = async (requestId) => {
    try {
      await updateReq(requestId, { requestStatus: "denied" });

      //refresh the list of requests after the update
      const requestsFromAPI = await getAllRequests();
      setRequests(requestsFromAPI.AdReq);
    } catch (error) {
      console.error("Error denying request:", error);
    }
  };

  //organize requests based on the active tab ('pending', 'approved', or 'denied')
  const filteredRequests = requests.filter(request => request.requestStatus === activeTab);

//determine if the requester is a student or lecturer
const determinerole = (email) => {
  if (email.includes('@student')) {
    return 'Student';
  } else {
    return 'Lecturer';
  }
};

  return (
    <div className="requests-container">
      <h1>Admin Requests Management</h1>

      <div className="tabs">
        <button
          className={activeTab === 'pending' ? 'active' : ''}
          onClick={() => setActiveTab('pending')}
        >
          Pending Requests
        </button>
        <button
          className={activeTab === 'approved' ? 'active' : ''}
          onClick={() => setActiveTab('approved')}
        >
          Approved Requests
        </button>
        <button
          className={activeTab === 'denied' ? 'active' : ''}
          onClick={() => setActiveTab('denied')}
        >
          Denied Requests
        </button>
      </div>

      {/* List of filtered requests based on active tab */}
      {filteredRequests.length > 0 ? (
        <div className="requests-list">
          {filteredRequests.map(request => (
            <div key={request.id} className={`request-card ${request.requestStatus}`}>
              <h3>
            <strong>  Requester email: </strong>{request.requesterEmail} </h3>
              <p><strong>Role:</strong> {determinerole(request.requesterEmail)}</p>
              <p><strong>Status:</strong> {request.requestStatus}</p>
              <p><strong>Request Text:</strong> {request.requestText || 'No request text provided'}</p> {/*if no requests then display that second part*/}

              {/* Show "Approve" and "Deny" buttons only for pending requests */}
              {request.requestStatus === 'pending' && (
                <>
                  <button className="approve-btn" onClick={() => handleApproveClick(request.id, setRequests)}>
                    Approve Request
                  </button>
                  <button className="deny-btn" onClick={() => handleDenyClick(request.id)}>
                    Deny Request
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No {activeTab} requests available</p>
      )}
    </div>
  );
}

export default AdminRequests;
