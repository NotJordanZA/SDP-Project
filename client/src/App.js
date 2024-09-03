import './App.css';
import Login from './pages/Login';
import Venues from './pages/Venues';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from './components/Header';

function App() {
  return (
    <Router>
        <Routes>
          <Route path= "/" element= {<Header/>}>
            <Route path= "/login" element= {<Login/>}/>
            <Route index element= {<Login/>}/>
            <Route path= "*" element= {<Login/>}/>
            <Route path= "/venues" element= {<Venues/>}/>
          </Route>
        </Routes>
    </Router>
  );
}

export default App;
