
// import React, { useState, useEffect } from 'react';
// import './ManageRequests.css';
// import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
// import { db } from '../firebase';

// function AdminRequests() {
//   const [requests, setRequests] = useState([]);

//   useEffect(() => {
//     const fetchRequests = async () => {
//       const querySnapshot = await getDocs(collection(db, "AdminRequests"));
//       const requestsFromFirebase = querySnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));
//       setRequests(requestsFromFirebase);
//     };

//     fetchRequests();
//   }, []);

//   const handleApproveClick = async (requestId) => {
//     const requestDoc = doc(db, "AdminRequests", requestId);
//     await updateDoc(requestDoc, { requestStatus: "approved" });

//     // Refresh requests
//     const querySnapshot = await getDocs(collection(db, "AdminRequests"));
//     const requestsFromFirebase = querySnapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data()
//     }));
//     setRequests(requestsFromFirebase);
//   };

//   return (
//     <div className="requests-container">
//       <h1>Admin Requests</h1>
//       {requests.length > 0 ? (
//         <div className="requests-list">
//           {requests.map(request => (
//             <div key={request.id} className={`request-card ${request.requestStatus === 'approved' ? 'approved' : 'pending'}`}>
//               <h3>Request ID: {request.id}</h3>
//               <p><strong>Email:</strong> {request.requestEmail}</p>
//               <p><strong>Status:</strong> {request.requestStatus.charAt(0).toUpperCase() + request.requestStatus.slice(1)}</p>
//               <p><strong>Request Text:</strong> {request.requestText || 'No request text provided'}</p>
//               {request.requestStatus === "pending" && (
//                 <button className="approve-btn" onClick={() => handleApproveClick(request.id)}>Approve Request</button>
//               )}
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p>No requests available</p>
//       )}
//     </div>
//   );
// }

// export default AdminRequests;
// import React, { useState, useEffect } from 'react';
// import './ManageRequests.css';

// import { useNavigate } from 'react-router-dom';
// import { getAllRequests , updateReq, getReqById} from "../api";


// function AdminRequests() {
//   const [requests, setRequests] = useState([]);
//   const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'approved'

//   useEffect(() => {
//     const fetchRequests = async () => {
//       const querySnapshot = await getDocs(collection(db, "AdminRequests"));
//       const requestsFromFirebase = querySnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));
//       setRequests(requestsFromFirebase);
//     };

//     fetchRequests();
//   }, []);

//   const handleApproveClick = async (requestId) => {
//     const requestDoc = doc(db, "AdminRequests", requestId);
//     await updateDoc(requestDoc, { requestStatus: "approved" });

//     // Refresh requests
//     const querySnapshot = await getDocs(collection(db, "AdminRequests"));
//     const requestsFromFirebase = querySnapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data()
//     }));
//     setRequests(requestsFromFirebase);
//   };

//   const filteredRequests = requests.filter(request => request.requestStatus === activeTab);

//   return (
//     <div className="requests-container">
//       <h1>Admin Requests Management</h1>

//       {/* Tabs */}
//       <div className="tabs">
//         <button
//           className={activeTab === 'pending' ? 'active' : ''}
//           onClick={() => setActiveTab('pending')}
//         >
//           Pending Requests
//         </button>
//         <button
//           className={activeTab === 'approved' ? 'active' : ''}
//           onClick={() => setActiveTab('approved')}
//         >
//           Approved Requests
//         </button>
//       </div>

//       {/* Content based on active tab */}
//       {filteredRequests.length > 0 ? (
//         <div className="requests-list">
//           {filteredRequests.map(request => (
//             <div key={request.id} className={`request-card ${request.requestStatus}`}>
//               <h3>Request ID: {request.id}</h3>
//               <p><strong>Email:</strong> {request.requestEmail}</p>
//               <p><strong>Status:</strong> {request.requestStatus.charAt(0).toUpperCase() + request.requestStatus.slice(1)}</p>
//               <p><strong>Request Text:</strong> {request.requestText || 'No request text provided'}</p>
//               {request.requestStatus === "pending" && (
//                 <button className="approve-btn" onClick={() => handleApproveClick(request.id)}>Approve Request</button>
//               )}
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p>No {activeTab} requests available</p>
//       )}
//     </div>
//   );
// }
// export default AdminRequests;
// import React, { useState, useEffect } from 'react';
// import './ManageRequests.css';
// import { getAllRequests, updateReq } from "../api";

// function AdminRequests() {
//   const [requests, setRequests] = useState([]);
//   const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'approved'

