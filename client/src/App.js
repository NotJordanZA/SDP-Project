import './App.css';
import React, { useState } from 'react';
import Login from './pages/Login';
import Venues from './pages/Venues';

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from './components/Header';
import HomePage from './pages/homePage';
import Reports from './pages/reports';
import SideBar from './components/SideBar'; 
import MyBookings from './pages/MyBookings';
import ManageReports from './pages/ManageReports';
import ManageRequests from './pages/ManageRequests';
import AdminRequest from './pages/AdminRequest';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} /> {SideBar}
      <Routes>
        <Route path="/" element={<Header title="Wits Venue Management" toggleSidebar={toggleSidebar} />}>
          <Route path="/login" element={<Login />} />
          <Route index element={<Login />} />
          <Route path="*" element={<Login />} />
          <Route path="/venues" element={<Venues />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/bookings" element= {<MyBookings/>}/>
          <Route path="/requests" element= {<AdminRequest/>} />
          <Route path="/manage-reports" element={<ManageReports />} />
          <Route path="/manage-requests" element={<ManageRequests />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
