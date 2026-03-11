// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Alapértelmezetten VILÁGOS módban indulunk
// Töröljük a localStorage-ból a sötét mód beállítást ha volt
localStorage.removeItem('theme');
// Eltávolítjuk a dark class-t a html elemről
document.documentElement.classList.remove('dark');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);