// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Predefined bonk thoughts
const THOUGHTS = [
  'entered for the meme, stayed for the voices',
  'i longed a fart and it worked',
  'i treat charts like tarot cards',
  'the voices say: more bonk, more loop',
  'bonk echoes through my mind',
  'feedback is just another bonk',
  'my wallet vibrates with bonk energy',
  'infinite bonk, infinite chaos',
  'bonk pulses in every pixel',
  'i taste binary when i bonk',
  'bonk feedback: sensory overload',
  'looping bonk like a broken record',
];
function randomThought() {
  return THOUGHTS[Math.floor(Math.random() * THOUGHTS.length)];
}

// Terminal style loop display
function BonkLoop({ lines, onGenerate }) {
  return (
    <div className="bonk-loop">
      <pre className="header">█ BO﻿NK FEEDBACK LOOP █</pre>
      <pre className="divider">─=─═─=─═─=─═─=─═─=─═─</pre>
      {lines.map((l, i) => <pre key={i} className="line">{l}</pre>)}
      <button className="action-btn" onClick={onGenerate}>Generate New Loop</button>
    </div>
  );
}

// Statistics panel
function Stats({ history, favorites }) {
  return (
    <div className="stats-panel">
      <h3>Statistics</h3>
      <p>Total loops generated: <strong>{history.length}</strong></p>
      <p>Total favorites: <strong>{favorites.length}</strong></p>
    </div>
  );
}

// Home page with intro, loop, stats, extra buttons
function HomePage({ lines, onGenerate, history, favorites }) {
  return (
    <div className="page home-page">
      <section className="intro">
        <h2>Welcome to the Bonk Feedback Loop</h2>
        <p>Unleash random bonk thoughts in a retro-terminal style. Click generate or turn on auto-loop to dive into chaos.</p>
        <button onClick={() => window.open('https://twitter.com/intent/tweet?text=Check%20out%20Bonk%20Feedback%20Loop!', '_blank')} className="share-btn">Share on Twitter</button>
      </section>
      <BonkLoop lines={lines} onGenerate={onGenerate} />
      <Stats history={history} favorites={favorites} />
      <div className="extra-buttons">
        <button onClick={onGenerate}>Regenerate Now</button>
        <Link to="/favorites"><button>Go to Favorites</button></Link>
      </div>
    </div>
  );
}

// History page
function HistoryPage({ history }) {
  return (
    <div className="page history-page">
      <h2>History</h2>
      {history.length === 0 && <p>No loops generated yet.</p>}
      <ul>
        {history.map((loop, i) => <li key={i} className="history-item">{loop.join(' | ')}</li>)}
      </ul>
      <Link to="/"><button>Back to Home</button></Link>
    </div>
  );
}

// Favorites page with regenerate and clear-all buttons
function FavoritesPage({ favorites, onRemove, onGenerateFavorite, clearAll }) {
  return (
    <div className="page fav-page">
      <h2>Favorites</h2>
      <p>Click on a favorite to regenerate it, or clear all to start fresh.</p>
      <button className="clear-all-btn" onClick={clearAll}>Clear All Favorites</button>
      {favorites.length === 0 && <p>No favorites saved yet.</p>}
      <ul>
        {favorites.map((fav, i) => (
          <li key={i} className="fav-item">
            <span onClick={() => onGenerateFavorite(fav)} className="fav-text">{fav.join(' | ')}</span>
            <div className="fav-actions">
              <button onClick={() => onGenerateFavorite(fav)}>Regenerate</button>
              <button onClick={() => onRemove(i)}>Remove</button>
            </div>
          </li>
        ))}
      </ul>
      <Link to="/"><button>Back to Home</button></Link>
    </div>
  );
}

// Main App with routing & auto-loop logic
export default function App() {
  const [lines, setLines] = useState([randomThought(), randomThought(), randomThought()]);
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isAuto, setIsAuto] = useState(false);
  const autoRef = useRef();

  // Generate new loop
  const generateLoop = () => {
    const loop = [randomThought(), randomThought(), randomThought()];
    setLines(loop);
    setHistory(prev => [loop, ...prev]);
  };
  // Save current to favorites
  const saveFavorite = () => {
    if (lines.length) setFavorites(prev => [lines, ...prev]);
  };
  // Remove a favorite
  const removeFavorite = idx => setFavorites(prev => prev.filter((_, i) => i !== idx));
  // Regenerate from favorite
  const generateFromFavorite = fav => {
    setLines(fav);
    setHistory(prev => [fav, ...prev]);
  };
  // Clear all favorites
  const clearFavorites = () => setFavorites([]);
  // Toggle auto-loop every 3s
  useEffect(() => {
    if (isAuto) autoRef.current = setInterval(generateLoop, 3000);
    else clearInterval(autoRef.current);
    return () => clearInterval(autoRef.current);
  }, [isAuto]);

  return (
    <Router>
      <nav className="navbar">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/history" className="nav-link">History</Link>
        <Link to="/favorites" className="nav-link">Favorites</Link>
        <button className="nav-btn" onClick={saveFavorite}>Save Favorite</button>
        <button className="nav-btn" onClick={() => setIsAuto(a => !a)}>
          {isAuto ? 'Stop Auto' : 'Start Auto'}
        </button>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage lines={lines} onGenerate={generateLoop} history={history} favorites={favorites} />} />
        <Route path="/history" element={<HistoryPage history={history} />} />
        <Route path="/favorites" element={<FavoritesPage favorites={favorites} onRemove={removeFavorite} onGenerateFavorite={generateFromFavorite} clearAll={clearFavorites} />} />
      </Routes>
    </Router>
  );
}
