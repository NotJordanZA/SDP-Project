import './App.css';
import React, { useState } from 'react';
import Login from './pages/Login';
import Venues from './pages/Venues';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from './components/Header';
import HomePage from './pages/homePage';
import Reports from './pages/reports';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <Router>
        <Routes>
          <Route path= "/" element= {<Header title="Wits Venue Management" toggleSidebar={toggleSidebar} />}>
            <Route path= "/login" element= {<Login/>}/>
            <Route index element= {<Login/>}/>
            <Route path= "*" element= {<Login/>}/>
            <Route path= "/venues" element= {<Venues/>}/>
            <Route path="/home" element= {<HomePage/>}/>
            <Route path="/reports" element= {<Reports/>}/>
          </Route>
        </Routes>
    </Router>
  );
}

export default App;
