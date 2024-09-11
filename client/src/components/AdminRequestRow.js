import '../styles/AdminRequests.css';

function AdminRequestRow({requestStatus, requestDescription}){
    return( // Returns a single booking entry with the booking information passed in from MyBookings.
        <li key={requestStatus + requestDescription} className="admin-request-list-entry">
            <span className="admin-request-status">{requestStatus}</span>
            <span className="admin-request-description">Description: {requestDescription}</span>
        </li>
    );
}

export default AdminRequestRow;