import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Teams from './components/Teams';
import TeamsRating from './components/TeamsRating';
import TeamsRanking from './components/TeamsRanking';  // Importer TeamsRanking ici
import './css/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="navbar">
          <nav>
            <Link to="/">Accueil</Link> | <Link to="/teams">Équipes</Link> | <Link to="/notes">Notes</Link> | <Link to="/rank">Rankings</Link>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/notes" element={<TeamsRating />} />
          <Route path="/rank" element={<TeamsRanking />} />  {/* Route pour TeamsRanking */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
