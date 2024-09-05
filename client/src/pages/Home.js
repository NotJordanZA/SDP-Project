// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import './Home.css';

// function Home() {
//   const navigate = useNavigate();

//   return (
//     <div className="home">
//       <div className="card" onClick={() => navigate('/my-bookings')}>
//         <h2>My Bookings</h2>
//       </div>
//       <div className="card" onClick={() => navigate('/my-reports')}>
//         <h2>My Reports</h2>
//       </div>
//       <div className="card" onClick={() => navigate('/file-report')}>
//         <h2>File a Report</h2>
//       </div>
//     </div>
//   );
// }

// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import './Home.css';

// function Home() {
//   const navigate = useNavigate();

//   return (
//     <div className="home">
//       <div className="card" onClick={() => navigate('/my-bookings')}>
//         <img src="../images/Calendar.svg" alt="My Bookings" className="card-logo" />
//         <h2>Manage Bookings</h2>
//       </div>
//       <div className="card" onClick={() => navigate('/my-reports')}>
//         <img src="../images/report.svg" alt="My Reports" className="card-logo" />
//         <h2>Manage Reports</h2>
//       </div>
//       <div className="card" onClick={() => navigate('/file-report')}>
//         <img src="../images/Calendar.svg" alt="Manage Requests" className="card-logo" />
//         <h2>Manage Requests</h2>
//       </div>
//     </div>
//   );
// }

// export default Home;  // This is necessary to export the Home component

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <div className="card" onClick={() => navigate('/manage-bookings')}>
        <img src="/assets/CalendarAdmin.svg" alt="Manage Bookings" className="card-logo" />
        <h2>Manage Bookings</h2>
      </div>
      <div className="card" onClick={() => navigate('/manage-reports')}>
        <img src="/assets/AdminReport.svg" alt="My Reports" className="card-logo" />
        <h2>Manage Reports</h2>
      </div>
      <div className="card" onClick={() => navigate('/manage-requests')}>
        <img src="/assets/Question.svg" alt="Manage Requests" className="card-logo" />
        <h2>Manage Requests</h2>
      </div>
      <div className="card" onClick={() => navigate('/manage-venues')}>
        <img src="/assets/Venue.svg" alt="Manage Venues" className="card-logo" />
        <h2>Manage Venues</h2>
      </div>
    </div>
  );
}

export default Home;
