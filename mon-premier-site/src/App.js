import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Teams from './components/Teams';
import TeamsRating from './components/TeamsRating';
import TeamsRanking from './components/TeamsRanking';
import Dashboard from './components/Dashboard';
import LoginPage from './components/LoginPage';
import PrivateRoute from './helpers/PrivateRoute';
import LogoutButton from "./helpers/LogoutButton";
import { isLoggedIn, onAuthChange } from "./helpers/AuthContext.js";
import Button from 'react-bootstrap/Button';
import './css/App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn()); // Initialiser l'état de connexion

  // Mettre à jour loggedIn si le token change
  useEffect(() => {
    onAuthChange(setLoggedIn); // Écouter les changements dans localStorage
  }, []);
  return (
      <Router>
        <div className="App">
          <header className="navbar">
            <nav>
              <Button variant="outline-info" ><Link to="/">Acceuil</Link></Button> 
              <Button variant="outline-info" > <Link to="/teams">Équipes</Link> </Button>
              <Button variant="outline-info" ><Link to="/notes">Notes</Link> </Button>
              <Button variant="outline-info" ><Link to="/rank">Rankings</Link> </Button>
              {loggedIn && (
                <li>
                  <LogoutButton/>
                </li>
              )}
            </nav>
          </header>
          <Routes>
            <Route path="*" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/teams" element={<PrivateRoute><Teams /></PrivateRoute>} />
              <Route path="/notes" element={<PrivateRoute><TeamsRating /></PrivateRoute>} />
              <Route path="/rank" element={<PrivateRoute><TeamsRanking /></PrivateRoute>} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
