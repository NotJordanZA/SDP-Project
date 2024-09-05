// import './App.css';
// import Login from './pages/Login';
// import TempRedirectTest from './pages/TempRedirectTest';
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Header from './components/Header';
// import HomePage from './pages/homePage';

// function App() {
//   return (
//     <Router>
//         <Routes>
//           <Route path= "/" element= {<Header/>}>
//             {/* <Route path= "/login" element= {<Login/>}/>
//             <Route index element= {<Login/>}/>
//             <Route path= "*" element= {<Login/>}/> */}
//             <Route path= "/temp" element= {<TempRedirectTest/>}/>
//             <Route path="/home" element= {<HomePage/>}/>
//           </Route>
//         </Routes>
//     </Router>
//   );
// }

// export default App;



import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import ManageBookings from './pages/ManageBookings';
import ManageReports from './pages/ManageReports';
import ManageRequests from './pages/ManageRequests';
import ManageVenues from './pages/ManageVenues';
import BookVenue from './pages/BookVenue'; // Import the new page
import './App.css';  // Import the main CSS file

function App() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Router>
      <div className="app">
      <header className="header">
  <div className="hamburger" onClick={toggleMenu}>
    &#9776;  {/* Hamburger icon */}
  </div>
  <h1>Venues @ Wits</h1>
  <img src="../images/logo1.png" alt="Logo" className="logo" />
</header>


        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
          <button className="close-btn" onClick={toggleMenu}>
            &times;  {/* Close icon (×) */}
          </button>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/manage-bookings">Manage Bookings</a></li>
            <li><a href="/manage-reports">Manage Reports</a></li>
            <li><a href="/manage-requests">Manage Requests</a></li>
            <li><a href="/manage-venues">Manage Venues</a></li>
          </ul>
        </div>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/manage-bookings" element={<ManageBookings />} />
            <Route path="/manage-reports" element={<ManageReports />} />
            <Route path="/manage-requests" element={<ManageRequests />} />
             <Route path="/manage-venues" element={<ManageVenues />} />
             <Route path="/book-venue" element={<BookVenue />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