//   // Fetch all requests from the API
//   useEffect(() => {
//     const fetchRequests = async () => {
//       try {
//         const response = await getAllRequests();
//         console.log("Fetched Requests:", response.AdReq); // Log the AdReq array
//         setRequests(response.AdReq); // Access the AdReq array from the response
//       } catch (error) {
//         console.error("Error fetching requests:", error);
//         setRequests([]); // Set to an empty array in case of an error
//       }
//     };

//     fetchRequests();
//   }, []);

//   // Function to handle approving a request
//   const handleApproveClick = async (requestId) => {
//     try {
//       await updateReq(requestId, { requestStatus: "approved" });

//       // Refresh the list of requests after the update
//       const requestsFromAPI = await getAllRequests();
//       setRequests(requestsFromAPI.AdReq);
//     } catch (error) {
//       console.error("Error updating request:", error);
//     }
//   };

//   // Filter requests based on the active tab ('pending' or 'approved')
//   const filteredRequests = requests.filter(request => request.requestStatus === activeTab);

//   return (
//     <div className="requests-container">
//       <h1>Admin Requests Management</h1>

//       {/* Tabs for Pending and Approved Requests */}
//       <div className="tabs">
//         <button
//           className={activeTab === 'pending' ? 'active' : ''}
//           onClick={() => setActiveTab('pending')}
//         >
//           Pending Requests
//         </button>
//         <button
//           className={activeTab === 'approved' ? 'active' : ''}
//           onClick={() => setActiveTab('approved')}
//         >
//           Approved Requests
//         </button>
//       </div>

//       {/* List of filtered requests based on active tab */}
//       {filteredRequests.length > 0 ? (
//         <div className="requests-list">
//           {filteredRequests.map(request => (
//             <div key={request.id} className={`request-card ${request.requestStatus}`}>
//               <h3>Request ID: {request.id}</h3>
//               <p><strong>Email:</strong> {request.requesterEmail}</p>
//               <p><strong>Status:</strong> {request.requestStatus}</p>
//               <p><strong>Request Text:</strong> {request.requestText || 'No request text provided'}</p>

//               {/* Show "Approve" button only for pending requests */}
//               {request.requestStatus === 'pending' && (
//                 <button className="approve-btn" onClick={() => handleApproveClick(request.id)}>
//                   Approve Request
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p>No {activeTab} requests available</p>
//       )}
//     </div>
//   );
// }

// export default AdminRequests;


import React, { useState, useEffect } from 'react';
import './ManageRequests.css';
const API_URL = process.env.NODE_ENV === 'production' ? 'https://your-production-site.com' : 'http://localhost:3002'; 
export const getAllRequests = async () => {
  const response = await fetch(`${API_URL}/adminRequests`);
  return await response.json();
};

// update a Request- change status from pending to approved
export const updateReq= async (id, ReqData) => {
const response = await fetch(`${API_URL}/adminRequests/${id}`, {
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


  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await getAllRequests();
        console.log("Fetched Requests:", response.AdReq); // Log the AdReq array
        setRequests(response.AdReq); // Access the AdReq array from the response
      } catch (error) {
        console.error("Error fetching requests:", error);
        setRequests([]); // Set to an empty array in case of an error
      }
    };

    fetchRequests();
  }, []);

  // Function to handle approving a request
  const handleApproveClick = async (requestId) => {
    try {
      await updateReq(requestId, { requestStatus: "approved" });

      // Refresh the list of requests after the update
      const requestsFromAPI = await getAllRequests();
      setRequests(requestsFromAPI.AdReq);
    } catch (error) {
      console.error("Error updating request:", error);
    }
  };

  // Function to handle denying a request
  const handleDenyClick = async (requestId) => {
    try {
      await updateReq(requestId, { requestStatus: "denied" });

      // Refresh the list of requests after the update
      const requestsFromAPI = await getAllRequests();
      setRequests(requestsFromAPI.AdReq);
    } catch (error) {
      console.error("Error denying request:", error);
    }
  };

  // Filter requests based on the active tab ('pending', 'approved', or 'denied')
  const filteredRequests = requests.filter(request => request.requestStatus === activeTab);

  return (
    <div className="requests-container">
      <h1>Admin Requests Management</h1>

      {/* Tabs for Pending, Approved, and Denied Requests */}
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
              <h3>Request ID: {request.id}</h3>
              <p><strong>Email:</strong> {request.requesterEmail}</p>
              <p><strong>Status:</strong> {request.requestStatus}</p>
              <p><strong>Request Text:</strong> {request.requestText || 'No request text provided'}</p>

              {/* Show "Approve" and "Deny" buttons only for pending requests */}
              {request.requestStatus === 'pending' && (
                <>
                  <button className="approve-btn" onClick={() => handleApproveClick(request.id)}>
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
